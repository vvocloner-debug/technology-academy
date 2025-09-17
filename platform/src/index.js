const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.static("public"));
app.use(bodyParser.json());

// صفحة رئيسية بسيطة
app.get("/", (req, res) => {
  res.send("<h1>Stripe Payment Platform Running 🚀</h1>");
});

// ✅ إنشاء جلسة دفع
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Product",
            },
            unit_amount: 2000, // السعر 20$
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ استقبال Webhook من Stripe
app.post("/webhook", bodyParser.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err.message);
    return res.sendStatus(400);
  }

  // التعامل مع الأحداث
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("✅ Payment successful:", session);
  }

  res.json({ received: true });
});

// ✅ صفحات نجاح وفشل الدفع
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/success.html"));
});

app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/cancel.html"));
});

// ✅ تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});