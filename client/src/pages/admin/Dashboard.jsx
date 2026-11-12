import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { fmtDate } from '../../utils/seo.js';
export default function Dashboard() {
  const { data: d, loading, error } = useFetch('/admin/stats');
  if (loading) return <p className="state">Loading…</p>; if (error) return <p className="state err">{error}</p>;
  const stats = [['Total blogs', d.total], ['Published', d.published], ['Drafts', d.draft], ['Total views', d.totalViews], ['Subscribers', d.subscribers], ['Pending comments', d.pendingComments]];
  return (<><h1>Dashboard</h1><div className="stats">{stats.map(([l, v]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
    <div className="two"><div className="panel"><h2>Recent posts</h2><table><tbody>{d.recent.map(b => <tr key={b._id}><td><Link to={`/admin/blogs/${b._id}`}>{b.title}</Link></td><td>{b.status}</td><td>{fmtDate(b.createdAt)}</td></tr>)}</tbody></table></div>
      <div className="panel"><h2>Pending comments</h2>{!d.pendingList.length && <p className="state">Nothing waiting for review.</p>}{d.pendingList.map(c => <p key={c._id}><b>{c.name}</b> on {c.blog?.title}</p>)}<Link to="/admin/comments" className="read">Review comments</Link></div></div>
    <div className="panel"><h2>Most viewed</h2><table><tbody>{d.top.map(b => <tr key={b._id}><td>{b.title}</td><td>{b.views} views</td></tr>)}</tbody></table></div></>);
}
