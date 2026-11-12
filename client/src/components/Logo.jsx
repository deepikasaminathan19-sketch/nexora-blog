export default function Logo({ full }) {
  return (<span className="logo" aria-label="NEXORA">
    <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2f6bff"/><stop offset="1" stopColor="#8b7cf6"/></linearGradient></defs>
      <path d="M8 8l24 24M32 8L8 32" stroke="url(#lg)" strokeWidth="6" strokeLinecap="round"/><path d="M4 26c8 10 24 10 32-2" fill="none" stroke="#8b7cf6" strokeWidth="1.2" opacity=".7"/></svg>
    <span><b>NEXORA</b>{full && <small>EXPLORE. LEARN. INNOVATE.</small>}</span></span>);
}
