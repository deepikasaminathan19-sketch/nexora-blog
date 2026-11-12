import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, Tags, Users, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
const items = [['/admin', 'Dashboard', LayoutDashboard, true], ['/admin/blogs', 'Manage Blogs', FileText], ['/admin/categories', 'Categories', FolderTree], ['/admin/tags', 'Tags', Tags], ['/admin/authors', 'Authors', Users], ['/admin/comments', 'Comments', MessageSquare]];
export default function AdminLayout() {
  const { token, logout } = useAuth(); const nav = useNavigate();
  if (!token) return <Navigate to="/admin/login" replace/>;
  return (<div className="admin"><aside className="side"><Logo/>{items.map(([to, l, I, end]) => <NavLink key={to} to={to} end={end}><I size={18}/><span>{l}</span></NavLink>)}
    <button onClick={() => { logout(); nav('/admin/login'); }}><LogOut size={18}/><span>Logout</span></button></aside><section className="admin-main"><Outlet/></section></div>);
}
