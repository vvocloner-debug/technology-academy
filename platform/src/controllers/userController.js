const db = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const hashed = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name || '', email, hashed);
    const user = db.prepare('SELECT id, name, email, isAdmin FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare('SELECT id, name, email, password, isAdmin FROM users WHERE email = ?').get(email);
  if (!row) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, row.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: row.id, email: row.email, isAdmin: row.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: row.id, name: row.name, email: row.email, isAdmin: row.isAdmin }, token });
};

exports.getProfile = (req, res) => {
  const userId = req.user.id;
  const row = db.prepare('SELECT id, name, email, isAdmin, createdAt FROM users WHERE id = ?').get(userId);
  res.json({ user: row });
};