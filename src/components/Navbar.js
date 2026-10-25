

import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const id = decodeURIComponent(location.hash.slice(1));

    const scrollToSection = () => {
      const target = document.getElementById(id);
      if (!target) return;

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    requestAnimationFrame(scrollToSection);
  }, [location.pathname, location.hash, location.key]);

  return (
    <header className="site-navbar">
      <nav className="site-navbar__inner" aria-label="Main navigation">
        <Link
  className="site-navbar__brand"
  to="/"
  onClick={() => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (location.pathname === "/" && !location.hash) {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
    }
  }}
>
          UNSEALED
        </Link>

        <div className="site-navbar__links">
          <Link to="/#archives">Archives</Link>
          <Link to="/#uncovered">Upcoming</Link>
          <Link to="/#margins">The Margins</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
          {/* <Link to="/blog">Blog</Link> */}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

