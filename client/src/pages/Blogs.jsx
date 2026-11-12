import BlogList from '../components/BlogList.jsx';
import { useSEO } from '../utils/seo.js';
export default function Blogs() {
  useSEO({ title: 'All articles', description: 'Browse every NEXORA technology article.' });
  return <div className="wrap sec"><h1>All articles</h1><p className="lead">Search, filter by topic and sort to find what to read next.</p><BlogList/></div>;
}
