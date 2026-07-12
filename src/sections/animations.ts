import {
  gsap,
  ScrollTrigger,
  SplitText,
  SCRAMBLE_CHARS,
} from "../core/motion";
import { scrollState } from "../core/scroll";
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
        ["#hero-kicker", "#hero-role", "#hero-tagline", "#nav", "#hero-scrollhint"],
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
    })
    .from(
      "#hero-kicker",
      { autoAlpha: 0, x: -24, duration: 0.6, ease: "power3.out" },
      "-=0.7"
    )
    .from(
      ["#hero-role", "#hero-tagline"],
      { autoAlpha: 0, y: 24, duration: 0.7, ease: "power3.out", stagger: 0.08 },
      "-=0.5"
    )
    .from(
      "#nav",
      { y: -72, autoAlpha: 0, duration: 0.7, ease: "power3.out" },
      "-=0.5"
    )
    .from(
      "#hero-scrollhint",
      { autoAlpha: 0, duration: 0.6 },
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

/** Pinned about section: bio scrubbed in word by word, portrait wipe-in. */
export function initAbout(): void {
  new SplitText(".about-line", { type: "words", wordsClass: "word" });

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
    scrollTrigger: { trigger: "#experience", start: "top 70%" },
  });

  gsap.from(".edu-card", {
    y: 60,
    autoAlpha: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: "#education", start: "top 80%" },
  });
}

/** Scroll-scrubbed image reveals for portrait + project thumbnails. */
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

  gsap.utils.toArray<HTMLElement>(".proj-media").forEach((media) => {
    gsap.from(media, {
      y: 60,
      scale: 1.05,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      onUpdate: function () {
        setImageRevealProgress(media, this.progress());
      },
      scrollTrigger: { trigger: media, start: "top 82%" },
    });

    const img = media.querySelector("img");
    if (img) {
      gsap.fromTo(
        img,
        { yPercent: 8 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: media.closest(".proj-card") ?? media,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  });
}

/** Horizontal-scroll projects: vertical scroll drives the track sideways. */
export function initProjects(): void {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px)", () => {
    const track = document.getElementById("projects-track")!;
    const amount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -amount(),
      ease: "none",
      scrollTrigger: {
        trigger: "#projects",
        start: "top top",
        end: () => `+=${amount()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // subtle velocity skew on the cards while flying through
    const proxy = { skew: 0 };
    const skewSetter = gsap.quickSetter(".proj-card", "skewX", "deg");
    const clamp = gsap.utils.clamp(-6, 6);
    gsap.ticker.add(() => {
      const target = clamp(scrollState.velocity * -0.18);
      proxy.skew += (target - proxy.skew) * 0.1;
      skewSetter(proxy.skew);
    });
  });

  mm.add("(max-width: 900px)", () => {
    gsap.utils.toArray<HTMLElement>(".proj-card").forEach((card) => {
      gsap.from(card, {
        y: 80,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 85%" },
      });
    });
  });
}

/** Skills bento grid: staggered scroll reveal. */
export function initSkills(): void {
  gsap.from(".skill-cell", {
    y: 40,
    autoAlpha: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.06,
    scrollTrigger: { trigger: "#skills", start: "top 75%" },
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
