import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { api } from '../../services/api.js';
import { fmtDate } from '../../utils/seo.js';
export default function Comments() {
  const [n, setN] = useState(0); const { data, loading, error } = useFetch('/admin/comments', [n]);
  const approve = async (c) => { await api(`/admin/comments/${c._id}/approve`, { method: 'PATCH' }); setN(n + 1); };
  const del = async (c) => { if (confirm('Delete this comment?')) { await api(`/admin/comments/${c._id}`, { method: 'DELETE' }); setN(n + 1); } };
  return (<><h1>Comments</h1>{loading && <p className="state">Loading…</p>}{error && <p className="state err">{error}</p>}{data && !data.length && <p className="state">No comments yet.</p>}
    {data?.map(c => <div key={c._id} className="panel"><b>{c.name}</b> <small>{c.email} · {fmtDate(c.createdAt)} · on {c.blog?.title}</small><p>{c.text}</p>
      <div className="acts">{!c.approved ? <button onClick={() => approve(c)}>Approve</button> : <small>Approved</small>}<button onClick={() => del(c)}>Delete</button></div></div>)}</>);
}
