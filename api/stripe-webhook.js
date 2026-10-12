
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe needs the original, unmodified request body
// to verify that a webhook really came from Stripe.
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

  console.log("Request body inspection:", {
  bodyType: typeof req.body,
  bodyIsBuffer: Buffer.isBuffer(req.body),
  bodyIsString: typeof req.body === "string",
  bodyIsObject: req.body !== null && typeof req.body === "object",
  readableEnded: req.readableEnded,
  hasRawBody: req.rawBody != null,
});

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

    console.log("Webhook body diagnostics:", {
  isBuffer: Buffer.isBuffer(rawBody),
  length: rawBody.length,
  contentType: req.headers["content-type"],
  hasSignature: Boolean(req.headers["stripe-signature"]),
});

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Verified Stripe event:", event.type);

    // Next, we'll securely record successful payments
    // and activate the correct story enrollment.

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook verification failed:", error.message);

    return res.status(400).json({
      error: "Invalid webhook signature",
    });
  }
};
