import {
  about,
  education,
  experience,
  projects,
  skills,
} from "../data/content";

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
          <img src="${p.image}" alt="${p.title}" loading="eager" />
        </div>
        <h3 class="proj-title">${p.title}</h3>
        <p class="proj-desc">${p.description}</p>
        <div class="badges">
          ${p.badges.map((b) => `<span>${b}</span>`).join("")}
        </div>
        <a class="proj-link" href="${p.github}" target="_blank" rel="noopener" data-hover>GITHUB ↗</a>
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
      <a href="https://github.com/shreemit" target="_blank" rel="noopener" data-hover>SEE EVERYTHING →</a>
    </div>`;
}

export function renderSkills(): void {
  const bento = document.getElementById("skills-bento")!;
  bento.innerHTML = skills
    .map(
      (name, i) => `
      <div class="skill-cell${i % 2 === 1 ? " skill-cell-outline" : ""}" data-hover>
        <span class="skill-index mono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <span class="skill-name">${name}</span>
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
