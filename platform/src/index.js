// src/index.js
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

const PORT = process.env.PORT || 3000;

// route بسيط للتأكد
app.get('/', (req, res) => res.send('🚀 Server is running...'));

// IMPORTANT: Use raw body parser for webhook route
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.STRIPE_WEBHOOK_SECRET || '';

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        // optional: log the raw body for debugging (avoid in production)
        fs.appendFileSync('webhook-errors.log', `${new Date().toISOString()} - Signature verification failed: ${err.message}\n`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('✅ Received event:', event.type);
    // save a small log
    try {
        fs.appendFileSync('webhook.log', `${new Date().toISOString()} | ${event.type} | ${JSON.stringify(event.data.object)}\n`);
    } catch (e) { /* ignore logging errors */ }

    // example handling
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        // هنا تكتب منطقك: حفظ في DB، ارسال ايميل ... الخ
    }

    res.json({ received: true });
});

// بعد تعريف route الخاص بالـ webhook نستخدم body parser لباقي الـ routes
app.use(express.json());

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});