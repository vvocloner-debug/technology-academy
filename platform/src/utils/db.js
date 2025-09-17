const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// Create tables if not exist
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  isAdmin INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now'))
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  price INTEGER,
  createdAt TEXT DEFAULT (datetime('now'))
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  courseId INTEGER,
  stripeSessionId TEXT,
  paidAt TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);
`).run();

module.exports = db;