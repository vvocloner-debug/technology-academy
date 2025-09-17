import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Use raw body for webhook verification
router.post("/", express.raw({ type: "application/json" }), (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle common events
    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        console.log("💰 PaymentIntent succeeded:", pi.id);
        // TODO: update DB / send email / fulfill order
    } else {
        console.log("🔔 Received event:", event.type);
    }

    res.json({ received: true });
});

export default router;