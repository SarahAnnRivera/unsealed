import "./App.css";
import React, { useState } from "react";
import { stories } from "./data/stories";
import StoryCard from "./components/StoryCard";

function App() {
  const [email, setEmail] = useState("");
  const [showVioletSignup, setShowVioletSignup] = useState(false);
  const [violetSent, setVioletSent] = useState(false);
  const [violetError, setVioletError] = useState("");

  const handleVioletSignup = async () => {
    if (!email || !email.includes("@")) {
      setVioletError("Please enter a valid email address.");
      return;
    }
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (response.ok) {
      setVioletError("");
      setVioletSent(true);
    } else {
      setVioletError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="app">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__archive">AN ARCHIVE OF PRIVATE LIVES</span>

          <h1>UNSEALED</h1>

          <p className="hero__tagline">
            Some correspondence was never meant for you.
          </p>

          <p className="hero__description">
            Discover private letters, diaries, and forgotten records from lives
            lived inside real history.
          </p>

          <button className="hero__button">Unseal the first archive</button>
        </div>
      </section>
      <section className="collection">
        <div className="collection__header">
          <span>THE COLLECTION</span>
          <h2>
            Recovered stories.
            <br />
            Lives left behind.
          </h2>

          <p>
            Each archive contains a fictional story told through the documents
            its characters left behind.
          </p>
        </div>
        <div className="archive-card">
          <div className="archive-card__image">
            <img src="/violetUNSEALED.png" alt="Violet" />

            <div className="archive-mark archive-mark--violet">
              <span>Yours,</span>
              <strong>Violet</strong>
            </div>
          </div>

          <div className="archive-card__content">
            <div className="archive-card__meta">
              <span>ARCHIVE 001</span>
              <span>NEWPORT, RHODE ISLAND</span>
              <span>1895</span>
            </div>

            <h3>{stories[0].title}</h3>

            <p className="archive-card__excerpt">
              “Sarah, you will simply die when I tell you who asked me to
              dance...”
            </p>

            <p className="archive-card__synopsis">
              Seventeen-year-old Violet has waited an extra year to enter
              Newport society. Now one of the season's most desirable men has
              noticed her, her family's fortunes are beginning to crack, and
              everyone is watching.
            </p>

            <div className="archive-card__details">
              <span>Historical Romance</span>
              <span>PG</span>
              <span>16 Letters</span>
            </div>

            {violetSent ? (
              <div className="archive-success">
                <span className="archive-success-label">ARCHIVE UNSEALED</span>

                <p className="archive-discovery">
                  Discovered in the back of an antique shop, an old French
                  writing desk held a drawer no one had been able to open.
                </p>

                <p className="archive-discovery-emphasis">Until you did.</p>

                <p className="archive-discovery">
                  Inside: sixteen letters, tied together and untouched for more
                  than a century.
                </p>

                <span className="archive-on-its-way">
                  THE FIRST IS ON ITS WAY
                </span>
              </div>
            ) : !showVioletSignup ? (
              <button onClick={() => setShowVioletSignup(true)}>
                FOLLOW FREE
              </button>
            ) : (
              <div className="archive-signup">
                <input
                  className="archive-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL ADDRESS"
                />

                {violetError && <p className="archive-error">{violetError}</p>}

                <button onClick={handleVioletSignup}>UNSEAL LETTER 001</button>
              </div>
            )}
          </div>
        </div>

        {stories.slice(1).map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </section>
      <section className="experience">
        <div className="experience__header">
          <span>HOW IT WORKS</span>
          <h2>Some stories are meant to take time.</h2>
        </div>

        <div className="experience__steps">
          <div className="experience__step">
            <span>01</span>
            <h3>Choose an archive.</h3>
            <p>
              Discover a life through the letters, diaries, and records they
              left behind.
            </p>
          </div>

          <div className="experience__step">
            <span>02</span>
            <h3>Let it unfold.</h3>
            <p>
              Follow the archive as new documents arrive over time. Some
              correspondence arrives when you least expect it.
            </p>
          </div>

          <div className="experience__step">
            <span>03</span>
            <h3>Or don't wait.</h3>
            <p>
              Unlock a complete archive and discover the entire story right now.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
