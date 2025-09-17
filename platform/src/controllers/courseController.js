const db = require('../utils/db');

exports.list = (req, res) => {
  const rows = db.prepare('SELECT id, title, description, price FROM courses ORDER BY id DESC').all();
  res.json(rows);
};

exports.create = (req, res) => {
  const { title, description, price } = req.body;
  if (!title || !price) return res.status(400).json({ error: 'Title and price required' });
  const info = db.prepare('INSERT INTO courses (title, description, price) VALUES (?, ?, ?)').run(title, description || '', price);
  const course = db.prepare('SELECT id, title, description, price FROM courses WHERE id = ?').get(info.lastInsertRowid);
  res.json(course);
};

exports.get = (req, res) => {
  const id = req.params.id;
  const course = db.prepare('SELECT id, title, description, price FROM courses WHERE id = ?').get(id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};