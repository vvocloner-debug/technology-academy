import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // sk_test_xxx من .env

app.use(express.json());

// Create Checkout Session
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
              name: "Course Subscription", // غيرها على حسب منتجك
            },
            unit_amount: 2000, // السعر بـ "سنت" (هنا 20.00 USD)
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success", // بعد الدفع الناجح
      cancel_url: "http://localhost:3000/cancel", // لو رجع بدون دفع
    });
    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));