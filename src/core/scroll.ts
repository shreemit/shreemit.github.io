import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "./motion";

export let lenis: Lenis | null = null;

/** Latest smooth-scroll velocity, consumed by WebGL shaders. */
export const scrollState = { velocity: 0, progress: 0 };

export function initScroll(): void {
  if (!reducedMotion) {
    lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && lenis && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis?.scroll ?? window.scrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    lenis.on("scroll", (e: { velocity: number }) => {
      scrollState.velocity = e.velocity;
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      lenis!.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());

  // global scroll progress bar
  const bar = document.getElementById("progress-bar")!;
  ScrollTrigger.create({
    start: 0,
    end: () => document.documentElement.scrollHeight - window.innerHeight,
    onUpdate: (self) => {
      scrollState.progress = self.progress;
      gsap.set(bar, { scaleX: self.progress });
    },
  });

  // anchor navigation
  document.querySelectorAll<HTMLAnchorElement>("[data-scrollto]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = a.dataset.scrollto!;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.6 });
      } else {
        (el as HTMLElement).scrollIntoView({ behavior: "auto" });
      }
    });
  });
}
