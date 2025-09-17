// src/routes/api.js
const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({ ok: true, msg: 'Hello from platform API' });
});

module.exports = router;