// skill.js — unified helpers for user skill + mixed-difficulty serving (practice only)
import { supabase } from "../supabaseClient.js";

/** Read (or default) the user's skill for a subtopic. */
export async function getUserSkill(userId, subtopicId) {
  const { data, error } = await supabase
    .from('user_skills')
    .select('level, ema_success, attempts, streak')
    .eq('user_id', userId)
    .eq('subtopic_id', subtopicId)
    .maybeSingle();

  // If no row yet → Level 1 by default.
  if (error && error.code !== 'PGRST116') throw error;
  return data ?? { level: 1, ema_success: 0, attempts: 0, streak: 0 };
}

/** For a given level k (1..5) return allowed difficulties [1..k]. */
function diffsForLevel(level) {
  const lv = Math.max(1, Math.min(5, level || 1));
  return Array.from({ length: lv }, (_, i) => i + 1);
}

/** Split those difficulties into buckets with weights. */
function difficultyBuckets(level) {
  const diffs = diffsForLevel(level);
  const current = level;
  const prev = Math.max(1, level - 1);
  const earlier = diffs.filter(d => d < prev);
  return { current, prev, earlier };
}

/** Fetch questions by subtopic + difficulty list (optionally class), capped by limit. */
async function fetchByDiffList(subtopicId, diffList, selectedClass, limit) {
  if (!limit || diffList.length === 0) return [];
  let q = supabase
    .from('questions')
    .select('id, question_text, options, correct_option, explanation, subtopic_id, class, type, answer_text, answer_type, answer_tolerance, difficulty')
    .eq('subtopic_id', subtopicId)
    .in('difficulty', diffList);

  if (selectedClass) q = q.eq('class', selectedClass);

  // deterministic but varied enough between calls (you can add randomized RPC later if you wish)
  q = q.order('id', { ascending: false }).limit(limit);

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

/**
 * Build a practice pool for one subtopic using a mixed distribution:
 * current level ~50%, previous ~30%, earlier ~20% (spread evenly).
 */
async function mixedPoolForSubtopic(userId, subtopicId, selectedClass, N = 20) {
  const skill = await getUserSkill(userId, subtopicId);
  const { current, prev, earlier } = difficultyBuckets(skill.level);

  const counts = {
    current: Math.round(N * 0.5),
    prev: Math.round(N * 0.3),
    earlier: N - Math.round(N * 0.5) - Math.round(N * 0.3),
  };

  const parts = [];
  parts.push(...await fetchByDiffList(subtopicId, [current], selectedClass, counts.current));
  parts.push(...await fetchByDiffList(subtopicId, [prev], selectedClass, counts.prev));

  // split the 20% "earlier" across remaining diffs (if any)
  if (earlier.length && counts.earlier > 0) {
    const per = Math.max(1, Math.floor(counts.earlier / earlier.length));
    for (const d of earlier) {
      const chunk = await fetchByDiffList(subtopicId, [d], selectedClass, per);
      parts.push(...chunk);
    }
  }

  // Dedup and cap N
  const seen = new Set();
  const pool = [];
  for (const q of parts) {
    if (!seen.has(q.id)) {
      seen.add(q.id);
      pool.push(q);
      if (pool.length >= N) break;
    }
  }
  return { pool, skill };
}

/**
 * Serve ONE fresh practice question across possibly multiple subtopics.
 * - Builds a mixed pool per subtopic using each user's level.
 * - Filters out questions the user has already attempted.
 * - Returns a random candidate and the set of exhausted subtopics.
 */
export async function serveNextPracticeQuestion({ userId, subtopicIds, selectedClass, poolSizePerSub = 20 }) {
  if (!userId) throw new Error('serveNextPracticeQuestion: userId required');
  if (!subtopicIds?.length) throw new Error('serveNextPracticeQuestion: subtopicIds required');

  // Build per-subtopic pools in parallel
  const perSub = await Promise.all(
    subtopicIds.map(sid => mixedPoolForSubtopic(userId, sid, selectedClass, poolSizePerSub))
  );

  const pool = perSub.flatMap(x => x.pool);
  if (!pool.length) return { pick: null, exhaustedSubtopics: subtopicIds.slice() };

  // Filter out already-attempted
  const qids = pool.map(q => q.id);
  const { data: attempts, error: aErr } = await supabase
    .from('question_attempts')
    .select('question_id')
    .eq('user_id', userId)
    .in('question_id', qids)
    .limit(50000);
  if (aErr) throw aErr;

  const seen = new Set((attempts || []).map(a => a.question_id));
  const fresh = pool.filter(q => !seen.has(q.id));

  // Determine which subtopics are exhausted (had items, but none were fresh)
  const totals = new Map(); // sid -> { total, fresh }
  for (const q of pool) {
    if (!totals.has(q.subtopic_id)) totals.set(q.subtopic_id, { total: 0, fresh: 0 });
    totals.get(q.subtopic_id).total++;
  }
  for (const q of fresh) {
    totals.get(q.subtopic_id).fresh++;
  }
  const exhaustedSubtopics = subtopicIds.filter(
    sid => (totals.get(sid)?.total ?? 0) > 0 && (totals.get(sid)?.fresh ?? 0) === 0
  );

  if (!fresh.length) return { pick: null, exhaustedSubtopics };

  // Random pick among the remaining fresh items
  const pick = fresh[Math.floor(Math.random() * fresh.length)];
  return { pick, exhaustedSubtopics };
}
