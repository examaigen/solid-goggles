// config/renderMath.js
// One-call math renderer for any container(s) using KaTeX auto-render.
// Safe to call even if KaTeX isn't loaded yet.
export function renderMath(...roots) {
  try {
    if (!window.renderMathInElement) return; // KaTeX not present → no-op
    const opts = {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$",  right: "$",  display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    };
    roots.flat().filter(Boolean).forEach(el => renderMathInElement(el, opts));
  } catch (e) {
    console.warn("KaTeX render warning:", e);
  }
}
