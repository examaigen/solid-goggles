import { supabase } from './supabaseClient.js';
import { subjects } from './config/subjects.js';
import { selectQuestionsByIdsChunked, selectQuestionsBySubtopicsChunked } from './dbUtil.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
let userId = null;
/**
 * Fetches and renders the user's profile information, attempt stats, and exam history.
 * @param {string} userId - The UUID of the logged-in user.
 */

// Build a global map: subtopic_id -> label (from subjects.js)
const SUBTOPIC_LABELS = (() => {
  const map = new Map();
  for (const subjKey of Object.keys(subjects)) {
    const subj = subjects[subjKey];
    const tbc = subj?.topicsByClass || {};
    for (const cls of Object.keys(tbc)) {
      for (const topic of (tbc[cls] || [])) {
        for (const st of (topic.subtopics || [])) {
          if (st?.id) map.set(st.id, st.label || st.name || st.title || st.id);
        }
      }
    }
  }
  return map;
})();

async function loadProfileStats(userId) {
  // PROFILE INFO
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email, created_at')
    .eq('id', userId)
    .single();
  if (profileError) {
    console.error('Profile load error:', profileError);
    return;
  }
  document.getElementById('profile-email').textContent = profile.email;
  document.getElementById('profile-joined').textContent =
    new Date(profile.created_at).toLocaleDateString();

  // ATTEMPT STATS
  const { count: totalCount } = await supabase
    .from('question_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  const { count: correctCount } = await supabase
    .from('question_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_correct', true);

  document.getElementById('stat-attempts').textContent = totalCount ?? 0;
  document.getElementById('stat-correct').textContent = correctCount ?? 0;
  document.getElementById('stat-accuracy').textContent =
    totalCount
      ? ((correctCount / totalCount) * 100).toFixed(1) + '%'
      : '0%';

  // EXAM HISTORY
  const { data: exams, error: historyError } = await supabase
    .from('user_exam_results')
    .select('exam_title, score, total_questions, percentage, duration_seconds, completed_at')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
if(historyError){console.error('Exam history load error:', historyError); return;}
renderExamHistory(exams);
    // ───────────────── NEW: Per-subtopic heatmap & achievements ─────────────────

  // 1) Fetch all this user's attempts (you can add a time window if needed)
  const { data: attemptsAll, error: attErr } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct, answered_at')
    .eq('user_id', userId)
    .order('answered_at', { ascending: true }); // oldest→newest (nice for trend)
  if (attErr) { console.error(attErr); return; }

  // 2) Map question_id → subtopic_id (chunked to avoid huge GET URLs)
const qids = [...new Set((attemptsAll || []).map(a => a.question_id))];
let subtopicByQid = new Map();

if (qids.length) {
  const { data: qrows, error: qErr } = await selectQuestionsByIdsChunked(
    supabase,
    qids,
    'id,subtopic_id',
    100
  );
  if (!qErr) qrows.forEach(q => subtopicByQid.set(q.id, q.subtopic_id));
  else console.error(qErr);
}


  // 3) Group attempts by subtopic_id
  const bySub = {};
  for (const a of (attemptsAll||[])){
    const sid = subtopicByQid.get(a.question_id);
    if (!sid) continue;
    if (!bySub[sid]) bySub[sid] = { total:0, correct:0, attempts:[] };
    bySub[sid].total += 1;
    if (a.is_correct) bySub[sid].correct += 1;
    bySub[sid].attempts.push({ is_correct: !!a.is_correct, answered_at: a.answered_at });
  }

  // 4) Subtopic labels (from DB); fallback to ID if missing
// Instead of fetching labels from DB, take them from subjects.js
const subIds = Object.keys(bySub);
const labelById = {};
for (const id of subIds) labelById[id] = SUBTOPIC_LABELS.get(id) || id;

  // 5) Render heatmap tiles with sparklines
  const heatmapEl = document.getElementById('subtopic-heatmap');
  if (heatmapEl) renderSubtopicHeatmap(heatmapEl, bySub, labelById);

  // 6) Best / Worst lists (min 10 attempts)
  const bestList = document.getElementById('best-list');
  const worstList = document.getElementById('worst-list');
  if (bestList && worstList) renderBestWorst(bestList, worstList, bySub, labelById, 10);

  // 7) Achievements
  // 7a) Daily streak (based on attempts)
  const streak = computeDailyStreak(attemptsAll || []);
  const streakEl = document.getElementById('ach-streak');
  if (streakEl) streakEl.textContent = `${streak} day${streak===1?'':'s'}`;

  // 7b) Fastest 10/10 from user_exam_results
// ── Achievements: fastest perfect exam (any total size) ──
const examCountEl = document.getElementById('ach-exam-count');
if (examCountEl) examCountEl.textContent = String((exams || []).length);

let fastest = null;
for (const ex of (exams || [])) {
  const total = Number(ex.total_questions);
  const score = Number(ex.score);
  const dur   = Number(ex.duration_seconds);

  // perfect score, valid duration, any exam size > 0
  if (Number.isFinite(total) && total > 0 &&
      Number.isFinite(dur) &&
      score === total) {
    if (!fastest || dur < Number(fastest.duration_seconds)) fastest = ex;
  }
}

const fastEl = document.getElementById('ach-fastest');
const fastDt = document.getElementById('ach-fastest-date');

if (fastEl) {
  if (fastest) {
    fastEl.textContent = `${fmtDuration(Number(fastest.duration_seconds))} • ${fastest.total_questions}Q`;
  } else {
    fastEl.textContent = '—';
  }
}
if (fastDt) fastDt.textContent = fastest ? new Date(fastest.completed_at).toLocaleDateString() : '—';

}

// ────────────────────────────────────────────────────────────
// Helpers for per-subtopic stats, sparklines, achievements
// ────────────────────────────────────────────────────────────

function openExamModal(ex) {
  const body = document.getElementById('examModalBody');
  const dlg  = document.getElementById('examModal');
  body.innerHTML = examSummaryHTML(ex);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open',''); // fallback if <dialog> lacks .showModal
}

function examSummaryHTML(ex) {
  const title = ex.exam_title || ex.title || 'Exam';
  const total = Number(ex.total_questions) || 0;
  const score = Number(ex.score) || 0;
  const dur   = Number(ex.duration_seconds) || 0;
  const acc   = total ? score/total : 0;
  const paceS = (total && dur) ? (dur/total) : 0;
  const dt    = ex.completed_at ? new Date(ex.completed_at) : null;

  return `
    <div class="space-y-2">
    <div><span class="text-gray-500">Exam:</span> ${title}</div>
      <div><span class="text-gray-500">Completed:</span> ${dt ? dt.toLocaleString() : '—'}</div>
      <div><span class="text-gray-500">Score:</span> ${score}/${total} (${(acc*100).toFixed(0)}%)</div>
      <div><span class="text-gray-500">Duration:</span> ${fmtDuration(dur)} • Pace ${paceS.toFixed(1)}s/Q</div>
    </div>
  `;
}

// Create one clickable exam card
function createExamCard(ex) {
  const title = ex.exam_title || ex.title || 'Exam';
  const total = Number(ex.total_questions) || 0;
  const score = Number(ex.score) || 0;
  const dur   = Number(ex.duration_seconds) || 0;
  const dt    = ex.completed_at ? new Date(ex.completed_at) : null;

  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'w-full text-left p-3 rounded border bg-white hover:bg-gray-50 transition';

  card.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="font-medium truncate pr-3" title="${title}">${title}</div>
      <div class="text-sm text-gray-500">${dt ? dt.toLocaleDateString() : '—'}</div>
    </div>
    <div class="text-sm text-gray-600 mt-1">Score: ${score}/${total} • Time: ${fmtDuration(dur)}</div>
  `;

  card.addEventListener('click', () => openExamModal(ex));
  return card;
}


// Render latest 5 + collapsible older
function renderExamHistory(exams) {
  const el = document.getElementById('examHistory');
  if (!el) return;

  el.innerHTML = '';

  const sorted = [...(exams || [])].sort(
    (a, b) => new Date(b.completed_at || 0) - new Date(a.completed_at || 0)
  );

  if (sorted.length === 0) {
    el.innerHTML = '<p class="text-gray-500 text-sm">No exams yet.</p>';
    return;
  }

  const latest = sorted.slice(0, 5);
  const older  = sorted.slice(5);

  // Header line
  const header = document.createElement('div');
  header.className = 'text-sm text-gray-600 mb-1';
  header.textContent = older.length > 0
    ? `Showing latest 5 of ${sorted.length}`
    : `Showing all ${sorted.length}`;
  el.appendChild(header);

  // Latest 5
  latest.forEach(ex => el.appendChild(createExamCard(ex)));

  // Older (collapsible)
  if (older.length > 0) {
    const details = document.createElement('details');
    details.className = 'mt-2 rounded border bg-white';

    const summary = document.createElement('summary');
    summary.className = 'cursor-pointer px-3 py-2 text-sm font-medium';
    summary.textContent = `Show ${older.length} older exam${older.length===1?'':'s'}`;
    details.appendChild(summary);

    const inner = document.createElement('div');
    inner.className = 'p-3 space-y-3 border-t';
    older.forEach(ex => inner.appendChild(createExamCard(ex)));
    details.appendChild(inner);

    el.appendChild(details);
  }
}

// ── Bookmark modal + card rendering ──
function openBookmarkModal(bm) {
  const body = document.getElementById('bookmarkModalBody');
  const dlg  = document.getElementById('bookmarkModal');
  body.innerHTML = bookmarkSummaryHTML(bm);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open','');
}

function bookmarkSummaryHTML(bm) {
  const q  = bm.questions || {};
  const txt = q.question_text || bm.question_id;
  const sid = q.subtopic_id;
  const label = SUBTOPIC_LABELS.get(sid) || sid || '—';
  const created = bm.created_at ? new Date(bm.created_at).toLocaleString() : '—';

  return `
    <div class="space-y-3">
      <div class="text-sm text-gray-500">Saved:</div>
      <div>${created}</div>

      <div class="text-sm text-gray-500">Subtopic:</div>
      <div>${label}</div>

      <div class="text-sm text-gray-500">Question:</div>
      <div class="whitespace-pre-wrap">${txt}</div>
    </div>
  `;
}

function createBookmarkCard(bm) {
  const q  = bm.questions || {};
  const txt = q.question_text || bm.question_id || '';
  const sid = q.subtopic_id;
  const label = SUBTOPIC_LABELS.get(sid) || sid || '—';
  const short = txt.length > 160 ? txt.slice(0,160) + '…' : txt;

  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'w-full text-left p-3 rounded border bg-white hover:bg-gray-50 transition';
  card.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="font-medium truncate pr-3">${label}</div>
      <div class="text-sm text-gray-500">${new Date(bm.created_at).toLocaleDateString()}</div>
    </div>
    <div class="text-sm text-gray-600 mt-1">${short || '—'}</div>
  `;
  card.addEventListener('click', () => openBookmarkModal(bm));
  return card;
}

async function loadAndRenderBookmarks(userId) {
  const { data, error } = await supabase
    .from('question_bookmarks')
    .select(`
      question_id,
      created_at,
      questions (
        id,
        question_text,
        subtopic_id
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const listEl = document.getElementById('bookmarkList');
  if (!listEl) return;

  if (error) {
    console.error('Bookmarks load error:', error);
    listEl.innerHTML = '<p class="text-sm text-red-600">Could not load bookmarks.</p>';
    return;
  }
  if (!data || data.length === 0) {
    listEl.innerHTML = '<p class="text-gray-500 text-sm">No bookmarks yet.</p>';
    return;
  }

  listEl.innerHTML = '';
  data.forEach(bm => listEl.appendChild(createBookmarkCard(bm)));
}


function fmtDuration(sec){
  const n = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(n / 60), s = n % 60;
  return `${m}m ${s}s`;
}


function fmtPct(x) { return `${(x*100).toFixed(0)}%`; }
function clamp01(x){ return Math.max(0, Math.min(1, x)); }
function hslForAccuracy(acc){ // 0→red, 1→green
  const h = Math.round(clamp01(acc) * 120); // 0=red, 120=green
  return `hsl(${h} 70% 85%)`;
}
function yyyy_mm_dd(d){
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}

// Build a simple SVG sparkline for last N attempts trend (cumulative accuracy)
function sparklineForAttempts(attempts, maxPoints = 30){
  // attempts: [{is_correct, answered_at}], sorted oldest→newest preferred
  const arr = attempts.slice(-maxPoints);
  let cum = 0;
  const series = arr.map((a, i) => {
    cum += a.is_correct ? 1 : 0;
    return cum / (i + 1);
  });
  const W = 120, H = 28, n = series.length || 1;
  const pts = series.map((v, i) => {
    const x = (i/(n-1||1)) * (W-2) + 1;
    const y = (1 - clamp01(v)) * (H-2) + 1;
    return `${x},${y}`;
  }).join(' ');
  const last = series[series.length-1] ?? 0;
  return `
    <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
      <polyline fill="none" stroke="currentColor" stroke-width="2" points="${pts}"/>
      <text x="${W-2}" y="${H-4}" text-anchor="end" font-size="10">${fmtPct(last)}</text>
    </svg>
  `;
}

// Render heatmap tiles
function renderSubtopicHeatmap(container, stats, labelById){
  container.innerHTML = '';
  const entries = Object.entries(stats); // [subtopic_id, {total, correct, attempts[]}]
  if (!entries.length){
    container.innerHTML = '<p class="text-gray-500 text-sm">No attempts yet.</p>';
    return;
  }
  // sort by subtopic label for stable view
  entries.sort((a,b)=> (labelById[a[0]]||a[0]).localeCompare(labelById[b[0]]||b[0]));
  for (const [sid, s] of entries){
    const acc = s.total ? (s.correct / s.total) : 0;
    const tile = document.createElement('div');
    tile.className = 'p-3 rounded border text-sm';
    tile.style.background = hslForAccuracy(acc);
    tile.innerHTML = `
      <div class="font-medium truncate" title="${labelById[sid] || sid}">${labelById[sid] || sid}</div>
      <div class="flex items-center justify-between mt-2">
        <div class="text-xs text-gray-700">${fmtPct(acc)} • ${s.total} attempts</div>
        <div class="ml-2 text-gray-700">${sparklineForAttempts(s.attempts)}</div>
      </div>
    `;
    container.appendChild(tile);
  }
}

function renderBestWorst(bestListEl, worstListEl, stats, labelById, minAttempts = 10){
  const rows = Object.entries(stats)
    .map(([sid, s]) => ({ sid, total: s.total, acc: s.total ? s.correct/s.total : 0 }))
    .filter(r => r.total >= minAttempts);

  bestListEl.innerHTML = ''; worstListEl.innerHTML = '';
  if (!rows.length){
    bestListEl.innerHTML = '<li class="text-gray-500">Not enough data yet</li>';
    worstListEl.innerHTML = '<li class="text-gray-500">Not enough data yet</li>';
    return;
  }

  rows.sort((a,b)=>b.acc-a.acc);
  rows.slice(0,3).forEach(r=>{
    const li = document.createElement('li');
    li.textContent = `${labelById[r.sid] || r.sid} — ${fmtPct(r.acc)} (${r.total})`;
    bestListEl.appendChild(li);
  });
  rows.sort((a,b)=>a.acc-b.acc);
  rows.slice(0,3).forEach(r=>{
    const li = document.createElement('li');
    li.textContent = `${labelById[r.sid] || r.sid} — ${fmtPct(r.acc)} (${r.total})`;
    worstListEl.appendChild(li);
  });
}

function computeDailyStreak(attempts){
  // Use local date (Europe/Vilnius) via browser; attempts sorted newest→oldest is ok.
  const days = new Set(attempts.map(a => yyyy_mm_dd(new Date(a.answered_at))));
  let streak = 0;
  const today = new Date();
  for(let i=0;;i++){
    const d = new Date(today); d.setDate(today.getDate()-i);
    if (days.has(yyyy_mm_dd(d))) streak++;
    else break;
  }
  return streak;
}

// Initialize on page load for standalone profile page
// Initialize on page load for standalone profile page
document.addEventListener('DOMContentLoaded', async () => {
  // Sign-out button handler (available on all pages with this script)
  const signOutBtn = document.getElementById('signout-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      window.location.replace('login.html');
    });
  }


  // ── Find question by ID → open in player ──
const qidForm = document.getElementById('qidForm');
const qidInput = document.getElementById('qidInput');
const qidPreviewBtn = document.getElementById('qidPreviewBtn');
const qidPreview = document.getElementById('qidPreview');

function isUuid(v) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v || '');
}

qidForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const id = qidInput.value.trim();
  if (!isUuid(id)) return alert('Please enter a valid UUID.');
  // Jump straight to player single-question mode
  location.href = `player.html?mode=single&qid=${encodeURIComponent(id)}`;
});

qidPreviewBtn?.addEventListener('click', async () => {
  const id = qidInput.value.trim();
  if (!isUuid(id)) { qidPreview.textContent = 'Invalid UUID.'; return; }
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, subtopic_id')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) { qidPreview.textContent = 'Question not found.'; return; }
  const txt = (data.question_text || '').slice(0, 200);
  qidPreview.textContent = txt + (txt.length === 200 ? '…' : '');
});

  // Only proceed if on profile.html (has profile-email element)
  if (!document.getElementById('profile-email')) return;

  // Ensure user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('Session fetch error or no session:', sessionError);
    return window.location.replace('login.html');
  }

  // Save for later handlers
  userId = session.user.id;

  // Load and render the profile stats and exam history
  await loadProfileStats(userId);
await loadAndRenderBookmarks(userId);


  // Wire up "clear attempts" button
  const clearBtn = document.getElementById('clear-attempts-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
      const ok = confirm('Ar tikrai išvalyti visus praktikos bandymus?');
      if (!ok) return;

      clearBtn.disabled = true;

      const { error: delErr } = await supabase
        .from('question_attempts')
        .delete()
        .eq('user_id', userId);

      if (delErr) {
        alert('Nepavyko ištrinti bandymų: ' + delErr.message);
        clearBtn.disabled = false;
        return;
      }

      // Refresh stats and history
      await loadProfileStats(userId);
      clearBtn.disabled = false;
    });
  }

  // View bookmarks
  const viewBookmarksBtn = document.getElementById('view-bookmarks');
  if (viewBookmarksBtn) {
    viewBookmarksBtn.addEventListener('click', async () => {
      const { data, error } = await supabase
        .from('question_bookmarks')
        .select(`
          question_id,
          created_at,
          questions (
            id,
            question_text,
            subtopic_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        alert('Could not load bookmarks.');
        return;
      }

      if (!data || !data.length) {
        alert('No bookmarks yet.');
        return;
      }

      const list = data
        .map(row => `• ${row.questions?.question_text ?? row.question_id}`)
        .join('\n\n');
      alert(`Bookmarked questions:\n\n${list}`);
    });
  }
  // Auto-open exam if dashboard linked with ?view_exam=ID
  const id = new URLSearchParams(location.search).get('view_exam');
  if (id) {
    try {
      const { data, error } = await supabase
        .from('user_exam_results')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!error && data) openExamModal(data);
    } catch {}
  }
});
