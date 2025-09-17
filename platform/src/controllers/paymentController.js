const db = require('../utils/db');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:3000';

exports.createCheckoutSession = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });

  const course = db.prepare('SELECT id, title, price FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const userId = req.user ? req.user.id : null; // if authenticated
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: course.title },
          unit_amount: course.price
        },
        quantity: 1
      }],
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      metadata: { courseId: course.id.toString(), userId: userId ? userId.toString() : '' }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('createCheckoutSession err', err);
    res.status(500).json({ error: err.message });
  }
};