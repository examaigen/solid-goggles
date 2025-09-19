// special.js – quick links into focused practice modes
import { supabase } from './supabaseClient.js';
import { subjects } from './config/subjects.js';
import { selectQuestionsByIdsChunked  } from './dbUtil.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "./config/env.js";
// Show signout if logged in; otherwise redirect to login
(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const signOutBtn = document.getElementById('signout-btn');
  if (session) {
    if (signOutBtn) {
      signOutBtn.classList.remove('hidden');
      signOutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.replace('login.html');
      });
    }
  } else {
    // if you want this page to be public, comment next line:
    window.location.replace('login.html');
  }
})();

// ─────────────────────────────────────────────────────────────
// Build subtopic metadata (label + subject) from subjects.js
// ─────────────────────────────────────────────────────────────
const SUB_META = (() => {
  const bySubId = new Map(); // subtopic_id -> { label, subjectKey, subjectLabel }
  for (const subjKey of Object.keys(subjects)) {
    const subj = subjects[subjKey];
    const subjectLabel = subj?.label || subj?.name || subjKey;
    const tbc = subj?.topicsByClass || {};
    for (const cls of Object.keys(tbc)) {
      for (const topic of (tbc[cls] || [])) {
        for (const st of (topic.subtopics || [])) {
          if (st?.id) {
            bySubId.set(st.id, {
              label: st.label || st.name || st.title || st.id,
              subjectKey: subjKey,
              subjectLabel,
            });
          }
        }
      }
    }
  }
  return bySubId;
})();

const $ = (id) => document.getElementById(id);
const resultsEl = $('results');
const resultsTitle = $('results-title');
const resultsNote = $('results-note');
const resultsGrid = $('results-grid');
$('results-clear')?.addEventListener('click', () => {
  resultsEl?.classList.add('hidden');
  resultsGrid.innerHTML = '';
});

// ─────────────────────────────────────────────────────────────
// Data loaders
// ─────────────────────────────────────────────────────────────
async function loadLatestAttempts(userId, { sinceDays = null } = {}) {
  let q = supabase
    .from('question_attempts')
    .select('question_id, is_correct, answered_at, next_review_at')
    .eq('user_id', userId)
    .order('answered_at', { ascending: false });
  if (sinceDays && Number.isFinite(sinceDays)) {
    const dt = new Date();
    dt.setDate(dt.getDate() - sinceDays);
    q = q.gte('answered_at', dt.toISOString());
  }
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

async function mapQuestionToSubtopic(questionIds) {
  // sanitize + dedupe just in case
  const ids = Array.from(new Set((questionIds || []).filter(Boolean)));
  if (ids.length === 0) return new Map();

  // dbUtil helper does: select(...) THEN .in(...), in safe chunks
  const { data, error } = await selectQuestionsByIdsChunked(
    supabase,
    ids,
    'id,subtopic_id',   // fields
    100                 // chunk size (tweak 100–150 if you like)
  );

  if (error) {
    console.error('mapQuestionToSubtopic failed:', error);
    throw error;
  }

  const m = new Map();
  (data || []).forEach(r => m.set(r.id, r.subtopic_id));
  return m;
}



// ─────────────────────────────────────────────────────────────
// Aggregations
// ─────────────────────────────────────────────────────────────
function latestByQuestion(attempts) {
  const m = new Map(); // qid -> attempt (latest because ordered desc)
  for (const a of (attempts || [])) {
    if (!m.has(a.question_id)) m.set(a.question_id, a);
  }
  return m;
}

function groupCountsBySubtopic(questionSet, qidToSubtopic) {
  const counts = new Map(); // subtopic_id -> count
  for (const qid of questionSet) {
    const sid = qidToSubtopic.get(qid);
    if (!sid) continue;
    counts.set(sid, (counts.get(sid) || 0) + 1);
  }
  return counts;
}

// ─────────────────────────────────────────────────────────────
// Render
// ─────────────────────────────────────────────────────────────
function renderResults({ mode, countsBySubtopic }) {
  resultsGrid.innerHTML = '';
  // Group by subject label
  const bySubject = new Map(); // subjectLabel -> [{ sid, label, count }]
  for (const [sid, count] of countsBySubtopic.entries()) {
    const meta = SUB_META.get(sid);
    if (!meta) continue;
    const list = bySubject.get(meta.subjectLabel) || [];
    list.push({ sid, label: meta.label, count });
    bySubject.set(meta.subjectLabel, list);
  }

  if (bySubject.size === 0) {
    resultsGrid.innerHTML = `<p class="text-sm text-gray-500">Nieko nerasta.</p>`;
    return;
  }

  for (const [subjectLabel, rows] of bySubject.entries()) {
    const card = document.createElement('div');
    card.className = 'p-4 rounded border bg-white';
    card.innerHTML = `
      <div class="font-semibold mb-3">${subjectLabel}</div>
      <div class="flex flex-wrap gap-2"></div>
    `;
    const wrap = card.querySelector('div.flex');
    rows
      .sort((a,b)=> a.label.localeCompare(b.label))
      .forEach(({ sid, label, count }) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'px-3 py-1 rounded-full border bg-white hover:bg-gray-50 text-sm flex items-center gap-2';
        btn.innerHTML = `<span>${label}</span><span class="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">${count}</span>`;
        btn.addEventListener('click', () => {
          const url = new URL('player.html', location.href);
          url.searchParams.set('mode', mode);
          url.searchParams.set('subs', sid);
          // no class filter → include all matching questions
          location.href = url.toString();
        });
        wrap.appendChild(btn);
      });
    resultsGrid.appendChild(card);
  }
}

function showResultsPanel({ title, note }) {
  resultsTitle.textContent = title;
  resultsNote.textContent = note || '';
  resultsEl.classList.remove('hidden');
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function onMistakes() {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return;

  // latest attempts within last 7 days
  const attempts = await loadLatestAttempts(userId, { sinceDays: 7 });
  const latest = latestByQuestion(attempts);
  // questions where latest attempt is incorrect
  const badQids = new Set(
    [...latest.entries()]
      .filter(([, a]) => a.is_correct === false)
      .map(([qid]) => qid)
  );
  if (badQids.size === 0) {
    renderResults({ mode: 'mistakes', countsBySubtopic: new Map() });
    showResultsPanel({ title: 'Tik klaidos', note: 'Per pastarąsias 7 dienas klaidų nerasta.' });
    return;
  }
  const qidToSub = await mapQuestionToSubtopic([...badQids]);
  const counts = groupCountsBySubtopic(badQids, qidToSub);
  renderResults({ mode: 'mistakes', countsBySubtopic: counts });
  showResultsPanel({ title: 'Tik klaidos', note: 'Rodytos potėmės, kuriose jūsų paskutinis bandymas (per 7 d.) buvo neteisingas.' });
}

async function onReview() {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return;

  // latest attempt per question (all time), then next_review_at <= now
  const attempts = await loadLatestAttempts(userId);
  const latest = latestByQuestion(attempts);
  const now = Date.now();
  const dueQids = new Set(
    [...latest.entries()]
      .filter(([, a]) => a.next_review_at && new Date(a.next_review_at).getTime() <= now)
      .map(([qid]) => qid)
  );
  if (dueQids.size === 0) {
    renderResults({ mode: 'review', countsBySubtopic: new Map() });
    showResultsPanel({ title: 'Peržiūros skola', note: 'Šiuo metu pakartojimo skolų nėra.' });
    return;
  }
  const qidToSub = await mapQuestionToSubtopic([...dueQids]);
  const counts = groupCountsBySubtopic(dueQids, qidToSub);
  renderResults({ mode: 'review', countsBySubtopic: counts });
  showResultsPanel({ title: 'Peržiūros skola', note: 'Rodytos potėmės, kuriose atėjo pakartojimo laikas.' });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-mistakes')?.addEventListener('click', onMistakes);
  document.getElementById('start-review')?.addEventListener('click', onReview);
  document.getElementById('start-exam')?.addEventListener('click', () => {
    window.location.href = 'exam.html';
  });
});
