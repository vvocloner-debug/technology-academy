// src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// For normal JSON APIs
app.use(cors());
app.use(express.json());

// Mount routes (other app routes)
app.use('/api', routes);

// Stripe webhook needs raw body; define raw middleware at the exact route in controller
const stripeController = require('./controllers/stripeController');
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), stripeController.webhookHandler);

app.get('/', (req, res) => res.send('Platform API is up'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});