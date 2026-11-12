import { useSearchParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import BlogCard from './BlogCard.jsx';
export default function BlogList({ category, lockQuery }) {
  const [sp, setSp] = useSearchParams();
  const page = +sp.get('page') || 1, sort = sp.get('sort') || 'latest', cat = category || sp.get('category') || '', q = sp.get('q') || '';
  const cats = useFetch('/categories');
  const { data, loading, error } = useFetch(`/blogs?page=${page}&sort=${sort}&category=${cat}&q=${encodeURIComponent(q)}`);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); setSp(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return (<div>
    <div className="filters">
      {!lockQuery && <input className="field" defaultValue={q} placeholder="Search articles" onKeyDown={e => e.key === 'Enter' && set('q', e.target.value.trim())} aria-label="Search"/>}
      {!category && <select className="field" value={cat} onChange={e => set('category', e.target.value)} aria-label="Category"><option value="">All categories</option>{cats.data?.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}</select>}
      <select className="field" value={sort} onChange={e => set('sort', e.target.value)} aria-label="Sort"><option value="latest">Latest</option><option value="oldest">Oldest</option><option value="popular">Most viewed</option></select></div>
    {loading && <p className="state">Loading articles…</p>}
    {error && <p className="state err">Could not load articles: {error}. Check your connection and refresh.</p>}
    {data && !data.items.length && <p className="state">No articles match. Try a different search or category.</p>}
    <div className="grid">{data?.items.map(b => <BlogCard key={b._id} blog={b}/>)}</div>
    {data?.pages > 1 && <div className="pager"><button className="btn ghost" disabled={page <= 1} onClick={() => set('page', page - 1)}>Previous</button><span>Page {page} of {data.pages}</span><button className="btn ghost" disabled={page >= data.pages} onClick={() => set('page', page + 1)}>Next</button></div>}
  </div>);
}
