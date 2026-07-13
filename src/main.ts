import "./styles/main.css";

import { reducedMotion, isMobile } from "./core/motion";
import { initScroll } from "./core/scroll";
import { initCursor, initMagnetic } from "./core/cursor";
import { runPreloader } from "./preloader";
import { initMobileNav } from "./core/nav";
import {
  renderIdentity,
  renderAbout,
  renderExperience,
  renderProjects,
  renderSkills,
  renderFooterTime,
} from "./sections/render";
import {
  buildHeroIntro,
  initHeroScroll,
  initAbout,
  initExperience,
  initImageReveals,
  initProjects,
  initSkills,
  initContact,
  refreshTriggers,
} from "./sections/animations";

async function boot(): Promise<void> {
  // data-driven DOM first, so triggers measure the real layout
  renderIdentity();
  renderAbout();
  renderExperience();
  renderProjects();
  renderSkills();
  renderFooterTime();

  initCursor();
  initScroll();
  initMobileNav();

  // wait for fonts before splitting text, otherwise chars measure wrong
  await document.fonts.ready;

  if (reducedMotion) {
    // parallel experience: everything visible, no pins, no WebGL motion
    await runPreloader();
    initMagnetic();
    return;
  }

  initHeroScroll();
  initAbout();
  initExperience();
  initImageReveals();
  initProjects();
  initSkills();
  initContact();
  initMagnetic();

  // WebGL loads fire-and-forget: never blocks the intro
  (async () => {
    try {
      const [{ Stage }, { initParticles }, { attachImagePlane }] =
        await Promise.all([
          import("./webgl/stage"),
          import("./webgl/particles"),
          import("./webgl/imagePlane"),
        ]);
      const stage = new Stage(
        document.getElementById("webgl") as HTMLCanvasElement
      );
      initParticles(stage);
      if (!isMobile) {
        attachImagePlane(stage, document.getElementById("portrait-frame")!);
        document
          .querySelectorAll<HTMLElement>(".proj-media[data-distort]")
          .forEach((el) => attachImagePlane(stage, el));
      }
    } catch (err) {
      // WebGL unavailable: DOM images stay visible, site fully works
      console.warn("WebGL disabled:", err);
    }
  })();

  // apply from() start states while the overlay still covers the hero
  const heroIntro = buildHeroIntro();
  await runPreloader();

  refreshTriggers();
  heroIntro.play();
}

boot();
