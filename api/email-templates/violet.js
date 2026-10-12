
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}



function formatLetter(content) {
  const normalized = content.replace(/\r\n/g, "\n").trim();

  const paragraphs = normalized.split(/\n\s*\n/);

  return paragraphs
    .map((paragraph, index) => {
      const cleanText = paragraph
        .split("\n")
        .map((line) => line.trim())
        .join(" ");

      const formatted = escapeHtml(cleanText)
        .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

      // First paragraph: location and date
      if (index === 0) {
        return `
          <p style="
            margin:0 0 32px;
            text-align:right;
            font-size:13px;
            line-height:1.6;
            color:#77675b;
            font-style:italic;
          ">${formatted}</p>
        `;
      }

      // Final paragraph: Violet's signature
      if (
        index === paragraphs.length - 1 &&
        /Violet/i.test(cleanText)
      ) {
        return `
          <p style="
            margin:28px 0 12px;
            text-align:right;
            font-family:Georgia,'Times New Roman',serif;
            font-size:19px;
            line-height:1.7;
            font-style:italic;
            color:#713c49;
          ">${formatted}</p>
        `;
      }

      // All other paragraphs
      return `
        <p style="
          margin:0 0 22px;
          line-height:1.8;
        ">${formatted}</p>
      `;
    })
    .join("");
}



function violetTemplate(content) {
  const letter = formatLetter(content);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UNSEALED — Private Correspondence</title>
</head>

<body style="margin:0;padding:0;background-color:#eae2d5;">

  <table role="presentation" cellpadding="0" cellspacing="0"
    width="100%" style="background-color:#eae2d5;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <table role="presentation" cellpadding="0" cellspacing="0"
          width="100%" style="max-width:600px;background-color:#fbf6eb;
          border:1px solid #d3c1a3;">

          <tr>
            <td style="padding:45px 36px 20px;text-align:center;">
              <div style="font-family:Georgia,serif;font-size:18px;
                letter-spacing:6px;color:#713c49;">
                UNSEALED
              </div>

              <div style="font-family:Georgia,serif;font-size:11px;
                letter-spacing:2px;color:#8c7665;margin-top:12px;">
                PRIVATE CORRESPONDENCE
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 36px;">
              <div style="border-top:1px solid #d3c1a3;"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:36px;color:#40372f;
              font-family:Georgia,'Times New Roman',serif;
              font-size:15px;line-height:1.8;">
              ${letter}
            </td>
          </tr>

          <tr>
            <td style="padding:12px 36px 36px;text-align:center;">
              <div style="border-top:1px solid #d3c1a3;
                margin-bottom:20px;"></div>

              <div style="font-family:Georgia,serif;font-size:10px;
                letter-spacing:2px;color:#8c7665;">
                FROM THE UNSEALED ARCHIVE
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

module.exports = violetTemplate;
