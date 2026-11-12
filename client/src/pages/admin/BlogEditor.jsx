import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { api } from '../../services/api.js';
const empty = { title: '', slug: '', excerpt: '', content: '', category: '', tags: [], author: '', image: '', imageAlt: '', seoTitle: '', seoDescription: '', status: 'draft', publishedAt: '', featured: false };
export default function BlogEditor() {
  const { id } = useParams(); const nav = useNavigate(); const isNew = id === 'new';
  const [f, setF] = useState(empty); const [msg, setMsg] = useState({ t: '', ok: true }); const [busy, setBusy] = useState(false);
  const cats = useFetch('/admin/categories'), tags = useFetch('/admin/tags'), authors = useFetch('/admin/authors');
  useEffect(() => { if (!isNew) api(`/admin/blogs/${id}`).then(b => setF({ ...empty, ...b, publishedAt: b.publishedAt ? b.publishedAt.slice(0, 16) : '' })).catch(e => setMsg({ t: e.message, ok: false })); }, [id]);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const save = async (status) => {
    if (!f.title || !f.excerpt || !f.content || !f.category || !f.author) return setMsg({ t: 'Title, description, content, category and author are required.', ok: false });
    setBusy(true);
    try {
      const body = { ...f, status, publishedAt: f.publishedAt ? new Date(f.publishedAt).toISOString() : undefined };
      if (isNew) await api('/admin/blogs', { method: 'POST', body }); else await api(`/admin/blogs/${id}`, { method: 'PUT', body });
      nav('/admin/blogs');
    } catch (e) { setMsg({ t: e.message, ok: false }); } setBusy(false);
  };
  const upload = async (e) => { const fd = new FormData(); fd.append('image', e.target.files[0]); try { const d = await api('/admin/upload', { method: 'POST', form: fd }); setF(x => ({ ...x, image: d.url })); } catch (er) { setMsg({ t: er.message, ok: false }); } };
  const insertImage = async (e) => { const fd = new FormData(); fd.append('image', e.target.files[0]); try { const d = await api('/admin/upload', { method: 'POST', form: fd }); setF(x => ({ ...x, content: x.content + `<img src="${d.url}" alt=""/>` })); } catch (er) { setMsg({ t: er.message, ok: false }); } };
  const del = async () => { if (confirm('Delete this blog permanently?')) { await api(`/admin/blogs/${id}`, { method: 'DELETE' }); nav('/admin/blogs'); } };
  return (<><h1>{isNew ? 'New blog' : 'Edit blog'}</h1><div className="editor">
    <label>Title<input className="field" value={f.title} onChange={on('title')}/></label>
    <label>Slug (auto from title if empty)<input className="field" value={f.slug} onChange={on('slug')}/></label>
    <label>Short description<textarea className="field" rows="2" maxLength="300" value={f.excerpt} onChange={on('excerpt')}/></label>
    <label>Article content (HTML: use h2, p, ul, pre/code)<textarea className="field mono" rows="14" value={f.content} onChange={on('content')}/></label>
    <label>Insert article image<input type="file" accept="image/*" onChange={insertImage}/></label>
    <div className="two"><label>Category<select className="field" value={f.category} onChange={on('category')}><option value="">Select</option>{cats.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
      <label>Author<select className="field" value={f.author} onChange={on('author')}><option value="">Select</option>{authors.data?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}</select></label></div>
    <label>Tags (hold Ctrl/Cmd to pick several)<select multiple className="field" value={f.tags} onChange={e => setF({ ...f, tags: [...e.target.selectedOptions].map(o => o.value) })}>{tags.data?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}</select></label>
    <label>Featured image<input type="file" accept="image/*" onChange={upload}/></label>{f.image && <img src={f.image} alt="" className="preview"/>}
    <label>Image alt text<input className="field" value={f.imageAlt} onChange={on('imageAlt')}/></label>
    <label>SEO title<input className="field" value={f.seoTitle} onChange={on('seoTitle')}/></label>
    <label>SEO meta description<textarea className="field" rows="2" value={f.seoDescription} onChange={on('seoDescription')}/></label>
    <label>Publish / schedule date<input type="datetime-local" className="field" value={f.publishedAt} onChange={on('publishedAt')}/></label>
    <label className="check"><input type="checkbox" checked={f.featured} onChange={on('featured')}/>Featured on homepage</label>
    {msg.t && <p className={msg.ok ? 'ok' : 'err'}>{msg.t}</p>}
    <div className="row"><button className="btn ghost" disabled={busy} onClick={() => save('draft')}>Save draft</button><button className="btn" disabled={busy} onClick={() => save('published')}>Publish</button><button className="btn ghost" disabled={busy} onClick={() => save('scheduled')}>Schedule</button>{!isNew && <button className="btn danger" onClick={del}>Delete</button>}</div></div></>);
}
