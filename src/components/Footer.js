

import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span className="site-footer__brand">UNSEALED</span>

        <a href="mailto:contact@readunsealed.com">
          Contact Us
        </a>

        <span className="site-footer__copyright">
          © {new Date().getFullYear()} UNSEALED.
          All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;

