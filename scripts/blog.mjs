/**
 * Markdown blog for the Vite portfolio.
 *
 * Drop a post in content/blog/*.md:
 *
 * ---
 * title: "Post title"
 * description: "One line used on the index and in meta tags."
 * date: 2026-10-24
 * draft: true
 * slug: optional-kebab-slug
 * ---
 *
 * `draft: true` still builds a page (so the URL can be previewed) but leaves
 * it off the index, the sitemap, and search (noindex). Remove the flag to publish.
 *
 * Generated HTML is written to /blog and is gitignored. `npm run dev` and
 * `npm run build` regenerate it.
 */
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const SITE = "https://shreemit.github.io";
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

marked.setOptions({ gfm: true, breaks: false });

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function parseFrontmatter(raw, file) {
  if (!raw.startsWith("---\n")) {
    throw new Error(`${file}: missing frontmatter`);
  }
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) throw new Error(`${file}: unclosed frontmatter`);
  const data = {};
  for (const line of raw.slice(4, end).split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) throw new Error(`${file}: bad frontmatter line: ${line}`);
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value === "true") data[match[1]] = true;
    else if (value === "false") data[match[1]] = false;
    else data[match[1]] = value;
  }
  return { data, body: raw.slice(end + 5) };
}

function requireString(data, key, file) {
  const value = data[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${file}: frontmatter ${key} is required`);
  }
  return value.trim();
}

function formatDate(iso, file) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month || Number(match[3]) < 1 || Number(match[3]) > 31) {
    throw new Error(`${file}: date must be YYYY-MM-DD`);
  }
  return `${Number(match[3])} ${month} ${match[1]}`;
}

function renderMarkdown(source) {
  const html = marked.parse(source, { async: false });
  if (typeof html !== "string") {
    throw new Error("marked.parse did not return a string");
  }
  return html
    .replaceAll(
      /<a href="(https?:\/\/[^"]*)"/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"'
    )
    .replaceAll("<table>", '<div class="blog-table"><table>')
    .replaceAll("</table>", "</table></div>");
}

export function loadPosts(root) {
  const dir = path.join(root, "content", "blog");
  if (!fs.existsSync(dir)) return [];
  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort();

  const posts = files.map((file) => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf8");
    const { data, body } = parseFrontmatter(raw, file);
    const slug = (typeof data.slug === "string" && data.slug.trim()) || file.replace(/\.md$/, "");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "index") {
      throw new Error(`${file}: slug must be kebab-case and not "index"`);
    }
    if (data.draft !== undefined && typeof data.draft !== "boolean") {
      throw new Error(`${file}: draft must be true or false`);
    }
    const date = requireString(data, "date", file);
    return {
      slug,
      title: requireString(data, "title", file),
      description: requireString(data, "description", file),
      date,
      dateLabel: formatDate(date, file),
      draft: data.draft === true,
      html: renderMarkdown(body),
    };
  });

  const seen = new Set();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
    seen.add(post.slug);
  }

  posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));
  return posts;
}

function page({ title, description, canonical, robots, main }) {
  const robotTag = robots ? `\n    <meta name="robots" content="${robots}" />` : "";
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />${robotTag}
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/og.jpg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE}/og.jpg" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;600;800&family=Space+Mono:wght@400;700&display=swap"
    />
  </head>
  <body class="blog-page">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="noise" aria-hidden="true"></div>

    <header class="nav" id="nav">
      <a class="nav-brand" href="/" data-hover>SG©</a>
      <nav class="nav-links" aria-label="Primary">
        <a href="/#about" data-hover>ABOUT</a>
        <a href="/#experience" data-hover>WORK</a>
        <a href="/#projects" data-hover>PROJECTS</a>
        <a href="/blog/" data-hover class="is-active" aria-current="page">BLOG</a>
        <a href="/#skills" data-hover>SKILLS</a>
        <a href="/#contact" data-hover>CONTACT</a>
      </nav>
      <div class="nav-actions">
        <a class="nav-resume" href="/resume.pdf" download rel="noopener" data-hover>RESUME ↗</a>
        <button
          type="button"
          class="nav-toggle"
          id="nav-toggle"
          aria-expanded="false"
          aria-controls="nav-drawer"
          aria-label="Open menu"
        >
          <span class="nav-toggle-bar" aria-hidden="true"></span>
          <span class="nav-toggle-bar" aria-hidden="true"></span>
        </button>
      </div>
    </header>

    <div class="nav-drawer" id="nav-drawer" aria-hidden="true" role="dialog" aria-label="Mobile navigation">
      <nav class="nav-drawer-links" aria-label="Mobile">
        <a href="/#about">ABOUT</a>
        <a href="/#experience">WORK</a>
        <a href="/#projects">PROJECTS</a>
        <a href="/blog/" aria-current="page">BLOG</a>
        <a href="/#skills">SKILLS</a>
        <a href="/#contact">CONTACT</a>
        <a href="/resume.pdf" download>RESUME ↗</a>
      </nav>
    </div>

    ${main}

    <footer class="footer">
      <p class="mono">© 2026 SHREEMIT GARIMELLA</p>
      <p class="mono">BUILT WITH GSAP + THREE.JS</p>
      <p class="mono">SEATTLE, WA — <span id="footer-time"></span></p>
    </footer>

    <script type="module" src="/src/blog/boot.ts"></script>
  </body>
</html>
`;
}

function renderIndex(posts) {
  const published = posts.filter((post) => !post.draft);
  const count = String(published.length).padStart(2, "0");
  const list = published.length
    ? published
        .map(
          (post, index) => `<article class="blog-row">
        <a class="blog-row-link" href="/blog/${post.slug}/">
          <span class="blog-row-index" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
          <span class="blog-row-body">
            <span class="blog-row-date mono">${escapeHtml(post.dateLabel)}</span>
            <span class="blog-row-title">${escapeHtml(post.title)}</span>
            <span class="blog-row-dek">${escapeHtml(post.description)}</span>
          </span>
          <span class="blog-row-arrow mono" aria-hidden="true">→</span>
        </a>
      </article>`
        )
        .join("\n")
    : `<p class="blog-empty mono">NOTHING PUBLISHED YET.</p>`;

  const html = page({
    title: "Blog — Shreemit Garimella",
    description: "Notes from Shreemit Garimella on building software and applied AI.",
    canonical: `${SITE}/blog/`,
    robots: "",
    main: `<main id="main" tabindex="-1">
      <header class="blog-hero">
        <p class="section-label mono">${count} / NOTES</p>
        <h1 class="section-title">BLOG</h1>
        <p class="blog-lede">Notes from building. Drafts stay off this list.</p>
      </header>
      <div class="blog-list">
        ${list}
      </div>
    </main>`,
  });

  for (const post of posts) {
    if (post.draft && html.includes(escapeHtml(post.title))) {
      throw new Error(`Draft leaked onto the blog index: ${post.slug}`);
    }
  }
  return html;
}

function renderPost(post) {
  const banner = post.draft
    ? `<p class="blog-draft" role="status">DRAFT · NOT LISTED ON THE INDEX</p>`
    : "";
  return page({
    title: `${post.draft ? "Draft: " : ""}${post.title} — Shreemit Garimella`,
    description: post.description,
    canonical: `${SITE}/blog/${post.slug}/`,
    robots: post.draft ? "noindex, nofollow" : "",
    main: `<main id="main" tabindex="-1">
      <article class="blog-article">
        <p class="blog-back"><a href="/blog/" data-hover>← ALL NOTES</a></p>
        ${banner}
        <p class="section-label mono">${post.draft ? "DRAFT · " : ""}${escapeHtml(post.dateLabel)}</p>
        <h1 class="blog-title">${escapeHtml(post.title)}</h1>
        <p class="blog-lede">${escapeHtml(post.description)}</p>
        <div class="blog-body">
          ${post.html}
        </div>
      </article>
    </main>`,
  });
}

function renderSitemap(posts) {
  const urls = [
    { loc: `${SITE}/`, priority: "1.0" },
    { loc: `${SITE}/blog/`, priority: "0.8" },
    ...posts
      .filter((post) => !post.draft)
      .map((post) => ({ loc: `${SITE}/blog/${post.slug}/`, priority: "0.6" })),
  ];
  const body = urls
    .map(
      (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function writeIfChanged(file, contents) {
  const next = contents.endsWith("\n") ? contents : `${contents}\n`;
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === next) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, next);
  return true;
}

export function writeBlogPages(root) {
  const posts = loadPosts(root);
  const blogDir = path.join(root, "blog");
  fs.mkdirSync(blogDir, { recursive: true });

  const inputs = {
    blog: path.join(blogDir, "index.html"),
  };
  writeIfChanged(inputs.blog, renderIndex(posts));

  const live = new Set();
  for (const post of posts) {
    const file = path.join(blogDir, post.slug, "index.html");
    writeIfChanged(file, renderPost(post));
    inputs[`blog-${post.slug}`] = file;
    live.add(post.slug);
  }

  for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !live.has(entry.name)) {
      fs.rmSync(path.join(blogDir, entry.name), { recursive: true, force: true });
    }
  }

  writeIfChanged(path.join(root, "public", "sitemap.xml"), renderSitemap(posts));
  return inputs;
}

function isPostMarkdown(root, file) {
  const dir = path.join(root, "content", "blog") + path.sep;
  return file.startsWith(dir) && file.endsWith(".md");
}

export function blogPlugin() {
  let root = process.cwd();
  return {
    name: "blog-pages",
    config() {
      root = process.cwd();
      const inputs = writeBlogPages(root);
      return {
        build: {
          rollupOptions: {
            input: {
              main: path.resolve(root, "index.html"),
              ...inputs,
            },
          },
        },
      };
    },
    buildStart() {
      writeBlogPages(root);
    },
    configureServer(server) {
      root = server.config.root;
      const contentDir = path.join(root, "content", "blog");
      server.watcher.add(contentDir);
      const refresh = (file) => {
        if (!isPostMarkdown(root, file)) return;
        writeBlogPages(root);
        server.ws.send({ type: "full-reload", path: "*" });
      };
      server.watcher.on("add", refresh);
      server.watcher.on("change", refresh);
      server.watcher.on("unlink", refresh);
    },
  };
}
