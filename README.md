# Sparsh Bandi — Engineering Portfolio

A hand-built, dependency-free portfolio site: HTML, CSS and vanilla JavaScript. Content lives in one data file; the page renders it, routes to a case study per project, and animates with the browser's own Web Animations API. Three.js is loaded only when a visitor asks for the 3D model.

## Run it locally

Any static file server works. From this folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` straight from disk mostly works, but the 3D viewer needs a server because it fetches the STL file.)

## Edit content

Everything you would normally change is in **`js/data.js`**:

| What | Where in `data.js` |
|---|---|
| Name, links, resume path | `person` |
| Projects and case studies | `projects` (one object per project; `id` becomes the URL `#case-<id>`) |
| Experience timeline | `experience` |
| Competitions list | `competitions` |
| Skills (with links to projects) | `skills` — `["Tool", "projectId"]` links the tag; `["Tool"]` leaves it unlinked |
| Sport / outreach | `beyond` |

Hero text, About, Education and Contact are plain HTML in `index.html`.

### Add a project
1. Put images in `assets/img/` as `name.webp` (full size, ≤1800 px) and `name-sm.webp` (≤900 px).
2. Add `name: [width, height]` to `dims` in `data.js` (prevents layout shift).
3. Add a project object (copy an existing one). Set `status: "ongoing"` or `"completed"`.

PCB and schematic images (`pcb3d`, `schem`) are kept as lossless PNG for full-size viewing; list any new technical image in `lossless` to do the same.

## Build for deployment

```bash
pip install playwright && python3 -m playwright install chromium   # one-time, optional
python3 scripts/build.py
```

This writes `dist/` with a **prerendered** `index.html` (all project text present in the HTML, which helps search engines and link previews). Without Playwright, `dist/` is a plain copy and the site works the same.

`python3 scripts/build.py --embed` also writes `dist-embed/`, the same page without the `<html>/<head>/<body>` wrapper, for hosts that supply their own.

## Deploy

Upload the contents of `dist/` to any static host:

- **GitHub Pages:** push `dist/` contents to a `gh-pages` branch (or a `docs/` folder) of a repo such as `Sparsh819.github.io`.
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop `dist/`, no build command needed.

After you have a domain, update:
- `og:image` in `index.html` to an absolute URL (`https://your-domain/assets/img/abh2.webp`) so link previews show the image;
- add `<link rel="canonical" href="https://your-domain/">`;
- uncomment the `Sitemap:` line in `robots.txt` and add a `sitemap.xml` listing the root URL.

## Structure

```
index.html            page shell, hero, static sections, dialogs
css/styles.css        design tokens + all styles (single file)
js/data.js            all content
js/main.js            rendering, hash router (#case-<id>), filters, motion, lightbox, resume viewer
js/viewer.js          on-demand Three.js STL viewer with built-in orbit controls
assets/img/           WebP photos (+ -sm thumbnails), lossless PCB PNGs, CAD renders
assets/models/        balsa-plane.stl (Fusion 360 export) + balsa-plane.json (same file, gzipped + base64; what the viewer loads)
assets/docs/          resume PDF + page images for the in-page viewer
scripts/build.py      prerender / packaging
```

## Accessibility and performance notes

- All content is visible without animation; reveals play only on top of a visible resting state and are skipped under `prefers-reduced-motion`.
- Lightbox and resume are native `<dialog>` elements (Esc closes, focus returns); arrow keys move between images; "Actual size" shows PCB images 1:1.
- The architecture diagram is made of buttons; each one explains its block in a live region.
- Images are lazy-loaded below the fold, carry width/height, and use `srcset`.
- The 3D library (~600 KB) and model (2 MB compressed) download only after "Load interactive model".
