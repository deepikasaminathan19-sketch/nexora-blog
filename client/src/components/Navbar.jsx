import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import Logo from './Logo.jsx';
export default function Navbar() {
  const [open, setOpen] = useState(false); const [q, setQ] = useState(''); const nav = useNavigate();
  const go = (e) => { e.preventDefault(); if (q.trim()) { nav(`/search?q=${encodeURIComponent(q.trim())}`); setOpen(false); } };
  return (<header className="nav"><div className="wrap nav-in">
    <Link to="/" onClick={() => setOpen(false)}><Logo /></Link>
    <nav className={open ? 'links open' : 'links'} onClick={() => setOpen(false)}>
      <NavLink to="/" end>Home</NavLink><NavLink to="/blogs">Blogs</NavLink><NavLink to="/categories">Categories</NavLink><NavLink to="/about">About</NavLink></nav>
    <form className="nav-search" onSubmit={go}><Search size={16}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search articles" aria-label="Search articles"/></form>
    <button className="icon-btn burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X/> : <Menu/>}</button></div></header>);
}
