const jwt = require('jsonwebtoken');
const db = require('./db');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // attach user
    const user = db.prepare('SELECT id, name, email, isAdmin FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'Invalid token user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}

module.exports = { auth, requireAdmin };