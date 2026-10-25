import "../styles/main.css";
import "../styles/blog.css";
import { initMobileNav } from "../core/nav";

initMobileNav();

// Same Seattle clock as the homepage footer, without pulling the portfolio renderer.
const footerTime = document.getElementById("footer-time");
if (footerTime) {
  const fmt = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Los_Angeles",
    });
  const paint = () => {
    footerTime.textContent = fmt();
  };
  paint();
  window.setInterval(paint, 30_000);
}
