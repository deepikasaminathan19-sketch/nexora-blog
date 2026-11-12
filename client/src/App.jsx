import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from './pages/Home.jsx'; import Blogs from './pages/Blogs.jsx'; import BlogDetails from './pages/BlogDetails.jsx';
import Categories from './pages/Categories.jsx'; import CategoryDetails from './pages/CategoryDetails.jsx'; import Search from './pages/Search.jsx';
import About from './pages/About.jsx'; import NotFound from './pages/NotFound.jsx';
import Login from './pages/admin/Login.jsx'; import Dashboard from './pages/admin/Dashboard.jsx'; import ManageBlogs from './pages/admin/ManageBlogs.jsx';
import BlogEditor from './pages/admin/BlogEditor.jsx'; import Crud from './pages/admin/Crud.jsx'; import AdminComments from './pages/admin/Comments.jsx';
export default function App() {
  return (<Routes>
    <Route element={<PublicLayout/>}>
      <Route path="/" element={<Home/>}/><Route path="/blogs" element={<Blogs/>}/><Route path="/blog/:slug" element={<BlogDetails/>}/>
      <Route path="/categories" element={<Categories/>}/><Route path="/category/:slug" element={<CategoryDetails/>}/><Route path="/search" element={<Search/>}/>
      <Route path="/about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Route>
    <Route path="/admin/login" element={<Login/>}/>
    <Route path="/admin" element={<AdminLayout/>}>
      <Route index element={<Dashboard/>}/><Route path="blogs" element={<ManageBlogs/>}/><Route path="blogs/:id" element={<BlogEditor/>}/>
      <Route path="categories" element={<Crud path="categories" title="Categories" fields={['name', 'description']}/>}/>
      <Route path="tags" element={<Crud path="tags" title="Tags" fields={['name']}/>}/>
      <Route path="authors" element={<Crud path="authors" title="Authors" fields={['name', 'bio', 'avatar']}/>}/>
      <Route path="comments" element={<AdminComments/>}/></Route>
  </Routes>);
}
