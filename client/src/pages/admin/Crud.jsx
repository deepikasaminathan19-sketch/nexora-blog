import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import { api } from '../../services/api.js';
// One reusable page for Categories, Tags and Authors.
export default function Crud({ path, title, fields }) {
  const [n, setN] = useState(0); const { data, loading, error } = useFetch(`/admin/${path}`, [n]);
  const blank = Object.fromEntries(fields.map(f => [f, ''])); const [f, setF] = useState(blank); const [edit, setEdit] = useState(null); const [err, setErr] = useState('');
  const save = async (e) => { e.preventDefault(); setErr('');
    try { await api(`/admin/${path}${edit ? '/' + edit : ''}`, { method: edit ? 'PUT' : 'POST', body: f }); setF(blank); setEdit(null); setN(n + 1); } catch (x) { setErr(x.message); } };
  const del = async (d) => { if (!confirm(`Delete "${d.name}"?`)) return; try { await api(`/admin/${path}/${d._id}`, { method: 'DELETE' }); setN(n + 1); } catch (x) { setErr(x.message); } };
  return (<><h1>{title}</h1><form className="inline" onSubmit={save}>{fields.map(k => <input key={k} className="field" required={k === 'name'} placeholder={k} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })}/>)}
    <button className="btn">{edit ? 'Save changes' : 'Add'}</button>{edit && <button type="button" className="btn ghost" onClick={() => { setEdit(null); setF(blank); }}>Cancel</button>}</form>
    {err && <p className="err">{err}</p>}{loading && <p className="state">Loading…</p>}{error && <p className="state err">{error}</p>}
    <div className="table-wrap"><table><tbody>{data?.map(d => <tr key={d._id}><td>{d.name}</td><td>{d.description || d.bio || ''}</td><td className="acts"><button onClick={() => { setEdit(d._id); setF(Object.fromEntries(fields.map(k => [k, d[k] || '']))); }}>Edit</button><button onClick={() => del(d)}>Delete</button></td></tr>)}</tbody></table></div></>);
}
