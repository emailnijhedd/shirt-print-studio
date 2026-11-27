# Phabrika

Design shirt prints on a flat pattern and preview them on a 3D shirt. Runs entirely in the browser: designs and artwork never leave the user's device.

Styles: T-shirt Men, T-shirt Woman, Polo shirt Men, Polo shirt Women, V-neck Jersey Men, V-neck Jersey Women, Basketball Jersey.

## Publish on GitHub Pages

1. Create a new repository on GitHub (for example `shirt-print-studio`). Public works on any plan; a private repo needs a paid plan for Pages.
2. Upload **everything inside this folder** to the repo root, keeping the folders (`s`, `p`, `lib`, `fonts`, `icons`) and the hidden `.nojekyll` file.
   - Easiest: on the repo page choose **Add file → Upload files**, drag the folder contents in, then **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at `https://<your-username>.github.io/shirt-print-studio/`.

## Install it as an app

- **Windows / Mac (Chrome or Edge):** open the link, then click the install icon in the address bar (or menu → *Install Phabrika*). It gets its own window and desktop/Start-menu icon.
- **Android (Chrome):** menu ⋮ → *Install app* / *Add to Home screen*.
- **iPhone / iPad (Safari):** Share → *Add to Home Screen*.

After the first open (give it about a minute on a slow connection), every style works offline.

## Updating the app

1. Replace the changed files in the repo.
2. Open `sw.js` and change the `VERSION` line (for example `v1-2026-11-26` → `v2-2026-12-03`). This tells installed copies to refresh.
3. Users get the new version the next time they open the app (sometimes it takes one extra reopen).

## Files

| Path | What it is |
|---|---|
| `index.html` | The app |
| `s/` | 3D shirt models (`*.json`) and fabric textures (`*_knit.png`) for each style |
| `p/` | Pattern images (drip, pastel triangles) |
| `lib/` | three.js r128, OrbitControls, JSZip (local copies, no internet needed) |
| `fonts/` | Inter, Inter Tight, Anton, Bebas Neue, Permanent Marker, Archivo Black (SIL Open Font License) |
| `icons/` | App icons |
| `manifest.webmanifest`, `sw.js` | Install and offline support |

## Test on your own computer

Opening `index.html` by double-click will not load the shirts (browsers block that). Run a small local server in this folder instead, for example `python -m http.server 8000`, then open `http://localhost:8000`.
