const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const getToken = () => localStorage.getItem('nexora_token');
export async function api(path, { method = 'GET', body, form } = {}) {
  const headers = {}; const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(BASE + path, { method, headers, body: form || (body && JSON.stringify(body)) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
