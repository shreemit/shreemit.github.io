/** Mobile drawer navigation + body scroll lock. */
export function initMobileNav(): void {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("nav-drawer");
  if (!toggle || !drawer) return;

  const links = drawer.querySelectorAll<HTMLAnchorElement>("a");

  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    setOpen(open);
  });

  links.forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // close if viewport grows past mobile breakpoint
  const mq = window.matchMedia("(min-width: 901px)");
  const onMq = () => {
    if (mq.matches) setOpen(false);
  };
  mq.addEventListener("change", onMq);
}
