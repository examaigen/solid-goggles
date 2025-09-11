// services/url.js
export function qs() {
  const p = new URLSearchParams(location.search);
  const get = (k, d=null) => p.get(k) ?? d;
  const list = (k) => (get(k, '') || '').split(',').map(s=>s.trim()).filter(Boolean);
  return { get, list, has: (k)=>p.has(k) };
}
