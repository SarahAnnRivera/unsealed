
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
  <title>Private Correspondence</title>
</head>

<body style="margin:0;padding:0;background-color:#e9e0d1;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
    style="background-color:#e9e0d1;">
    <tr>
      <td align="center" style="padding:30px 12px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px;background-color:#fffcf4;
                 border:1px solid #cbb998;">

          <!-- Violet's personal stationery seal -->
          <tr>
            <td align="center" style="padding:42px 24px 18px;">

              <div style="
                width:76px;
                height:76px;
                line-height:76px;
                border:2px double #783f50;
                border-radius:50%;
                font-family:Georgia,'Times New Roman',serif;
                font-size:44px;
                font-style:italic;
                color:#783f50;
                text-align:center;
              ">
                V
              </div>

              <div style="
                margin-top:18px;
                font-family:Georgia,serif;
                font-size:10px;
                letter-spacing:4px;
                color:#9a8060;
              ">
                PRIVATE CORRESPONDENCE
              </div>

            </td>
          </tr>

          <!-- Gold stationery rule -->
          <tr>
            <td style="padding:6px 42px 0;">
              <div style="border-top:1px solid #c9af83;"></div>
            </td>
          </tr>

          <!-- Violet's letter -->
          <tr>
            <td style="
              padding:40px 38px 46px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:17px;
              line-height:1.9;
              color:#3c302e;
            ">
              ${letter}
            </td>
          </tr>

          <!-- Archive signature -->
          <tr>
            <td align="center" style="padding:0 30px 38px;">

              <div style="
                border-top:1px solid #c9af83;
                margin-bottom:24px;
              "></div>

              <div style="
                font-family:Georgia,serif;
                font-size:9px;
                letter-spacing:2px;
                color:#a28d79;
              ">
                FROM THE ARCHIVE OF
              </div>

              <div style="
                font-family:Georgia,serif;
                font-size:15px;
                letter-spacing:5px;
                color:#783f50;
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

}

module.exports = violetTemplate;
