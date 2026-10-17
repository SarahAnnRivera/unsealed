
import React from "react";
import "./Margins.css";

export default function Margins() {
  return (
    <section className="margins">
      <div className="margins__inner">
        <p className="margins__eyebrow">
          A READER-WRITTEN ARCHIVE
        </p>

        <h2>The Margins</h2>

        <p className="margins__tagline">
          The story ends. The possibilities don't.
        </p>

        <p className="margins__description">
          Continue the story. Rewrite the ending.
          Explore another perspective. Make it your own.
        </p>

        <div className="margins__actions">
          <a
            href="https://unsealedmargins.tumblr.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            READ THE MARGINS ↗
          </a>

          <a
            href="https://unsealedmargins.tumblr.com/submit"
            target="_blank"
            rel="noopener noreferrer"
          >
            SUBMIT YOUR STORY ↗
          </a>
        </div>

        <p className="margins__note">
          All interpretations welcome · Pen names encouraged ·
          Spoilers must be labeled
        </p>
      </div>
    </section>
  );
}
