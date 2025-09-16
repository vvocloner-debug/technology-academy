require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

const app = express();

// استخدم المفتاح السري من .env
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// البورت
const port = process.env.PORT || 3000;

// Secret بتاع الـ webhook
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware عادي
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route عادي للتجربة
app.get("/", (req, res) => {
  res.send("✅ Stripe Webhook Server Running");
});

// Webhook endpoint
app.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // هنا بتتعامل مع الأحداث
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("💰 Payment succeeded:", event.data.object.id);
      break;
    case "payment_intent.payment_failed":
      console.log("❌ Payment failed:", event.data.object.id);
      break;
    default:
      console.log(`ℹ️Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
