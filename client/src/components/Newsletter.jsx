import { useState } from 'react';
import { api } from '../services/api.js';
export default function Newsletter() {
  const [email, setEmail] = useState(''); const [msg, setMsg] = useState({ t: '', ok: true }); const [busy, setBusy] = useState(false);
  const submit = async (e) => { e.preventDefault(); setBusy(true);
    try { const d = await api('/newsletter', { method: 'POST', body: { email } }); setMsg({ t: d.message, ok: true }); setEmail(''); }
    catch (err) { setMsg({ t: err.message, ok: false }); } setBusy(false); };
  return (<section className="news"><div className="wrap news-in"><div><h2>Get new articles in your inbox</h2><p>One short email when we publish something worth your time.</p></div>
    <form onSubmit={submit}><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email"/><button className="btn" disabled={busy}>{busy ? 'Subscribing…' : 'Subscribe'}</button>
      {msg.t && <p className={msg.ok ? 'ok' : 'err'} role="status">{msg.t}</p>}</form></div></section>);
}
