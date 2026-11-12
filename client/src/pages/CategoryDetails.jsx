import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import BlogList from '../components/BlogList.jsx';
import { useSEO } from '../utils/seo.js';
export default function CategoryDetails() {
  const { slug } = useParams(); const { data } = useFetch('/categories'); const c = data?.find(x => x.slug === slug);
  useSEO({ title: c?.name || 'Category', description: c?.description });
  return <div className="wrap sec"><h1>{c?.name || 'Category'}</h1><p className="lead">{c?.description}</p><BlogList category={slug} lockQuery key={slug}/></div>;
}
