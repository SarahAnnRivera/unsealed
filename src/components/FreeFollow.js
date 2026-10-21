
import { useState } from "react";

function FreeFollow({ story }) {
  const [email, setEmail] = useState("");
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupSent, setSignupSent] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [bingeOpen, setBingeOpen] = useState(false);
const [bingeEmail, setBingeEmail] = useState("");

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

  const handleBingeCheckout = async () => {
  const customerEmail = bingeEmail.trim();

if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
  alert("Please enter a valid email address.");
  return;
}

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: customerEmail.trim(),
        storyId: story.id,
        plan: "bingefree",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Checkout failed");
    }

    if (!data.url) {
      throw new Error("Stripe checkout URL was not returned");
    }

    window.location.assign(data.url);
  } catch (error) {
    console.error("Binge checkout error:", error);
    alert(error.message);
  }
};

  return (
    <>
      {signupSent ? (
        <div className="archive-success">
          <span className="archive-success-label">
            ARCHIVE UNSEALED
          </span>

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
      )}
  <div className="archive-card__actions" style={{ display: "block" }}>
  {!bingeOpen ? (
    <button
      type="button"
      style={{ width: "100%" }}
      onClick={() => setBingeOpen(true)}
    >
      UNSEAL EVERYTHING · $2.99
    </button>
  ) : (
    <div className="archive-signup">
      <input
        className="archive-email-input"
        type="email"
        value={bingeEmail}
        onChange={(e) => setBingeEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address for complete collection"
      />

      <button type="button" onClick={handleBingeCheckout}>
        CONTINUE TO CHECKOUT
      </button>

      <button type="button" onClick={() => setBingeOpen(false)}>
        BACK
      </button>
    </div>
  )}
</div>
    </>
  );
}

export default FreeFollow;
