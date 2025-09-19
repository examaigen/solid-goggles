// cookie-consent.js — ultra-forced styles for "Accept All"
(function () {
  const CONSENT_KEY = "mg_consent_v1";

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); } catch { return null; }
  }
  function setConsent(obj) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(obj));
    window.dispatchEvent(new Event("mg-consent-changed"));
  }

  function forceStyle(el, css) {
    // apply styles with !important to defeat global CSS
    Object.entries(css).forEach(([k, v]) => el.style.setProperty(k, v, "important"));
  }

  function openPrefs() {
    const existing = getConsent() || { essential: true, analytics: false, marketing: false };
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div style="position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:100000">
        <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;color:#111;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.1);width:min(100%,640px);max-width:640px;padding:24px;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
          <h2 style="margin:0 0 12px;font-size:18px;font-weight:700">Slapukų nustatymai</h2>
          <label style="display:flex;gap:12px;align-items:flex-start;margin:12px 0;opacity:.85">
            <input type="checkbox" checked disabled style="margin-top:2px"/>
            <div><div style="font-weight:600">Būtini</div><div style="font-size:13px">Sesija ir autentifikacija (negali būti išjungti).</div></div>
          </label>
          <label style="display:flex;gap:12px;align-items:flex-start;margin:12px 0;">
            <input id="mg-analytics" type="checkbox" ${existing.analytics ? "checked" : ""} style="margin-top:2px"/>
            <div><div style="font-weight:600">Analitika</div><div style="font-size:13px;opacity:.85">Veikimo analizė ir tobulinimas.</div></div>
          </label>
          <label style="display:flex;gap:12px;align-items:flex-start;margin:12px 0;">
            <input id="mg-marketing" type="checkbox" ${existing.marketing ? "checked" : ""} style="margin-top:2px"/>
            <div><div style="font-weight:600">Rinkodara</div><div style="font-size:13px;opacity:.85">Reklamos ir remarketingas.</div></div>
          </label>
          <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap">
            <button id="mg-close">Atšaukti</button>
            <button id="mg-save">Išsaugoti</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // style modal buttons safely
    const baseBtn = { padding: "8px 12px", "font-size": "13px", border: "1px solid #d1d5db", "border-radius": "8px", background: "#fff", color: "#111", cursor: "pointer" };
    forceStyle(document.getElementById("mg-close"), baseBtn);
    const saveBtn = document.getElementById("mg-save");
    forceStyle(saveBtn, { ...baseBtn, border: "1px solid #111", background: "#111", color: "#fff" });

    document.getElementById("mg-close").onclick = () => modal.remove();
    document.getElementById("mg-save").onclick = () => {
      const analytics = !!document.getElementById("mg-analytics").checked;
      const marketing = !!document.getElementById("mg-marketing").checked;
      setConsent({ essential: true, analytics, marketing, ts: Date.now(), version: 1 });
      modal.remove();
    };
  }

  function ensureBanner() {
    if (getConsent()) return;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = "position:fixed;inset-inline:0;bottom:0;z-index:100000;background:#fff;color:#111;border-top:1px solid #e5e7eb;";
    wrapper.innerHTML = `
      <div style="max-width:1152px;margin:0 auto;padding:12px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
        <p style="margin:0;flex:1 1 420px">
          Naudojame būtinuosius slapukus paslaugai veikti. Analitinius ir (ar) rinkodaros slapukus įjungsime tik gavę jūsų sutikimą.
        </p>
        <div id="mg-btns" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
          <button id="mg-prefs">Tvarkyti pasirinkimus</button>
          <button id="mg-reject">Sutikti tik su būtinais</button>
          <button id="mg-accept" aria-label="Sutikti su visais">Sutikti su visais</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);

    // style 3 buttons with !important
    const prefs = document.getElementById("mg-prefs");
    const reject = document.getElementById("mg-reject");
    const accept = document.getElementById("mg-accept");

    const ghost = { padding: "8px 12px", "font-size": "13px", border: "1px solid #d1d5db", "border-radius": "8px", background: "#ffffff", color: "#111111", cursor: "pointer", display: "inline-block" };
    forceStyle(prefs, ghost);
    forceStyle(reject, ghost);

    // TEMP neon so you can see it immediately, then flip to black
    const acceptForced = {
      padding: "8px 12px",
      "font-size": "13px",
      border: "2px solid #0a0a0a",
      "border-radius": "8px",
      background: "#00e5ff", // neon for 2s
      color: "#000000",
      cursor: "pointer",
      display: "inline-block",
      "box-shadow": "0 0 0 2px rgba(0,0,0,0.04)"
    };
    forceStyle(accept, acceptForced);

    // After 2s, switch to black/white
    setTimeout(() => {
      forceStyle(accept, { background: "#111111", color: "#ffffff", border: "2px solid #111111" });
    }, 2000);

    // Re-apply styles every 500ms for 5s to beat aggressive global CSS
    let n = 10;
    const reapply = setInterval(() => {
      forceStyle(accept, { background: getComputedStyle(accept).backgroundColor === "rgba(0, 0, 0, 0)" ? "#111111" : getComputedStyle(accept).backgroundColor, color: "#ffffff", border: "2px solid #111111", display: "inline-block" });
      forceStyle(prefs, ghost);
      forceStyle(reject, ghost);
      if (!--n) clearInterval(reapply);
    }, 500);

    // handlers
    accept.onclick = function () {
      setConsent({ essential: true, analytics: true, marketing: true, ts: Date.now(), version: 1 });
      wrapper.remove();
    };
    reject.onclick = function () {
      setConsent({ essential: true, analytics: false, marketing: false, ts: Date.now(), version: 1 });
      wrapper.remove();
    };
    document.getElementById("mg-prefs").onclick = openPrefs;
  }

  // expose
  window.mgOpenCookiePrefs = openPrefs;
  window.mgGetConsent = getConsent;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureBanner);
  } else {
    ensureBanner();
  }
})();
