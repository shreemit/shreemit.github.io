import { gsap, isMobile, reducedMotion } from "./motion";

export const mouse = { x: 0, y: 0, nx: 0, ny: 0 };

export function initCursor(): void {
  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ny = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  if (isMobile || reducedMotion) return;

  const dot = document.getElementById("cursor")!;
  const ring = document.getElementById("cursor-ring")!;

  const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
  const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
  const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
  const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

  window.addEventListener("pointermove", (e) => {
    dotX(e.clientX);
    dotY(e.clientY);
    ringX(e.clientX);
    ringY(e.clientY);
  });

  // grow ring over interactive elements (delegated, survives dynamic DOM)
  document.addEventListener("pointerover", (e) => {
    if ((e.target as HTMLElement).closest("[data-hover], a, button")) {
      ring.classList.add("is-hover");
    }
  });
  document.addEventListener("pointerout", (e) => {
    if ((e.target as HTMLElement).closest("[data-hover], a, button")) {
      ring.classList.remove("is-hover");
    }
  });
}

/** Magnetic pull toward the cursor for elements with .magnetic */
export function initMagnetic(): void {
  if (isMobile || reducedMotion) return;

  document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      xTo(relX * 0.4);
      yTo(relY * 0.4);
    });

    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
    });
  });
}
