import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
export default function Footer() {
  return (<footer className="footer"><div className="wrap foot-in"><div><Logo full/><p>Clear, practical writing on the technology shaping tomorrow.</p></div>
    <div><h4>Explore</h4><Link to="/blogs">All articles</Link><Link to="/categories">Categories</Link><Link to="/about">About NEXORA</Link></div></div>
    <div className="wrap copy">© {new Date().getFullYear()} NEXORA. All rights reserved.</div></footer>);
}
