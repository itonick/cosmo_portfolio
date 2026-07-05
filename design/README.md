# Handoff: 宇宙の神秘 3D ポートフォリオ (Cosmic Mystery 3D Portfolio)

## Overview
A single-page, scroll-driven personal portfolio for a backend engineer. The page renders a continuous 3D "space voyage" in the background (built with Three.js) while five content sections scroll over it. As the user scrolls, a camera flies forward through five cosmic phenomena, each mapped to a portfolio section:

| Section | Cosmic phenomenon | Content |
|---|---|---|
| 01 Hero | 六角形の巨大嵐 (Saturn's hexagonal north-pole storm) | Name + title |
| 02 About | アインシュタイン・リング (Einstein ring / gravitational lensing) | Career timeline |
| 03 Skills | スクエア・ネブラ (Square Nebula / MWC 922) | Skill categories |
| 04 Projects | 黄金比と対数螺旋 (Golden-ratio logarithmic spiral galaxy) | Project cards |
| 05 Contact | 宇宙ひもと大規模構造 (Cosmic web / large-scale structure) | Contact links |

The tone is a dark, scientific "observatory / telemetry" aesthetic (monospace HUD labels, faint coordinates, a progress bar). Copy is in Japanese with English section headers.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype that demonstrates the intended look, motion, and behavior. **They are not production code to copy directly.**

- `Cosmic Portfolio.dc.html` is a "Design Component" (DC) file. It relies on a proprietary runtime (`support.js`) that transpiles a custom template syntax (`<x-dc>`, `{{ }}` holes, `ref="{{ }}"`, `style-hover`) into React at load time. **Do not ship `support.js` or the `.dc.html` format.** It is included only so you can open the prototype in a browser and study exact values and behavior.
- Your task is to **recreate this design in the target codebase's environment** (React, Vue, Svelte, plain TS + Three.js, etc.) using its established patterns. If no codebase exists yet, pick the most appropriate stack — a Vite + React + `three` (or `@react-three/fiber`) setup is a natural fit; plain TypeScript + `three` works equally well since the 3D logic is framework-agnostic.
- The Three.js scene logic (all the `_build*` methods and the render loop) is ordinary framework-agnostic JavaScript and **can be ported almost verbatim**. Only the DOM/React wrapper (refs, lifecycle, props) needs to be rewritten in your framework's idioms.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion timings, and 3D parameters are all specified below and present in the source. Recreate the UI to match. The 3D scene is intentionally procedural (star/particle positions are randomized each load) — exact particle placement is not meaningful, but counts, colors, radii, and motion speeds are.

---

## Tech Stack (recommended target)
- **3D:** `three` (prototype uses r158, loaded from CDN). Any recent version works; the API used is stable (`WebGLRenderer`, `PerspectiveCamera`, `Points`, `Sprite`, `Line`/`LineSegments`/`LineLoop`, `TorusGeometry`, `BufferGeometry`, `FogExp2`, `AdditiveBlending`, `CanvasTexture`).
- **Fonts (Google Fonts):** `Space Grotesk` (400/500/700), `IBM Plex Mono` (400/500), `Noto Sans JP` (300/400/500/700), `Shippori Mincho` (600/700).
- No other runtime dependencies. No images or icon assets are used.

---

## Global Layout & Stacking

The page is a single scroll container. Everything is layered by `z-index`:

- **z:0** — `<canvas>` holder: `position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none`. The Three.js renderer canvas mounts here.
- **z:1** — Vignette overlay (fixed, full-viewport, `pointer-events:none`): `radial-gradient(ellipse at 50% 50%, rgba(4,6,15,0) 52%, rgba(4,6,15,0.6) 100%)`.
- **z:2** — The five `<section>` elements (normal document flow, each `min-height:100vh`).
- **z:6** — Fixed HUD chrome: top nav bar, bottom-left telemetry labels, bottom-right progress bar.
- **z:9** — Loading overlay (removed after load).
- **z:50** — Click-burst particles (transient DOM nodes appended to body).

Page background: `#04060f` on both `html/body` and the Three.js scene (`scene.background`), so the fixed canvas and the flowing sections share one seamless void.

---

## Design Tokens

### Colors
| Token | Hex / value | Usage |
|---|---|---|
| Void background | `#04060f` | Page + scene background, fog color |
| Card surface | `rgba(5,8,18,0.62)` | All content cards |
| Card border | `rgba(140,165,225,0.16)` | Default card border |
| Card border (blue hover) | `rgba(140,185,245,0.55)` | About/Skills card hover |
| Card border (gold hover) | `rgba(224,184,102,0.5)` | Project card hover |
| Text primary | `#e9edf7` / `#eef2fa` / `#f0f4fc` | Headings, body |
| Text muted | `rgba(210,222,245,0.6)` – `rgba(212,222,244,0.75)` | Subtitles, paragraphs |
| Accent blue | `#6ab0f0` / `#4a9de8` / `#7db8f5` | Storm, ring, "blue" HUD labels |
| Accent violet | `#9d8af5` / `#8a5cf5` / `#b48af8` | Nebula, "data" HUD labels |
| Accent gold | `#e0b866` | Spiral / Projects section |
| Chip blue bg / border | `rgba(74,157,232,0.07)` / `rgba(140,165,225,0.25)` | Language & framework chips |
| Chip violet bg / border | `rgba(138,92,245,0.08)` / `rgba(157,138,245,0.28)` | Data & infra chips |
| Selection | `rgba(122,150,245,0.35)` | `::selection` |
| Progress bar fill | `linear-gradient(90deg,#4a9de8,#9d8af5)` | |
| Hero name gradient | `linear-gradient(100deg,#f0f4fc 20%,#7db8f5 45%,#c9b3ff 60%,#f0f4fc 85%)` | animated text fill |

### Typography
- **Display / headings:** `Space Grotesk`, weight 700.
  - H1 (hero name): `font-size: clamp(54px,8.5vw,112px)`, `line-height:0.98`, `letter-spacing:0.03em`.
  - H2 (section titles): `clamp(38px,5vw,64px)`, `line-height:1.02`, `letter-spacing:0.02em`.
- **HUD / mono labels:** `IBM Plex Mono`. Sizes 10–14px, `letter-spacing:0.14em–0.34em`, often uppercase.
- **Body (Japanese):** `Noto Sans JP`. Body copy 13–14px, `line-height:1.95–2.1`.
- **Poetic-tone heading override:** `Shippori Mincho` (serif), weight 600, `letter-spacing:0.08em`.

### Spacing / structure
- Section padding: `120px 24px` (hero adds extra bottom padding `140px`; contact `120px 24px 80px`).
- Content max-widths: About card `540px`; Skills grid `1000px`; Projects column `1160px` wrapper with `560px` cards; nav/HUD full width with `20px 28px` padding.
- Card padding: About `42px 44px`, Skills `24px 26px`, Projects `28px 32px`.
- Skills grid: `repeat(auto-fit, minmax(290px, 1fr))`, `gap:14px`.
- No border-radius anywhere — all cards and chips are sharp rectangles (deliberate).

### Motion timings
- Card hover: `transform:translateY(-6px)` + border-color + box-shadow, `transition: 0.5s cubic-bezier(0.22,1,0.36,1)`.
  - Blue cards shadow: `0 14px 44px rgba(46,90,200,0.28)`. Gold (project) cards shadow: `0 14px 44px rgba(120,90,30,0.22)`.
- Scroll reveal: each section child starts `opacity:0; translateY(30px)`, animates to visible over `0.9s cubic-bezier(0.22,1,0.36,1)` with a per-child stagger of `0.13s`. Triggered by IntersectionObserver at `threshold:0.12`. Elements already in the viewport on load are shown immediately (no fade).
- Hero name: `floatY 7s ease-in-out infinite` (translateY 0 → -9px → 0) + `gradFlow 9s linear infinite` (background-position sweep for the animated gradient fill).
- Blink cue (`SCROLL TO DESCEND ▼`, loader text): `blinkCue` opacity 0.85 ↔ 0.2.
- Loader bar: `loadBar 1.4s cubic-bezier(0.22,1,0.36,1)` scaleX 0→1.

---

## Sections (content & structure)

### 01 — Hero (`#sec1`)
Centered column. Order: mono eyebrow `OBS.01 — HEXAGONAL STORM / SATURN NORTH POLE` (`#6ab0f0`) → H1 `TAKUMI` / `HOSHINO` (animated gradient text) → subtitle `星野 拓海 — バックエンドエンジニア` (letter-spacing 0.5em) → paragraph (max-width 480px) → absolute-bottom blinking `SCROLL TO DESCEND ▼`.
Paragraph: 「大規模分散システムの設計と運用が専門。土星の北極で60年以上崩れない六角形の嵐のように、秩序を保ち続けるシステムをつくります。」

### 02 — About (`#sec2`)
Left-aligned single card (max-width 540px) inside a 1160px wrapper. Card contains: mono eyebrow `OBS.02 — EINSTEIN RING / GRAVITATIONAL LENSING` → H2 `ABOUT` → subtitle `経歴 — 光は重力で曲がり、道は出会いで曲がる` → intro paragraph → 4 timeline rows.
Timeline rows (year in mono `#6ab0f0`, 56px wide, then title + subtitle; each row `border-top:1px solid rgba(140,165,225,0.14)`, padding `16px 0`, gap 20px):
- **2018** — SIerで基幹システム開発 / Java / Oracle — 金融系バッチ処理の設計・運用
- **2020** — スタートアップの1人目バックエンド / Go / AWS — ゼロからのマイクロサービス基盤構築
- **2022** — 決済基盤のテックリード / ピーク12,000 TPSの決済システムを設計・運用
- **2025** — 独立 — 技術顧問 / 設計支援 / 大規模データ基盤・分散システムの設計コンサルティング

### 03 — Skills (`#sec3`)
Centered header (eyebrow `OBS.03 — SQUARE NEBULA / MWC 922` in violet `#9d8af5`, H2 `SKILLS`, subtitle `スキル — 星雲は、4つの象限に区切られる`) over a 2×2 auto-fit grid of 4 cards. Each card: header row with mono category label + Japanese label, then a wrapping row of chips (`gap:8px`).
- **LANGUAGES / 言語** (blue chips): Go, Python, TypeScript, Rust, SQL
- **FRAMEWORKS / API / 通信・実装** (blue chips): gRPC, Gin, FastAPI, NestJS, GraphQL
- **DATA / データ基盤** (violet chips): PostgreSQL, Redis, Kafka, Elasticsearch, BigQuery
- **INFRA / OPS / インフラ・運用** (violet chips): AWS, GCP, Kubernetes, Terraform, Docker, GitHub Actions

### 04 — Projects (`#sec4`)
1160px wrapper. Header (eyebrow `OBS.04 — GOLDEN SPIRAL / LOGARITHMIC GALAXY` in gold `#e0b866`, H2 `PROJECTS`, subtitle `実績 — 渦巻銀河の腕のように、中心から外へ`). Three cards (max-width 560px each) staircased rightward with increasing left margin (`0`, `6vw`, `12vw`) to echo a spiral arm. Each card: top row with a golden `φ¹/φ²/φ³` marker + mono tech-stack label; project title; description; a 3-metric row (mono numbers 20px + tiny uppercase labels).
- **φ¹ リアルタイム決済基盤** — GO / KAFKA / POSTGRESQL / K8S — metrics: 12,000 PEAK TPS · 45ms P99 LATENCY · 99.99% SLA
- **φ² 検索基盤リプレイス** — PYTHON / ELASTICSEARCH — metrics: 240M DOCUMENTS · 80→18ms P50 QUERY · -62% INFRA COST
- **φ³ マルチテナントSaaS API基盤** — GO / GRPC / TERRAFORM — metrics: 340 TENANTS · 99.98% UPTIME · 90s DEPLOY

### 05 — Contact (`#sec5`)
Centered column. Eyebrow `OBS.05 — COSMIC WEB / LARGE-SCALE STRUCTURE` → H2 `CONTACT` → subtitle `連絡先 — すべての銀河は、見えない糸でつながっている` → paragraph → 3 outlined buttons (EMAIL `mailto:hello@hoshino.dev`, GITHUB, X / TWITTER) with hover fill → footer `© 2026 TAKUMI HOSHINO — RENDERED WITH THREE.JS`.
Button: `padding:15px 28px`, `border:1px solid rgba(140,165,225,0.32)`, `background:rgba(74,157,232,0.08)`; hover → `background:rgba(74,157,232,0.22)`, `border-color:rgba(140,185,245,0.6)`.

> **All content above is placeholder/dummy** (name, dates, metrics, links). Replace with the real engineer's details.

---

## HUD Chrome (fixed overlays)
- **Top nav** (`z:6`, gradient fade background `linear-gradient(rgba(4,6,15,0.75), rgba(4,6,15,0))`): left brand `T.HOSHINO — BACKEND ENGINEER`; right anchor nav `01 STORM / 02 RING / 03 NEBULA / 04 SPIRAL / 05 WEB` linking to `#sec1..#sec5`. Nav links hover to `#ffffff`. Bar is `pointer-events:none` except the `<nav>`.
- **Bottom-left telemetry** (mono): two lines that update per active section — a label (e.g. `OBS.01 — HEXAGONAL STORM`) and a coordinate string (e.g. `SATURN — 78.1°N / Ø 29,000 KM`). The coordinate strings per section: `SATURN — 78.1°N / Ø 29,000 KM`, `LRG 3-757 — COSMIC HORSESHOE`, `MWC 922 — RED SQUARE NEBULA`, `M51 — LOGARITHMIC SPIRAL / φ`, `LANIAKEA — 520 MLY`.
- **Bottom-right progress bar** (150×2px track, gradient fill): width = scroll progress 0–100% through the whole page.

---

## 3D Scene — camera & render loop

**Setup:** `PerspectiveCamera(fov 58, near 0.1, far 600)`, initial position `(0, 3, 56)`. `FogExp2(0x04060f, 0.0072)`. Renderer `antialias:true`, `pixelRatio = min(devicePixelRatio, 2)`, sized to the window and resized on `resize`.

**Scene layout along -Z:** the five phenomena sit at `z = [0, -170, -340, -510, -680]`, with small x-offsets `[0, -9, 0, 9, 0]`. A camera "waypoint" is derived per section (`{x, y:(section0?3:0), z:z+56}`) and a matching "look-at" target (`{x, y:0, z}`).

**Scroll → camera:** an eased scroll value (`_seg`, 0–4) picks which pair of waypoints to interpolate between, using smoothstep between them. Two extra live motions layer on top:
- Constant idle sway: `x += sin(t*0.3)*0.7`, `y += cos(t*0.22)*0.5`, plus a subtle roll `camera.rotation.z += sin(t*0.13)*0.015`.
- Scroll-velocity FOV "warp": `fov = 58 + min(9, |targetSeg - currentSeg| * 26)` — the faster you scroll, the wider the FOV, giving a warp feel.
- Mouse parallax: normalized cursor offset shifts camera position (`* parallax * 3.2`) and look-at target.

All easing is exponential smoothing (`value += (target - value) * factor` per frame; factors ~0.05–0.07). `dt` is clamped to 0.1 to avoid jumps after tab-switch.

**Active-section detection:** `round(_seg)` clamped 0–4 drives which telemetry label/coord shows and (implicitly) which phenomenon is centered.

### The five phenomena (all use additive-blended `Points` clouds + glow `Sprite`s built from a radial-gradient `CanvasTexture`)

A shared Gaussian helper `_g()` = `(rand+rand+rand-1.5)/1.5` gives a bell-curve spread. Particle counts scale by a `density` factor (0.4–1.6).

1. **Hexagonal Storm** (`z=0`, tilted `rotation.x=-0.5`): 3 concentric particle bands. A hexagon-warp function `_hexShape(θ)` bends the outer bands from circular to hexagonal (inner band `hex:0` circular → outer `hex:1` fully hexagonal). Colors lerp white `#f2f6ff` → blue `#4a9de8` → violet `#8a5cf5` by radius. Each band rotates at its own speed (0.20 / 0.08 / 0.05). Two hexagonal outline `Line` loops (radii 16.4, 17.6) slowly rotate. Central pulsing glow sprite.
2. **Einstein Ring** (`z=-170`): a bright central lens glow sprite (pulsing scale), a ring of particles at radius 13.5 whose brightness peaks top & bottom (`pow(|sin θ|,3)`) to mimic a lensed arc, a faint full `TorusGeometry` ring + two brighter partial arc toruses that rotate, and 10 scattered background galaxy glows. Ring particles rotate at 0.11.
3. **Square Nebula** (`z=-340`, `rotation.z≈0.08` with slow oscillation): particles biased (72%) toward the four edges of a square (half-size H=11) to form a hollow square, plus interior fill. Colors lerp violet `#8a5cf5` ↔ blue `#4a9de8`. Two square `LineLoop` outlines (H and H×1.18) + two faint diagonal `LineSegments`. Central pulsing star sprite + large soft halo.
4. **Golden Spiral Galaxy** (`z=-510`, tilted `rotation.x=-0.45`): two logarithmic-spiral arms `r = a·e^(b·θ)` where `b = ln(φ)/(π/2)` (φ = golden ratio), `θ` up to `4.1π`, offset by 0 and π. Spread widens with radius. Colors lerp warm core `#fff2d8` → gold `#e0b866` → blue `#4a9de8`. Dense central bulge cloud + a golden guide `Line` tracing the ideal spiral + core glow. Whole group rotates at -0.04.
5. **Cosmic Web** (`z=-680`, `rotation.x=0.15` oscillating): ~300 nodes clustered around 11 random "supercluster" centers plus 40 scattered field nodes. Edges (`LineSegments`) connect any two nodes closer than `sqrt(72)`, capped at degree 5 per node, drawn faint blue `#4a7ad6`. Four soft cluster-halo sprites. Group slowly rotates on Y (0.055).

Plus two ambient layers spanning the whole depth:
- **Starfield:** ~2600 points scattered across `z ∈ [60, -760]`, slightly blue-tinted, with a global twinkle (`material.opacity = 0.55 + sin(t*1.6)*0.15 + sin(t*4.3)*0.07`).
- **Comets / shooting stars:** 3 elongated sprites (`scale 5.5×0.4`) that streak diagonally across random depths, fade in/out over a 2.2–5s life via `sin(π·life/max)`, then respawn.

---

## Interactions & Behavior
- **Scroll:** drives camera fly-through, per-section telemetry labels, progress bar, and section reveals. Uses a captured, passive scroll listener on `document`.
- **Mouse move:** parallax on camera + look-at (eased).
- **Click anywhere:** spawns 12 small colored circle particles (`#7db8f5 / #b48af8 / #e0b866 / #f0f4fc`, 3–7px, `box-shadow` glow) that burst outward via the Web Animations API over 0.6–1.1s and remove themselves. Fixed-position, `z:50`, `pointer-events:none`.
- **Loading overlay:** shows `CALIBRATING OBSERVATORY` + an animated bar; hidden (fade-out 0.8s then `display:none`) ~900ms after the Three.js scene initializes, with a 4s hard-timeout fallback so it never gets stuck if WebGL/Three fails to load.
- **Resize:** renderer + camera aspect updated.
- **Reduced motion / perf:** the prototype exposes a `density` control (0.4–1.6) that scales particle counts; consider wiring this to `prefers-reduced-motion` and/or a device-tier check in production. `pixelRatio` is already capped at 2.

## State / Props (tweakable parameters in the prototype)
These were exposed as editor "tweaks"; treat them as configurable props/constants:
- `tone`: `observatory` (default) | `poetic` | `minimal`.
  - **observatory**: as described above.
  - **poetic**: headings switch to `Shippori Mincho` serif (weight 600, letter-spacing 0.08em); mono labels tinted violet `rgba(196,186,240,0.8)`.
  - **minimal**: headings weight 400 + letter-spacing 0.12em; all decorative HUD elements (`[data-hud]`: telemetry, scroll cue) hidden; mono labels dimmed to opacity 0.55.
  - Implemented in the prototype by injecting a `<style>` override; in production, prefer conditional classes/variants.
- `speed` (0.2–2.5, default 1): global multiplier on all rotation/animation speeds.
- `parallax` (0–2, default 1): mouse-parallax strength.
- `density` (0.4–1.6, default 1): particle-count multiplier.

## Cleanup / lifecycle
On unmount: cancel the RAF loop, remove scroll/mouse/resize/click listeners, disconnect the IntersectionObserver, and dispose all Three.js geometries/materials/textures + the renderer, and remove the canvas from the DOM. (See `componentWillUnmount` and `_dispose` in the source.)

## Accessibility notes
- Content is real DOM (headings, links, text) over the canvas — keep it that way so it stays selectable and screen-reader accessible. The canvas is purely decorative (`pointer-events:none`, no ARIA needed, or `aria-hidden`).
- Ensure text contrast holds over the darkest scene moments (the vignette + `text-shadow` on hero/section text already help).
- Honor `prefers-reduced-motion`: disable the float/gradient/idle-sway/comet motion and reduce density.

## Files in this bundle
- `Cosmic Portfolio.dc.html` — the design-reference prototype (open in a browser to study look & motion). **Reference only — do not ship. Requires `support.js` to run.**
- `support.js` — the proprietary DC runtime the prototype depends on. **Do not ship; not part of the deliverable.**
- `README.md` — this document (self-sufficient spec).
