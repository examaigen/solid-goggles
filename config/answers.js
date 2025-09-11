// utils/answers.js
export function normalizeText(s) {
  return (s ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\u03C0/gu, 'pi')
    .replace(/\p{Diacritic}/gu, '');
}

export function parseNumberLoose(s) {
  if (s == null) return NaN;
  const cleaned = String(s).trim().replace(/\s+/g, '').replace(',', '.');
  return Number(cleaned);
}

export function isCorrectOpen(q, userInput, opts = {}) {
  const tol =
    typeof q.answer_tolerance === "number"
      ? q.answer_tolerance
      : (opts.tolerance ?? 1e-6);

  const userNorm = normalizeText(userInput);

  // 1) Canonical text match
  const canonical =
    q.answer_text ?? q.correct_answer_text ?? q.correct_text ?? "";
  if (normalizeText(canonical) === userNorm) return true;

  // 2) Alias text match (questions.answer_aliases: JSON array)
  const aliases = Array.isArray(q.answer_aliases) ? q.answer_aliases : [];
  for (const a of aliases) {
    if (normalizeText(a) === userNorm) return true;
  }

  // 3) Numeric tolerance (if both sides parse to numbers)
  const uNum = parseNumberLoose(userInput);
  const cNumRaw = parseNumberLoose(canonical);
  const cNum =
    Number.isFinite(cNumRaw) ? cNumRaw :
    (typeof q.correct_number === "number" ? q.correct_number : NaN);

  if (Number.isFinite(uNum) && Number.isFinite(cNum)) {
    if (Math.abs(uNum - cNum) <= tol) return true;
  }

  // 4) Numeric aliases (e.g., "1.5708" accepted for "π/2")
  for (const a of aliases) {
    const aNum = parseNumberLoose(a);
    if (Number.isFinite(uNum) && Number.isFinite(aNum)) {
      if (Math.abs(uNum - aNum) <= tol) return true;
    }
  }

  return false;
}

