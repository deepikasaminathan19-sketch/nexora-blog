import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { fmtDate } from '../utils/seo.js';
export default function BlogCard({ blog }) {
  return (<article className="card">
    <Link to={`/blog/${blog.slug}`} className="thumb"><img src={blog.image} alt={blog.imageAlt || blog.title} loading="lazy"/></Link>
    <div className="card-body">
      <Link to={`/category/${blog.category?.slug}`} className="cat">{blog.category?.name}</Link>
      <h3><Link to={`/blog/${blog.slug}`}>{blog.title}</Link></h3>
      <p>{blog.excerpt}</p>
      <div className="meta"><span>{blog.author?.name}</span><span>{fmtDate(blog.publishedAt)}</span><span className="rt"><Clock size={14}/>{blog.readingTime} min</span></div>
      <Link to={`/blog/${blog.slug}`} className="read">Read Article <ArrowRight size={16}/></Link></div></article>);
}
