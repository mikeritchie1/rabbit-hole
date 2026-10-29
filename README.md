# Rabbit Hole

A cinematic, keyboard-first curiosity explorer. React + TypeScript + Vite, entirely static. Each topic has as many depths as its researched journey needs, and each depth contains 1-4 explicit floating objects: facts, images, videos or articles. No backend, AI service, API key, or runtime content API.

## Run locally

Install Node.js 22.12+ (Node 24 LTS also works). In PowerShell:

```powershell
cd "C:\Users\mjrit\OneDrive\Desktop\Rabbit Hole"
npm install
npm run dev
```

Open the Local URL printed by Vite (normally **http://127.0.0.1:5173**). Keep the terminal open; press Ctrl+C to stop. If that port is occupied Vite prints a different one. Do not double-click index.html.

To test a production build:

```powershell
npm test
npm run build
npm run preview
```

Preview normally serves http://127.0.0.1:4173. `dist/` is the deployable output.

For a TV or phone on the same trusted Wi-Fi, use `npm run dev -- --host 0.0.0.0`, then open `http://YOUR-PC-LAN-IP:5173` on the other device. Windows may prompt to allow Node through the private-network firewall. Fullscreen and clipboard support depend on the browser and security context; ordinary buttons and address-bar sharing still work.

## Controls

| Key | Action |
| --- | --- |
| Up / Down | Descend / move up within the current topic; Down stops at depth 1 |
| Left / Right | Previous / next already-opened topic, at the depth you left it |
| F | Fullscreen |
| Space | Begin / new random story within the selected category |
| Esc | Close overlay |

Explore opens the topic picker, with six topics per page in two rows of three. Clicking a category filters the picker without closing it. Click a topic to enter it, or use Start rabbit hole in category to enter a random matching topic. Space / New Rabbit Hole also use the selected category. All includes every topic. The selection is remembered in localStorage; anonymous recent visits also help avoid immediate repeats. Returning to Welcome keeps the selected category. Down never crosses into another topic. Left and Right move through the topics opened in this page session, stopping at the first and last. Each topic remembers its depth. Space inserts a new topic immediately after the current position and before any topics to its right, preserving that entire forward sequence (for example, A, B, C becomes A, B, New, C when opening New from B). Starting a topic from Explore inserts it in the same way. This sequence lasts until the page is reloaded, including returns to Welcome, with no 200-topic limit. It is separate from the stored recent visits used for random selection. The active category still controls future random choices. Random selection only chooses topics not yet opened in this page session. When none remain, a temporary message says there are no more rabbit holes (or no more in the selected category). Explore can still explicitly reopen a topic. Reloading starts a fresh session; returning to Welcome keeps seen topics. An empty category is disabled.

The four topic categories are:

- **Explained:** extraordinary phenomena with established scientific mechanisms.
- **Unsolved:** genuine mysteries with competing hypotheses.
- **Mind-bending:** discoveries that challenge ordinary intuition.
- **Dark & disturbing:** parasites, disasters, gruesome history and strange behaviour.

Each topic has exactly one category; All is only a filter. Category labels describe the overall surprise, while individual fact evidence badges identify hypotheses or disputes.

Swipe up/down to navigate on touchscreens, or use the on-screen arrows. Navigation can interrupt a flight. The logo returns to Welcome; fullscreen is in the top right. Tangents, bookmarks, history UI, sharing and Help controls are currently disabled or removed. Topic/depth hash URLs work with static hosting.

## Add a topic

Copy the entire [GENERATE_TOPIC.md](GENERATE_TOPIC.md) into ChatGPT, replace the TOPIC on its first line, and ask it to research the topic. The prompt is self-contained and includes all field definitions plus a complete example. Save the returned JSON as `topics/<id>.json`, then run `npm run validate:topics` and `npm run build`. Vite discovers every topic automatically. Adding a file to a deployed site requires rebuilding and deploying.

The current format is **schemaVersion 2**: `category` must be one of the four surprise labels above; `levels` is a nonempty array with no maximum depth count, and each level has 1-4 entries in `objects`. Only the actual last level has `final: true`. Each object uses exactly its own type's fields; the renderer displays those objects without filling empty slots or duplicating a takeaway. Version 1 fields (`body`, `takeaway`, and level-level media/source arrays) are no longer used. [topic.schema.json](topic.schema.json) is the machine-readable format for editors and other tools.

`src/schema.ts` is the executable source of truth. Every object is strict. New files omit tangents; legacy tangent fields are optional and still checked if present. The production build fails on malformed files, duplicate IDs, invalid final levels, broken tangent IDs, and out-of-range tangent depths. During development malformed topics are skipped; the CLI reports validation errors. No valid topics yields a readable error screen.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this folder's contents, including package-lock.json and `.github/workflows/deploy.yml`. Do not commit node_modules or dist.
2. In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. The included workflow runs on pushes to `main` or through **Actions → Deploy Rabbit Hole → Run workflow**. If your default branch differs, update the workflow's branch filter.
4. When deployment succeeds, GitHub displays the Pages URL in Settings → Pages and in the deployment job.

Vite uses `base: './'`; built assets resolve under both `https://USER.github.io/REPO/` and a custom domain. Hash URLs preserve topic/depth without server rewrite rules. The workflow tests content/navigation, builds, uploads dist, and deploys using the standard GitHub Pages actions. No paid hosting is required. See [Vite's Pages guide](https://vite.dev/guide/static-deploy.html#github-pages).

## Content & media

Sources are linked at each depth. Hypotheses and disputed history are labelled. The stories follow connected discoveries within each topic. Tangents point at relevant depths rather than forcing an unrelated connection between birds and dancing mania. The engraving depicts a later Molenbeek outbreak, not an eyewitness scene of Strasbourg.

- Pigeon photo: [Bramans, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rock_pigeon_or_common_pigeon_(Columba_livia).jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The displayed image is cropped/darkened with CSS; that image treatment is available under the same license. The original file is unmodified.
- Dancing engraving: Hendrik Hondius after Pieter Bruegel, 1642, public domain, via [The Public Domain Review](https://publicdomainreview.org/essay/the-dancing-plague-of-1518).
- YouTube thumbnails link to actual videos on YouTube. The RTL episode is in French and is labelled accordingly.
- Fonts: DM Sans and Cormorant Garamond from Google Fonts, with system fallbacks.

External images/fonts need internet access and can be blocked or removed by their hosts. Failed imagery becomes a styled fallback; article/video links remain available. Research links and video identities were checked during creation on 29 October 2026; availability can change. The app itself never fetches an external content API. No analytics or tracking scripts are included.

## Project map

`topics/` stories · `src/schema.ts` validation · `src/navigation.ts` navigation logic · `src/main.tsx` interface · `src/styles.css` styling · `tests/` regression checks · `scripts/validate-topics.ts` CLI validator.
