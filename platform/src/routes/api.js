import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// create a checkout session (test)
router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Course: Full Stack" },
          unit_amount: 5000
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: `${req.headers.origin || "http://localhost:3000"}/success.html`,
      cancel_url: `${req.headers.origin || "http://localhost:3000"}/cancel.html`
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;