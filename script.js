// script.js — DASHBOARD

// --- i18n/bootstrap wiring (add at the very top of the file) ---
import "./bootstrap.js";
import { t } from "./config/i18n-lt.js";
import { APP_NAME } from "./config/env.js";
import { selectQuestionsByIdsChunked } from './dbUtil.js';

// Tiny getter: "auth.email" -> t.auth.email
function getI18n(key) {
  try {
   return key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), t);
  } catch (_) {
    return undefined;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Brand any element that asks for it
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = APP_NAME;
  });

  // 1) Inner text labels: <span data-i18n="auth.email"></span>
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const v = key ? getI18n(key) : undefined;
    if (typeof v === "string") el.textContent = v;
  });

  // 2) Placeholders: <input data-i18n-ph="auth.email" ...>
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    const v = key ? getI18n(key) : undefined;
    if (typeof v === "string") el.setAttribute("placeholder", v);
  });

  // 3) Title attributes (tooltips): <button data-i18n-title="player.submit">
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const v = key ? getI18n(key) : undefined;
    if (typeof v === "string") el.setAttribute("title", v);
  });
});
// --- end i18n/bootstrap wiring ---

import { ensureSessionOrRedirect } from './services/authGuard.js';
import { supabase } from './supabaseClient.js';
import { subjects } from './config/subjects.js';
let userId = null;



// ───────────────────────────────────────────────────────────
// Common helpers
// ───────────────────────────────────────────────────────────
function subtopicMetaMap() {
  const map = new Map(); // subtopic_id -> { label, subjectLabel }
  for (const sk of Object.keys(subjects)) {
    const subj = subjects[sk];
    const subjectLabel = subj?.label || subj?.name || sk;
    const tbc = subj?.topicsByClass || {};
    Object.keys(tbc).forEach(klass => {
      (tbc[klass] || []).forEach(topic => {
        (topic.subtopics || []).forEach(st => {
          if (st?.id) {
            map.set(st.id, {
              label: st.label || st.name || st.title || st.id,
              subjectLabel
            });
          }
        });
      });
    });
  }
  return map;
}

async function getLatestAttempts(userId, { sinceDays = null } = {}) {
  let q = supabase
    .from('question_attempts')
    .select('question_id, is_correct, answered_at, next_review_at')
    .eq('user_id', userId)
    .order('answered_at', { ascending: false });
  if (sinceDays && Number.isFinite(sinceDays)) {
    const dt = new Date(); dt.setDate(dt.getDate() - sinceDays);
    q = q.gte('answered_at', dt.toISOString());
  }
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

function latestByQuestion(attempts) {
  const m = new Map(); // qid -> attempt (latest wins)
  for (const a of attempts) if (!m.has(a.question_id)) m.set(a.question_id, a);
  return m;
}

async function mapQidsToSubtopics(qids) {
  const ids = Array.isArray(qids) ? qids : Array.from(qids || []);
  const cleanIds = ids.filter(id => typeof id === 'string' && id.length > 0);
  if (cleanIds.length === 0) return new Map();

  const { data, error } = await selectQuestionsByIdsChunked(supabase, cleanIds, 'id,subtopic_id', 100);
  if (error) throw error;

  const m = new Map();
  for (const r of (data || [])) m.set(r.id, r.subtopic_id);
  return m;
}
function groupCountsBySubtopic(qidSet, qidToSub) {
  const counts = new Map();
  for (const qid of qidSet) {
    const sid = qidToSub.get(qid);
    if (!sid) continue;
    counts.set(sid, (counts.get(sid) || 0) + 1);
  }
  return counts;
}

function renderList(container, counts, meta, mode) {
  if (!container) return; 
  container.innerHTML = '';
  const items = [...counts.entries()]
    .map(([sid, count]) => ({ sid, count, meta: meta.get(sid) }))
    .filter(x => x.meta)
    .sort((a,b)=> b.count - a.count)
    .slice(0, 8);
  if (!items.length) {
    container.innerHTML = `<div class="text-gray-500">Nieko nerasta.</div>`;
    return;
  }
  items.forEach(({ sid, count, meta }) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'w-full text-left px-3 py-2 rounded border bg-white hover:bg-gray-50 flex items-center justify-between';
    row.innerHTML = `
      <div>
        <div class="font-medium">${meta.label}</div>
        <div class="text-xs text-gray-500">${meta.subjectLabel}</div>
      </div>
      <span class="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">${count}</span>
    `;
    row.addEventListener('click', () => {
      const url = new URL('player.html', location.href);
      url.searchParams.set('mode', mode);
      url.searchParams.set('subs', sid);
      location.href = url.toString();
    });
    container.appendChild(row);
  });
}

// ───────────────────────────────────────────────────────────
// Dashboard cards/lists
// ───────────────────────────────────────────────────────────
async function initDashboard() {
  // Resume exam card (localStorage)
  try {
    const saved = JSON.parse(localStorage.getItem('examState') || 'null');
    const valid = saved && Array.isArray(saved.questions) && saved.questions.length && saved.remainingTime > 0;
    if (valid) {
      const cardResume = document.getElementById('card-resume');
      cardResume?.classList.remove('hidden');
      if (cardResume) cardResume.onclick = () => { location.href = 'exam.html'; };
    }
  } catch {}

  // Need session for Supabase reads
  const { data: { session } } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) return;
  userId = uid;

  const meta = subtopicMetaMap();
  const attemptsAll  = await getLatestAttempts(uid);
  const attempts7d   = await getLatestAttempts(uid, { sinceDays: 7 });
  const latestAll    = latestByQuestion(attemptsAll);
  const latest7d     = latestByQuestion(attempts7d);
  const now          = Date.now();

  // review due
  const dueQids = new Set(
    [...latestAll.entries()]
      .filter(([, a]) => a.next_review_at && new Date(a.next_review_at).getTime() <= now)
      .map(([qid]) => qid)
      .filter(Boolean)
  );

  // mistakes (7d)
  const mistakeQids = new Set(
    [...latest7d.entries()]
      .filter(([, a]) => a.is_correct === false)
      .map(([qid]) => qid)
      .filter(Boolean)
  );

  // map qids -> subtopic
  const qidToSubForDue = await mapQidsToSubtopics([...dueQids]);
  const qidToSubForBad = await mapQidsToSubtopics([...mistakeQids]);
  const countsDue      = groupCountsBySubtopic(dueQids, qidToSubForDue);
  const countsMistakes = groupCountsBySubtopic(mistakeQids, qidToSubForBad);
  const topDue = [...countsDue.entries()].sort((a,b)=>b[1]-a[1])[0];
  const topBad = [...countsMistakes.entries()].sort((a,b)=>b[1]-a[1])[0];

  // cards
  const dueCountEl = document.getElementById('card-review-count');
  const badCountEl = document.getElementById('card-mistakes-count');
  const totalDue   = [...countsDue.values()].reduce((a,b)=>a+b,0);
  const totalBad   = [...countsMistakes.values()].reduce((a,b)=>a+b,0);
  if (dueCountEl) dueCountEl.textContent = String(totalDue);
  if (badCountEl) badCountEl.textContent = String(totalBad);

  // clicking a card jumps to the top item if available
  const cardReview   = document.getElementById('card-review');
  const cardMistakes = document.getElementById('card-mistakes');
  if (cardReview)   cardReview.onclick = () => {
    const url = new URL('player.html', location.href);
    url.searchParams.set('mode', 'review');
    if (topDue) url.searchParams.set('subs', topDue[0]);
    location.href = url.toString();
  };
  if (cardMistakes) cardMistakes.onclick = () => {
    const url = new URL('player.html', location.href);
    url.searchParams.set('mode', 'mistakes');
    if (topBad) url.searchParams.set('subs', topBad[0]);
    location.href = url.toString();
  };

  // lists
  renderList(document.getElementById('list-review'),   countsDue,      meta, 'review');
  renderList(document.getElementById('list-mistakes'), countsMistakes, meta, 'mistakes');
}

// ───────────────────────────────────────────────────────────
// Recent exams
// ───────────────────────────────────────────────────────────
async function loadRecentExams(uid, limit = 3) {
  const { data, error } = await supabase
    .from('user_exam_results')
    .select('id, exam_title, score, total_questions, started_at, completed_at, duration_seconds')
    .eq('user_id', uid)
    .order('completed_at', { ascending: false, nullsFirst: false })
    .order('started_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

function renderRecentExams(rows) {
  const box = document.getElementById('list-exams');
  if (!box) return;
  box.innerHTML = '';
  if (!rows.length) {
    box.innerHTML = `<div class="text-gray-500">Dar neturite išsaugotų egzaminų.</div>`;
    return;
  }
  rows.forEach(r => {
    const when = new Date(r.completed_at || r.started_at || Date.now()).toLocaleString();
    const pct  = (r.total_questions > 0) ? Math.round((r.score / r.total_questions) * 100) : 0;
    const row  = document.createElement('div');
    row.className = 'px-3 py-2 rounded border bg-white flex items-center justify-between';
    row.innerHTML = `
      <div class="min-w-0">
        <div class="font-medium truncate">${r.exam_title || 'Egzaminas'}</div>
        <div class="text-xs text-gray-500">${when}</div>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">${r.score}/${r.total_questions} (${pct}%)</span>
        <a href="profile.html?view_exam=${encodeURIComponent(r.id)}" class="text-blue-600 text-sm hover:underline">Peržiūra</a>
      </div>
    `;
    box.appendChild(row);
  });
}

async function initRecentExams() {
  const { data: { session } } = await supabase.auth.getSession();
  const uid = session?.user?.id;
  if (!uid) return;
  const rows = await loadRecentExams(uid, 3);
  renderRecentExams(rows);
}

// ───────────────────────────────────────────────────────────
// Bootstrap
// ───────────────────────────────────────────────────────────
function bootstrapDashboard() {
  // Clear dynamic containers to avoid stale DOM after bfcache restore
  const reviewList   = document.getElementById('list-review');
  const mistakesList = document.getElementById('list-mistakes');
  const examsList    = document.getElementById('list-exams');
  if (reviewList)   reviewList.innerHTML   = '';
  if (mistakesList) mistakesList.innerHTML = '';
  if (examsList)    examsList.innerHTML    = '';
  initDashboard().catch(console.warn);
  initRecentExams().catch(console.warn);
}

(async () => {
  const { user } = await ensureSessionOrRedirect();
  userId = user?.id || null;
  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapDashboard, { once: true });
  } else {
    bootstrapDashboard();
  }
  // Re-run when returning via back/forward cache
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) bootstrapDashboard();
  });
})();