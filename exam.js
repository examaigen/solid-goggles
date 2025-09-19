// exam.js
import { supabase } from './supabaseClient.js';
import { subjects } from './config/subjects.js';
import { isCorrectOpen } from './config/answers.js';
import { renderMath } from './config/renderMath.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
let questionPool = [];
let currentClass = '';
let currentSubtopics = [];

// UI elements
const classSelect        = document.getElementById('classSelect');
const subjectSelect      = document.getElementById('subjectSelect');
const subtopicsContainer = document.getElementById('subtopicsContainer');
const subSelect          = document.getElementById('subtopicsSelect');
const lengthSelect      = document.getElementById('testLengthSelect');
const timeInput         = document.getElementById('timeLimitInput');
const startBtn          = document.getElementById('startBtn');
const timerEl           = document.getElementById('timer');
const examContainer     = document.getElementById('examContainer');
const examForm          = document.getElementById('examForm');
const submitBtn         = document.getElementById('submitBtn');
const resultContainer   = document.getElementById('resultContainer');
const examHeader        = document.getElementById('examHeader');

const EXAM_SAVE_KEY = "examState";
let timerInterval;
let remainingTime;
let startedAt = null;
let saveTimer = null;
let examResultId = null;
const onBeforeUnload = () => saveExamState();

const markedSet = new Set();
const examAnswers = new Map();
const MIN_PER_SUBTOPIC = 2;

// ── helpers to fix double-escaped unicode and normalize options ──
function decodeUnicodeEscapes(s) {
  if (typeof s !== 'string') return s;
  if (!/\\u[0-9a-fA-F]{4}/.test(s)) return s;
  try { return JSON.parse('"' + s.replace(/"/g,'\\"') + '"'); } catch { return s; }
}

function stripNonAsciiBackslashes(s) {
  if (typeof s !== 'string') return s;
  // Drop one or more backslashes if they precede any non-ASCII char.
  // Examples: "\\ž" -> "ž", "\ą" -> "ą"
  return s.replace(/\\+(?=[^\x00-\x7F])/g, '');
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

function normText(s){ return decodeUnicodeEscapes(unescapeKaTeXString(String(s ?? ''))).trim(); }

// Accept both formats:
// 1) [{key:'A',text:'...'}, ...]  2) {A:'...',B:'...'} or {A:{text:'...'}}
function normalizeOptions(raw){
  if (!raw) return {};
  if (!Array.isArray(raw) && typeof raw === 'object') {
    const m = {};
    for (const [k,v] of Object.entries(raw)) m[String(k).toUpperCase()] = typeof v === 'string' ? v : (v?.text ?? '');
    return m;
  }
  const m = {};
  raw.forEach((it,i)=>{ m[String(it?.key ?? String.fromCharCode(65+i)).toUpperCase()] = typeof it==='string'?it:(it?.text ?? ''); });
  return m;
}
  

function saveExamState() {
  try {
    const state = {
      startedAt: startedAt ? startedAt.toISOString() : null,
      remainingTime,
      classKey: classSelect.value,
      subjectKey: subjectSelect.value,
      subtopicIds: currentSubtopics,
      questions: questionPool,
      marked: [...markedSet],
      answers: [...examAnswers.entries()],
    };
    localStorage.setItem(EXAM_SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("saveExamState failed:", e);
  }
}

function loadExamState() {
  try {
    const raw = localStorage.getItem(EXAM_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function clearExamState() {
  localStorage.removeItem(EXAM_SAVE_KEY);
}

function populateSubjects(classKey = '') {
  subjectSelect.innerHTML = '<option value="">All Subjects</option>';
     Object.entries(subjects)
     .filter(([_, subj]) => !classKey || (subj.topicsByClass[classKey] || []).length)
     .forEach(([key, subj]) => {
    const opt = document.createElement('option');
    opt.value       = key;
    opt.textContent = subj.label;
    subjectSelect.appendChild(opt);
  });
}

function isValidSavedExam(saved) {
  if (!saved) return false;
  if (!Array.isArray(saved.questions) || saved.questions.length === 0) return false;
  if (typeof saved.remainingTime !== "number" || !(saved.remainingTime > 0)) return false;
  // optional TTL: ignore saves older than 36h
  if (saved.startedAt) {
    const age = Date.now() - new Date(saved.startedAt).getTime();
    if (age > 36 * 3600 * 1000) return false;
  }
  return true;
}

function updateProgressPill() {
  const pill = document.getElementById('progressPill');
  if (!pill) return;

  const total = Array.isArray(questionPool) ? questionPool.length : 0;
  let answered = 0;

  for (const q of (questionPool || [])) {
    const ans = examAnswers.get(q.id);
    if (!ans) continue;
    if (ans.type === 'mc' && ans.value) answered++;
    if (ans.type === 'open' && ans.value && String(ans.value).trim().length > 0) answered++;
  }

  pill.textContent = `${answered} / ${total}`;
}


// ────────────────────────────────────────────────────────────
// Multi-question page: active question management + hotkeys
// - Click/focus sets active question
// - Numbers 1..9 select options in the active block
// - Enter = next question (scrolls); Shift+Enter = previous
// - On the last question, Enter = submit (if submit exists)
// - Optional: auto-advance after choosing a radio
// ────────────────────────────────────────────────────────────
export function initMultiPageQuestionNav() {
  const form = document.getElementById('examForm') || document;
  const submitBtn =
    document.getElementById('submitBtn') ||
    form.querySelector('button[type="submit"], input[type="submit"]');

  // If you already have a progress pill, we reuse it; else it’s no-op.
  function setProgress(i, total) {
    const el = document.getElementById('progressPill');
    if (el) el.textContent = `${i + 1} / ${total}`;
  }

  // Find all question blocks (tolerant to different structures)
  function getQuestionBlocks() {
    // Prefer explicit markers if you have them (add your own selectors here)
    let blocks = Array.from(
      form.querySelectorAll(
        '[data-question-id], .question, .question-block, fieldset[data-question], fieldset.question'
      )
    );
    // Fallback: fieldsets that contain inputs
    if (blocks.length === 0) {
      blocks = Array.from(form.querySelectorAll('fieldset')).filter(fs =>
        fs.querySelector('input, textarea, select')
      );
    }
    // As a last resort, any direct child that contains inputs
    if (blocks.length === 0) {
      blocks = Array.from(form.querySelectorAll('*')).filter(el =>
        el.querySelector && el.querySelector('input, textarea, select')
      );
    }
    // Deduplicate & keep in DOM order
    const seen = new Set();
    const ordered = [];
    for (const el of blocks) {
      if (!seen.has(el)) {
        seen.add(el);
        ordered.push(el);
      }
    }
    // Ensure each has a stable index attribute
    ordered.forEach((el, i) => el.setAttribute('data-q-index', String(i)));
    return ordered;
  }

  const blocks = getQuestionBlocks();
  if (blocks.length === 0) return; // nothing to do

  let activeIndex = 0;

  function setActiveByIndex(i, scroll = false) {
    const idx = Math.max(0, Math.min(blocks.length - 1, i));
    activeIndex = idx;
    blocks.forEach((b, j) => {
      if (j === idx) {
        b.classList.add('question-active');
        b.setAttribute('data-active', 'true');
      } else {
        b.classList.remove('question-active');
        b.removeAttribute('data-active');
      }
    });
    setProgress(activeIndex, blocks.length);
    if (scroll) {
      blocks[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function setActiveByElement(el, scroll = false) {
    const idx = Number(el.getAttribute('data-q-index') || -1);
    if (idx >= 0) setActiveByIndex(idx, scroll);
  }

  // Initial active = first visible (or 0)
  setActiveByIndex(0, false);

  // 1) Click/focus inside a question → make it active
  form.addEventListener('click', (e) => {
    const el = e.target.closest('[data-q-index]');
    if (el) setActiveByElement(el, false);
  });
  form.addEventListener('focusin', (e) => {
    const el = e.target.closest('[data-q-index]');
    if (el) setActiveByElement(el, false);
  });

  // 2) IntersectionObserver: when scrolling, pick the block nearest center
  // (helps when user scrolls without clicking)
  const centerPicker = new IntersectionObserver((entries) => {
    // Choose the entry with the largest intersection ratio that’s near center
    let best = null;
    let bestScore = -1;
    const viewportMid = window.innerHeight / 2;
    for (const ent of entries) {
      if (!ent.isIntersecting) continue;
      const rect = ent.target.getBoundingClientRect();
      const dist = Math.abs((rect.top + rect.bottom) / 2 - viewportMid);
      const score = ent.intersectionRatio - dist / window.innerHeight; // simple heuristic
      if (score > bestScore) {
        bestScore = score;
        best = ent.target;
      }
    }
    if (best) setActiveByElement(best, false);
  }, { root: null, threshold: [0.25, 0.5, 0.75] });

  blocks.forEach(b => centerPicker.observe(b));

  // 3) Keyboard: numbers to pick, Enter to navigate
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    const active = blocks[activeIndex];
    if (!active) return;

    const isTyping =
      document.activeElement?.tagName === 'INPUT' ||
      document.activeElement?.tagName === 'TEXTAREA' ||
      document.activeElement?.isContentEditable;

    // 1..9 selects that option (radio) in the active block; skip if typing text
    if (/^[1-9]$/.test(e.key) && !isTyping) {
      const idx = Number(e.key) - 1;
      const radios = active.querySelectorAll('input[type="radio"]');
      const r = radios[idx];
      if (r && !r.disabled) {
        r.checked = true;
        r.dispatchEvent(new Event('input', { bubbles: true }));
        r.dispatchEvent(new Event('change', { bubbles: true }));
        // Optional: auto-advance after pick (uncomment to enable)
        // setTimeout(() => nextQuestion(), 120);
      }
      return;
    }

    // Enter navigation works even in numeric inputs
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        prevQuestion();
      } else {
        // If on last question, try to submit
        if (activeIndex >= blocks.length - 1) {
          if (submitBtn && !submitBtn.disabled) submitBtn.click();
        } else {
          nextQuestion();
        }
      }
    }
  });

  function nextQuestion() {
    if (activeIndex < blocks.length - 1) {
      setActiveByIndex(activeIndex + 1, true);
      focusFirstInput(blocks[activeIndex]);
    }
  }
  function prevQuestion() {
    if (activeIndex > 0) {
      setActiveByIndex(activeIndex - 1, true);
      focusFirstInput(blocks[activeIndex]);
    }
  }
  function focusFirstInput(block) {
    const inp = block.querySelector('input, textarea, select');
    if (inp) inp.focus({ preventScroll: true });
  }

  // Optional: when a radio changes, auto-advance
  // Toggle this flag to true to enable auto-advance UX
  const AUTO_ADVANCE = false;
  if (AUTO_ADVANCE) {
    form.addEventListener('change', (e) => {
      if (e.target.matches('input[type="radio"]')) {
        // Ensure the change came from the active block
        const el = e.target.closest('[data-q-index]');
        if (!el) return;
        const idx = Number(el.getAttribute('data-q-index') || -1);
        if (idx === activeIndex) setTimeout(() => nextQuestion(), 120);
      }
    });
  }
};


 document.addEventListener('DOMContentLoaded', async () => {
  populateSubjects();
  updateStartState();
  classSelect.addEventListener('change', e => {
    populateSubjects(e.target.value);
    // if a subject is already picked, repopulate subtopics,
    // otherwise hide the section
    if (subjectSelect.value) {
      populateSubtopics(subjectSelect.value);
    } else {
      subtopicsContainer.classList.add('hidden');
    }
  });
  subjectSelect.addEventListener('change', e => {
    // simply populate (and show) subtopics for the new subject
    populateSubtopics(e.target.value);
  });

  startBtn.addEventListener('click', startExam);
  submitBtn.addEventListener('click', submitExam);

  // Resume unfinished exam if available
  const saved = loadExamState();
   if (isValidSavedExam(saved)) {
    if (confirm("You have an unfinished exam. Resume?")) {
      // restore state
      startedAt = saved.startedAt ? new Date(saved.startedAt) : new Date();
      remainingTime = saved.remainingTime;
      classSelect.value = saved.classKey || classSelect.value;
      subjectSelect.value = saved.subjectKey || subjectSelect.value;
      currentSubtopics = saved.subtopicIds || [];

      // show the exam UI
      examForm.innerHTML = '';
      resultContainer.innerHTML = '';
      classSelect.parentElement.classList.add('hidden');
      subjectSelect.parentElement.classList.add('hidden');
      subtopicsContainer.classList.add('hidden');
      lengthSelect.parentElement.classList.add('hidden');
      startBtn.classList.add('hidden');
      examContainer.classList.remove('hidden');
      examHeader?.classList.remove('hidden'); 

// Ensure the Review drawer exists on resume too
let drawer = document.getElementById('review-drawer');
if (!drawer) {
  drawer = document.createElement('div');
  drawer.id = 'review-drawer';
  drawer.className = 'hidden mb-4 border rounded p-3 bg-white';
  drawer.innerHTML = `
    <div class="flex items-center justify-between">
      <strong>Review</strong>
      <div class="text-sm text-gray-500">
        <span id="review-count-unanswered">0</span> unanswered •
        <span id="review-count-marked">0</span> marked
      </div>
    </div>
    <div id="review-list" class="mt-2 flex flex-wrap gap-2"></div>
  `;
  examContainer.insertBefore(drawer, examForm);
}


      // restore questionPool and rebuild blocks
      questionPool = saved.questions;
      markedSet.clear();
      saved.marked?.forEach(id => markedSet.add(id));
      examAnswers.clear();
      saved.answers?.forEach(([qid, val]) => examAnswers.set(qid, val));

      // rebuild the DOM from questionPool
   // REPLACE the body of questionPool.forEach((q, idx) => { ... }) WITH:
questionPool.forEach((q, idx) => {
  const div = document.createElement("div");
  div.className = 'question-block';
  div.dataset.qid  = q.id;
  div.dataset.qnum = String(idx + 1);

  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = `Q${idx+1}: `;
  p.appendChild(strong);
  const span = document.createElement('span');
  span.textContent = normText(q.question_text);
  p.appendChild(span);
  div.appendChild(p);

  if (q.type === 'open') {
    const input = document.createElement('input');
    input.type  = 'text';
    input.name  = 'q' + idx;
    input.className = 'w-full border p-2 rounded mt-2';
    input.placeholder = 'Write your answer…';
    const savedAns = examAnswers.get(q.id);
    if (savedAns?.type === 'open') input.value = savedAns.value || "";
    input.addEventListener('input', () => {
      examAnswers.set(q.id, { type: 'open', value: input.value.trim() });
      refreshReviewDrawer(); updateProgressPill(); saveExamState();
    });
    div.appendChild(input);
  } else {
    const opts = normalizeOptions(q.options);
    Object.entries(opts).forEach(([key, text]) => {
      const label = document.createElement('label');
      label.className = 'block';
      const radio = document.createElement('input');
      radio.type  = 'radio';
      radio.name  = 'q' + idx;
      radio.value = key;

      const savedAns = examAnswers.get(q.id);
      if (savedAns?.type === 'mc' && savedAns.value === key) radio.checked = true;

      const keySpan = document.createElement('strong');
      keySpan.textContent = ` ${key}: `;

      const txtSpan = document.createElement('span');
      txtSpan.textContent = normText(text);

      label.append(radio, keySpan, txtSpan);
      div.appendChild(label);
    });
    div.querySelectorAll(`input[name="q${idx}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        examAnswers.set(q.id, { type: 'mc', value: radio.value });
        refreshReviewDrawer(); saveExamState(); updateProgressPill();
      });
    });
  }

  const markWrap = document.createElement('label');
  markWrap.className = 'mt-2 inline-flex items-center gap-2';
  const markCb = document.createElement('input');
  markCb.type = 'checkbox';
  markCb.checked = markedSet.has(q.id);
  markCb.addEventListener('change', () => {
    if (markCb.checked) markedSet.add(q.id); else markedSet.delete(q.id);
    refreshReviewDrawer(); saveExamState();
  });
  markWrap.append(markCb, document.createTextNode('Mark for review'));
  div.appendChild(markWrap);

  examForm.appendChild(div);
});

// Render math after all blocks are in
renderMath(examForm);


      refreshReviewDrawer();
      clearInterval(saveTimer);
      saveTimer = setInterval(() => {
        saveExamState();
      }, 5000);
      window.addEventListener('beforeunload', onBeforeUnload);
      startTimer();
      initMultiPageQuestionNav();
  } else {
    // 🔥 user said "Cancel": delete the stale saved exam so it won't re-prompt
    clearExamState();
  }
  } else {
    // invalid/expired save → clean up just in case
    clearExamState();
  }

});

function updateStartState() {
    const hasSub = document
    .querySelectorAll('#subtopicsCheckboxes input:checked')
    .length > 0;
  startBtn.disabled = !(classSelect.value && subjectSelect.value && hasSub);
  console.log('Update Start State:', {
    class: classSelect.value,
    subject: subjectSelect.value,
    hasSubtopics: hasSub,
  });
}
classSelect.addEventListener('change', updateStartState);
subjectSelect.addEventListener('change', updateStartState);

// 2) when a subject is picked, build the Subtopics multi-select
async function populateSubtopics(subjectKey) {
  // hide if no subject (All Subjects)
  if (!subjectKey) {
    subtopicsContainer.classList.add('hidden');
    return;
  }

  // show and populate (grouped by Topic title)
  subtopicsContainer.classList.remove('hidden');
  const boxContainer = document.getElementById('subtopicsCheckboxes');
  boxContainer.innerHTML = '';
  const classKey = classSelect.value;
  const topicsByClass = subjects[subjectKey].topicsByClass || {};
  const topicGroups = classKey
    ? (topicsByClass[classKey] || [])
    : Object.values(topicsByClass).flat();

  if (!Array.isArray(topicGroups) || topicGroups.length === 0) {
    boxContainer.innerHTML = `<div class="text-sm text-gray-500 p-2">Šiai klasei potėmių nėra.</div>`;
    updateStartState();
    return;
  }

  // Build a section per Topic with its subtopics (no de-dupe here)
  topicGroups.forEach(group => {
    const section = document.createElement('div');
    section.className = 'border rounded p-2';
    const title = document.createElement('div');
    title.className = 'text-sm font-medium mb-2';
    title.textContent = group.title || 'Tema';
    section.appendChild(title);

    (group.subtopics || []).forEach(st => {
      const row = document.createElement('label');
      row.className = 'flex items-center space-x-2 mb-1';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = st.id; // real subtopic_id used for queries
      row.append(cb, document.createTextNode(st.label || st.id));
      section.appendChild(row);
    });
    boxContainer.appendChild(section);
  });

  // One change handler for the whole container
  boxContainer.onchange = updateStartState;
  updateStartState();
}

// --- exam logic ---
async function startExam() {
  console.log('▶️ startExam called');
  startedAt = new Date();
  clearInterval(timerInterval);
  resultContainer.innerHTML = '';
  examForm.innerHTML      = '';
  examHeader?.classList.remove('hidden'); 

  // Ensure the Review drawer exists (insert above the form)
let drawer = document.getElementById('review-drawer');
if (!drawer) {
  drawer = document.createElement('div');
  drawer.id = 'review-drawer';
  drawer.className = 'hidden mb-4 border rounded p-3 bg-white';
  drawer.innerHTML = `
    <div class="flex items-center justify-between">
      <strong>Review</strong>
      <div class="text-sm text-gray-500">
        <span id="review-count-unanswered">0</span> unanswered •
        <span id="review-count-marked">0</span> marked
      </div>
    </div>
    <div id="review-list" class="mt-2 flex flex-wrap gap-2"></div>
  `;
  examContainer.insertBefore(drawer, examForm);
}

// reset per-exam state
markedSet.clear();
examAnswers.clear();


  const selectedClass     = classSelect.value;
  currentClass = selectedClass;
  // De-duplicate selected IDs so repeated checkboxes (same id in different topic groups)
  // don’t cause duplicate queries.
  const selectedSubtopics = Array.from(
    document.querySelectorAll('#subtopicsCheckboxes input:checked')
  ).map(i => i.value);
  const uniqueSubtopics = [...new Set(selectedSubtopics)];
  currentSubtopics = uniqueSubtopics;
  const lengthVal   = lengthSelect.value;
  // fixed durations: short=30m, half=60m, full=120m
switch (lengthVal) {
  case 'short': remainingTime = 30 * 60; break;
  case 'half':  remainingTime = 60 * 60; break;
  default:      remainingTime = 120 * 60; break;
}


  // Determine number of questions by test length
  let numQuestions;
  if (lengthVal === 'short') {
    numQuestions = Math.floor(Math.random() * (20 - 15 + 1)) + 15;
  } else if (lengthVal === 'half') {
    numQuestions = Math.floor(Math.random() * (40 - 35 + 1)) + 35;
  } else {
    numQuestions = 60;
  }

  // Prepare and filter the question pool
  // 1) Fetch exactly the rows we need from Supabase
 // ── Balanced, limited fetch per subtopic ──
let pool = [];

if (uniqueSubtopics.length) {
  const minPerSubtopic = 2; // keep in sync with your pickBalanced()
  // Aim to have enough candidates per subtopic to balance,
  // but cap to avoid huge downloads.
const perSubNeeded = Math.max(MIN_PER_SUBTOPIC, Math.ceil(numQuestions / uniqueSubtopics.length));
  const limitPerSubtopic = Math.min(perSubNeeded * 4, 200); // tweak the cap as you like

  // Fetch each subtopic with its own limit (in parallel)
  const promises = uniqueSubtopics.map((sid) => {
    let q = supabase.from('questions').select('*').eq('subtopic_id', sid);
    if (currentClass) q = q.eq('class', currentClass);
    return q.limit(limitPerSubtopic);
  });

  const results = await Promise.all(promises);
  pool = results.flatMap(({ data, error }, i) => {
    if (error) {
      console.error('Error fetching subtopic', selectedSubtopics[i], error);
      return [];
    }
    return data || [];
  });
} else {
  // Fallback: no subtopics explicitly chosen → small global sample
  let q = supabase.from('questions').select('*');
  if (currentClass) q = q.eq('class', currentClass);
  const { data, error } = await q.limit(Math.min(numQuestions * 3, 300));
  if (error) {
    console.error('Failed to load questions:', error);
    return;
  }
  pool = data || [];
}

if (!pool.length) {
  console.warn('No questions available for the chosen filters.');
  return;
}
// 2) Clamp and pick balanced per subtopic
numQuestions = Math.min(numQuestions, pool.length);

// Build sid -> questions[]
const bySub = new Map();
for (const q of pool) {
  const sid = q.subtopic_id;
  if (!bySub.has(sid)) bySub.set(sid, []);
  bySub.get(sid).push(q);
}

// pick at least N from each chosen subtopic, then round-robin
const examQ = pickBalanced(bySub, numQuestions, MIN_PER_SUBTOPIC);
 questionPool = examQ;

 // Build questions safely (Unicode + KaTeX-ready)
 examQ.forEach((q, idx) => {
   const div = document.createElement("div");
   div.className = 'question-block';
   // identifiers for review drawer
   div.dataset.qid  = q.id;
   div.dataset.qnum = String(idx + 1);

   // Title (safe text; KaTeX renders later)
   const p = document.createElement('p');
   const strong = document.createElement('strong');
   strong.textContent = `Q${idx+1}: `;
   const span = document.createElement('span');
   span.textContent = normText(q.question_text);
   p.append(strong, span);
   div.appendChild(p);

   if (q.type === 'open') {
     const input = document.createElement('input');
     input.type  = 'text';
     input.name  = 'q' + idx;               // FormData uses this
     input.className = 'w-full border p-2 rounded mt-2';
     input.placeholder = 'Write your answer…';
     input.addEventListener('input', () => {
       examAnswers.set(q.id, { type: 'open', value: input.value.trim() });
       refreshReviewDrawer();
       saveExamState();
     });
     div.appendChild(input);
   } else {
     const opts = normalizeOptions(q.options);
     Object.entries(opts).forEach(([key, text]) => {
       const label = document.createElement('label');
       label.className = 'block';
       const radio = document.createElement('input');
       radio.type  = 'radio';
       radio.name  = 'q' + idx;
       radio.value = key;
       const keySpan = document.createElement('strong');
       keySpan.textContent = ` ${key}: `;
       const txtSpan = document.createElement('span');
       txtSpan.textContent = normText(text);
       label.append(radio, keySpan, txtSpan);
       div.appendChild(label);
     });
     // track selected option for review drawer
     div.querySelectorAll(`input[name="q${idx}"]`).forEach(radio => {
       radio.addEventListener('change', () => {
         examAnswers.set(q.id, { type: 'mc', value: radio.value });
         refreshReviewDrawer();
         saveExamState();
       });
     });
   }

   // 🔹 Mark for review checkbox
   const markWrap = document.createElement('label');
   markWrap.className = 'mt-2 inline-flex items-center gap-2';
   const markCb = document.createElement('input');
   markCb.type = 'checkbox';
   markCb.addEventListener('change', () => {
     if (markCb.checked) markedSet.add(q.id);
     else markedSet.delete(q.id);
     refreshReviewDrawer();
     saveExamState();
   });
   markWrap.appendChild(markCb);
   markWrap.appendChild(document.createTextNode('Mark for review'));
   div.appendChild(markWrap);

   examForm.appendChild(div);
 });

// Render KaTeX after all blocks are mounted
renderMath(examForm);
refreshReviewDrawer();
saveExamState();
clearInterval(saveTimer);
saveTimer = setInterval(saveExamState, 5000);
window.addEventListener('beforeunload', onBeforeUnload);

classSelect.parentElement.classList.add('hidden');
subjectSelect.parentElement.classList.add('hidden');
  subtopicsContainer.classList.add('hidden');
  lengthSelect.parentElement.classList.add('hidden');
  startBtn.classList.add('hidden');
  examContainer.classList.remove('hidden');
  startTimer();
  initMultiPageQuestionNav();
}

function refreshReviewDrawer() {
  const container = document.getElementById('review-drawer');
  if (!container) return;

  const list = document.getElementById('review-list');
  const cUn = document.getElementById('review-count-unanswered');
  const cMk = document.getElementById('review-count-marked');

  list.innerHTML = "";
  let unanswered = 0;

  document.querySelectorAll('.question-block').forEach(el => {
    const qid  = el.dataset.qid;
    const qnum = el.dataset.qnum;
    const ans  = examAnswers.get(qid);
    const answered = ans && String(ans.value || '').length > 0;
    const marked   = markedSet.has(qid);
    if (!answered) unanswered++;

    if (marked || !answered) {
      const btn = document.createElement('button');
      btn.className =
        "px-2 py-1 rounded text-sm border " +
        (marked ? "bg-yellow-100 border-yellow-300" : "bg-gray-100 border-gray-300");
      btn.textContent = qnum + (marked ? " ★" : "");
      btn.addEventListener('click', () => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2","ring-blue-400");
        setTimeout(() => el.classList.remove("ring-2","ring-blue-400"), 800);
      });
      list.appendChild(btn);
    }
  });

  cUn.textContent = String(unanswered);
  cMk.textContent = String(markedSet.size);
  container.classList.toggle('hidden', list.children.length === 0);
}


renderMath(document.getElementById('examForm'));


function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingTime--;
    if ((remainingTime % 5) === 0) saveExamState(); // keep saved time fresh
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      submitExam();
    }
    updateTimerDisplay();
  }, 1000);
}

function updateTimerDisplay() {
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  timerEl.textContent = `Time Remaining: ${mins}m ${secs}s`;
}

async function submitExam() {
  clearInterval(timerInterval);
  clearInterval(saveTimer);

  try {
    const completedAt = new Date();
    const durationSeconds = Math.floor((completedAt - startedAt) / 1000);

    const answers = new FormData(examForm);
    let score = 0;
    const total = examForm.querySelectorAll('.question-block').length;

    answers.forEach((val, key) => {
      const idx = parseInt(key.replace('q', ''), 10);
      const q = questionPool[idx];
      if (q.type === 'open') {
        if (isCorrectOpen(q, val)) score++;
      } else {
        if (val === q.correct_option) score++;
      }
    });

    const percentage = Math.round((score / total) * 100);

    // Get the current user
    const {
      data: { user },
      error: authErr
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      console.error('Not logged in, cannot record results', authErr);
    } else {
      // Insert into user_exam_results
      const payload = {
        user_id:           user.id,
        exam_title:        `${classSelect.value} – ${subjectSelect.value}`,
        score:             score,
        total_questions:   total,
        duration_seconds:  durationSeconds,
        started_at:        startedAt.toISOString(),
        completed_at:      completedAt.toISOString(),
        topic_id:          currentSubtopics[0], // representative subtopic
      };

      const { data, error: insertErr } = await supabase
        .from('user_exam_results')
        .insert([payload])
        .select();

      if (insertErr) {
        console.error('✖️ Failed to record exam result:', insertErr);
        return;
      }

      examResultId = Array.isArray(data) && data[0]?.id ? data[0].id : null;

      // Build exam_items from the form answers
      const items = [];
      for (let idx = 0; idx < questionPool.length; idx++) {
        const q = questionPool[idx];
        const radioEl = document.querySelector(`input[name="q${idx}"]:checked`);
        const textEl  = document.querySelector(`input[name="q${idx}"]`);
        const chosen  = radioEl ? radioEl.value : (textEl ? textEl.value.trim() : null);

        let correct = false;
        if (q.type === 'open') {
          correct = chosen ? isCorrectOpen(q, chosen) : false;
        } else {
          correct = chosen === q.correct_option;
        }

        items.push({
          user_id: user.id,
          exam_result_id: examResultId,
          question_id: q.id,
          chosen_text: q.type === 'open' ? (chosen ?? null) : null,
          chosen_option: q.type !== 'open' ? (chosen ?? null) : null,
          is_correct: correct,
          time_ms: null,
        });
      }

      if (items.length && examResultId) {
        const { error: itemsErr } = await supabase.from('exam_items').insert(items);
        if (itemsErr) console.error('exam_items insert failed:', itemsErr);
      }

      // Hide exam UI; show results
      examContainer.style.display = 'none';
      examHeader?.classList.add('hidden');
      document.getElementById('review-drawer')?.classList.add('hidden');
      resultContainer.innerHTML = `
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Results</h2>
          <span class="text-sm text-gray-500">${new Date().toLocaleString()}</span>
        </div>
        <p class="mt-2">You scored <strong>${score}</strong> out of <strong>${total}</strong> (${percentage}%).</p>
        <div class="mt-4 flex gap-2">
          <button id="saveResultsBtn" class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Save to profile</button>
          <button id="newExamBtn" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Start a new exam</button>
        </div>
      `;

      // Wire buttons
      const saveBtn = document.getElementById('saveResultsBtn');
      const newBtn  = document.getElementById('newExamBtn');

      if (examResultId) {
        saveBtn.textContent = 'Saved to profile ✓';
        saveBtn.disabled = true;
        saveBtn.classList.remove('bg-green-600','hover:bg-green-700');
        saveBtn.classList.add('bg-green-500','opacity-80','cursor-default');
      } else {
        // Manual save (if auto-save failed)
        saveBtn.addEventListener('click', async () => {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');
            const payload2 = {
              user_id:           user.id,
              exam_title:        `${classSelect.value} – ${subjectSelect.value}`,
              score, total_questions: total,
              duration_seconds:  durationSeconds,
              started_at:        startedAt.toISOString(),
              completed_at:      completedAt.toISOString(),
              topic_id:          currentSubtopics[0] || null,
            };
            const { data: ins, error: insErr } = await supabase
              .from('user_exam_results').insert([payload2]).select();
            if (insErr) throw insErr;
            examResultId = Array.isArray(ins) && ins[0]?.id ? ins[0].id : null;

            if (examResultId && items.length) {
              const { error: itemsErr2 } = await supabase.from('exam_items').insert(
                items.map(it => ({ ...it, exam_result_id: examResultId }))
              );
              if (itemsErr2) console.warn('exam_items (manual) insert failed:', itemsErr2);
            }

            saveBtn.textContent = 'Saved to profile ✓';
            saveBtn.disabled = true;
            saveBtn.classList.remove('bg-green-600','hover:bg-green-700');
            saveBtn.classList.add('bg-green-500','opacity-80','cursor-default');
          } catch (e) {
            console.error('Manual save failed:', e);
            saveBtn.textContent = 'Save failed — try again';
          }
        });
      }
      newBtn.addEventListener('click', () => location.reload());

      // Build detailed report (safe DOM + KaTeX)
      const reportEl = document.getElementById('reportContainer');
      reportEl.innerHTML = '';

      questionPool.forEach((q, idx) => {
        const radioEl  = document.querySelector(`input[name="q${idx}"]:checked`);
        const textEl   = document.querySelector(`input[name="q${idx}"]`);
        const chosen   = radioEl ? radioEl.value : (textEl ? textEl.value.trim() : '[no answer]');

        const optsMap      = normalizeOptions(q.options);
        const correctKey   = q.type === 'open' ? null : q.correct_option;
        const correctValue = q.type === 'open'
          ? (q.answer_text ?? '')
          : (optsMap[correctKey] ?? correctKey ?? '');

        const block = document.createElement('div');
        block.className = 'p-4 border rounded';

        const pQ = document.createElement('p');
        const s  = document.createElement('strong'); s.textContent = `Q${idx+1}: `;
        const spanQ = document.createElement('span'); spanQ.textContent = normText(q.question_text);
        pQ.append(s, spanQ);
        block.appendChild(pQ);

        const pYour = document.createElement('p');
        pYour.append('Your answer: ');
        const emYour = document.createElement('em'); emYour.textContent = String(chosen ?? '');
        pYour.append(emYour);
        block.appendChild(pYour);

        const pCorr = document.createElement('p');
        pCorr.append('Correct answer: ');
        const emCorr = document.createElement('em');
        emCorr.textContent = q.type === 'open'
          ? String(correctValue ?? '')
          : `${correctKey}) ${String(correctValue ?? '')}`;
        pCorr.append(emCorr);
        block.appendChild(pCorr);

        const details = document.createElement('details');
        details.className = 'mt-2';
        const summary = document.createElement('summary');
        summary.className = 'cursor-pointer text-blue-600';
        summary.textContent = 'Explanation';
        details.appendChild(summary);
        const pExp = document.createElement('p');
        pExp.className = 'mt-1';
        pExp.textContent = normText(q.explanation || 'No explanation provided.');
        details.appendChild(pExp);

        block.appendChild(details);
        reportEl.appendChild(block);
      });

      // Render math in the REPORT (not the form)
      renderMath(reportEl);
      reportEl.classList.remove('hidden');
    } // <-- close the "else { ... }" that starts after auth check
  } // <-- close the outer "try {"
  finally {
    // Always clear autosave, even if we errored or returned early
    try { clearExamState(); } catch {}
    try { window.removeEventListener('beforeunload', onBeforeUnload); } catch {}
  }
}


function pickBalanced(bySubtopicMap, totalNeeded, minPerSubtopic) {
  // buckets: [{ sid, arr: shuffled questions }]
  const buckets = [...bySubtopicMap.entries()].map(([sid, arr]) => ({
    sid, arr: [...arr]
  }));
  buckets.forEach(b => shuffleArray(b.arr));

  const chosen = [];
  const subCount = buckets.length;
  if (subCount === 0 || totalNeeded <= 0) return [];

  // PASS A: round-robin for up to minPerSubtopic rounds
  // ensures representation from every subtopic even if totalNeeded is small
  for (let round = 0; round < minPerSubtopic && chosen.length < totalNeeded; round++) {
    for (const b of buckets) {
      if (b.arr.length > round) {
        chosen.push(b.arr[round]);
        if (chosen.length >= totalNeeded) break;
      }
    }
  }
  if (chosen.length >= totalNeeded) return shuffleArrayReturn(chosen).slice(0, totalNeeded);

  // PASS B: remove those already picked from each bucket
  const pickedIds = new Set(chosen.map(q => q.id));
  for (const b of buckets) {
    b.arr = b.arr.filter(q => !pickedIds.has(q.id));
  }

  // PASS C: round-robin fill from remaining
  let i = 0;
  while (chosen.length < totalNeeded) {
    const b = buckets[i % buckets.length];
    const q = b.arr.shift();
    if (q) chosen.push(q);
    // stop if all buckets empty
    if (!buckets.some(x => x.arr.length)) break;
    i++;
  }

  return shuffleArrayReturn(chosen).slice(0, totalNeeded);
}

function shuffleArrayReturn(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// Fisher–Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

