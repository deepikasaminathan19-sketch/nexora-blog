import { useEffect, useState } from 'react';
import { api } from '../services/api.js';
export default function useFetch(path, deps = []) {
  const [s, set] = useState({ data: null, loading: true, error: '' });
  useEffect(() => { let off = false; set(x => ({ ...x, loading: true, error: '' }));
    api(path).then(d => !off && set({ data: d, loading: false, error: '' })).catch(e => !off && set({ data: null, loading: false, error: e.message }));
    return () => { off = true; }; }, [path, ...deps]);
  return s;
}
