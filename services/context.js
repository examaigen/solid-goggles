// services/context.js
let topicContext = null;

export function setTopicContext(ctx) {
  topicContext = ctx || null;
}

export function getTopicContext() {
  return topicContext;
}

// DOM-based getter for current question text (so chatbot never imports page scripts)
export function getCurrentQuestionText() {
  const active = document.querySelector('.question-active .question-text')
    || document.querySelector('.question-block .question-text')
    || document.querySelector('[data-question-id] .question-text');
  return active?.innerText || '';
}
