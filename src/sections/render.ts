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

  const contactKicker = document.getElementById("contact-kicker");
  if (contactKicker) contactKicker.textContent = identity.contactKicker;
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
      <div class="xp-item${xp.compact ? " xp-item--compact" : ""}">
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
  const list = document.getElementById("projects-list")!;
  const all = document.getElementById("projects-all") as HTMLAnchorElement | null;
  if (all) all.href = identity.github;

  list.innerHTML = projects
    .map(
      (p, i) => `
      <article class="proj-row">
        <div class="proj-index" aria-hidden="true">${String(i + 1).padStart(2, "0")}</div>
        <div class="proj-body">
          <h3 class="proj-title">${p.title}</h3>
          ${p.role ? `<p class="proj-role mono">${p.role}</p>` : ""}
          <p class="proj-desc">${p.description}</p>
          <p class="proj-outcome">${p.outcome}</p>
          <div class="badges">
            ${p.badges.map((b) => `<span>${b}</span>`).join("")}
          </div>
          <div class="proj-links">
            <a class="proj-link" href="${p.github}" target="_blank" rel="noopener" data-hover>GITHUB ↗</a>
          </div>
        </div>
      </article>`
    )
    .join("");
}

export function renderSkills(): void {
  const bento = document.getElementById("skills-bento")!;
  bento.innerHTML = skillGroups
    .map((group, gi) => {
      const slug = group.label.toLowerCase().replace(/\s+/g, "-");
      return `
      <div class="skill-group skill-group--${slug}">
        <h3 class="skill-group-label mono">
          <span class="skill-group-index" aria-hidden="true">${String(gi + 1).padStart(2, "0")}</span>
          ${group.label}
        </h3>
        <div class="skill-chips">
          ${group.items
            .map(
              (name, i) =>
                `<span class="skill-chip mono magnetic${i % 2 === 1 ? " skill-chip-outline" : ""}" data-hover>${name}</span>`
            )
            .join("")}
        </div>
      </div>`;
    })
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
