// footer.js (diagnostic)
(function () {
  console.log("[footer.js] loaded");

  // Create/inject footer (robust)
  try {
    var el = document.getElementById("mg-footer");
    if (!el) {
      el = document.createElement("footer");
      document.body.appendChild(el);
    }
    el.innerHTML = `
      <footer class="border-t mt-16">
        <div class="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-wrap gap-4 justify-between">
          <div class="opacity-70">© ${new Date().getFullYear()} MokslaiGo</div>
          <nav class="flex gap-6">
            <!-- Use DIRECT FILE LINKS so we don't depend on server routes -->
            <a class="hover:underline" href="/legal/privacy.html">Privatumo politika</a>
            <a class="hover:underline" href="/legal/terms.html">Paslaugos teikimo sąlygos</a>
            <a class="hover:underline" href="/legal/cookies.html">Slapukų politika</a>
            <a class="hover:underline" href="#" onclick="window.mgOpenCookiePrefs?.();return false;">Slapukų nustatymai</a>
          </nav>
        </div>
      </footer>
    `;

    // Tiny visible proof that this script ran
    var testBar = document.createElement("div");
    testBar.textContent = "footer.js OK";
    testBar.style.cssText =
      "position:fixed;right:8px;bottom:8px;z-index:99999;background:#eef;border:1px solid #99f;padding:4px 8px;border-radius:8px;font:12px/1.2 system-ui";
    document.body.appendChild(testBar);
    setTimeout(() => testBar.remove(), 2500);
  } catch (e) {
    console.error("[footer.js] error:", e);
  }
})();
