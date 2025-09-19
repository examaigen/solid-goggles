// dbUtil.js
export const DEFAULT_QUESTION_FIELDS =
  'id,question_text,options,correct_option,explanation,difficulty,subtopic_id,class,type,answer_text,answer_type,answer_tolerance';

export function safeSelectFields(fields = DEFAULT_QUESTION_FIELDS) {
  let f = Array.isArray(fields) ? fields.filter(Boolean).join(',') : String(fields ?? '').trim();
  f = f.replace(/[, \n\r\t]+$/g, '');
  return f || DEFAULT_QUESTION_FIELDS;
}

// Add this in dbUtil.js
export function safeSelect(qb, fields = DEFAULT_QUESTION_FIELDS) {
  // Only use this on a builder that hasn't called .select yet.
  return qb.select(safeSelectFields(fields));
}


function sanitizeIdArray(idsLike) {
  const arr = Array.isArray(idsLike) ? idsLike : Array.from(idsLike || []);
  return arr.filter(v => typeof v === 'string' && v.length > 0);
}

/**
 * CHUNKED query: questions by ID (uses .select(...).in(...))
 */
export async function selectQuestionsByIdsChunked(supabase, ids, fields = 'id,subtopic_id', chunkSize = 100) {
  const clean = sanitizeIdArray(ids);
  if (clean.length === 0) return { data: [], error: null };

  const out = [];
  const sel = safeSelectFields(fields);

  for (let i = 0; i < clean.length; i += chunkSize) {
    const chunk = clean.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('questions')
      .select(sel)          // <-- select FIRST
      .in('id', chunk);     // <-- then filter

    if (error) return { data: out, error };
    if (data) out.push(...data);
  }
  return { data: out, error: null };
}

/**
 * CHUNKED query: questions by subtopic_id (uses .select(...).in(...))
 */
export async function selectQuestionsBySubtopicsChunked(supabase, subtopicIds, fields = 'id,subtopic_id', chunkSize = 100) {
  const clean = sanitizeIdArray(subtopicIds);
  if (clean.length === 0) return { data: [], error: null };

  const out = [];
  const sel = safeSelectFields(fields);

  for (let i = 0; i < clean.length; i += chunkSize) {
    const chunk = clean.slice(i, i + chunkSize);
    const { data, error } = await supabase
      .from('questions')
      .select(sel)                // <-- select FIRST
      .in('subtopic_id', chunk);  // <-- then filter

    if (error) return { data: out, error };
    if (data) out.push(...data);
  }
  return { data: out, error: null };
}
