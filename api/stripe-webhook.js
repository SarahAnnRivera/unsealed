

const Stripe = require("stripe");
const supabase = require("../lib/supabase");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe needs the original request body to verify its signature.
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      error: "Missing Stripe signature",
    });
  }

  let event;

  // First: verify that this event really came from Stripe.
  try {
    let rawBody;

    if (req.rawBody) {
      rawBody = Buffer.isBuffer(req.rawBody)
        ? req.rawBody
        : Buffer.from(req.rawBody);
    } else {
      const chunks = [];

      for await (const chunk of req) {
        chunks.push(Buffer.from(chunk));
      }

      rawBody = Buffer.concat(chunks);
    }

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Stripe signature verification failed:", error.message);

    return res.status(400).json({
      error: "Invalid Stripe webhook signature",
    });
  }

  try {
    console.log("Verified Stripe event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Never activate an enrollment without confirmed payment.
      if (session.payment_status !== "paid") {
        console.log("Skipping checkout without confirmed payment:", session.id);

        return res.status(200).json({
          received: true,
        });
      }

      const email = (
        session.customer_details?.email ||
        session.customer_email ||
        ""
      )
        .trim()
        .toLowerCase();

      const storyId = session.metadata?.story_id;
      const plan = session.metadata?.plan;

      // Validate the story and plan before creating an enrollment.
      if (
        !email ||
        !["charles", "denise"].includes(storyId) ||
        !["follow", "binge"].includes(plan)
      ) {
        throw new Error("Missing or invalid checkout information");
      }

      // Our shared Supabase function handles:
      // 1. Finding or creating the subscriber
      // 2. Finding or creating the enrollment
      // 3. Setting the correct Follow/Binge delivery details
      const enrollment = await supabase.enrollReader({
        email,
        storyId,
        plan,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
        stripeSubscriptionId: session.subscription,
      });

      // Immediately send Letter 1 for this specific purchased story.
if (plan === "follow" && !enrollment.alreadyEnrolled) {
  const response = await fetch(
    `${process.env.APP_URL}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({
        enrollmentId: enrollment.enrollmentId,
        storyId,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Initial letter delivery failed: ${response.status}`);
  }
}

      console.log("UNSEALED purchase enrolled:", {
        sessionId: session.id,
        storyId,
        plan,
        enrollmentId: enrollment.enrollmentId,
        alreadyEnrolled: enrollment.alreadyEnrolled,
      });
    }

    // Acknowledge successfully processed Stripe events.
    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error.message);

    // Return 500 so Stripe can retry temporary processing failures.
    return res.status(500).json({
      error: "Webhook processing failed",
    });
  }
};
