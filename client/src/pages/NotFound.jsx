import { Link } from 'react-router-dom';
import { useSEO } from '../utils/seo.js';
export default function NotFound() {
  useSEO({ title: 'Page not found', description: 'This page does not exist.' });
  return <div className="wrap sec narrow"><h1>Page not found</h1><p className="lead">The page you want has moved or never existed.</p><Link to="/" className="btn">Go to homepage</Link></div>;
}
