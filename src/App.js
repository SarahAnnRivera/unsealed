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
  storyId: "violet",
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

          <button
  className="hero__button"
  onClick={() =>
    document.getElementById("archives")?.scrollIntoView({
      behavior: "smooth",
    })
  }
>
  Explore the Archives
</button>
        </div>
      </section>
      <section id="archives" className="collection">
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

        
{stories.map((story) => (
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
