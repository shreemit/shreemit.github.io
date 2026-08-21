import {
  gsap,
  ScrollTrigger,
  SplitText,
  SCRAMBLE_CHARS,
} from "../core/motion";
import { setImageRevealProgress } from "../webgl/imageReveal";

/** Hero entrance, played after the preloader wipe. */
export function buildHeroIntro(): gsap.core.Timeline {
  const split = new SplitText(".hero-line", { type: "chars" });

  const tl = gsap.timeline({
    paused: true,
    onComplete: () => {
      // restore clean DOM text and clear inline tween styles
      split.revert();
      gsap.set(
        [
          "#hero-kicker",
          "#hero-role",
          "#hero-proof",
          "#hero-tagline",
          "#hero-ctas",
          "#nav",
          "#hero-scrollhint",
        ],
        { clearProps: "all" }
      );
    },
  });
  tl.from(split.chars, {
      yPercent: 130,
      rotation: 6,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.028,
      immediateRender: true,
    })
    .from(
      "#hero-kicker",
      {
        autoAlpha: 0,
        x: -24,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: true,
      },
      "-=0.7"
    )
    .from(
      ["#hero-role", "#hero-proof", "#hero-tagline"],
      {
        autoAlpha: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        immediateRender: true,
      },
      "-=0.5"
    )
    .from(
      "#hero-ctas",
      {
        autoAlpha: 0,
        y: 16,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: true,
      },
      "-=0.4"
    )
    .from(
      "#nav",
      {
        y: -72,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        immediateRender: true,
      },
      "-=0.5"
    )
    .from(
      "#hero-scrollhint",
      { autoAlpha: 0, duration: 0.6, immediateRender: true },
      "-=0.3"
    );

  // idle bounce on the scroll arrow
  gsap.to(".hero-scrollhint-arrow", {
    y: 6,
    repeat: -1,
    yoyo: true,
    duration: 0.7,
    ease: "power1.inOut",
  });

  return tl;
}

/** Hero parallax-out while scrolling away (particles dissolve in webgl). */
export function initHeroScroll(): void {
  gsap.to(".hero-inner", {
    yPercent: -22,
    autoAlpha: 0.15,
    ease: "none",
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });
}

/** About: pinned word scrub on desktop; unpinned scrub on mobile. */
export function initAbout(): void {
  new SplitText(".about-line", { type: "words", wordsClass: "word" });

  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: "#about-pin",
          start: "top top",
          end: "+=140%",
          pin: true,
          scrub: 0.6,
        },
      })
      .to(".about-line .word", { opacity: 1, stagger: 0.05, ease: "none" });
  });

  mm.add("(max-width: 900px)", () => {
    // No pin — section is taller than the viewport; scrub words as it scrolls through
    gsap.to(".about-line .word", {
      opacity: 1,
      stagger: 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: "#about",
        start: "top 75%",
        end: "bottom 45%",
        scrub: 0.6,
      },
    });
  });

  gsap.from(".about-media-caption", {
    autoAlpha: 0,
    duration: 0.8,
    delay: 0.6,
    scrollTrigger: { trigger: "#about", start: "top 65%" },
  });
}

/** Experience timeline: skewed card reveals + parallax outline years. */
export function initExperience(): void {
  gsap.utils.toArray<HTMLElement>(".xp-item").forEach((item) => {
    const card = item.querySelector(".xp-card");
    const year = item.querySelector(".xp-year");

    gsap.from(card, {
      y: 90,
      autoAlpha: 0,
      skewY: 3,
      duration: 1,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: { trigger: item, start: "top 80%" },
    });

    gsap.fromTo(
      year,
      { yPercent: 30 },
      {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  gsap.from(".experience-head .section-title", {
    yPercent: 60,
    autoAlpha: 0,
    duration: 1,
    ease: "power4.out",
    immediateRender: false,
    scrollTrigger: { trigger: "#experience", start: "top 70%" },
  });

  gsap.from(".edu-card", {
    y: 60,
    autoAlpha: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: { trigger: "#education", start: "top 80%" },
  });
}

/** Scroll-scrubbed image reveal for the about portrait. */
export function initImageReveals(): void {
  const portrait = document.getElementById("portrait-frame");
  if (portrait) {
    gsap.fromTo(
      portrait,
      {
        y: 48,
        scale: 1.06,
        clipPath: "inset(12% 8% 12% 8%)",
      },
      {
        y: 0,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: "#about",
          start: "top 75%",
          end: "top 25%",
          scrub: 0.8,
          onUpdate: (self) => setImageRevealProgress(portrait, self.progress),
        },
      }
    );
  }
}

/** Typographic project list: stagger-in rows on enter. */
export function initProjects(): void {
  gsap.from(".projects-head .section-title", {
    yPercent: 40,
    autoAlpha: 0,
    duration: 1,
    ease: "power4.out",
    immediateRender: false,
    scrollTrigger: { trigger: "#projects", start: "top 75%" },
  });

  gsap.from(".proj-row", {
    y: 40,
    autoAlpha: 0,
    stagger: 0.08,
    duration: 0.8,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: { trigger: "#projects", start: "top 70%" },
  });
}

/** Skills chips: scramble-in on scroll, scramble + magnetic on hover. */
export function initSkills(): void {
  gsap.from(".skills-title", {
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    immediateRender: false,
    scrollTrigger: { trigger: "#skills", start: "top 80%" },
  });

  gsap.from(".skill-group", {
    y: 28,
    autoAlpha: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.12,
    immediateRender: false,
    scrollTrigger: { trigger: "#skills", start: "top 78%" },
  });

  document.querySelectorAll<HTMLElement>(".skill-chip").forEach((chip, i) => {
    const original = chip.textContent ?? "";
    gsap.from(chip, {
      autoAlpha: 0,
      y: 16,
      duration: 0.55,
      delay: 0.05 * (i % 6),
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: { trigger: "#skills", start: "top 75%" },
      onStart: () => {
        gsap.to(chip, {
          duration: 0.55,
          scrambleText: {
            text: original,
            chars: SCRAMBLE_CHARS,
            speed: 1.4,
          },
        });
      },
    });

    chip.addEventListener("pointerenter", () => {
      gsap.to(chip, {
        duration: 0.55,
        scrambleText: {
          text: original,
          chars: SCRAMBLE_CHARS,
          speed: 1.3,
        },
      });
    });
  });
}

/** Contact: giant reveal + scramble hover on links. */
export function initContact(): void {
  const split = new SplitText(".contact-line", { type: "chars" });

  gsap.from(split.chars, {
    yPercent: 120,
    duration: 1,
    ease: "power4.out",
    stagger: 0.04,
    scrollTrigger: { trigger: "#contact", start: "top 65%" },
  });

  gsap.from(["#contact-kicker", ".contact-links a"], {
    autoAlpha: 0,
    y: 24,
    duration: 0.8,
    stagger: 0.07,
    ease: "power3.out",
    scrollTrigger: { trigger: "#contact", start: "top 60%" },
  });

  document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
    const original = el.textContent ?? "";
    el.addEventListener("pointerenter", () => {
      gsap.to(el, {
        duration: 0.7,
        scrambleText: {
          text: original,
          chars: SCRAMBLE_CHARS,
          speed: 1.2,
        },
      });
    });
  });
}

/** Recalculate everything once layout settles (fonts, images). */
export function refreshTriggers(): void {
  ScrollTrigger.refresh();
}
