import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Link2, Share2, ArrowUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { api } from '../services/api.js';
import BlogCard from '../components/BlogCard.jsx';
import { useSEO, fmtDate } from '../utils/seo.js';
export default function BlogDetails() {
  const { slug } = useParams();
  const { data, loading, error } = useFetch(`/blogs/${slug}`);
  const popular = useFetch('/blogs/popular');
  const [progress, setProgress] = useState(0); const [voted, setVoted] = useState(false); const [copied, setCopied] = useState(false);
  const blog = data?.blog;
  useSEO({ title: blog?.seoTitle?.replace(' | NEXORA', '') || blog?.title, description: blog?.seoDescription || blog?.excerpt, image: blog?.image,
    jsonLd: blog && { '@context': 'https://schema.org', '@type': 'Article', headline: blog.title, image: blog.image, datePublished: blog.publishedAt, author: { '@type': 'Person', name: blog.author?.name } } });
  useEffect(() => { const f = () => { const h = document.documentElement; setProgress(h.scrollTop / (h.scrollHeight - h.clientHeight) * 100); }; window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { window.scrollTo(0, 0); setVoted(false); }, [slug]);
  // Add ids to h2 headings and build a table of contents
  const { html, toc } = useMemo(() => {
    const toc = []; const html = (blog?.content || '').replace(/<h2>(.*?)<\/h2>/g, (m, t) => { const id = t.toLowerCase().replace(/[^a-z0-9]+/g, '-'); toc.push({ id, t }); return `<h2 id="${id}">${t}</h2>`; });
    return { html, toc };
  }, [blog]);
  const copy = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const share = () => navigator.share ? navigator.share({ title: blog.title, url: window.location.href }) : copy();
  const vote = async (helpful) => { await api(`/blogs/${slug}/helpful`, { method: 'POST', body: { helpful } }).catch(() => {}); setVoted(true); };
  if (loading) return <p className="state wrap sec">Loading article…</p>;
  if (error) return <div className="wrap sec narrow"><h1>Article not found</h1><p className="state err">{error}</p><Link to="/blogs" className="btn">Browse articles</Link></div>;
  return (<>
    <div className="progress" style={{ width: progress + '%' }}/>
    <article className="wrap sec article">
      <Link to={`/category/${blog.category.slug}`} className="cat">{blog.category.name}</Link>
      <h1>{blog.title}</h1>
      <div className="meta"><span>By {blog.author.name}</span><span>{fmtDate(blog.publishedAt)}</span><span className="rt"><Clock size={14}/>{blog.readingTime} min</span></div>
      <img className="hero-img" src={blog.image} alt={blog.imageAlt || blog.title}/>
      <div className="share"><button className="btn ghost" onClick={share}><Share2 size={16}/>Share</button><button className="btn ghost" onClick={copy}><Link2 size={16}/>{copied ? 'Copied' : 'Copy link'}</button></div>
      {toc.length > 2 && <nav className="toc"><b>In this article</b>{toc.map(x => <a key={x.id} href={`#${x.id}`}>{x.t}</a>)}</nav>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }}/>
      <div className="tags">{blog.tags.map(t => <span key={t._id}>{t.name}</span>)}</div>
      <div className="helpful">{voted ? 'Thanks for your feedback.' : <>Was this article helpful? <button className="btn ghost" onClick={() => vote(true)}><ThumbsUp size={16}/>Yes</button><button className="btn ghost" onClick={() => vote(false)}><ThumbsDown size={16}/>No</button></>}</div>
      <Comments slug={slug}/>
    </article>
    <section className="wrap sec"><h2>Related articles</h2>{!data.related.length && <p className="state">No related articles yet.</p>}<div className="grid">{data.related.map(b => <BlogCard key={b._id} blog={b}/>)}</div></section>
    <section className="wrap sec"><h2>Popular articles</h2><ol className="popular">{popular.data?.map(b => <li key={b._id}><Link to={`/blog/${b.slug}`}>{b.title}</Link><span>{b.views} views</span></li>)}</ol></section>
    <button className="top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp/></button></>);
}
function Comments({ slug }) {
  const { data, loading } = useFetch(`/blogs/${slug}/comments`);
  const [f, setF] = useState({ name: '', email: '', text: '' }); const [msg, setMsg] = useState({ t: '', ok: true });
  const submit = async (e) => { e.preventDefault();
    try { const d = await api(`/blogs/${slug}/comments`, { method: 'POST', body: f }); setMsg({ t: d.message, ok: true }); setF({ name: '', email: '', text: '' }); } catch (er) { setMsg({ t: er.message, ok: false }); } };
  return (<section className="comments"><h2>Leave a reply</h2>
    <form onSubmit={submit}><input className="field" required placeholder="Name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })}/>
      <input className="field" required type="email" placeholder="Email (never shown)" value={f.email} onChange={e => setF({ ...f, email: e.target.value })}/>
      <textarea className="field" required rows="4" placeholder="Comment" value={f.text} onChange={e => setF({ ...f, text: e.target.value })}/>
      <button className="btn">Post comment</button>{msg.t && <p className={msg.ok ? 'ok' : 'err'}>{msg.t}</p>}</form>
    {loading ? null : !data?.length ? <p className="state">No comments yet. Be the first to reply.</p> : data.map((c, i) => <div key={i} className="comment"><b>{c.name}</b><span>{fmtDate(c.createdAt)}</span><p>{c.text}</p></div>)}</section>);
}
