# Rabbit Hole

A cinematic, keyboard-first curiosity explorer. React + TypeScript + Vite, entirely static. Every topic has exactly six depths and each depth contains 1-4 explicit floating objects: facts, images, videos or articles. No backend, AI service, API key, or runtime content API.

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
| Up / Down | Descend / backtrack |
| H | Exploration history |
| F | Fullscreen |
| Space | New random story (when not focused on a button/link) |
| Esc | Close overlay |
| ? | Help |

All actions have mouse/touch controls. Swipe up or down to change depth. Tangents are currently disabled. Down unwinds actual navigation, including tangent entries; on a directly loaded deep link it moves up one depth. Topic/depth URLs use hashes so refreshes work on static hosting. The history panel records up to 200 visits. Bookmarks and history stay in localStorage on that browser, with in-memory fallback if storage is blocked. Clearing browser data removes them. Random selection prefers topics outside the most recent eight visits and never immediately repeats the current topic when another exists.

## Add a topic

Copy the entire [GENERATE_TOPIC.md](GENERATE_TOPIC.md) into ChatGPT, replace the TOPIC on its first line, and ask it to research the topic. The prompt is self-contained and includes all field definitions plus a complete six-depth example. Save the returned JSON as `topics/<id>.json`, then run `npm run validate:topics` and `npm run build`. Vite discovers every topic automatically. Adding a file to a deployed site requires rebuilding and deploying.

The current format is **schemaVersion 2**: a topic has exactly six entries in `levels`, and each level has 1-4 entries in `objects`. Each object uses exactly its own type's fields; the renderer displays those objects without filling empty slots or duplicating a takeaway. Version 1 fields (`body`, `takeaway`, and level-level media/source arrays) are no longer used. [topic.schema.json](topic.schema.json) is the machine-readable format for editors and other tools.

`src/schema.ts` is the executable source of truth. Every object is strict. The production build fails on malformed files, duplicate IDs, invalid final levels, broken tangent IDs, and out-of-range tangent depths. During development the UI skips malformed topics and disables broken links, showing diagnostics below the content. No valid topics yields a readable error screen.

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
