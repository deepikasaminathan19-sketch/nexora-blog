import { useSearchParams } from 'react-router-dom';
import BlogList from '../components/BlogList.jsx';
import { useSEO } from '../utils/seo.js';
export default function Search() {
  const [sp] = useSearchParams(); const q = sp.get('q') || '';
  useSEO({ title: `Search: ${q}`, description: `Search results for ${q}` });
  return <div className="wrap sec"><h1>Results for “{q}”</h1><BlogList/></div>;
}
