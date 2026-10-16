import { useState } from "react";
import PurchaseButtons from "./PurchaseButtons";

function StoryCard({ story }) {
  const [email, setEmail] = useState("");
const [signupOpen, setSignupOpen] = useState(false);
const [signupSent, setSignupSent] = useState(false);
const [signupError, setSignupError] = useState("");


const handleSignup = async () => {
  if (!email || !email.includes("@")) {
    setSignupError("Please enter a valid email address.");
    return;
  }

  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        storyId: story.id,
      }),
    });

    if (response.ok) {
      setSignupError("");
      setSignupSent(true);
    } else {
      setSignupError("Something went wrong. Please try again.");
    }
  } catch (error) {
    setSignupError("Something went wrong. Please try again.");
  }
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


{story.free ? (
  signupSent ? (
    <div className="archive-success">
      <span className="archive-success-label">ARCHIVE UNSEALED</span>
      {story.discovery?.map((paragraph, index) => (
  <p
    key={index}
    className={
      index === 1
        ? "archive-discovery-emphasis"
        : "archive-discovery"
    }
  >
    {paragraph}
  </p>
))}
      <span className="archive-on-its-way">
        THE FIRST IS ON ITS WAY
      </span>
    </div>
  ) : !signupOpen ? (
    <button onClick={() => setSignupOpen(true)}>
      FOLLOW FREE
    </button>
  ) : (
    <div className="archive-signup">
      <input
        className="archive-email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
      />

      {signupError && (
        <p className="archive-error">{signupError}</p>
      )}

      <button onClick={handleSignup}>
        UNSEAL LETTER 001
      </button>
    </div>
  )
) : (
  <PurchaseButtons story={story} />
)}

</div>
    </div>
  );
}

export default StoryCard;
 