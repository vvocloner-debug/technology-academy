const express = require("express");
const bodyParser = require("body-parser");
const Stripe = require("stripe");

const app = express();

// ضع الـ Secret Key الخاص بحسابك (مفتاح STRIPE_SECRET_KEY من Dashboard)
const stripe = Stripe("sk_test_1234567890"); // ⚠️ عدله بالمفتاح السري بتاعك

// ضع الـ Signing Secret اللي أخدته من Stripe Webhooks
const endpointSecret = "whsec_scnLAOGeVlRsCPK8mCN0zCTpaGKdHX9E";

// لازم body يكون خام (raw) علشان نتحقق من التوقيع
app.post(
    "/webhook",
    bodyParser.raw({ type: "application/json" }),
    (req, res) => {
        const sig = req.headers["stripe-signature"];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("✅ Event Received:", event.type);
        } catch (err) {
            console.error("❌ Error verifying webhook:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // هنا تقدر تتعامل مع الأحداث المختلفة
        switch (event.type) {
            case "payment_intent.succeeded":
                console.log("💰 Payment succeeded!");
                break;
            case "payment_intent.payment_failed":
                console.log("❌ Payment failed!");
                break;
            default:
                console.log(`ℹ️ Event type not handled: ${event.type}`);
        }

        res.json({ received: true });
    }
);

app.listen(3000, () => console.log("🚀 Webhook server running on port 3000"));
    default:
      console.log(`ℹ️Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
