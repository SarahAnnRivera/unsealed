const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const { createClient } = require("@supabase/supabase-js");

const violetTemplate = require("./email-templates/violet");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

module.exports = async function handler(req, res) {

    if (req.method !== "POST") {
  return res.status(405).json({ error: "Method not allowed" });
}


    const { email } = req.body;

    if (!email) {
  return res.status(400).json({ error: "Email is required" });
}

// Retrieve Violet's first letter from Supabase
const { data, error: dbError } = await supabase
  .from("letters")
  .select("subject, content")
  .eq("story_id", "violet")
  .eq("entry_number", 1)
  .single();

if (dbError || !data) {
  console.error("Supabase error:", dbError);
  return res.status(500).json({
    error: "Could not retrieve Violet's letter",
  });
}

  const { data: emailResult, error } = await resend.emails.send({
  from: "Unsealed <onboarding@resend.dev>",
  to: email,
  subject: data.subject,
  text: data.content,
  html: violetTemplate(data.content),
});


if (error) {
  return res.status(400).json({ error });
}

return res.status(200).json({ data: emailResult });

};