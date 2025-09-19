// player.js — single-question player (formerly in script.js / index.html)
import { supabase } from "./supabaseClient.js";
import { serveNextPracticeQuestion } from "./config/skill.js";
import { safeSelect, selectQuestionsBySubtopicsChunked } from './dbUtil.js';
import { isCorrectOpen } from "./config/answers.js";
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
// --- Numeric helpers for open questions ---
function parseNumeric(val) {
  if (val == null) return NaN;
  // accept comma decimal separators too
  const s = String(val).trim().replace(',', '.');
  // reject fancy symbols (like π) because open answers are numeric-only per spec
  return Number(s);
}

function isNumericCorrect(userStr, correctStr, tol) {
  const u = parseNumeric(userStr);
  const c = parseNumeric(correctStr);
  if (!isFinite(u) || !isFinite(c)) return false;
  const t = Math.max(0, Number(tol) || 0);
  return Math.abs(u - c) <= t;
}
async function loadQuestionById(qid) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', qid)
      .maybeSingle();
    if (error || !data) {
      document.getElementById('questionContainer')?.replaceChildren(
        Object.assign(document.createElement('div'), {
          className: 'p-4 rounded border bg-white',
          textContent: 'Question not found.'
        })
      );
      return;
    }
    // Reuse your existing renderer
    renderQuestion(data);

    // Optional: simplify UI for single mode
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    nextBtn && (nextBtn.style.display = 'none');
    prevBtn && (prevBtn.style.display = 'none');
  } catch (e) {
    console.error('loadQuestionById failed:', e);
  }
}


// Optional KaTeX helper; falls back to auto-render if missing
let renderMathFn = null;
try {
  const mod = await import('./config/renderMath.js').catch(()=>null);
  if (mod?.renderMath) renderMathFn = mod.renderMath;
} catch {}
function renderMathSafe(...els){
  try {
    if (renderMathFn) return renderMathFn(...els);
    if (!window.renderMathInElement) return;
    const opts = {
      delimiters: [
        { left:'$$', right:'$$', display:true },
        { left:'$',  right:'$',  display:false },
        { left:'\\(', right:'\\)', display:false },
        { left:'\\[', right:'\\]', display:true },
      ],
      throwOnError: false
    };
    els.flat().filter(Boolean).forEach(el => window.renderMathInElement(el, opts));
  } catch(e){ console.warn('KaTeX render warning:', e); }
}

// === Unicode + KaTeX helpers ===
// Decode both \uXXXX and \\uXXXX (and \UXXXXXXXX).
function decodeUnicodeEscapes(s) {
  if (typeof s !== 'string') return s;
  // double-escaped first: \\uXXXX
  s = s.replace(/\\\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // single-escaped: \uXXXX
  s = s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  // optional 8-digit: \UXXXXXXXX
  s = s.replace(/\\\\U([0-9A-F]{8})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  s = s.replace(/\\U([0-9A-F]{8})/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  return s;
}

// Remove stray "\" only when it precedes a non-ASCII char (ū, š, …).
// This keeps real KaTeX commands like \sin, \(, \alpha, \, etc.
function stripNonAsciiBackslashes(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\\(?=[^\x00-\x7F])/g, '');
}

// Decode unicode, then normalize backslashes for KaTeX commands/spaces.
function unescapeKaTeXString(s){
  if (typeof s !== 'string') return s;

  // 0) decode both \uXXXX and \\uXXXX (and \UXXXXXXXX)
  s = decodeUnicodeEscapes(s);

  // 1) Collapse \\ before KaTeX tokens: parens/braces/brackets, backslash, letters,
  //    AND spacing punctuations (, : ; !) so \\,, \\:, \\; , \\! -> \, \: \; \!
  s = s.replace(/\\\\(?=[(){}\[\]\\A-Za-z,:;!])/g, '\\');

  // 2) Collapse triple backslashes in rare cases (e.g. "\\\(")
  s = s.replace(/\\{3}(?=[(){}\[\]\\A-Za-z,:;!])/g, '\\');

  // 3) Drop stray "\" only when it precedes a non-ASCII character (ū, š, …)
  //    (keeps \sin, \alpha, \(, \, etc.)
  s = stripNonAsciiBackslashes(s);

  return s;
}

function deepUnescapeKaTeX(x){
  if (Array.isArray(x)) return x.map(deepUnescapeKaTeX);
  if (x && typeof x === 'object') {
    const out = {};
    for (const [k,v] of Object.entries(x)) out[k] = deepUnescapeKaTeX(v);
    return out;
  }
  return unescapeKaTeXString(x);
}

// Accept both formats:
// 1) [{key:'A', text:'...'}, ...]
// 2) {"A":"...", "B":"..."} or {"A":{"text":"..."}}
function normalizeOptions(raw){
  if (!raw) return null;
  // If already a map:
  if (!Array.isArray(raw) && typeof raw === 'object') {
    const map = {};
    for (const [k,v] of Object.entries(raw)) {
      map[String(k).toUpperCase()] = typeof v === 'string' ? v : (v?.text ?? String(v ?? ''));
    }
    return map;
  }
  // Array → map
  const map = {};
  raw.forEach((item, i) => {
    const letter = String(item?.key ?? String.fromCharCode(65+i)).toUpperCase();
    const text   = typeof item === 'string' ? item : (item?.text ?? String(item ?? ''));
    map[letter] = text;
  });
  return map;
}

// ------- State -------
let userId = null;
let selectedClass = null;
let subtopicIds = [];   // passed from Practice
let mode = "practice";  // practice | mistakes | review
let currentQuestion = null;
let selectedChoice = null;
let loadSeq = 0;

// ------- DOM -------
const questionEl     = document.getElementById("question-text");
const choicesEl      = document.getElementById("choices-container");
const checkBtn       = document.getElementById("check-btn");
const explanationBtn = document.getElementById("explanation-btn");
const nextBtn        = document.getElementById("next-btn");
const flagBtn        = document.getElementById("flag-btn");
const feedbackEl     = document.getElementById("feedback");
const explanationText= document.getElementById("explanation-text");

const cbAutoNext     = document.getElementById('auto-next');

const flagPanel   = document.getElementById('flag-panel');
const flagSubmit  = document.getElementById('flag-submit');
const flagCancel  = document.getElementById('flag-cancel');
const flagCat     = document.getElementById('flag-category');
const flagNote    = document.getElementById('flag-note');
const bookmarkBtn = document.getElementById('bookmark-btn');
let isBookmarked = false;

// ------- Auth & Params -------
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return window.location.replace('login.html');
  userId = session.user.id;

  const params = new URLSearchParams(location.search);
  selectedClass = params.get('class') || null;
  subtopicIds = (params.get('subs') || '').split(',').map(s=>s.trim()).filter(Boolean);
  mode = params.get('mode') || 'practice';
  const qid = params.get('qid'); 

  // restore auto-next toggle only
  cbAutoNext.checked = localStorage.getItem('autoNext') === '1';
  cbAutoNext.addEventListener('change', ()=> localStorage.setItem('autoNext', cbAutoNext.checked?'1':'0'));
  wireUI();

  // ---- Single-question mode (from profile search) ----
  if (qid) {
    mode = 'single';
   // Hide "auto-next" control and the Next button in single mode
   try { cbAutoNext?.closest('label')?.classList.add('hidden'); } catch {}
    nextBtn?.classList.add('hidden');
    await loadQuestionById(qid);
    return; // ⟵ skip normal practice/review/mistakes flows
  }

  // ---- Normal initial load ----
  if (mode === 'review')        await loadReview();
  else if (mode === 'mistakes') await loadMistake();
  else                          await loadRandom();
})();

function wireUI(){
  checkBtn.addEventListener('click', onCheck);
  explanationBtn.addEventListener('click', ()=> explanationText.classList.toggle('hidden'));
  nextBtn.addEventListener('click', async ()=>{
    if (mode === 'review')      await loadReview();
    else if (mode === 'mistakes') await loadMistake();
    else                          await loadRandom();
  });
  flagBtn.addEventListener('click', ()=> flagPanel.classList.remove('hidden'));
  flagCancel.addEventListener('click', ()=> flagPanel.classList.add('hidden'));
  flagSubmit.addEventListener('click', submitFlag);

  // keyboard shortcuts
  document.addEventListener('keydown', (e)=>{
    if (e.altKey||e.ctrlKey||e.metaKey) return;
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (/^[1-9]$/.test(e.key) && !typing) {
      const idx = Number(e.key)-1;
      const radios = choicesEl.querySelectorAll('input[type="radio"]');
      const r = radios[idx];
      if (r && !r.disabled) { r.checked = true; r.dispatchEvent(new Event('change',{bubbles:true})); }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!checkBtn.classList.contains('hidden')) onCheck();
      else if (!nextBtn.classList.contains('hidden')) nextBtn.click();
    }
  });
}

// ------- Loading variants -------
// Practice mode: fetch a never-seen question for this user
async function loadRandom(){
  const my = ++loadSeq;
  resetView(true);
  questionEl.textContent = "Kraunama…";

  try {
    const { freshPick, exhaustedSubtopics } = await pickUniquePracticeQuestion();

    if (my !== loadSeq) return;

    if (!freshPick) {
      showExhaustedUI(exhaustedSubtopics);
      // Log one DB event per exhausted subtopic (or all selected if unknown)
      const sids = exhaustedSubtopics.length ? exhaustedSubtopics : subtopicIds;
      for (const sid of sids) {
        try { await logPracticeExhaustion(sid); } catch(e){ console.warn(e); }
      }
      return;
    }

    currentQuestion = freshPick;
    renderQuestion(freshPick);
  } catch(e){
    if (my !== loadSeq) return;
    console.error(e);
    questionEl.textContent = "Klaida kraunant klausimą.";
  }
}


async function loadMistake(){
  const my = ++loadSeq;
  resetView(true);
  questionEl.textContent = "Kraunama…";

  try {
    const since = new Date(); since.setDate(since.getDate()-90);
    const { data: attempts, error: aErr } = await supabase
      .from('question_attempts')
      .select('question_id, is_correct, answered_at')
      .eq('user_id', userId)
      .gte('answered_at', since.toISOString())
      .order('answered_at', { ascending:false })
      .limit(2000);
    if (aErr) throw aErr;

    const wrongIds = [...new Set((attempts||[]).filter(a=>a.is_correct===false).map(a=>a.question_id))];
    if (!wrongIds.length){ questionEl.textContent = "Klaidų nėra 👌"; return; }

    let q = supabase.from('questions').select('*').in('id', wrongIds);
    if (subtopicIds.length) q = q.in('subtopic_id', subtopicIds);
    if (selectedClass) q = q.eq('class', selectedClass);
    const { data: qs, error: qErr } = await q;
    if (qErr) throw qErr;
    if (!qs?.length){ questionEl.textContent = "Klaidų nėra 👌"; return; }
    const pick = qs[Math.floor(Math.random()*qs.length)];
    currentQuestion = pick;
    renderQuestion(pick);
  } catch(e){
    if (my !== loadSeq) return;
    console.error(e);
    questionEl.textContent = "Klaida kraunant klausimą.";
  }
}

async function loadReview(){
  const my = ++loadSeq;
  resetView(true);
  questionEl.textContent = "Kraunama…";
  try {
    const { data: idsData, error: idErr } =
      await selectQuestionsBySubtopicsChunked(supabase, subtopicIds, 'id');
    if (idErr) throw idErr;
    const qids = idsData?.map(r=>r.id) || [];
    if (!qids.length){ questionEl.textContent = "Nėra klausimų pasirinktuose potėmėse."; return; }

    const { data: attempts, error: aErr } = await supabase
      .from('question_attempts')
      .select('question_id, next_review_at, answered_at')
      .eq('user_id', userId)
      .in('question_id', qids)
      .order('answered_at', { ascending:false });
    if (aErr) throw aErr;

    const now = new Date().toISOString();
    const seen = new Set();
    const dueIds = [];
    for (const a of attempts || []) {
      if (seen.has(a.question_id)) continue;
      seen.add(a.question_id);
      if (a.next_review_at && a.next_review_at <= now) dueIds.push(a.question_id);
    }
    const pickId = dueIds.length ? dueIds[Math.floor(Math.random()*dueIds.length)] : null;
    if (!pickId) return loadRandom();

   const { data: qs, error: qErr } = await supabase
     .from('questions')
     .select('*')
     .eq('id', pickId)
     .maybeSingle();
    if (qErr || !qs) throw qErr || new Error('No question');
    currentQuestion = qs;
    renderQuestion(qs);
  } catch(e){
    if (my !== loadSeq) return;
    console.error(e);
    questionEl.textContent = "Klaida kraunant klausimą.";
  }
}

// Get a unique (unseen) practice question across the selected subtopics
// Use the central mixed-difficulty logic (practice only).
async function pickUniquePracticeQuestion() {
  const { pick, exhaustedSubtopics } = await serveNextPracticeQuestion({
    userId,
    subtopicIds,
    selectedClass,
    poolSizePerSub: 24 // slightly above typical session size
  });
  return { freshPick: pick, exhaustedSubtopics };
}


// UI shown when there are no unique questions left
function showExhaustedUI(exhaustedSubtopics) {
  questionEl.textContent = "Nėra daugiau unikalių klausimų pasirinktose potėmėse.";
  choicesEl.innerHTML = "";
  feedbackEl.innerHTML = "";
  explanationText.classList.add('hidden');
  [checkBtn, explanationBtn, nextBtn, flagBtn].forEach(btn => btn.classList.add('hidden'));

  const panel = document.createElement('div');
  panel.className = 'p-4 mt-2 rounded border bg-yellow-50 text-yellow-900';
  const list = (exhaustedSubtopics && exhaustedSubtopics.length)
    ? `<div class="text-xs mt-2 opacity-80">Potėmės (ID): ${exhaustedSubtopics.join(', ')}</div>` : '';
  panel.innerHTML = `
    <div class="font-semibold mb-1">Visi unikalūs klausimai išspręsti 🎉</div>
    <p>Pranešėme administratoriui – bus pridėta daugiau klausimų.</p>
    ${list}
    <button class="mt-3 px-3 py-1 rounded border bg-white hover:bg-gray-50" onclick="history.back()">Grįžti</button>
  `;
  choicesEl.appendChild(panel);
}

// Write a single upsert event so you see shortages in DB
// Write one event per (user, subtopic); ignore duplicates, no UPDATE path
// Insert-or-update the exhaustion event for this user+subtopic
// Insert-or-update the exhaustion event for this user+subtopic
async function logPracticeExhaustion(subtopicId) {
  const payload = {
    // DO NOT include user_id — DB default (auth.uid()) fills it
    subtopic_id: subtopicId,
    class: selectedClass || null,
    remaining_count: 0,
    note: 'practice_exhausted'
  };

  const { error, status } = await supabase
    .from('question_supply_events')
    .upsert(payload, {
      onConflict: 'user_id,subtopic_id',
      returning: 'minimal' // don't require SELECT on this table
    });

  if (error) console.warn('logPracticeExhaustion failed:', status, error);
}





// ------- Render & grade -------
function resetView(clear){
  if (clear) questionEl.textContent = "";
  choicesEl.innerHTML = "";
  feedbackEl.textContent = "";
  explanationText.textContent = "";
  explanationText.classList.add('hidden');
  [checkBtn, explanationBtn, nextBtn, flagBtn].forEach(btn=>{
    btn.classList.add('hidden');
    btn.disabled = false;
    btn.classList.remove('opacity-50','cursor-not-allowed');
  });
  selectedChoice = null;
}

// ─────────────────────────────────────────────
// Chatbot context bridge (global, read-only)
// ─────────────────────────────────────────────
window.__currentQuestionForChat = null;
window.getCurrentExerciseText = function () {
  const c = window.__currentQuestionForChat;
  if (!c) return "";
  let s = `Question:\n${c.stem}`;
  if (Array.isArray(c.options) && c.options.length) {
    s += `\nOptions:\n- ` + c.options.join("\n- ");
  }
  if (c.userAnswer != null) {
    s += `\n\nYour answer: ${c.userAnswer}`;
    if (c.correctAnswer != null) {
      s += `\nCorrect answer: ${c.correctAnswer}`;
      s += `\nResult: ${c.correct ? "correct" : "incorrect"}`;
    }
  }
  if (c.explanation) s += `\n\nExplanation (author): ${c.explanation}`;
  return s;
};

function normalizeChoice(val) {
  if (val == null) return null;
  const s = String(val).trim();
  return s.length ? s : null;
}

async function renderQuestion(q){
  const qtext = unescapeKaTeXString(q.question_text || q.prompt || "");
  const expl  = unescapeKaTeXString(q.explanation || "");
  // Put plain text; KaTeX auto-render will convert the delimiters afterward
  questionEl.textContent = qtext;
  explanationText.textContent = expl;
  choicesEl.innerHTML = "";
  selectedChoice = null;

  if (q.type === "open" || (!q.options && !q.choices)) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Write your answer…";
    input.className = "w-full border p-2 rounded";
input.addEventListener("input", () => {
  selectedChoice = input.value.trim();
  feedbackEl.textContent = "";

  const ready = selectedChoice.length > 0;
  checkBtn.disabled = !ready;
  checkBtn.classList.toggle('opacity-50', !ready);
  checkBtn.classList.toggle('cursor-not-allowed', !ready);
});
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !checkBtn.classList.contains('hidden') && !checkBtn.disabled) onCheck();
    });
    choicesEl.appendChild(input);
  // REPLACE the else { ... } branch in renderQuestion(q) WITH:
} else {
  // Normalize both formats
  let opts = q.options ? normalizeOptions(q.options)
                       : Object.fromEntries((q.choices||[]).map((v,i)=>[String.fromCharCode(65+i), v]));
  opts = deepUnescapeKaTeX(opts);

  const list = document.createElement("div");
  list.className = "space-y-2";

  Object.entries(opts).forEach(([letter, text]) => {
    const label = document.createElement("label");
    label.className = "flex items-center p-2 border rounded hover:bg-gray-50 cursor-pointer";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "choice";
    input.value = letter;
    input.className = "mr-2";
    input.addEventListener('change', (e) => {
      selectedChoice = e.target.value;
      feedbackEl.textContent = "";
      checkBtn.disabled = false;
      checkBtn.classList.remove('opacity-50','cursor-not-allowed');
    });

    const keySpan = document.createElement('strong');
    keySpan.textContent = `${letter}) `;

    const txtSpan = document.createElement('span');
    txtSpan.textContent = String(text ?? '');

    label.append(input, keySpan, txtSpan);
    list.appendChild(label);
  });

  choicesEl.appendChild(list);
}


  renderMathSafe(questionEl, choicesEl, explanationText);

  checkBtn.classList.remove('hidden');
  checkBtn.disabled = true;
  checkBtn.classList.add('opacity-50','cursor-not-allowed');
  flagBtn.classList.remove('hidden');
  explanationBtn.classList.toggle('hidden', !q.explanation);
  await checkBookmark(q.id);
  updateBookmarkIcon();

  // ── Update chatbot context (fresh question) ──
  const optsMapFresh = q.options ? normalizeOptions(q.options)
                                  : Object.fromEntries((q.choices||[]).map((v,i)=>[String.fromCharCode(65+i), v]));
  const opts = Object.entries(deepUnescapeKaTeX(optsMapFresh)).map(([k,v]) => `${String(k).toUpperCase()}) ${v}`);
  window.__currentQuestionForChat = {
    id: q.id,
    stem: (questionEl?.innerText || "").trim(),
    type: q.type || (q.options || q.choices ? "mcq" : "open"),
    options: opts,
    explanation: q.explanation || null,
    userAnswer: null,
    correctAnswer: null,
    correct: null
  };
}

async function onCheck(){
  if (!currentQuestion) return;
  // If somehow pressed with no answer (safety), block
  if (selectedChoice == null || (typeof selectedChoice === 'string' && selectedChoice.trim() === '')) {
    feedbackEl.textContent = "Prašome pasirinkti atsakymą.";
    return;
  }
  checkBtn.disabled = true;

  let isCorrect = false;
  let userVal = selectedChoice;

  if (currentQuestion.type === 'open' || (!currentQuestion.options && !currentQuestion.choices)) {
    const correctVal = currentQuestion.correct_option ?? currentQuestion.answer_text ?? currentQuestion.correct_number ?? currentQuestion.answer;
    const ansType    = (currentQuestion.answer_type || '').toLowerCase();
    const tol        = currentQuestion.answer_tolerance ?? 0;

    if (ansType === 'numeric') {
      isCorrect = isNumericCorrect(userVal, correctVal, tol);
    } else {
      // Fallback: strict text compare if ever used
      isCorrect = String(userVal || '').trim() === String(correctVal ?? '').trim();
      // Or, if you still want the old heuristic as a backup:
      // if (!isCorrect) isCorrect = isCorrectOpen(String(userVal||''), String(correctVal??''));
    }
  } else {
    const correct = currentQuestion.correct_option;
    isCorrect = userVal != null && String(userVal).toUpperCase() === String(correct).toUpperCase();
  }


  // Build "correct answer" display when wrong (also used for chatbot context)
  let correctDisplay = "";
  if (!isCorrect) {
    if (currentQuestion.type === 'open' || (!currentQuestion.options && !currentQuestion.choices)) {
      const cv = currentQuestion.correct_option ?? currentQuestion.answer_text ?? currentQuestion.correct_number ?? currentQuestion.answer;
      correctDisplay = String(cv ?? "");
    } else {
      const correct = currentQuestion.correct_option;
      const optsMap = currentQuestion.options
        ? normalizeOptions(currentQuestion.options)
        : Object.fromEntries((currentQuestion.choices||[]).map((v,i)=>[String.fromCharCode(65+i), v]));
      const text = (optsMap && optsMap[correct]) ? optsMap[correct] : "";
      correctDisplay = `${String(correct).toUpperCase()}${text ? ") " + text : ""}`;
    }
  }
  feedbackEl.innerHTML = isCorrect
    ? "Teisingai! ✅"
   : `Neteisingai. ❌ Teisingas atsakymas: ${correctDisplay}`;

  // re-render KaTeX in feedback too
  renderMathSafe(feedbackEl);
  const row = checkBtn.parentElement;
  if (row && nextBtn) row.insertBefore(nextBtn, checkBtn);
  nextBtn.classList.remove('hidden');
  checkBtn.classList.add('hidden');

  // log attempt (avoid null selected_option)
  try {
    const payload = {
      user_id: userId,
      question_id: currentQuestion.id,
      answered_at: new Date().toISOString(),
      is_correct: isCorrect,
      selected_option: (typeof userVal === 'string' ? userVal : String(userVal ?? '')),
      next_review_at: new Date(Date.now() + (isCorrect ? 7 : 2) * 24*3600*1000).toISOString()
    };
    await supabase.from('question_attempts').insert(payload);
  } catch(e){ console.warn('Failed to record attempt:', e); }

  if (isCorrect && cbAutoNext.checked) {
    setTimeout(()=> nextBtn.click(), 500);
  }
    // ── Update chatbot context (after check) ──
  window.__currentQuestionForChat = {
    ...(window.__currentQuestionForChat || {}),
    userAnswer: normalizeChoice(userVal),
    correctAnswer: correctDisplay || (isCorrect ? normalizeChoice(userVal) : null),
    correct: !!isCorrect
  };
}

async function submitFlag(){
  const cat = flagCat.value || 'other';
  const note = flagNote.value?.trim() || null;
  try {
    await supabase.from('question_flags').insert({
      user_id: userId,
      question_id: currentQuestion?.id || null,
      category: cat,
      note,
      created_at: new Date().toISOString()
    });
    flagPanel.classList.add('hidden');
    flagNote.value = "";
    alert('Ačiū! Žinutė užfiksuota.');
  } catch(e){
    console.warn('Flag insert failed:', e);
    flagPanel.classList.add('hidden');
    alert('Gauta. Jei klaida kartosis – praneškite administratoriui.');
  }
}

async function checkBookmark(qid) {
  const { data, error } = await supabase
    .from('question_bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('question_id', qid)
    .maybeSingle();
  isBookmarked = !!data;
}

function updateBookmarkIcon() {
  bookmarkBtn.classList.toggle('text-yellow-500', isBookmarked);
  bookmarkBtn.classList.toggle('text-gray-400', !isBookmarked);
}

bookmarkBtn.addEventListener('click', async () => {
  if (!currentQuestion) return;
  if (isBookmarked) {
    await supabase
      .from('question_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('question_id', currentQuestion.id);
    isBookmarked = false;
  } else {
    await supabase
      .from('question_bookmarks')
      .insert({ user_id: userId, question_id: currentQuestion.id });
    isBookmarked = true;
  }
  updateBookmarkIcon();
});
