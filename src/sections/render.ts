import {
  about,
  education,
  experience,
  identity,
  projects,
  skillGroups,
} from "../data/content";

export function renderIdentity(): void {
  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText("hero-role", identity.role.toUpperCase());
  setText("hero-proof", identity.proof.toUpperCase());
  setText("hero-tagline", identity.tagline.toUpperCase());

  const first = document.querySelector("#hero-title .hero-line:not(.hero-line-outline)");
  const last = document.querySelector("#hero-title .hero-line-outline");
  if (first) first.textContent = identity.firstName;
  if (last) last.textContent = identity.lastName;

  const resume = document.getElementById("resume-link") as HTMLAnchorElement | null;
  if (resume) {
    resume.href = identity.resume;
    resume.setAttribute("download", "");
  }

  const heroResume = document.getElementById("hero-resume") as HTMLAnchorElement | null;
  if (heroResume) {
    heroResume.href = identity.resume;
    heroResume.setAttribute("download", "");
  }

  const drawerResume = document.getElementById("drawer-resume") as HTMLAnchorElement | null;
  if (drawerResume) {
    drawerResume.href = identity.resume;
    drawerResume.setAttribute("download", "");
  }

  const portrait = document.getElementById("portrait-img") as HTMLImageElement | null;
  if (portrait) {
    portrait.src = identity.portrait;
    portrait.width = identity.portraitWidth;
    portrait.height = identity.portraitHeight;
    portrait.alt = `Portrait of ${identity.name}`;
  }

  const contactTitle = document.getElementById("contact-title") as HTMLAnchorElement | null;
  if (contactTitle) {
    contactTitle.href = `mailto:${identity.email}`;
    contactTitle.setAttribute(
      "aria-label",
      `Email ${identity.name} at ${identity.email}`
    );
  }

  const github = document.getElementById("contact-github") as HTMLAnchorElement | null;
  if (github) github.href = identity.github;

  const linkedin = document.getElementById("contact-linkedin") as HTMLAnchorElement | null;
  if (linkedin) linkedin.href = identity.linkedin;

  const email = document.getElementById("contact-email") as HTMLAnchorElement | null;
  if (email) {
    email.href = `mailto:${identity.email}`;
    email.textContent = identity.email.toUpperCase();
  }
}

export function renderAbout(): void {
  const wrap = document.getElementById("about-lines")!;
  wrap.innerHTML = about.paragraphs
    .map((p) => `<p class="about-line">${p}</p>`)
    .join("");
}

export function renderExperience(): void {
  const timeline = document.getElementById("timeline")!;
  timeline.innerHTML = experience
    .map(
      (xp) => `
      <div class="xp-item">
        <div class="xp-year" aria-hidden="true">${xp.year}</div>
        <div class="xp-card">
          <h3 class="xp-role">${xp.role}</h3>
          <div class="xp-meta">
            ${
              xp.companyUrl
                ? `<a class="xp-company" href="${xp.companyUrl}" target="_blank" rel="noopener" data-hover>${xp.company} ↗</a>`
                : `<span class="xp-company">${xp.company}</span>`
            }
            <span class="xp-date">${xp.date}</span>
          </div>
          <ul class="xp-bullets">
            ${xp.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
          ${
            xp.featuredLink
              ? `<a class="xp-featured" href="${xp.featuredLink.url}" target="_blank" rel="noopener" data-hover>${xp.featuredLink.label} ↗</a>`
              : ""
          }
        </div>
      </div>`
    )
    .join("");

  const eduGrid = document.getElementById("education-grid")!;
  eduGrid.innerHTML = education
    .map(
      (edu) => `
      <div class="edu-card">
        <h3 class="edu-degree">${edu.degree}</h3>
        <p class="edu-school">${edu.school}</p>
        <p class="edu-date">${edu.date}</p>
        <div class="edu-courses">
          ${edu.courses.map((c) => `<span>${c}</span>`).join("")}
        </div>
      </div>`
    )
    .join("");
}

export function renderProjects(): void {
  const track = document.getElementById("projects-track")!;
  const cards = projects
    .map(
      (p, i) => `
      <article class="proj-card">
        <div class="proj-index" aria-hidden="true">0${i + 1}</div>
        <div class="proj-media" data-distort data-hover>
          <img
            src="${p.image}"
            alt="${p.title}"
            width="${p.imageWidth}"
            height="${p.imageHeight}"
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 class="proj-title">${p.title}</h3>
        ${p.role ? `<p class="proj-role mono">${p.role}</p>` : ""}
        <p class="proj-desc">${p.description}</p>
        <p class="proj-outcome">${p.outcome}</p>
        <div class="badges">
          ${p.badges.map((b) => `<span>${b}</span>`).join("")}
        </div>
        <div class="proj-links">
          <a class="proj-link" href="${p.github}" target="_blank" rel="noopener" data-hover>GITHUB ↗</a>
          ${
            p.demo
              ? `<a class="proj-link" href="${p.demo}" target="_blank" rel="noopener" data-hover>LIVE DEMO ↗</a>`
              : ""
          }
        </div>
      </article>`
    )
    .join("");

  track.innerHTML = `
    <div class="proj-intro">
      <p class="section-label mono">03 / SELECTED WORK</p>
      <h2 class="section-title">THINGS<br />I'VE BUILT</h2>
    </div>
    ${cards}
    <div class="proj-outro">
      <a href="${identity.github}" target="_blank" rel="noopener" data-hover>SEE EVERYTHING →</a>
    </div>`;
}

export function renderSkills(): void {
  const bento = document.getElementById("skills-bento")!;
  let index = 0;
  bento.innerHTML = skillGroups
    .map(
      (group) => `
      <div class="skill-group">
        <p class="skill-group-label mono">${group.label}</p>
        <div class="skill-group-grid">
          ${group.items
            .map((name) => {
              const i = index++;
              return `
              <div class="skill-cell${i % 2 === 1 ? " skill-cell-outline" : ""}" data-hover>
                <span class="skill-index mono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
                <span class="skill-name">${name}</span>
              </div>`;
            })
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

export function renderFooterTime(): void {
  const el = document.getElementById("footer-time")!;
  const fmt = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Los_Angeles",
    });
  el.textContent = fmt();
  setInterval(() => (el.textContent = fmt()), 30_000);
}
