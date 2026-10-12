import PurchaseButtons from "./PurchaseButtons";

function StoryCard({ story }) {
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

        <div className={`archive-mark ${story.markClass}`}>
          <span>{story.markTop}</span>
          <strong>{story.markBottom}</strong>
        </div>
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

<PurchaseButtons story={story} />
</div>
    </div>
  );
}

export default StoryCard;
 