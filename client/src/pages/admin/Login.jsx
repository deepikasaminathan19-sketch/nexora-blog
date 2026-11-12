import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Logo from '../../components/Logo.jsx';
export default function Login() {
  const { login } = useAuth(); const nav = useNavigate(); const [f, setF] = useState({ email: '', password: '' }); const [err, setErr] = useState('');
  const submit = async (e) => { e.preventDefault(); try { await login(f.email, f.password); nav('/admin'); } catch (x) { setErr(x.message); } };
  return <div className="login"><form onSubmit={submit}><Logo full/><h1>Admin sign in</h1>
    <input className="field" type="email" required placeholder="Email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })}/>
    <input className="field" type="password" required placeholder="Password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })}/>
    {err && <p className="err">{err}</p>}<button className="btn">Sign in</button></form></div>;
}
