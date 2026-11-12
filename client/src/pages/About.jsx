import useFetch from '../hooks/useFetch.js';
import { useSEO } from '../utils/seo.js';
export default function About() {
  useSEO({ title: 'About', description: 'About NEXORA and its authors.' });
  const { data } = useFetch('/authors');
  return <div className="wrap sec narrow"><h1>About NEXORA</h1>
    <p className="lead">NEXORA helps people explore, learn and innovate by explaining technology in plain language with practical examples.</p>
    <h2>Our authors</h2>{data?.map(a => <div key={a._id} className="author"><img src={a.avatar} alt={a.name}/><div><b>{a.name}</b><p>{a.bio}</p></div></div>)}</div>;
}
