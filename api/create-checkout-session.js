
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prices = {
  follow: process.env.STRIPE_PRICE_FOLLOW,
  binge: process.env.STRIPE_PRICE_BINGE,
};

const allowedStories = ["charles", "denise"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { email, storyId, plan } = req.body || {};

    // Check that the request has the information we need.
    if (
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !allowedStories.includes(storyId) ||
      !["follow", "binge"].includes(plan)
    ) {
      return res.status(400).json({
        error: "Invalid email, story, or plan",
      });
    }

    const priceId = prices[plan];

    if (!priceId) {
      return res.status(500).json({
        error: "Stripe price is not configured",
      });
    }

    const origin = process.env.APP_URL;

    if (!origin) {
      return res.status(500).json({
        error: "APP_URL is not configured",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email.trim().toLowerCase(),

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      metadata: {
        story_id: storyId,
        plan,
      },

      
success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&story=${encodeURIComponent(storyId)}`,

      cancel_url: `${origin}/checkout/cancel`,
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error.message);

    return res.status(500).json({
      error: "Unable to start checkout",
    });
  }
};
