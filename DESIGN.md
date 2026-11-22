# DESIGN.md: Loksai Palyam — 和室 Portfolio

A moonlit washitsu you walk into. The 3D room carries the mood; the HTML layer stays quiet and
literary: washi paper, sumi ink, a vermilion seal (shu) and lantern gold. The one idea: every
section is a hanging scroll (kakejiku) unrolled beside the room, so UI reads as paper objects in
the scene, never as app chrome. Tokens live in `src/styles/base.css` `:root`.

## 1. Colour

| Token                           | Value               | Role                                                                   |
| ------------------------------- | ------------------- | ---------------------------------------------------------------------- |
| `--night`                       | `#0c0e22`           | page / scene background, theme colour                                  |
| `--ink`                         | `#141117`           | text on paper, dark chips, primary button                              |
| `--ink-muted`                   | `#645f5c`           | secondary text on paper (≥4.9:1 on the darkest sheet tone)             |
| `--washi`                       | `#f2e8d5`           | text on night and on the scene                                         |
| `--paper`                       | `#f4ecdc`           | paper fills (timeline markers, quest kanji)                            |
| `--shu`                         | `#b8382c`           | seal, kickers, subtitles, rules, button hover (4.8:1 on paper)         |
| `--gold`                        | `#d9b46a`           | hairlines, underlines, diamonds (decorative only, never text on paper) |
| `--gold2`                       | `#f3dc9c`           | active / hover text on dark, cursor, stats numbers                     |
| `--sakura`                      | `#f0b8c8`           | kicker lines over the scene (hero, intro)                              |
| `--ren`                         | `#a58bd8`           | Ren's badge only                                                       |
| `--tile-bg` / `--tile-bg-hover` | white 55% / white   | panel tiles                                                            |
| `--label-halo`                  | layered dark shadow | hotspot labels over the bright scene                                   |
| `--label-backing`               | night 65%           | behind hotspot label text: ≥4.9:1 even over white shoji glare          |
| `--line-strong`                 | ink 50%             | borders that identify a control (ghost button): 3.4:1 on paper         |
| `--scroll-edge`                 | `#b89a5a`           | gilt edge of the hanging scroll, scrollbar                             |
| `--paper-sheet`                 | `#f7f0e1 → #efe4cc` | scroll sheet and text-only fallback background                         |
| `--bubble-bg`                   | paper 96%           | Ren's speech bubble                                                    |
| `--intro-muted`                 | `#b8afc7`           | quiet text on the intro screen                                         |

Alpha variants are written as `rgba(var(--ink-rgb), 0.1)` using the `--*-rgb` channel tokens
(ink, night, washi, paper, gold, gold2, shade). Raw values left in the CSS are material one-offs
(wood rod and gilt cap gradients, mount green, hanko inset), neutral black shadows and white.

Proportion: scene ~70%, paper ~25%, shu + gold ~5%. Rules: gold never carries text on paper;
shu is for small emphasis (kickers, subtitles, one rule segment), not body copy. Focus rings are
`--gold2` on the scene and `--ink` on paper (`app.css`).

## 2. Typography

Cormorant Garamond (`--disp`) for Latin display, Shippori Mincho B1 (`--serif`) for Japanese and
literary accents, Zen Kaku Gothic New (`--sans`) for body and UI. Latin caps labels are small and
widely tracked (0.12–0.5em), so the small end of the scale moves in 1px steps.

| Role                              | Size                   | Line-height | Weight       | Tracking      | Token                       |
| --------------------------------- | ---------------------- | ----------- | ------------ | ------------- | --------------------------- |
| Intro / hero name                 | clamp 56–128 / 44–86px | 0.88–0.92   | 600          | -0.01em       | fluid                       |
| Panel title                       | 48px (JA 40px)         | 1           | 600 (JA 800) | -0.005em      | `--text-6xl` / `--text-5xl` |
| Stats number                      | 40px                   | 1           | 600          | —             | `--text-5xl`                |
| Card title                        | 30px                   | 1           | 600          | —             | `--text-4xl`                |
| Spine kanji, path abbr.           | 24px                   | 1           | 700–800      | 0.6em (spine) | `--text-3xl`                |
| Brand, quest title                | 22px                   | 1–1.1       | 600          | 0.06em        | `--text-2xl`                |
| Section h3, timeline role         | 18px                   | —           | 700–800      | —             | `--text-xl`                 |
| Seal                              | 16px                   | —           | 800          | —             | `--text-lg`                 |
| Panel body                        | 15px                   | 1.9         | 400          | —             | `--text-base`               |
| Card / list text                  | 14px                   | 1.7–1.8     | 400          | —             | `--text-md`                 |
| Subtitles, tags, small text       | 13px                   | 1.7         | 400–700      | 0.04–0.12em   | `--text-sm`                 |
| Nav, buttons, chips               | 12px                   | —           | 400–700      | 0.1–0.4em     | `--text-xs`                 |
| Kickers, captions                 | 11px                   | —           | 400–700      | 0.3–0.5em     | `--text-2xs`                |
| Micro labels (JA nav sub, counts) | 10px                   | —           | 400          | 0.3em         | `--text-3xs`                |

## 3. Spacing and layout

4px grid: `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 ·
`-12` 48 · `-16` 64 · `-24` 96. Steps 20 and 40 exist because the bar, hero and panel gutters
use them. Raw px remain only for hairlines, negative geometry (scroll rod caps) and the docked
bubble's badge inset; each is commented.

- Overlay gutters: 40px desktop, 20px mobile; top bar height is measured into `--bar-h`.
- Panel: `min(580px, 46vw)` wide, starts below the bar; body padding 40/40/64px.
- Tiles: `--tile-pad` (20px), `--tile-pad-compact` (16px) in two-column grids. Static tiles only
  brighten on hover; only links (contact rows) move.
- Breakpoint: 900px (bar collapses to a menu, panel becomes an 80%-height bottom sheet).

## 4. Motion

`--ease` `cubic-bezier(.77,0,.18,1)` for movement; `--dur` 0.3s for state changes, `--dur-slow`
0.4s for larger surfaces. Transitions always name their properties. `:hover` styles live inside `@media (hover: hover)` so they never stick after a tap; hotspot labels ease their collision offset in the engine instead of jumping. Long reveals (scroll unroll
1.1s, intro 1.2–2.6s) are part of the ceremony. Under `prefers-reduced-motion` everything
completes instantly and loops run once.
