const db = require('../utils/db');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

exports.handle = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // handle events
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const courseId = session.metadata && session.metadata.courseId ? Number(session.metadata.courseId) : null;
    const userId = session.metadata && session.metadata.userId ? Number(session.metadata.userId) : null;

    // store enrollment
    try {
      db.prepare('INSERT INTO enrollments (userId, courseId, stripeSessionId, paidAt) VALUES (?, ?, ?, ?)').run(
        userId || null,
        courseId || null,
        session.id,
        new Date().toISOString()
      );
      console.log('Enrollment saved for session', session.id, 'course', courseId, 'user', userId);
    } catch (e) {
      console.error('Failed to save enrollment', e.message);
    }
  } else {
    console.log('Unhandled event:', event.type);
  }

  res.json({ received: true });
};