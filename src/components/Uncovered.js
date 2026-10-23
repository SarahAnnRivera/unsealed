
import "./Uncovered.css";

const upcomingStories = [
  {
    id: "starlet",
    era: "HOLLYWOOD · 1940s",
    title: "The Starlet",
    teaser: "A rising star. A suspicious death. A story the tabloids never finished.",
    image: "/starlet.png",
  },
  {
    id: "pirate",
    era: "THE CARIBBEAN · 1700s",
    title: "The Pirate",
    teaser: "A young life caught between freedom, fortune, and the open sea.",
    image: "/pirate.png",
  },
  {
    id: "egypt",
    era: "ANCIENT EGYPT",
    title: "The Boy in the Tomb",
    teaser: "An unlikely burial. A forgotten boy. A mystery beneath the sand.",
    image: "/egypt.png",
    releaseDate: "OCTOBER 23",
  },
];

export default function Uncovered() {
  return (
    <section className="uncovered" id="uncovered">
      <div className="uncovered__header">
        <span className="uncovered__eyebrow">
          THE UNSEALED ARCHIVE · FORTHCOMING
        </span>
        <h2>Next to be Uncovered</h2>
        <p>Some stories have waited centuries to be found.</p>
      </div>

      <div className="uncovered__grid">
        {upcomingStories.map((story) => (
          <article className="uncovered__card" key={story.id}>
            <div className="uncovered__image">
              <img src={story.image} alt="" />

              {story.releaseDate && (
                <div className="uncovered__overlay">
                  <span>ARCHIVE COMPILED</span>
                  <strong>RELEASE DATE · {story.releaseDate}</strong>
                </div>
              )}
            </div>

            <div className="uncovered__info">
              <span>{story.era}</span>
              <h3>{story.title}</h3>
              <p>{story.teaser}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}