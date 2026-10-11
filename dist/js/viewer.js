/* On-demand 3D viewer for the Fusion 360 STL export.
 * Three.js (r128, UMD build from cdnjs) and the 3.9 MB model load only after the visitor asks for them.
 * Orbit controls are implemented here to avoid a second dependency.
 */
(function () {
  "use strict";
  const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  const MODEL_URL = "assets/models/balsa-plane.json"; // gzipped binary STL, base64 in JSON (2 MB instead of 3.9 MB)
  const RAW_URL = "assets/models/balsa-plane.stl";    // fallback for browsers without DecompressionStream
  const stage = document.getElementById("viewer-stage");
  if (!stage) return;
  const btn = document.getElementById("viewer-load");
  const msg = document.getElementById("viewer-msg");
  const bar = document.getElementById("viewer-bar");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadScript(src) {
    return new Promise((res, rej) => {
      if (window.THREE) return res();
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error("Could not load the 3D library."));
      document.head.appendChild(s);
    });
  }
  function webglOK() {
    try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (_) { return false; }
  }
  function parseSTL(buf) {
    const dv = new DataView(buf);
    const n = dv.getUint32(80, true);
    if (84 + n * 50 !== buf.byteLength) throw new Error("Unexpected STL format.");
    const pos = new Float32Array(n * 9), nor = new Float32Array(n * 9);
    for (let i = 0; i < n; i++) {
      const o = 84 + i * 50;
      const nx = dv.getFloat32(o, true), ny = dv.getFloat32(o + 4, true), nz = dv.getFloat32(o + 8, true);
      for (let v = 0; v < 3; v++) {
        const vo = o + 12 + v * 12, k = i * 9 + v * 3;
        pos[k] = dv.getFloat32(vo, true); pos[k + 1] = dv.getFloat32(vo + 4, true); pos[k + 2] = dv.getFloat32(vo + 8, true);
        nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
      }
    }
    return { pos, nor, n };
  }

  async function fetchModel() {
    if ("DecompressionStream" in window) {
      const r = await fetch(MODEL_URL);
      if (!r.ok) throw new Error("The model file could not be downloaded.");
      const bin = Uint8Array.from(atob((await r.json()).data), (c) => c.charCodeAt(0));
      const stream = new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"));
      return await new Response(stream).arrayBuffer();
    }
    const r = await fetch(RAW_URL);
    if (!r.ok) throw new Error("This browser cannot unpack the model file.");
    return await r.arrayBuffer();
  }

  async function start() {
    btn.disabled = true;
    if (!webglOK()) { msg.textContent = "3D needs WebGL, which this browser has turned off. The render above shows the same model."; btn.disabled = false; return; }
    msg.textContent = "Loading 3D library…";
    try {
      await loadScript(THREE_URL);
      msg.textContent = "Downloading model (2 MB)…";
      const { pos, nor, n } = parseSTL(await fetchModel());
      build(pos, nor, n);
    } catch (err) {
      msg.textContent = `${err.message} Reload the page to try again.`;
      btn.disabled = false;
    }
  }

  function build(pos, nor, n) {
    const T = window.THREE;
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("normal", new T.BufferAttribute(nor, 3));
    geo.rotateX(-Math.PI / 2); // model is Z-up; Three.js is Y-up
    geo.computeBoundingBox();
    const c = new T.Vector3(); geo.boundingBox.getCenter(c); geo.translate(-c.x, -c.y, -c.z);
    geo.computeBoundingSphere();
    const R = geo.boundingSphere.radius;

    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new T.Scene();
    const cam = new T.PerspectiveCamera(35, 1, R / 50, R * 20);
    scene.add(new T.HemisphereLight(0xffffff, 0x8899aa, 0.85));
    const key = new T.DirectionalLight(0xffffff, 0.75); key.position.set(1, 1.4, 0.8); scene.add(key);
    const rim = new T.DirectionalLight(0x9cc8ff, 0.35); rim.position.set(-1, 0.3, -1); scene.add(rim);
    const mat = new T.MeshStandardMaterial({ color: 0x5b84b8, metalness: 0.1, roughness: 0.55 });
    const mesh = new T.Mesh(geo, mat); scene.add(mesh);

    stage.querySelector(".viewer__poster").remove(); btn.remove();
    const cv = renderer.domElement;
    cv.setAttribute("tabindex", "0");
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", "Interactive 3D model of the Aero Club balsa aircraft. Drag or use arrow keys to rotate; plus and minus to zoom.");
    stage.appendChild(cv);
    bar.hidden = false;
    msg.textContent = `${n.toLocaleString()} facets · drag to orbit · scroll to zoom`;

    // Orbit state
    const S = { theta: 0.8, phi: 1.05, dist: R * 2.9, tTheta: 0.8, tPhi: 1.05, tDist: R * 2.9, spin: false };
    const VIEWS = { iso: [0.8, 1.05], top: [0, 0.0001], front: [0, Math.PI / 2], side: [Math.PI / 2, Math.PI / 2] };
    const clampPhi = (p) => Math.max(0.0001, Math.min(Math.PI - 0.0001, p));
    function resize() {
      const w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); dirty = true;
    }
    let dirty = true, visible = true;
    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      if (S.spin) { S.tTheta += 0.004; dirty = true; }
      const k = 0.14;
      const moving = Math.abs(S.tTheta - S.theta) + Math.abs(S.tPhi - S.phi) + Math.abs(S.tDist - S.dist) / R > 0.0005;
      if (!moving && !dirty) return;
      S.theta += (S.tTheta - S.theta) * k; S.phi += (S.tPhi - S.phi) * k; S.dist += (S.tDist - S.dist) * k;
      cam.position.set(S.dist * Math.sin(S.phi) * Math.sin(S.theta), S.dist * Math.cos(S.phi), S.dist * Math.sin(S.phi) * Math.cos(S.theta));
      cam.lookAt(0, 0, 0);
      renderer.render(scene, cam); dirty = false;
    }
    new ResizeObserver(resize).observe(stage); resize(); frame();
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(stage);

    // Pointer orbit + pinch zoom
    const pts = new Map(); let pinch0 = 0;
    cv.addEventListener("pointerdown", (e) => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch0 = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
    cv.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      const [px, py] = pts.get(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]);
      if (pts.size === 1) { S.tTheta -= (e.clientX - px) * 0.008; S.tPhi = clampPhi(S.tPhi - (e.clientY - py) * 0.008); }
      else if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) S.tDist = Math.max(R * 1.1, Math.min(R * 8, S.tDist * (pinch0 / d))); pinch0 = d; }
    });
    const up = (e) => { pts.delete(e.pointerId); pinch0 = 0; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    cv.addEventListener("wheel", (e) => { e.preventDefault(); S.tDist = Math.max(R * 1.1, Math.min(R * 8, S.tDist * (1 + Math.sign(e.deltaY) * 0.1))); }, { passive: false });
    cv.addEventListener("keydown", (e) => {
      const m = { ArrowLeft: () => (S.tTheta -= 0.15), ArrowRight: () => (S.tTheta += 0.15), ArrowUp: () => (S.tPhi = clampPhi(S.tPhi - 0.15)), ArrowDown: () => (S.tPhi = clampPhi(S.tPhi + 0.15)), "+": () => (S.tDist = Math.max(R * 1.1, S.tDist * 0.9)), "=": () => (S.tDist = Math.max(R * 1.1, S.tDist * 0.9)), "-": () => (S.tDist = Math.min(R * 8, S.tDist * 1.1)) };
      if (m[e.key]) { e.preventDefault(); m[e.key](); }
    });

    bar.addEventListener("click", (e) => {
      const v = e.target.closest("[data-view]"), t = e.target.closest("[data-toggle]");
      if (v) {
        bar.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", String(b === v)));
        const [th, ph] = VIEWS[v.dataset.view];
        // take the short way round
        const twoPi = Math.PI * 2; let d = (th - S.tTheta) % twoPi; if (d > Math.PI) d -= twoPi; if (d < -Math.PI) d += twoPi;
        S.tTheta += d; S.tPhi = ph; S.tDist = R * 2.9;
      }
      if (t) {
        const on = t.getAttribute("aria-pressed") !== "true"; t.setAttribute("aria-pressed", String(on));
        if (t.dataset.toggle === "wire") { mat.wireframe = on; dirty = true; }
        if (t.dataset.toggle === "spin") S.spin = on;
      }
    });
    if (reduce) bar.querySelector('[data-toggle="spin"]').title = "Off by default because reduced motion is on";
  }

  btn.addEventListener("click", start);
})();
