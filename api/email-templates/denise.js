
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function formatDenise(content) {
  const paragraphs = content
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n\s*\n/);

  let namesSection = false;

  return paragraphs.map((paragraph, index) => {
    const lines = paragraph
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const text = lines.join(" ");
    const formatted = formatInline(text);

    // Location and date
    if (index === 0) {
      return `
        <p style="
          margin:0 0 34px;
          text-align:right;
          font-size:13px;
          font-style:italic;
          color:#777365;
        ">${formatted}</p>
      `;
    }

    // The memorial record at the end of some letters
    if (/^\*\*Names:\*\*/i.test(text)) {
      namesSection = true;
    }

    if (namesSection) {
      return `
        <div style="
          border-left:2px solid #898b75;
          padding:12px 18px;
          margin:26px 0;
          background-color:#f0eee5;
          color:#56584c;
          font-size:14px;
          line-height:1.8;
        ">
          ${lines.map(formatInline).join("<br>")}
        </div>
      `;
    }

    // Standard correspondence
    return `
      <p style="
        margin:0 0 22px;
        line-height:1.8;
      ">${formatted}</p>
    `;
  }).join("");
}

function deniseTemplate(content) {
  const letter = formatDenise(content);


  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Denise's Diary</title>
</head>

<body style="margin:0;padding:0;background-color:#e8e4ee;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#e8e4ee;">
    <tr>
      <td align="center" style="padding:28px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background-color:#fffdfb;
                 border:1px solid #c9bfd8;">

          <!-- 1980s floral stationery header -->
          <tr>
            <td align="center" style="padding:36px 20px 8px;">

              <div style="
                font-family:Georgia,serif;
                font-size:29px;
                line-height:1.5;
                letter-spacing:7px;
                color:#8e86ba;
              ">
                ✿ ❀ ✿
              </div>

              <div style="
                font-family:Georgia,serif;
                font-size:11px;
                letter-spacing:3px;
                color:#7d85ac;
                margin-top:8px;
              ">
                ~ ~ ~
              </div>

            </td>
          </tr>

          <!-- Soft lavender separator -->
          <tr>
            <td style="padding:12px 44px 0;">
              <div style="
                border-top:1px solid #d8cce5;
              "></div>
            </td>
          </tr>

          <!-- Diary entry -->
          <tr>
            <td style="
              padding:34px 38px 42px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:16px;
              line-height:1.85;
              color:#414458;
            ">
              ${letter}
            </td>
          </tr>

          <!-- UNSEALED archive signature -->
          <tr>
            <td align="center" style="padding:0 30px 34px;">

              <div style="
                border-top:1px solid #d8cce5;
                margin-bottom:22px;
              "></div>

              <div style="
                font-family:Georgia,serif;
                font-size:9px;
                letter-spacing:2px;
                color:#9993a9;
              ">
                FROM THE ARCHIVE OF
              </div>

              <div style="
                font-family:Georgia,serif;
                font-size:15px;
                letter-spacing:5px;
                color:#77718b;
                margin-top:8px;
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
;
}

module.exports = deniseTemplate;
