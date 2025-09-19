// frontend/bootstrap.js
import { APP_NAME, LOCALE_TAG } from "./config/env.js";

function applyBranding() {
  // Set language for accessibility/SEO
  document.documentElement.lang = "lt";

  // Set a reasonable default title if page hasn’t set one
  if (!document.title || /^(Home|Index|App|Exam)$/i.test(document.title.trim())) {
    document.title = APP_NAME;
  }

  // Simple global formatters (optional)
  window.fmtDate = (d) =>
    new Intl.DateTimeFormat(LOCALE_TAG, { dateStyle: "medium", timeStyle: "short" }).format(d);
  window.fmtNumber = (n, opts = {}) =>
    new Intl.NumberFormat(LOCALE_TAG, opts).format(n);
}

document.addEventListener("DOMContentLoaded", applyBranding);

