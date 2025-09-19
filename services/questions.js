// services/questions.js
import { supabase } from '../supabaseClient.js';
import { toUIQuestion } from '../models/questionAdapter.js';
import { APP_NAME, DEFAULT_LOCALE, LOCALE_TAG } from "../config/env.js";
// Practice: random by subtopics/class
export async function fetchPracticeBySubtopics({ subtopicIds, cls, limit=20 }) {
  let q = supabase.from('questions')
    .select('id, question_text, options, correct_option, explanation, subtopic_id, class')
    .in('subtopic_id', subtopicIds)
    .limit(limit * 2); // small oversample for shuffle

  if (cls) q = q.eq('class', cls);

  const { data, error } = await q;
  if (error) throw error;
  return shuffle(data).slice(0, limit).map(toUIQuestion);
}

// Mistakes: last wrong attempts by user
export async function fetchMistakes({ userId, subtopicIds, sinceDays=90, limit=20 }) {
  const since = new Date();
  since.setDate(since.getDate() - sinceDays);

  const { data: attempts, error } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct, answered_at')
    .eq('user_id', userId)
    .gt('answered_at', since.toISOString())
    .order('answered_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  const ids = [...new Set(attempts.filter(a => a.is_correct === false).map(a => a.question_id))];
  if (!ids.length) return [];

  let q = supabase.from('questions')
    .select('id, question_text, options, correct_option, explanation, subtopic_id, class')
    .in('id', ids);

  if (subtopicIds?.length) q = q.in('subtopic_id', subtopicIds);

  const { data, error: e2 } = await q;
  if (e2) throw e2;
  return shuffle(data).slice(0, limit).map(toUIQuestion);
}

// Review: flagged/due questions (customize to your rule)
export async function fetchReview({ userId, subtopicIds, limit=20 }) {
  // Example: most recent attempts that were correct but older than 7 days (spaced review)
  const sevenDaysAgo = new Date(Date.now() - 7*24*3600*1000).toISOString();

  const { data: attempts, error } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct, answered_at')
    .eq('user_id', userId)
    .lte('answered_at', sevenDaysAgo)
    .order('answered_at', { ascending: false })
    .limit(1000);

  if (error) throw error;

  const ids = [...new Set(attempts.filter(a => a.is_correct === true).map(a => a.question_id))];
  if (!ids.length) return [];

  let q = supabase.from('questions')
    .select('id, question_text, options, correct_option, explanation, subtopic_id, class')
    .in('id', ids);

  if (subtopicIds?.length) q = q.in('subtopic_id', subtopicIds);

  const { data, error: e2 } = await q;
  if (e2) throw e2;
  return shuffle(data).slice(0, limit).map(toUIQuestion);
}

// One question from your backend (REST)
// Adjust URL to your actual endpoint
export async function fetchOneFromBackend(subtopicId) {
  const url = `https://examgenai.onrender.com/?subtopic_id=${encodeURIComponent(subtopicId)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Backend ${res.status}`);
  const row = await res.json();
  return toUIQuestion(row);
}

// utils
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
