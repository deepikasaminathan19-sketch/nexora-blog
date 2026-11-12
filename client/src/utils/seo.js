import { useEffect } from 'react';
function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value || '');
}
export function useSEO({ title, description, image, jsonLd }) {
  useEffect(() => {
    document.title = title ? `${title} | NEXORA` : 'NEXORA | Explore. Learn. Innovate.';
    setMeta('name', 'description', description); setMeta('property', 'og:title', title); setMeta('property', 'og:description', description);
    if (image) setMeta('property', 'og:image', image);
    let canon = document.head.querySelector('link[rel=canonical]');
    if (!canon) { canon = document.createElement('link'); canon.rel = 'canonical'; document.head.appendChild(canon); }
    canon.href = window.location.origin + window.location.pathname;
    let ld = document.getElementById('ld-json'); ld?.remove();
    if (jsonLd) { ld = document.createElement('script'); ld.id = 'ld-json'; ld.type = 'application/ld+json'; ld.text = JSON.stringify(jsonLd); document.head.appendChild(ld); }
    return () => document.getElementById('ld-json')?.remove();
  }, [title, description, image]);
}
export const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
