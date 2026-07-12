import { gsap, SCRAMBLE_CHARS, reducedMotion } from "./core/motion";

/**
 * Scramble-in the name while a counter runs 000 → 100, then wipe the
 * overlay away with a clip-path. Resolves when the wipe completes.
 */
export function runPreloader(): Promise<void> {
  const overlay = document.getElementById("preloader")!;
  const name = document.getElementById("preloader-name")!;
  const count = document.getElementById("preloader-count")!;

  if (reducedMotion) {
    overlay.remove();
    return Promise.resolve();
  }

  document.documentElement.style.overflow = "hidden";

  return new Promise((resolve) => {
    const counter = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.remove();
        document.documentElement.style.overflow = "";
        resolve();
      },
    });

    tl.to(name, {
      duration: 1.4,
      scrambleText: {
        text: "SHREEMIT",
        chars: SCRAMBLE_CHARS,
        revealDelay: 0.3,
        speed: 0.6,
      },
      ease: "none",
    })
      .to(
        counter,
        {
          value: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            count.textContent = String(Math.round(counter.value)).padStart(3, "0");
          },
        },
        0
      )
      .to(name, { color: "#ccff00", duration: 0.2 }, "-=0.2")
      .to(overlay, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.15,
      })
      .to(
        ".preloader-inner",
        { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" },
        "<"
      );
  });
}
