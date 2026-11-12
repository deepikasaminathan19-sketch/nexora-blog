import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { useSEO } from '../utils/seo.js';
export default function Categories() {
  useSEO({ title: 'Categories', description: 'Browse NEXORA by topic.' });
  const { data, loading, error } = useFetch('/categories');
  return <div className="wrap sec"><h1>Categories</h1>{loading && <p className="state">Loading…</p>}{error && <p className="state err">{error}</p>}
    <div className="cats">{data?.map(c => <Link key={c._id} to={`/category/${c.slug}`} className="cat-tile"><b>{c.name}</b><span>{c.description}</span><span>{c.count} articles</span></Link>)}</div></div>;
}
