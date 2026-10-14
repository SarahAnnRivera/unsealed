
const { Resend } = require("resend");
const supabase = require("../lib/supabase");

const violetTemplate = require("./email-templates/violet");
const charlesTemplate = require("./email-templates/charles");
const deniseTemplate = require("./email-templates/denise");

const resend = new Resend(process.env.RESEND_API_KEY);

const templates = {
  violet: violetTemplate,
  charles: charlesTemplate,
  denise: deniseTemplate,
};

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

// --------------------------------------------------
// FREE STORY SIGNUP
// --------------------------------------------------

async function handleFreeSignup(req, res) {
  const { email, storyId } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof storyId !== "string" ||
    !email.trim() ||
    !storyId.trim()
  ) {
    return res.status(400).json({
      error: "Email and story ID are required",
    });
  }

  // Check the actual story record, not a frontend flag.
  const { data: story, error: storyError } = await supabase
    .from("stories")
    .select("id, is_free")
    .eq("id", storyId)
    .maybeSingle();

  if (storyError) {
    throw storyError;
  }

  if (!story) {
    return res.status(404).json({
      error: "Story not found",
    });
  }

  if (!story.is_free) {
    return res.status(403).json({
      error: "This story requires payment",
    });
  }

  // Shared enrollment function handles the subscriber
  // and creates an active Follow enrollment.
  const enrollment = await supabase.enrollReader({
    email,
    storyId,
    plan: "follow",
  });

  return res.status(200).json({
    success: true,
    alreadyEnrolled: enrollment.alreadyEnrolled,
    message: enrollment.alreadyEnrolled
      ? "You are already enrolled in this story"
      : "You are enrolled! Your first letter is on its way.",
  });
}

// --------------------------------------------------
// SCHEDULED EMAIL DELIVERY
// --------------------------------------------------

async function handleScheduledDelivery(req, res) {
  const expectedSecret = process.env.CRON_SECRET;

  if (
    !expectedSecret ||
    req.headers.authorization !== `Bearer ${expectedSecret}`
  ) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const now = new Date().toISOString();
  const enrollmentId = req.body?.enrollmentId;
  const storyId = req.body?.storyId;

 // Find the purchased enrollment, or the next scheduled delivery.
let query = supabase
  .from("enrollments")
  .select("id, subscriber_id, story_id, next_entry_number, next_send_at")
  .eq("status", "active")
  .eq("access_type", "follow")
  .lte("next_send_at", now);

if (enrollmentId && storyId) {
  // Immediate delivery: target this exact story enrollment.
  query = query
    .eq("id", enrollmentId)
    .eq("story_id", storyId)
    .eq("next_entry_number", 1);
} else {
  // Scheduled delivery: find the next reader due.
  query = query.order("next_send_at", { ascending: true });
}

const { data: enrollment, error: enrollmentError } =
  await query.limit(1).maybeSingle();

  if (enrollmentError) {
    throw enrollmentError;
  }

  if (!enrollment) {
    return res.status(200).json({
      message: "No letters due",
    });
  }

  const { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("email")
      .eq("id", enrollment.subscriber_id)
      .single();

  if (subscriberError) {
    throw subscriberError;
  }

  const { data: letter, error: letterError } =
    await supabase
      .from("letters")
      .select("id, subject, content, delay_days")
      .eq("story_id", enrollment.story_id)
      .eq("entry_number", enrollment.next_entry_number)
      .maybeSingle();

  if (letterError) {
    throw letterError;
  }

  if (!letter) {
    // No next letter means the reader finished the story.
    const { error: finishError } = await supabase
      .from("enrollments")
      .update({
        status: "completed",
        next_send_at: null,
      })
      .eq("id", enrollment.id);

    if (finishError) {
      throw finishError;
    }

    return res.status(200).json({
      message: "Story completed",
      storyId: enrollment.story_id,
    });
  }

  const template = templates[enrollment.story_id];

  if (!template) {
    throw new Error(
      `Missing email template for ${enrollment.story_id}`
    );
  }

  const html = template(
    letter.content,
    enrollment.next_entry_number
  );

  // Send the actual letter.
  const { data: emailResult, error: sendError } =
    await resend.emails.send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject: letter.subject,
      text: letter.content,
      html,
    });

  if (sendError) {
    throw sendError;
  }

  // Record the email accepted by Resend.
  const { error: deliveryError } = await supabase
    .from("letter_deliveries")
    .upsert(
      {
        enrollment_id: enrollment.id,
        letter_id: letter.id,
        status: "sent",
        resend_email_id: emailResult.id,
        sent_at: new Date().toISOString(),
      },
      {
        onConflict: "enrollment_id,letter_id",
      }
    );

  if (deliveryError) {
    throw deliveryError;
  }

 // Get the next letter's delivery delay from Supabase.
const { data: nextLetter, error: nextLetterError } = await supabase
  .from("letters")
  .select("delay_days")
  .eq("story_id", enrollment.story_id)
  .eq("entry_number", enrollment.next_entry_number + 1)
  .maybeSingle();

if (nextLetterError) {
  throw nextLetterError;
}

const nextSend = nextLetter ? new Date() : null;

if (nextLetter) {
  nextSend.setDate(
    nextSend.getDate() + (nextLetter.delay_days ?? 0)
  );
}

  const { error: updateError } = await supabase
    .from("enrollments")
    .update({
      next_entry_number: enrollment.next_entry_number + 1,
      next_send_at: nextSend ? nextSend.toISOString() : null,
    })
    .eq("id", enrollment.id)
    .eq("next_entry_number", enrollment.next_entry_number);

  if (updateError) {
    throw updateError;
  }

  return res.status(200).json({
    success: true,
    storyId: enrollment.story_id,
    entryNumber: enrollment.next_entry_number,
    resendId: emailResult.id,
  });
}

// --------------------------------------------------
// MAIN API HANDLER
// --------------------------------------------------

module.exports = async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // Protected scheduler requests use this header.
    if (req.method === "GET" || req.headers.authorization) {
      return await handleScheduledDelivery(req, res);
    }

    // Public requests can ONLY enroll in free stories.
    return await handleFreeSignup(req, res);
  } catch (error) {
    console.error("UNSEALED email API error:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};
