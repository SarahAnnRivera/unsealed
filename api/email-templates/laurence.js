
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInline(value = "") {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}

function formatLaurence(content = "") {
  const lines = String(content).replace(/\r\n?/g, "\n").trim().split("\n");
  const output = [];
  let paragraph = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;

    output.push(
      `<p style="margin:0 0 18px;line-height:1.8;">${formatInline(text)}</p>`
    );
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const speaker = line.match(/^([A-Z][A-Z .'-]{1,35}):\s*(.*)$/);
    const cue = /^\[.*\]$/.test(line);

    const heading =
      /^(?:Artifact\s+\d+|Tape\s+\d+.*|(?:Field|Council|Inspection|Inventory|Addendum|Laboratory|Memorandum|Transcript|Record|Report)\b.*)$/i.test(line);

    const field = line.match(
      /^([A-Za-z][A-Za-z /().-]{1,35})\s*\|\s*(.+)$/
    );

    if (speaker || cue || heading || field) {
      flushParagraph();
    }

    if (speaker) {
      output.push(`
        <p style="margin:0 0 15px;line-height:1.75;">
          <strong style="color:#504737;letter-spacing:.03em;">
            ${escapeHtml(speaker[1])}:
          </strong>
          ${formatInline(speaker[2])}
        </p>
      `);
    } else if (cue) {
      output.push(`
        <p style="
          margin:12px 0 18px;
          color:#857865;
          font-size:14px;
          font-style:italic;
          line-height:1.65;
        ">
          ${formatInline(line)}
        </p>
      `);
    } else if (heading) {
      output.push(`
        <div style="
          margin:28px 0 14px;
          padding:10px 0;
          border-top:1px solid #c7bba4;
          border-bottom:1px solid #c7bba4;
          font-family:'Courier New',monospace;
          font-size:12px;
          letter-spacing:.08em;
          color:#645944;
        ">
          ${formatInline(line)}
        </div>
      `);
    } else if (field) {
      output.push(`
        <div style="
          padding:7px 12px;
          border-left:2px solid #b5a588;
          background:#f1ede3;
          font-size:14px;
          line-height:1.6;
        ">
          <strong>${escapeHtml(field[1])}:</strong>
          ${formatInline(field[2])}
        </div>
      `);
    } else {
      paragraph.push(line);
    }
  }

  flushParagraph();
  return output.join("\n");
}

function laurenceTemplate(content, entryNumber = 1) {
  const record = formatLaurence(content);
  const recordNumber = String(entryNumber).padStart(3, "0");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UNSEALED · Laurence · Expedition Record</title>
</head>

<body style="margin:0;padding:0;background:#dcd6c8;">

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background:#dcd6c8;"
  >
    <tr>
      <td align="center" style="padding:26px 12px;">

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background:#fbf8f0;
            border:1px solid #b5a88e;
          "
        >

          <!-- ARCHIVE HEADER -->
          <tr>
            <td style="
              padding:34px 30px 26px;
              text-align:center;
              border-bottom:1px solid #c7bba4;
            ">

              <div style="
                font-family:'Courier New',monospace;
                font-size:10px;
                letter-spacing:2px;
                color:#887b65;
              ">
                RECOVERED EXPEDITION MATERIAL · 1996
              </div>

              <div style="
                font-family:Georgia,'Times New Roman',serif;
                font-size:30px;
                letter-spacing:4px;
                color:#39352e;
                margin:15px 0 8px;
              ">
                LAURENCE
              </div>

              <div style="
                font-family:'Courier New',monospace;
                font-size:11px;
                letter-spacing:1.5px;
                color:#7a6d59;
              ">
                SAQQARA · FIELD ARCHIVE 004
              </div>

              <div style="
  font-family:'Courier New',monospace;
  font-size:12px;
  letter-spacing:2px;
  color:#645944;
  margin-top:18px;
">
  EXPEDITION RECORD · ${recordNumber}
</div>

            </td>
          </tr>

          <!-- TRANSCRIPT AND FIELD NOTES -->
          <tr>
            <td style="
              padding:34px 34px 38px;
              font-family:Georgia,'Times New Roman',serif;
              font-size:16px;
              line-height:1.8;
              color:#39352e;
            ">
              ${record}
            </td>
          </tr>

          <!-- UNSEALED SIGNATURE -->
          <tr>
            <td style="
              padding:0 30px 32px;
              text-align:center;
            ">

              <div style="
                border-top:1px solid #c7bba4;
                margin-bottom:20px;
              "></div>

              <div style="
                font-family:'Courier New',monospace;
                font-size:10px;
                letter-spacing:2px;
                color:#938570;
              ">
                FROM THE ARCHIVE OF
              </div>

              <div style="
                font-family:Georgia,'Times New Roman',serif;
                font-size:17px;
                letter-spacing:5px;
                color:#625845;
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

module.exports = laurenceTemplate;
