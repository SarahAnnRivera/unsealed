import "./App.css";
import { useEffect } from "react";
import { stories } from "./data/stories";
import StoryCard from "./components/StoryCard";
import Uncovered from "./components/Uncovered";
import Margins from "./components/Margins";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Navbar from "./components/Navbar";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";


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
           <p>
           No coins. No subscriptions. Just stories worth opening.
          </p>

        </div>

        

{stories.map((story) => (
  <div key={story.id} id={`story-${story.id}`}>
    <StoryCard story={story} />
  </div>
))}

<Uncovered />

<div id="margins">
  <Margins />
</div>


      </section>
      <section id="how-it-works" className="experience">
        <div className="experience__header">
          <span>HOW IT WORKS</span>
          <h2>Some stories are meant to take time.</h2>
        </div>

        <div className="experience__steps">
        
<div className="experience__step">
  <span>01</span>
  <h3>Choose an archive.</h3>
  <p>
    Discover stories told through letters, diaries, and forgotten records.
    Each archive shows its reading options and prices upfront.
  </p>
</div>

<div className="experience__step">
  <span>02</span>
  <h3>Let it unfold.</h3>
  <p>
    Choose Follow to receive new documents by email over time.
    Selected shorter archives are free to follow; others have
    a one-time price. No subscriptions, no coins.
  </p>
</div>

<div className="experience__step">
  <span>03</span>
  <h3>Or don't wait.</h3>
  <p>
    Prefer the whole story at once? Choose Unseal Everything
    to receive the complete archive immediately for the
    listed one-time price.
  </p>
</div>

        </div>
      </section>
    </main>
  );
}

function SiteRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </>
  );
}

export default SiteRoutes;
