import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { Blog, publicFilter } from './models/index.js';
import { notFound, errorHandler } from './middleware/auth.js';
const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (q, s) => s.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.get('/robots.txt', (q, s) => s.type('text/plain').send(`User-agent: *\nDisallow: /admin\nSitemap: ${process.env.SITE_URL}/sitemap.xml`));
app.get('/sitemap.xml', async (q, s, n) => {
  try {
    const site = process.env.SITE_URL, blogs = await Blog.find(publicFilter()).select('slug updatedAt');
    const urls = ['', '/blogs', '/categories', '/about'].map(p => `<url><loc>${site}${p}</loc></url>`)
      .concat(blogs.map(b => `<url><loc>${site}/blog/${b.slug}</loc><lastmod>${b.updatedAt.toISOString()}</lastmod></url>`));
    s.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
  } catch (e) { n(e); }
});
app.use(notFound); app.use(errorHandler);
export default app;
