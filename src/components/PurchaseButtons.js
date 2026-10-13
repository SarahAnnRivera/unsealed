import { useState } from "react";

function PurchaseButtons({ story }) {
  const [email, setEmail] = useState("");

  const handleCheckout = async (plan) => {
  if (!email.trim()) {
    alert("Please enter your email address first.");
    return;
  }

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        storyId: story.id,
        plan,
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
    console.error("Checkout error:", error);
    alert(error.message);
  }
};

  return (
    <div className="archive-card__actions">
      <input
  type="email"
  placeholder="Your email address"
  aria-label="Your email address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
      <button onClick={() => handleCheckout("follow")}>
  Follow · ${story.followPrice}
</button>

<button onClick={() => handleCheckout("binge")}>
  Unseal everything · ${story.bingePrice}
</button>
    </div>
  );
}

export default PurchaseButtons;