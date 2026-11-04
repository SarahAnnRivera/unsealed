
import PurchaseButtons from "./PurchaseButtons";
import FreeFollow from "./FreeFollow";

function StoryCard({ story }) {

  
const sampleFiles = {
  violet: "/UNSEALED_Violet_StyledLetter1.pdf",
  charles: "/UNSEALED_Charles_StyledPage10.pdf",
  denise: "/UNSEALED_Denise_StyledPage5-6.pdf",
};



  return (
    <div
      className={
        story.reverse
          ? "archive-card archive-card--reverse"
          : "archive-card"
      }
    >
      <div className="archive-card__image">
        <img src={story.image} alt={story.imageAlt} />
      </div>
      <div className="archive-card__content">
  <div className="archive-card__meta">
    <span>{story.archive}</span>
    <span>{story.location}</span>
    <span>{story.year}</span>
  </div>

  <h3>{story.title}</h3>

  <p className="archive-card__excerpt">
    {story.excerpt}
  </p>

  <p className="archive-card__synopsis">
    {story.synopsis}
  </p>
  <div className="archive-card__details">
  <span>{story.genre}</span>
  <span>{story.rating}</span>
  <span>{story.entryCount} {story.entryType}</span>
</div>


{sampleFiles[story.id] && (
  <div className="archive-card__sample">
    <a
      href={sampleFiles[story.id]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {story.id === "violet"
        ? "See the First Letter"
        : "Read an Excerpt"}
    </a>
  </div>
)}


{story.free ? (
  <FreeFollow story={story} />
) : (
  <PurchaseButtons story={story} />
)}

</div>
    </div>
  );
}

export default StoryCard;
 