import { useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { api } from '../../services/api.js';
export default function ManageBlogs() {
  const [n, setN] = useState(0); const { data, loading, error } = useFetch('/admin/blogs', [n]);
  const del = async (b) => { if (confirm(`Delete "${b.title}"? This cannot be undone.`)) { await api(`/admin/blogs/${b._id}`, { method: 'DELETE' }); setN(n + 1); } };
  return (<><div className="sec-head"><h1>Manage blogs</h1><Link to="/admin/blogs/new" className="btn">New blog</Link></div>
    {loading && <p className="state">Loading…</p>}{error && <p className="state err">{error}</p>}
    <div className="table-wrap"><table><thead><tr><th>Title</th><th>Category</th><th>Status</th><th>Views</th><th></th></tr></thead><tbody>
      {data?.map(b => <tr key={b._id}><td>{b.title}</td><td>{b.category?.name}</td><td>{b.status}</td><td>{b.views}</td><td className="acts"><Link to={`/admin/blogs/${b._id}`}>Edit</Link><button onClick={() => del(b)}>Delete</button></td></tr>)}</tbody></table></div></>);
}
