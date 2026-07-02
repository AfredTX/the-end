# THE END. — print ordering site

A single static page. "THE END." sits in the top-left corner; the photos
fill the center of the page. Tap a photo → pick a print size → an order
email is sent to Abby, who follows up directly to arrange pickup.

No build step, no server.

## Files

| File | What it is |
|------|------------|
| `index.html` | The whole page (anchor + photo grid + order modal) |
| `styles.css` | All styling (white bg, black text) |
| `app.js` | Gallery + order form logic — **set the Web3Forms key here** |
| `photos-data.js` | The photo list (**generated** — run `build-photos.py`) + print sizes (edit here) |
| `build-photos.py` | Makes web-sized copies of your photos and rebuilds the list |
| `publish-photos.ps1` | One-click: pull new photos, build them, commit + push |
| `photos/` | Your original image files (drop them here) |
| `the-end.png` | Top-left logo image — **add this file** (falls back to text) |
| `fonts/` | Optional Loubag font for the text fallback |
| `make-qr.py` | Generates the QR code once the site is live |

## Before going live — set these

1. **Logo** — save your top-left image as `the-end.png` in this folder.
2. **Order email** — see "Web3Forms setup" below, then paste the key into `app.js`.
3. **Print sizes** — edit `window.PRINT_SIZES` in `photos-data.js`
   (placeholders: 4×6, 5×7, 8×10, 11×14; add prices if you want).
4. **Photos** — see "Adding photos" below.

## Adding photos

**If photos were uploaded through the GitHub website** (the usual way), just run
this one command on the computer that has this folder — it pulls the new photos,
builds them, and publishes:

```
.\publish-photos.ps1
```

(First time only, install the image tool: `py -m pip install pillow`. If Windows
blocks the script the first time, run `Set-ExecutionPolicy -Scope CurrentUser
RemoteSigned` once, then retry.)

**If you're adding photos locally instead**, drop the image files (`.jpg`,
`.jpeg`, `.png`) into `photos/`, then run the builder and push:

```
py build-photos.py
git add photos photos-data.js && git commit -m "Add photos" && git push
```

Either way, the builder makes fast web-sized copies (small thumbnails for the
grid, medium copies for the opened view) and regenerates `photos-data.js`. Your
big originals stay in `photos/` as the archive — visitors never download them, so
the page stays fast even with 50+ photos. Re-running only processes files that
changed (`--force` rebuilds everything).

Photos appear in filename order (`photo2` before `photo10`). Captions default to
"Untitled no. 1, 2, 3…" and renumber automatically; edit the `caption:` text in
`photos-data.js` to give one a real title — your custom titles survive rebuilds.

## Web3Forms setup (gets orders into an inbox)

See the step-by-step in `SETUP.md`.

## Hosting on GitHub Pages + QR code

See the step-by-step in `SETUP.md`.

## Preview locally

```
py -m http.server 8000
```
then open http://localhost:8000
