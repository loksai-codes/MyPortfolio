# Loksai Palyam — 和室 portfolio

A moonlit Japanese room (washitsu) you can walk into: a vanilla Three.js scene with a React overlay, bilingual (EN | 日本語), generative koto music and a companion called Ren.

**Stack:** Next.js 16 (App Router) · TypeScript (strict) · three r187 · Zustand · deployed on Vercel.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production build
```

Quality gates:

```bash
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint (next/core-web-vitals + typescript)
npm run format       # Prettier
npm run build && npx playwright test   # smoke test: loads, enters, every section in EN + JA, fallback, deep link
```

## Edit your content

All copy lives in **`src/content/`**. Each user-facing string is typed `L10n = { en; ja }`, and nothing in `components/` or `engine/` is hard-coded.

| File                                                                                       | What it holds                                                                      |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `profile.ts`                                                                               | name, kana, roles, email, links, portrait, SEO description                         |
| `ui.ts`                                                                                    | buttons, hints, intro text, accessibility labels                                   |
| `sections.ts`                                                                              | nav order, nav labels, panel-spine kanji, 3D hotspot labels                        |
| `about.ts` `projects.ts` `experience.ts` `skills.ts` `quests.ts` `gallery.ts` `contact.ts` | the panels                                                                         |
| `ren.ts`                                                                                   | Ren's greeting, the lines he says when petted, his per-section comments            |
| `scene.ts`                                                                                 | text painted into the 3D room (the scroll, the lantern glyph, the laptop terminal) |

To add a project, add one object to `projectList` in `projects.ts`. To add a gallery photo, drop the JPG into `public/assets/` and add `{ src: "file-name", caption: { en, ja } }` to a tab in `gallery.ts`.

## How it's built

```
src/
  app/          layout (fonts, metadata, JSON-LD), page, OG image, sitemap, robots, /dev/engine harness
  content/      typed bilingual copy (see above)
  components/   React overlay: TopBar, Hero, Hotspots, RenBubble, Panel/*, Intro/*, Lightbox, Cursor…
                Experience.tsx mounts the engine (next/dynamic, ssr:false); Fallback.tsx = text-only page
  engine/       framework-free TypeScript: Engine, camera rig, picker, textures/, materials/ (GLSL),
                house/, world/, characters/Ren
  audio/        Web Audio: Karplus-Strong koto, shakuhachi, bells, SFX, Sakura Sakura composition
  voice/        Web Speech wrapper for Ren (ducks the music while he talks)
  store/        Zustand: language, open section, entered, sound, voice, gallery tab…
```

- **React never touches Three.js objects.** It calls the engine API (`focus`, `openDoors`, `petRen`, `setLanguage`, `dispose`) and listens to its events (`select`, `hover`, `renSay`, `sound`).
- **Parity with the original r128 scene.** Colour management is off and the r128 point-light falloff is restored (one guarded shader-chunk edit). Light intensities are multiplied by π, and indirect light gets a measured ×1.06 (see `engine/core/legacyLights.ts`).
- **Performance.** A deliberately minimal studio backdrop (gradient cyclorama dome, one floor plane, a round plinth, two contact-shadow decals). The shadow map is static, the pixel ratio adapts, and rendering pauses while the tab is hidden. Shaders are precompiled with `compileAsync`, and `dispose()` frees every geometry, material and texture. Audio code loads on idle, and the AudioContext is only created inside a click.
- **Accessibility and SEO.** Every panel is semantic HTML reachable from the nav by keyboard, and Esc closes things. With JavaScript off or no WebGL, a text version of every section (EN + JA) is shown, and it is always present in the HTML. `prefers-reduced-motion` skips the camera tweens and intro animations. Deep links such as `/#projects` open that panel after you enter.

## Visual-regression tooling

The original single-file site is kept in `reference/` as the baseline.

```bash
./scripts/serve.sh                 # build (with the /dev/engine harness) and start on :3000
npm run shots:ref                  # reference screenshots → shots/reference
npm run shots && npm run shots:diff   # current screenshots + diff report → shots/report.html
node scripts/calib.mjs             # 3D-only comparison (overlay hidden), luminance per view
node scripts/sequence.mjs          # intro → doors → camera timeline
node scripts/audio-check.mjs       # audio activity vs reference
node scripts/a11y-check.mjs        # no-JS / no-WebGL / reduced motion / keyboard
node scripts/perf.mjs              # fps + GPU resources before/after dispose
```

Trees, rocks, stars and clouds are randomised on every load (as in the original), so those areas always show up in pixel diffs.

## Deploy (Vercel)

The project is zero-config on Vercel: `next build` runs as-is, and cache headers for `/assets/*` come from `next.config.ts`.

1. Push to GitHub.
2. Vercel → **Add New… → Project** → import the repository → **Deploy**.
3. **Settings → Domains** → add `loksaipalyam.in` and `www.loksaipalyam.in`, then add the DNS records Vercel shows at your registrar.
