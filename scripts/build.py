"""Build a deployable copy of the site in dist/.

  python3 scripts/build.py            # dist/ : prerendered static site (best for SEO)
  python3 scripts/build.py --embed    # also writes dist-embed/ : same site without the
                                      # <html>/<head>/<body> wrapper, for hosts that add their own

Prerendering opens the page in headless Chromium (Playwright) and saves the rendered HTML,
so search engines and link previews see every project description without running JavaScript.
The JavaScript still runs on top of it in the browser. Requires: pip install playwright.
If Playwright is missing, dist/ is a plain copy of the source (the site works the same).
"""
import http.server, re, shutil, socketserver, sys, threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
COPY = ["index.html", "css", "js", "assets", "robots.txt"]


def copy_tree(dest):
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir()
    for item in COPY:
        src = ROOT / item
        if src.is_dir():
            shutil.copytree(src, dest / item)
        elif src.exists():
            shutil.copy2(src, dest / item)


def prerender():
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Playwright not installed; dist/ is an un-prerendered copy.")
        return None
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = lambda *a, **k: Quiet(*a, directory=str(ROOT), **k)
    with socketserver.TCPServer(("127.0.0.1", 0), handler) as httpd:
        port = httpd.server_address[1]
        threading.Thread(target=httpd.serve_forever, daemon=True).start()
        with sync_playwright() as p:
            b = p.chromium.launch()
            pg = b.new_page(viewport={"width": 1440, "height": 900})
            # External fonts/CDN are not needed to capture the DOM.
            pg.route(re.compile(r"https://(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)/.*"), lambda r: r.abort())
            pg.goto(f"http://127.0.0.1:{port}/index.html", wait_until="load")
            pg.wait_for_function("document.documentElement.classList.contains('js-ready')")
            html = pg.content()
            b.close()
        httpd.shutdown()
    html = html.replace(' class="js-ready"', "")
    if not html.lower().startswith("<!doctype"):
        html = "<!doctype html>\n" + html
    return html


def strip_wrapper(html):
    html = re.sub(r"<!doctype html>\s*", "", html, flags=re.I)
    html = re.sub(r"</?(html|head|body)\b[^>]*>", "", html, flags=re.I)
    html = re.sub(r'<meta charset="utf-8">\s*', "", html, flags=re.I)
    html = re.sub(r'<meta name="viewport"[^>]*>\s*', "", html, flags=re.I)
    return html.strip() + "\n"


def main():
    copy_tree(DIST)
    html = prerender()
    if html:
        (DIST / "index.html").write_text(html, encoding="utf-8")
        print("dist/index.html prerendered")
    if "--embed" in sys.argv:
        emb = ROOT / "dist-embed"
        copy_tree(emb)
        src = (DIST / "index.html").read_text(encoding="utf-8")
        (emb / "index.html").write_text(strip_wrapper(src), encoding="utf-8")
        print("dist-embed/index.html written")


if __name__ == "__main__":
    main()
