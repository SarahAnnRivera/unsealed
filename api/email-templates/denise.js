
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
  <title>UNSEALED — Archive 002</title>
</head>

<body style="margin:0;padding:0;background-color:#dcdcd3;">

<table role="presentation" width="100%"
  cellpadding="0" cellspacing="0"
  style="background-color:#dcdcd3;">
  <tr>
    <td align="center" style="padding:30px 12px;">

      <table role="presentation" width="100%"
        cellpadding="0" cellspacing="0"
        style="max-width:600px;background-color:#f6f3e9;
        border:1px solid #b7b6a7;">

        <tr>
          <td style="padding:38px 30px 18px;text-align:center;">

            <div style="
              font-family:Georgia,serif;
              font-size:17px;
              letter-spacing:5px;
              color:#4d5448;
            ">
              UNSEALED
            </div>

            <div style="
              font-family:Georgia,serif;
              font-size:10px;
              letter-spacing:2px;
              color:#858476;
              margin-top:12px;
            ">
              ARCHIVE 002 · PRIVATE CORRESPONDENCE
            </div>

          </td>
        </tr>

        <tr>
          <td style="padding:0 30px;">
            <div style="border-top:1px solid #b7b6a7;"></div>
          </td>
        </tr>

        <tr>
          <td style="
            padding:35px 30px;
            font-family:Georgia,'Times New Roman',serif;
            font-size:15px;
            line-height:1.8;
            color:#34382f;
          ">
            ${letter}
          </td>
        </tr>

        <tr>
          <td style="padding:12px 30px 34px;text-align:center;">

            <div style="
              border-top:1px solid #b7b6a7;
              margin-bottom:20px;
            "></div>

            <div style="
              font-family:Georgia,serif;
              font-size:10px;
              letter-spacing:2px;
              color:#858476;
            ">
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

module.exports = deniseTemplate;
