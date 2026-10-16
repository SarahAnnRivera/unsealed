import "./App.css";
import { useEffect } from "react";
import { stories } from "./data/stories";
import StoryCard from "./components/StoryCard";
import Uncovered from "./components/Uncovered";

function App() {

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("story");

  if (!storyId || !["charles", "denise"].includes(storyId)) return;

  const target = document.getElementById(`story-${storyId}`);

  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }
}, []);
  

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
  <div key={story.id} id={`story-${story.id}`}>
    <StoryCard story={story} />
  </div>
))}

<Uncovered />


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
