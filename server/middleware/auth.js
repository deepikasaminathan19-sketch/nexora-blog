import jwt from 'jsonwebtoken';
export function requireAdmin(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Login required' });
  try { req.admin = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Session expired. Please log in again.' }); }
}
export const notFound = (req, res) => res.status(404).json({ message: 'Route not found' });
export const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists (duplicate value)' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(', ') });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  console.error(err); res.status(err.status || 500).json({ message: err.message || 'Server error' });
};
