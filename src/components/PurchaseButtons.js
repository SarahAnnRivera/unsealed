function PurchaseButtons({ story }) {
  return (
    <div className="archive-card__actions">
      <button>Follow · ${story.followPrice}</button>
      <button>Unseal everything · ${story.bingePrice}</button>
    </div>
  );
}

export default PurchaseButtons;