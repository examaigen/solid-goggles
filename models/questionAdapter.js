// models/questionAdapter.js
export function toUIQuestion(row) {
  if ('question_text' in row) {
    return {
      id: row.id,
      type: row.type || (row.options ? 'mc' : 'open'),
      text: row.question_text,
      choices: row.options ? Object.values(row.options) : null,
      correct: row.correct_option ?? row.answer_text ?? row.correct_number ?? null,
      subtopic_id: row.subtopic_id,
      explanation: row.explanation ?? ''
    };
  }
  return {
    id: row.id,
    type: row.type,
    text: row.prompt,
    choices: row.choices ?? null,
    correct: row.answer ?? null,
    subtopic_id: row.subtopic_id,
    explanation: row.explanation ?? ''
  };
}
