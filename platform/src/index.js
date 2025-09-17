const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// === webhook raw parser must be mounted BEFORE express.json() ===
const stripeWebhook = require('./controllers/stripeWebhook');
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook.handle);

// general middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static public
app.use(express.static(path.join(__dirname, '..', 'public')));

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));

// fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));