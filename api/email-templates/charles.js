
// UNSEALED · Archive 002 — Charles
// Entry 19 alone is the official War Office notification.

function escapeHtml(value = "") {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function inline(text) {
  return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}
function formatCharles(content) {
  const paragraphs = String(content || "").replace(/\r\n/g, "\n").trim().split(/\n\s*\n/);
  return paragraphs.map((paragraph, index) => {
    const lines = paragraph.split("\n").map(x => x.trim()).filter(Boolean);
    if (!lines.length) return "";
    const text = lines.join(" ");
    if (index === 0) return `<p style="margin:0 0 34px;text-align:right;font-size:13px;font-style:italic;color:#777365;">${inline(text)}</p>`;
    if (/^\*\*Names:\*\*/i.test(text)) {
      return `<div style="border-left:2px solid #898b75;padding:12px 18px;margin:26px 0;background:#f0eee5;color:#56584c;font-size:14px;line-height:1.8;">${lines.map(inline).join("<br>")}</div>`;
    }
    return `<p style="margin:0 0 22px;line-height:1.8;">${lines.map(inline).join("<br>")}</p>`;
  }).join("");
}
function charlesTemplate(content, entryNumber) {
  const official = Number(entryNumber) === 19;
  const paper = official ? "#fbfaf6" : "#f6f3e9";
  const ink = official ? "#303335" : "#34382f";
  const heading = official ? "WAR OFFICE · OFFICIAL COMMUNICATION" : "ARCHIVE 002 · PRIVATE CORRESPONDENCE";
  const formatted = formatCharles(content);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UNSEALED — Archive 002</title></head>
<body style="margin:0;padding:0;background:${official ? "#e5e5e1" : "#dcdcd3"};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${paper};border:1px solid ${official ? "#9b9b97" : "#b7b6a7"};">
<tr><td style="padding:38px 30px 18px;text-align:center;font-family:Georgia,serif;">
<div style="font-size:17px;letter-spacing:5px;color:${official ? "#303335" : "#4d5448"};">${official ? "WAR OFFICE" : "UNSEALED"}</div>
<div style="font-size:10px;letter-spacing:2px;color:#858476;margin-top:12px;">${heading}</div></td></tr>
<tr><td style="padding:0 30px;"><div style="border-top:1px solid #b7b6a7;"></div></td></tr>
<tr><td style="padding:35px 30px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.8;color:${ink};">${formatted}</td></tr>
<tr><td style="padding:12px 30px 34px;text-align:center;font-family:Georgia,serif;font-size:10px;letter-spacing:2px;color:#858476;">
<div style="border-top:1px solid #b7b6a7;padding-top:20px;">FROM THE UNSEALED ARCHIVE</div></td></tr>
</table></td></tr></table></body></html>`;
}
module.exports = charlesTemplate;

