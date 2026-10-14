

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Enroll a reader in an UNSEALED story.
 *
 * Call only from trusted backend code:
 * - Free signup: after confirming stories.is_free === true
 * - Paid signup: after Stripe webhook verifies payment
 *
 * This function does not process payments or send emails.
 */
async function enrollReader({
  email,
  storyId,
  plan = "follow",
  stripeSessionId = null,
  stripePaymentIntentId = null,
  stripeSubscriptionId = null,
}) {
  // Validate the request.
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("A valid email is required");
  }

  if (!storyId || typeof storyId !== "string") {
    throw new Error("A story ID is required");
  }

  if (!["follow", "binge"].includes(plan)) {
    throw new Error("Invalid enrollment plan");
  }

  // Look up the story in Supabase.
  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id, is_free")
    .eq("id", storyId)
    .single();

  if (storyError || !story) {
    throw storyError || new Error("Story not found");
  }

  // Paid stories require a verified Stripe checkout session.
  // IMPORTANT: The caller must verify Stripe before passing this ID.
  if (!story.is_free && !stripeSessionId) {
    throw new Error("Paid enrollment requires verified payment");
  }

  // Find the subscriber, or create them if they're new.
  let { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

  if (subscriberError) {
    throw subscriberError;
  }

  if (!subscriber) {
    const { data: newSubscriber, error: insertError } =
      await supabase
        .from("subscribers")
        .insert({ email: normalizedEmail })
        .select("id")
        .single();

    if (insertError) {
      throw insertError;
    }

    subscriber = newSubscriber;
  }

  // Avoid creating a duplicate enrollment for the same story.
  const { data: existingEnrollment, error: existingError } =
    await supabase
      .from("enrollments")
      .select("id, access_type, status")
      .eq("subscriber_id", subscriber.id)
      .eq("story_id", storyId)
      .eq("access_type", plan)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
      

  if (existingError) {
    throw existingError;
  }

  if (existingEnrollment) {
    return {
      success: true,
      alreadyEnrolled: true,
      subscriberId: subscriber.id,
      enrollmentId: existingEnrollment.id,
      storyId,
      plan: existingEnrollment.access_type,
    };
  }

  // Follow starts with letter 1 due immediately.
  // Binge receives reading access instead of scheduled emails.
  const now = new Date().toISOString();

  const enrollmentData = {
    subscriber_id: subscriber.id,
    story_id: storyId,
    access_type: plan,
    status: "active",
    next_entry_number: 1,
    next_send_at: plan === "follow" ? now : null,
    activated_at: now,
    stripe_checkout_session_id: stripeSessionId,
    stripe_payment_intent_id: stripePaymentIntentId,
    stripe_subscription_id: stripeSubscriptionId,
  };

  const { data: enrollment, error: enrollmentError } =
    await supabase
      .from("enrollments")
      .insert(enrollmentData)
      .select("id")
      .single();

  if (enrollmentError) {
    throw enrollmentError;
  }

  return {
    success: true,
    alreadyEnrolled: false,
    subscriberId: subscriber.id,
    enrollmentId: enrollment.id,
    storyId,
    plan,
  };
}

// Preserve the existing Supabase client export.
// Existing files can continue using:
// const supabase = require("../lib/supabase");
supabase.enrollReader = enrollReader;

module.exports = supabase;

