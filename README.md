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
| `photos-data.js` | The list of photos and the print sizes — **edit here** |
| `photos/` | Image files (placeholders for now) |
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

Drop image files into `photos/`, then list them in `photos-data.js`:

```js
window.PHOTOS = [
  { src: "photos/sunset.jpg", caption: "Golden hour, 2024" },
  ...
];
```

The caption shows on hover and on the order screen. Reorder the lines to
reorder the album.

## Web3Forms setup (gets orders into an inbox)

See the step-by-step in `SETUP.md`.

## Hosting on GitHub Pages + QR code

See the step-by-step in `SETUP.md`.

## Preview locally

```
py -m http.server 8000
```
then open http://localhost:8000
