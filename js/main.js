/* Sparsh Bandi portfolio — rendering, routing, motion, lightbox.
 * No framework: content lives in data.js; this file turns it into DOM and wires interactions.
 * Everything is visible without JavaScript-driven animation; motion only plays on top of a visible resting state.
 */
(function () {
  "use strict";
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const byId = (id) => D.projects.find((p) => p.id === id);
  const catLabel = (id) => (D.categories.find((c) => c.id === id) || {}).label || "";

  /* ---------- Images ---------- */
  const REG = {}; // key -> { full, caption, alt, tech }
  function fullSrc(k) { return D.lossless.includes(k) ? `assets/img/${k}.png` : `assets/img/${k}.webp`; }
  function smSrc(k) { return `assets/img/${k}-sm.webp`; }
  function imgTag(k, alt, sizes, eager) {
    const [w, h] = D.dims[k] || [1200, 800];
    const sw = Math.min(900, w);
    const srcset = w > 900 ? `${smSrc(k)} 900w, ${fullSrc(k)} ${w}w` : `${fullSrc(k)} ${w}w`;
    return `<img src="${w > 900 ? smSrc(k) : fullSrc(k)}" srcset="${srcset}" sizes="${sizes || "(max-width: 700px) 100vw, 50vw"}" width="${sw}" height="${Math.round((h * sw) / w)}" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} decoding="async">`;
  }
  // A framed, click-to-enlarge figure. kind: photo | pcb | tech | cad
  function frame(item, group, extraClass) {
    const k = item.img;
    REG[k] = { full: fullSrc(k), caption: item.caption, alt: item.caption, tech: item.kind !== "photo" };
    const label = item.label ? `<span class="frame__label">${esc(item.label)}</span>` : "";
    const kind = item.kind === "cad" ? "cad" : item.kind;
    return `<figure class="${extraClass || ""}">
      <button type="button" class="frame frame--${kind}" data-open="${k}" data-group="${group}" aria-label="Enlarge image: ${esc(item.caption)}">
        ${label}${imgTag(k, item.caption)}<span class="frame__zoom" aria-hidden="true">ENLARGE ⤢</span>
      </button>
      <figcaption>${item.label ? `<b>${esc(item.label.split(" · ")[0])}</b>` : ""}${esc(item.caption)}</figcaption>
    </figure>`;
  }
  // Abhyuday evidence: top row = two primary photos, bottom row = two PCB images.
  function abhyudayGrid(group) {
    const g = byId("abhyuday").gallery;
    return `<div class="evidence" role="group" aria-label="Abhyuday photographs and PCB images">
      ${frame(g[0], group, "evidence__top")}${frame(g[1], group, "evidence__top")}
      ${frame(g[2], group, "evidence__bottom")}${frame(g[3], group, "evidence__bottom")}
    </div>`;
  }
  function metricsDl(list) {
    return list.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join("");
  }
  function statusTag(p, cls) {
    const on = p.status === "ongoing";
    return `<span class="status ${on ? "status--ongoing" : ""} ${cls || ""}">${on ? "Ongoing" : "Completed"}</span>`;
  }

  /* ---------- Home rendering ---------- */
  function renderHome() {
    const ab = byId("abhyuday");
    $("#abhyuday-grid").innerHTML = abhyudayGrid("feature");
    $("#feature-metrics").innerHTML = metricsDl(ab.metrics);

    // Filters + cards
    const order = ["icarus", "lat", "aeromodelling", "valkron", "pokerbots", "attitude", "dpca", "ecell"];
    const wide = ["icarus", "lat"];
    const list = order.map(byId);
    $("#filters").innerHTML = D.categories.filter((c) => c.id === "all" || list.some((p) => p.cats.includes(c.id))).map((c) => {
      const n = c.id === "all" ? list.length : list.filter((p) => p.cats.includes(c.id)).length;
      return `<button type="button" data-filter="${c.id}" aria-pressed="${c.id === "all"}">${esc(c.label)}<span>${n}</span></button>`;
    }).join("");
    $("#cards").innerHTML = list.map((p) => {
      const media = p.cover
        ? `<div class="card__media">${imgTag(p.cover, `${p.title}: ${p.subtitle}`, "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 40vw")}</div>`
        : `<div class="card__media card__media--schematic" aria-hidden="true"><div><div class="card__big">${esc(p.metrics[0][0])}</div><div class="card__bigl">${esc(p.metrics[0][1])}</div></div></div>`;
      return `<a class="card ${wide.includes(p.id) ? "card--wide" : ""}" href="#case-${p.id}" data-cats="${p.cats.join(" ")}">
        ${media}
        <div class="card__body">
          <div class="card__meta"><span>${esc(catLabel(p.cats[0]))}</span>${statusTag(p)}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary)}</p>
          <span class="card__go">Case study <span aria-hidden="true">→</span></span>
        </div>
      </a>`;
    }).join("");

    $("#timeline").innerHTML = D.experience.map((e) => `<li>
      <time>${esc(e.period)}</time>
      <div><h3><a href="#case-${e.link}">${esc(e.role)}</a></h3><p class="org">${esc(e.org)}</p><p>${esc(e.note)}</p></div>
    </li>`).join("");

    $("#research-list").innerHTML = ["lat", "attitude", "dpca"].map(byId).map((p) => `<article class="r-item">
      <div>
        <h3>${esc(p.title)}</h3>
        <p class="r-item__meta">${esc(p.org)}</p>
        ${statusTag(p)}
        <div><a class="link-arrow" href="#case-${p.id}">Full write-up <span aria-hidden="true">→</span></a></div>
      </div>
      <dl>
        <div><dt>Problem</dt><dd>${esc(p.overview)}</dd></div>
        <div><dt>Method</dt><dd>${p.pipeline ? `<div class="flow">${p.pipeline.map((s) => `<span>${esc(s)}</span>`).join('<i aria-hidden="true">→</i>')}</div>` : esc(p.contribution[0][1])}</dd></div>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
      </dl>
      <div class="r-item__nums">${p.metrics.slice(0, 4).map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
    </article>`).join("");

    $("#comp-list").innerHTML = D.competitions.map((c) => `<li>
      <h3>${c.link ? `<a href="#case-${c.link}">${esc(c.name)}</a>` : esc(c.name)}</h3>
      <span class="res">${esc(c.result)}</span>
      <p>${esc(c.note)}</p>
      ${c.link ? `<a class="go" href="#case-${c.link}" aria-label="Open the ${esc(c.name)} case study">→</a>` : "<span></span>"}
    </li>`).join("");

    $("#skills-groups").innerHTML = D.skills.map((g) => `<div class="sk-group">
      <h3>${esc(g.group)}</h3>
      <ul class="tags">${g.items.map(([name, link]) => link
        ? `<li><a class="tag" href="#case-${link}" title="Used in: ${esc(byId(link).title)}">${esc(name)}</a></li>`
        : `<li><span class="tag">${esc(name)}</span></li>`).join("")}</ul>
    </div>`).join("");

    $("#beyond-grid").innerHTML = D.beyond.map((b) => `<article class="b-item">
      ${b.img
        ? `<div class="b-item__media">${imgTag(b.img, `${b.title}`, "(max-width: 520px) 100vw, (max-width: 1000px) 50vw, 25vw")}</div>`
        : `<div class="b-item__media b-item__media--text" aria-hidden="true"><b>1,500</b><span>Mock-test registrations</span></div>`}
      <h3>${esc(b.title)}</h3><p>${esc(b.note)}</p>
    </article>`).join("");
  }

  /* ---------- Filters ---------- */
  function applyFilter(id, animate) {
    $$("#filters button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === id)));
    let shown = 0;
    $$("#cards .card").forEach((c) => {
      const on = id === "all" || c.dataset.cats.split(" ").includes(id);
      c.classList.toggle("is-hidden", !on);
      c.classList.toggle("card--wide", on && id === "all" && ["case-icarus", "case-lat"].includes(c.getAttribute("href").slice(1)));
      if (on) {
        if (animate && !reduceMotion.matches) c.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 450, delay: shown * 50, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
        shown++;
      }
    });
    $("#cards-empty").hidden = shown > 0;
  }

  /* ---------- Case study ---------- */
  function archDiagram() {
    const nodes = [
      { id: "sensors", c: 1, r: 1, k: "Inputs", t: "Sensors", s: "ICM-20948 IMU · H3LIS331DL high-g · MAX-M10S GNSS", d: "A 9-axis IMU, a high-g accelerometer and a GNSS receiver feed the flight computer. Their data is fused on board with Madgwick and Kalman filters, switchable in firmware." },
      { id: "power", c: 1, r: 2, k: "Power", t: "7S BMS · 25.9 V", s: "Buck rails: 5 V · 7.7 V · 24 V", d: "A custom 7S / 25.9 V battery-management system with multi-rail buck regulation: 5 V for the flight computer, 7.7 V for the airbrakes and 24 V for the actuation motor, so each subsystem is isolated." },
      { id: "core", c: 2, r: 1, k: "Core", t: "Flight computer · STM32H7", s: "4-layer CHILE-V1 PCB · fusion · flight logic · recovery", d: "My 4-layer STM32H7 board, designed from scratch over four months with 7+ sensors and 15+ components. It runs flight logic and sensor fusion and drives the recovery actuation system." },
      { id: "telemetry", c: 3, r: 1, k: "Link", t: "LoRa telemetry", s: "Downlink: AGL altitude, velocity, heading · uplink", d: "A bidirectional LoRa link with 7 km range streams live AGL altitude, velocity and heading to the ground and carries uplink commands." },
      { id: "recovery", c: 3, r: 2, k: "Outputs", t: "Recovery actuation", s: "Drogue and main · redundant channel · reefing", d: "The flight computer drives deployment. At IREC the primary SRAD CO₂ drogue ejection failed and the redundant channel fired the drogue; dual deployment with reefing completed and the rocket was recovered undamaged." },
      { id: "ground", c: 4, r: 1, k: "Ground", t: "Ground station", s: "Python GUI · 3D trajectory · hybrid fill control", d: "A Python GUI parses live NMEA packets from a Featherweight GPS into a real-time 3D trajectory. The SRAD ground station also automates hybrid-engine fill sequences over LoRa, and logged thrust during the two hot-fire tests." },
      { id: "payload", c: 4, r: 2, k: "Separate system", t: "Payload · CARIS", s: "Own flight computer · RF telemetry · 2.4 GHz phased array", d: "A separate payload with its own flight computer and RF telemetry circuit. I designed, routed and fabricated the FR4 phased-array antenna PCBs (3 elements per antenna) and tuned them in ANSYS HFSS." },
    ];
    const links = [["sensors", "core"], ["power", "core"], ["core", "telemetry"], ["core", "recovery"], ["telemetry", "ground"]];
    return {
      html: `<div class="arch" id="arch">
        <div class="arch__board">
          <svg class="arch__svg" aria-hidden="true"></svg>
          ${nodes.map((n) => `<button type="button" class="node ${n.id === "core" ? "node--core" : ""}" data-node="${n.id}" aria-pressed="${n.id === "core"}" style="--c:${n.c};--r:${n.r}">
            <small>${esc(n.k)}</small><strong>${esc(n.t)}</strong><span>${esc(n.s)}</span></button>`).join("")}
        </div>
        <div class="arch__detail" id="arch-detail" aria-live="polite"></div>
        <p class="arch__hint">Select a block to see what it does and how it connects</p>
      </div>`,
      init(root) {
        const board = $(".arch__board", root), svg = $(".arch__svg", root), detail = $("#arch-detail", root);
        const show = (id) => {
          const n = nodes.find((x) => x.id === id);
          $$(".node", root).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.node === id)));
          detail.innerHTML = `<h3>${esc(n.t)}</h3><p>${esc(n.d)}</p>`;
          $$("path", svg).forEach((p) => p.classList.toggle("is-hot", p.dataset.a === id || p.dataset.b === id));
        };
        const draw = () => {
          if (!board.isConnected) { ro.disconnect(); return; }
          const br = board.getBoundingClientRect();
          svg.setAttribute("viewBox", `0 0 ${br.width} ${br.height}`);
          const pos = (id) => $(`[data-node="${id}"]`, root).getBoundingClientRect();
          svg.innerHTML = links.map(([a, b]) => {
            const A = pos(a), B = pos(b);
            const x1 = A.right - br.left, y1 = A.top + A.height / 2 - br.top;
            const x2 = B.left - br.left, y2 = B.top + B.height / 2 - br.top;
            const mx = (x1 + x2) / 2;
            return `<path data-a="${a}" data-b="${b}" d="M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}"/>`;
          }).join("");
          const cur = $('.node[aria-pressed="true"]', root);
          if (cur) $$("path", svg).forEach((p) => p.classList.toggle("is-hot", p.dataset.a === cur.dataset.node || p.dataset.b === cur.dataset.node));
        };
        const ro = new ResizeObserver(() => draw());
        root.addEventListener("click", (e) => { const b = e.target.closest("[data-node]"); if (b) show(b.dataset.node); });
        draw(); show("core");
        ro.observe(board);
      },
    };
  }

  function sect(label, title, body, full) {
    return `<section class="case__sect ${full ? "case__sect--full" : ""}"><div class="wrap">
      ${full ? `<div class="case__sect-head"><div><p class="label">${esc(label)}</p><h2>${esc(title)}</h2></div></div>` : `<div><p class="label">${esc(label)}</p><h2>${esc(title)}</h2></div>`}
      <div>${body}</div></div></section>`;
  }

  function renderCase(p) {
    const ids = D.projects.map((x) => x.id);
    const i = ids.indexOf(p.id);
    const prev = byId(ids[(i - 1 + ids.length) % ids.length]);
    const next = byId(ids[(i + 1) % ids.length]);
    const group = "case-" + p.id;
    const isAb = p.id === "abhyuday";
    let arch = null;

    let html = `<header class="case__head"><div class="wrap">
      <div class="crumbs"><a class="link-arrow" href="#projects"><span aria-hidden="true">←</span> All projects</a>${statusTag(p)}</div>
      <p class="eyebrow">Case study · ${esc(catLabel(p.cats[0]))}</p>
      <h1 class="case__title" tabindex="-1">${esc(p.title)}</h1>
      <p class="case__sub">${esc(p.subtitle)}</p>
      <dl class="case__meta">
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Period</dt><dd>${esc(p.period)}</dd></div>
        <div><dt>Organisation</dt><dd>${esc(p.org)}</dd></div>
        <div><dt>Tools</dt><dd>${esc(p.tools.join(" · "))}</dd></div>
      </dl>
      ${!isAb && p.gallery.length ? `<div class="case__cover">${frame(p.gallery[0], group)}</div>` : ""}
    </div></header>`;

    html += `<section class="case__sect case__sect--full"><div class="wrap"><dl class="metrics" style="margin-top:0">${metricsDl(p.metrics)}</dl></div></section>`;
    html += sect("01 · Overview", "What it was", `<div class="prose"><p>${esc(p.overview)}</p></div>`);

    if (isAb) {
      html += sect("02 · Evidence", "Team, hardware and the PCB", abhyudayGrid(group), true);
    }
    html += sect(isAb ? "03 · My contribution" : "02 · My contribution", "What I designed and built",
      `<dl class="contrib">${p.contribution.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("")}</dl>`);

    if (isAb) {
      arch = archDiagram();
      html += sect("04 · Architecture", "How the avionics fit together", arch.html, true);
      html += sect("05 · Specification", "Flight-computer specification",
        `<div style="overflow-x:auto"><table class="spec-table"><tbody>${p.specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table></div>`);
    } else if (p.pipeline) {
      html += sect("03 · Approach", "How it works", `<ol class="pipeline">${p.pipeline.map((s) => `<li><span>${esc(s)}</span></li>`).join("")}</ol>`, true);
    }

    let n = isAb ? 6 : p.pipeline ? 4 : 3;
    const pad = (x) => String(x).padStart(2, "0");
    if (p.challenges) {
      html += sect(`${pad(n++)} · Engineering challenges`, "What went wrong, and design calls",
        `<div class="challenges">${p.challenges.map(([t, d]) => `<article class="challenge"><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}</div>`, true);
    }
    html += sect(`${pad(n++)} · Results`, isAb ? "Team outcomes at IREC and testing" : "Results",
      `<ul class="outcomes">${p.outcomes.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
       ${p.model ? `<p style="margin-top:18px"><a class="link-arrow" href="#cad">Open the interactive 3D model <span aria-hidden="true">→</span></a></p>` : ""}
       ${p.next ? `<div class="note-next"><span class="status status--ongoing">Ongoing · next project</span><p>${esc(p.next)}</p></div>` : ""}`);

    const rest = isAb ? p.gallery.slice(4) : p.gallery.slice(1);
    if (rest.length) {
      html += sect(`${pad(n++)} · Gallery`, isAb ? "More from the build" : "More images",
        `<div class="gallery ${rest.length === 1 ? "gallery--single" : ""}">${rest.map((g) => frame(g, group)).join("")}</div>`, true);
    }

    html += `<nav class="case__nav" aria-label="Case study navigation"><div class="wrap">
      <a class="pn" href="#case-${prev.id}"><small>← Previous</small><span>${esc(prev.title)}</span></a>
      <div class="mid"><a class="btn btn--small" href="#projects">Project index</a><button type="button" class="btn btn--small" data-copylink="${p.id}">Copy link</button></div>
      <a class="pn pn--next" href="#case-${next.id}"><small>Next →</small><span>${esc(next.title)}</span></a>
    </div></nav>`;

    const view = $("#case-view");
    view.innerHTML = html;
    if (arch) arch.init(view);
    return view;
  }

  /* ---------- Router ---------- */
  let lastHomeScroll = 0;
  const baseTitle = document.title;
  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    const home = $("#home-view"), view = $("#case-view");
    if (h.startsWith("case-") && byId(h.slice(5))) {
      const p = byId(h.slice(5));
      if (view.hidden) lastHomeScroll = window.scrollY;
      renderCase(p);
      home.hidden = true; view.hidden = false;
      document.title = `${p.title} — Sparsh Bandi`;
      window.scrollTo({ top: 0, behavior: "instant" });
      $(".case__title", view).focus({ preventScroll: true });
      setupReveal(view);
      setActiveNav(null);
      return;
    }
    const wasCase = !view.hidden;
    view.hidden = true; view.innerHTML = ""; home.hidden = false;
    document.title = baseTitle;
    const target = h && document.getElementById(h);
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: wasCase || reduceMotion.matches ? "instant" : "smooth", block: "start" }));
    } else if (wasCase) {
      window.scrollTo({ top: lastHomeScroll, behavior: "instant" });
    }
  }

  /* ---------- Motion: reveal on scroll (from a visible resting state) ---------- */
  let io = null;
  function setupReveal(root) {
    if (reduceMotion.matches || !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    if (!io) {
      io = new IntersectionObserver((entries) => {
        const hits = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        hits.forEach((e, i) => {
          const el = e.target;
          io.unobserve(el);
          const delay = Math.min(i * 70, 350);
          if (el.classList.contains("frame") || el.classList.contains("card__media")) {
            el.animate([{ clipPath: "inset(10% 6% 10% 6%)", opacity: 0 }, { clipPath: "inset(0 0 0 0)", opacity: 1 }], { duration: 900, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          } else {
            el.animate([{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { duration: 720, delay, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
          }
        });
      }, { rootMargin: "0px 0px 12% 0px", threshold: 0 });
    }
    const sel = "[data-reveal], .frame, .card, .timeline li, .r-item, .comp-list li, .sk-group, .b-item, .case__sect h2, .contrib > div, .challenge, .pipeline li, .arch__board, .metrics > div";
    const vh = window.innerHeight;
    $$(sel, root).forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.98) return; // already on screen: leave it alone
      io.observe(el);
    });
  }

  /* ---------- Nav, progress, active section ---------- */
  function setActiveNav(id) { $$("[data-nav]").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === id)); }
  function setupNav() {
    const nav = $("#nav"), bar = $(".progress span");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav.classList.toggle("is-scrolled", y > 30);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const map = { work: "work", projects: "work", experience: "experience", research: "research", cad: "cad", competitions: "cad", skills: "skills", beyond: "skills", education: "skills", contact: "contact" };
    const sio = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && $("#case-view").hidden) setActiveNav(map[e.target.id] || null); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach((id) => { const s = document.getElementById(id); if (s) sio.observe(s); });

    // Mobile menu
    const toggle = $(".nav__toggle"), menu = $("#mobile-menu");
    const setMenu = (open) => {
      menu.hidden = !open; toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) { $("a", menu).focus(); nav.classList.add("is-scrolled"); }
    };
    toggle.addEventListener("click", () => setMenu(menu.hidden));
    menu.addEventListener("click", (e) => { if (e.target.closest("a, button")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 901px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });
  }

  /* ---------- Hero parallax (desktop, fine pointer only) ---------- */
  function setupParallax() {
    if (reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;
    const hero = $(".hero"), layers = $$("[data-depth]", hero);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach((l) => { const d = +l.dataset.depth; l.style.transform = `translate3d(${cx * d}px, ${cy * d}px, 0)`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener("pointerleave", () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- Lightbox ---------- */
  function setupLightbox() {
    const dlg = $("#lightbox"), img = $("#lb-img"), cap = $("#lb-caption"), count = $("#lb-count"), stage = $("#lb-stage"), zoom = $("#lb-zoom");
    let items = [], idx = 0;
    REG.pcb3d = REG.pcb3d || { full: fullSrc("pcb3d"), caption: "3D render of the 4-layer STM32H7 flight-computer board, as designed.", tech: true };
    const setZoom = (on) => { stage.classList.toggle("is-actual", on); zoom.setAttribute("aria-pressed", String(on)); zoom.textContent = on ? "Fit to screen" : "Actual size"; };
    const show = (i) => {
      idx = (i + items.length) % items.length;
      const it = REG[items[idx]];
      setZoom(false);
      img.src = it.full; img.alt = it.alt || it.caption; img.classList.toggle("is-tech", !!it.tech);
      cap.textContent = it.caption;
      count.textContent = items.length > 1 ? `${idx + 1} / ${items.length}` : "Image";
      $("#lb-prev").hidden = $("#lb-next").hidden = items.length < 2;
    };
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open]");
      if (!t) return;
      const g = t.dataset.group;
      items = g ? $$(`[data-open][data-group="${g}"]`).filter((x) => x.offsetParent !== null).map((x) => x.dataset.open) : [t.dataset.open];
      items = items.filter((k, i2) => items.indexOf(k) === i2);
      dlg.showModal(); show(items.indexOf(t.dataset.open));
    });
    $("#lb-prev").addEventListener("click", () => show(idx - 1));
    $("#lb-next").addEventListener("click", () => show(idx + 1));
    $("#lb-close").addEventListener("click", () => dlg.close());
    zoom.addEventListener("click", () => setZoom(!stage.classList.contains("is-actual")));
    img.addEventListener("click", () => setZoom(!stage.classList.contains("is-actual")));
    dlg.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" && items.length > 1) show(idx + 1);
      if (e.key === "ArrowLeft" && items.length > 1) show(idx - 1);
    });
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    let sx = null;
    stage.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") sx = e.clientX; });
    stage.addEventListener("pointerup", (e) => {
      if (sx === null || stage.classList.contains("is-actual") || items.length < 2) { sx = null; return; }
      const dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    });

    // Resume
    const res = $("#resume");
    document.addEventListener("click", (e) => { if (e.target.closest("[data-resume]")) res.showModal(); });
    $("[data-close]", res).addEventListener("click", () => res.close());
    res.addEventListener("click", (e) => { if (e.target === res) res.close(); });
  }

  /* ---------- Copy + toast ---------- */
  let toastT = 0;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 3200);
  }
  function copyText(text, okMsg) {
    const fallback = () => {
      const ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
      ta.remove();
      toast(ok ? okMsg : `Copy this: ${text}`);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback);
    else fallback();
  }
  function setupCopy() {
    document.addEventListener("click", (e) => {
      const c = e.target.closest("[data-copy]");
      if (c) copyText(c.dataset.copy, "Email address copied");
      const l = e.target.closest("[data-copylink]");
      if (l) {
        let framed = false; try { framed = window.top !== window.self; } catch (_) { framed = true; }
        const hash = "#case-" + l.dataset.copylink;
        if (framed) copyText(hash, `Copied “${hash}”. Add it to the end of this page’s address to link straight here.`);
        else copyText(location.href.split("#")[0] + hash, "Link to this case study copied");
      }
    });
  }

  /* ---------- Broken image fallback ---------- */
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (t.tagName === "IMG" && !t.dataset.failed) {
      t.dataset.failed = "1";
      const note = document.createElement("span");
      note.className = "frame__label"; note.style.position = "static";
      note.textContent = "Image unavailable: " + (t.alt || "");
      t.replaceWith(note);
    }
  }, true);

  /* ---------- Boot ---------- */
  function boot() {
    renderHome();
    applyFilter("all", false);
    $("#filters").addEventListener("click", (e) => { const b = e.target.closest("[data-filter]"); if (b) applyFilter(b.dataset.filter, true); });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-filter-reset]")) applyFilter("all", true); });
    setupNav(); setupParallax(); setupLightbox(); setupCopy();
    window.addEventListener("hashchange", route);
    if (location.hash) route();
    setupReveal(document);
    document.documentElement.classList.add("js-ready");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
