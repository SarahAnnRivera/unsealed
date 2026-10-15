
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
  
return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Field Correspondence</title>
</head>

<body style="margin:0;padding:0;background-color:#bcb9a9;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#bcb9a9;">
    <tr>
      <td align="center" style="padding:26px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background-color:#e9e5d7;
                 border:1px solid #969381;">

          <!-- Wartime correspondence heading -->
          <tr>
            <td style="padding:32px 34px 16px;">

              <div style="
                font-family:'Courier New',Courier,monospace;
                font-size:11px;
                font-weight:bold;
                letter-spacing:2px;
                color:#4d5445;
              ">
                FIELD CORRESPONDENCE
              </div>

              <div style="
                font-family:'Courier New',Courier,monospace;
                font-size:10px;
                letter-spacing:1px;
                color:#777b6a;
                margin-top:10px;
              ">
                GREAT WAR · 1914
              </div>

            </td>
          </tr>

          <!-- Military-style double rule -->
          <tr>
            <td style="padding:0 34px;">
              <div style="border-top:2px solid #636a56;"></div>
              <div style="
                border-top:1px solid #a3a591;
                margin-top:4px;
              "></div>
            </td>
          </tr>

          <!-- Charles's letter -->
          <tr>
            <td style="
              padding:36px 34px 44px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:16px;
              line-height:1.85;
              color:#30362e;
            ">
              ${letter}
            </td>
          </tr>

          <!-- Archive signature -->
          <tr>
            <td align="center" style="padding:0 30px 34px;">

              <div style="
                border-top:1px solid #a3a591;
                margin-bottom:22px;
              "></div>

              <div style="
                font-family:'Courier New',Courier,monospace;
                font-size:9px;
                letter-spacing:2px;
                color:#858676;
              ">
                PRESERVED IN THE ARCHIVE OF
              </div>

              <div style="
                font-family:Georgia,serif;
                font-size:15px;
                letter-spacing:5px;
                color:#555d4d;
                margin-top:9px;
              ">
                UNSEALED
              </div>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

}
module.exports = charlesTemplate;

