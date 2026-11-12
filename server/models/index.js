import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ref = (n) => ({ type: Schema.Types.ObjectId, ref: n });
export const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const User = model('User', new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, name: { type: String, default: 'Admin' }
}, { timestamps: true }));

export const Category = model('Category', new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, unique: true }, description: String
}, { timestamps: true }).pre('validate', function (n) { this.slug = slugify(this.name); n(); }));

export const Tag = model('Tag', new Schema({
  name: { type: String, required: true, unique: true, trim: true }, slug: { type: String, unique: true }
}, { timestamps: true }).pre('validate', function (n) { this.slug = slugify(this.name); n(); }));

export const Author = model('Author', new Schema({
  name: { type: String, required: true, trim: true }, bio: String, avatar: String
}, { timestamps: true }));

const blogSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },   // HTML
  category: { ...ref('Category'), required: true },
  tags: [ref('Tag')], author: { ...ref('Author'), required: true },
  image: String, imageAlt: String, seoTitle: String, seoDescription: String,
  status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
  publishedAt: Date, featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 }, readingTime: { type: Number, default: 1 },
  helpfulYes: { type: Number, default: 0 }, helpfulNo: { type: Number, default: 0 }
}, { timestamps: true });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.pre('validate', function (next) {
  if (!this.slug && this.title) this.slug = slugify(this.title);
  const words = this.content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  this.readingTime = Math.max(1, Math.ceil(words / 200));   // 200 wpm, rounded up
  if (this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
  next();
});
export const Blog = model('Blog', blogSchema);

export const Comment = model('Comment', new Schema({
  blog: { ...ref('Blog'), required: true }, name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true }, text: { type: String, required: true, maxlength: 1000 },
  approved: { type: Boolean, default: false }
}, { timestamps: true }));

export const Subscriber = model('Subscriber', new Schema({
  email: { type: String, required: true, unique: true, lowercase: true }
}, { timestamps: true }));

export const Settings = model('Settings', new Schema({
  siteName: { type: String, default: 'NEXORA' }, tagline: { type: String, default: 'EXPLORE. LEARN. INNOVATE.' }
}));
// Only blogs that are published AND whose time has come are public.
export const publicFilter = () => ({ status: 'published', publishedAt: { $lte: new Date() } });
