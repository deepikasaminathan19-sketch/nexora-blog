import { Router } from 'express';
import { Blog, Category, Author, Comment, Subscriber, publicFilter } from '../models/index.js';
const r = Router();
const pop = (q) => q.populate('category', 'name slug').populate('author', 'name avatar bio').populate('tags', 'name slug');
const card = '-content -seoTitle -seoDescription';

r.get('/blogs', async (req, res, next) => {
  try {
    const page = Math.max(1, +req.query.page || 1), limit = Math.min(24, +req.query.limit || 9);
    const f = publicFilter();
    if (req.query.category) { const c = await Category.findOne({ slug: req.query.category }); f.category = c?._id; }
    if (req.query.q) f.$text = { $search: String(req.query.q) };
    if (req.query.featured) f.featured = true;
    const sort = { oldest: { publishedAt: 1 }, popular: { views: -1 } }[req.query.sort] || { publishedAt: -1 };
    const [items, total] = await Promise.all([pop(Blog.find(f).select(card).sort(sort).skip((page - 1) * limit).limit(limit)), Blog.countDocuments(f)]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (e) { next(e); }
});
r.get('/blogs/popular', async (req, res, next) => {
  try { res.json(await pop(Blog.find(publicFilter()).select(card).sort({ views: -1 }).limit(5))); } catch (e) { next(e); }
});
r.get('/blogs/:slug', async (req, res, next) => {
  try {
    const blog = await pop(Blog.findOneAndUpdate({ slug: req.params.slug, ...publicFilter() }, { $inc: { views: 1 } }, { new: true }));
    if (!blog) return res.status(404).json({ message: 'Article not found' });
    const tagIds = blog.tags.map(t => t._id);
    const pool = await pop(Blog.find({ ...publicFilter(), _id: { $ne: blog._id }, category: blog.category._id }).select(card).limit(12));
    const shared = (b) => b.tags.filter(t => tagIds.some(i => i.equals(t._id))).length;
    const related = pool.sort((a, b) => shared(b) - shared(a)).slice(0, 3);   // same category, ranked by shared tags
    res.json({ blog, related });
  } catch (e) { next(e); }
});
r.post('/blogs/:slug/helpful', async (req, res, next) => {
  try {
    const field = req.body.helpful ? 'helpfulYes' : 'helpfulNo';
    const b = await Blog.findOneAndUpdate({ slug: req.params.slug, ...publicFilter() }, { $inc: { [field]: 1 } });
    b ? res.json({ ok: true }) : res.status(404).json({ message: 'Article not found' });
  } catch (e) { next(e); }
});
r.get('/blogs/:slug/comments', async (req, res, next) => {
  try {
    const b = await Blog.findOne({ slug: req.params.slug, ...publicFilter() }).select('_id');
    if (!b) return res.status(404).json({ message: 'Article not found' });
    res.json(await Comment.find({ blog: b._id, approved: true }).select('name text createdAt -_id').sort({ createdAt: -1 })); // email never sent
  } catch (e) { next(e); }
});
r.post('/blogs/:slug/comments', async (req, res, next) => {
  try {
    const b = await Blog.findOne({ slug: req.params.slug, ...publicFilter() }).select('_id');
    if (!b) return res.status(404).json({ message: 'Article not found' });
    const { name, email, text } = req.body;
    if (!/^\S+@\S+\.\S+$/.test(email || '')) return res.status(400).json({ message: 'Enter a valid email' });
    await Comment.create({ blog: b._id, name, email, text });   // approved:false by default
    res.status(201).json({ message: 'Thanks! Your comment will appear after review.' });
  } catch (e) { next(e); }
});
r.get('/categories', async (req, res, next) => {
  try {
    const cats = await Category.find().sort('name').lean();
    const counts = await Blog.aggregate([{ $match: publicFilter() }, { $group: { _id: '$category', n: { $sum: 1 } } }]);
    res.json(cats.map(c => ({ ...c, count: counts.find(x => x._id.equals(c._id))?.n || 0 })));
  } catch (e) { next(e); }
});
r.get('/authors', async (req, res, next) => { try { res.json(await Author.find()); } catch (e) { next(e); } });
r.post('/newsletter', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter a valid email' });
    if (await Subscriber.findOne({ email })) return res.status(409).json({ message: 'You are already subscribed' });
    await Subscriber.create({ email });
    res.status(201).json({ message: 'Subscribed! Welcome to NEXORA.' });
  } catch (e) { next(e); }
});
export default r;
