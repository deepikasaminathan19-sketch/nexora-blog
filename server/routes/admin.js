import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { upload, uploadImage } from '../controllers/upload.js';
import { Blog, Category, Tag, Author, Comment, Subscriber, slugify } from '../models/index.js';
const r = Router();
r.use(requireAdmin);   // every route below needs a valid JWT
const pop = (q) => q.populate('category', 'name').populate('author', 'name').populate('tags', 'name');

// Blogs
r.get('/blogs', async (req, res, next) => { try { res.json(await pop(Blog.find().select('-content').sort('-createdAt'))); } catch (e) { next(e); } });
r.get('/blogs/:id', async (req, res, next) => { try { const b = await Blog.findById(req.params.id); b ? res.json(b) : res.status(404).json({ message: 'Not found' }); } catch (e) { next(e); } });
const prep = (b) => {
  if (b.title && !b.slug) b.slug = slugify(b.title); else if (b.slug) b.slug = slugify(b.slug);
  if (b.status === 'scheduled' && (!b.publishedAt || new Date(b.publishedAt) <= new Date())) throw Object.assign(new Error('Pick a future date to schedule'), { status: 400 });
  if (b.status === 'draft') b.publishedAt = undefined;
  return b;
};
r.post('/blogs', async (req, res, next) => { try { res.status(201).json(await Blog.create(prep(req.body))); } catch (e) { next(e); } });
r.put('/blogs/:id', async (req, res, next) => {
  try {
    const b = await Blog.findById(req.params.id); if (!b) return res.status(404).json({ message: 'Not found' });
    b.set(prep(req.body)); await b.save(); res.json(b);   // save() re-runs reading-time calculation
  } catch (e) { next(e); }
});
r.delete('/blogs/:id', async (req, res, next) => { try { await Blog.findByIdAndDelete(req.params.id); await Comment.deleteMany({ blog: req.params.id }); res.json({ ok: true }); } catch (e) { next(e); } });

// Categories / Tags / Authors share the same CRUD
const crud = (path, Model) => {
  r.get(`/${path}`, async (q, s, n) => { try { s.json(await Model.find().sort('name')); } catch (e) { n(e); } });
  r.post(`/${path}`, async (q, s, n) => { try { s.status(201).json(await Model.create(q.body)); } catch (e) { n(e); } });
  r.put(`/${path}/:id`, async (q, s, n) => { try { const d = await Model.findById(q.params.id); d.set(q.body); await d.save(); s.json(d); } catch (e) { n(e); } });
  r.delete(`/${path}/:id`, async (q, s, n) => {
    try {
      const field = { categories: 'category', tags: 'tags', authors: 'author' }[path];
      if (await Blog.exists({ [field]: q.params.id })) return s.status(409).json({ message: 'Used by blogs. Reassign them first.' });
      await Model.findByIdAndDelete(q.params.id); s.json({ ok: true });
    } catch (e) { n(e); }
  });
};
crud('categories', Category); crud('tags', Tag); crud('authors', Author);

// Comments
r.get('/comments', async (req, res, next) => { try { res.json(await Comment.find().populate('blog', 'title').sort('-createdAt')); } catch (e) { next(e); } });
r.patch('/comments/:id/approve', async (req, res, next) => { try { res.json(await Comment.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })); } catch (e) { next(e); } });
r.delete('/comments/:id', async (req, res, next) => { try { await Comment.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch (e) { next(e); } });

r.post('/upload', upload.single('image'), uploadImage);
r.get('/subscribers', async (req, res, next) => { try { res.json(await Subscriber.find().sort('-createdAt')); } catch (e) { next(e); } });
r.get('/stats', async (req, res, next) => {
  try {
    const [total, published, draft, scheduled, subs, pending, views, recent, pendingList, top] = await Promise.all([
      Blog.countDocuments(), Blog.countDocuments({ status: 'published' }), Blog.countDocuments({ status: 'draft' }), Blog.countDocuments({ status: 'scheduled' }),
      Subscriber.countDocuments(), Comment.countDocuments({ approved: false }),
      Blog.aggregate([{ $group: { _id: null, v: { $sum: '$views' } } }]),
      Blog.find().select('title status createdAt views').sort('-createdAt').limit(5),
      Comment.find({ approved: false }).populate('blog', 'title').sort('-createdAt').limit(5),
      Blog.find().select('title views').sort('-views').limit(5)]);
    res.json({ total, published, draft, scheduled, subscribers: subs, pendingComments: pending, totalViews: views[0]?.v || 0, recent, pendingList, top });
  } catch (e) { next(e); }
});
export default r;
