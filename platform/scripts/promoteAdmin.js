const db = require('../src/utils/db');
const email = process.argv[2];
if (!email) {
  console.log('Usage: node scripts/promoteAdmin.js email@example.com');
  process.exit(1);
}
const res = db.prepare('UPDATE users SET isAdmin = 1 WHERE email = ?').run(email);
console.log('Rows updated:', res.changes);
if (res.changes === 0) console.log('No user found with that email');