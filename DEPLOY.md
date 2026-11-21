# Loksai Palyam — 和室 portfolio

The site is fully static: `site/index.html` plus the images in `site/assets/`.
Three.js and the fonts load from public CDNs, so there is nothing to install or build.

## Run it locally (VS Code)
Open the repo folder, then either:
- install the "Live Server" extension, right-click `site/index.html` → "Open with Live Server", or
- run `npx serve site` (or `python -m http.server -d site 8080`) and open the printed URL.
(Opening the file directly with file:// will not load the 3D textures — use a local server.)

## Add it to the loksai-portfolio repo
1. `git checkout -b japanese-room`
2. Copy `site/` and this `netlify.toml` into the repo root (this netlify.toml replaces the Next.js one,
   so Netlify serves the new static site instead of building the old Next.js app).
3. `git add site netlify.toml DEPLOY.md && git commit -m "Japanese room portfolio" && git push -u origin japanese-room`
4. Open a pull request — Netlify builds a deploy preview — then merge to `main` to go live.

## Custom domain: loksaipalyam.in
1. Buy the domain from any registrar that sells .in (if you don't own it yet).
2. Netlify → your site → Domain management → Add a domain → `loksaipalyam.in` (www is added too).
3. Either:
   - Easiest: switch the domain's nameservers at your registrar to the 4 Netlify DNS nameservers Netlify shows you, or
   - Keep your registrar's DNS and add:
     - `@`   A      75.2.60.5   (or ALIAS/ANAME → apex-loadbalancer.netlify.com if your DNS supports it)
     - `www` CNAME  <your-site-name>.netlify.app
4. Wait for DNS to propagate (minutes to a few hours); Netlify issues the free HTTPS certificate automatically.
