"""
Build the photo album for the site.

What it does:
  1. Scans photos/ for image files you dropped in (.jpg .jpeg .png).
  2. Writes web-sized copies so the page loads fast on phones:
       - photos/thumbs/NAME.jpg   small, for the gallery grid
       - photos/view/NAME.jpg     medium, for the opened (modal) view
     EXIF rotation is baked in, so sideways phone photos come out upright.
  3. Regenerates photos-data.js (the list the page reads).

The big original files stay in photos/ as your archive — visitors never
download them, so 50 photos load quickly.

Usage:
    py -m pip install pillow      (one time)
    py build-photos.py            (rebuilds only what changed)
    py build-photos.py --force    (rebuild every derivative)

Your caption edits and print-size edits in photos-data.js are preserved
across rebuilds — feel free to tweak them by hand.
"""

import os
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  py -m pip install pillow")

HERE = Path(__file__).parent
PHOTOS = HERE / "photos"
THUMBS = PHOTOS / "thumbs"
VIEW = PHOTOS / "view"
DATA_FILE = HERE / "photos-data.js"

THUMB_MAX = 800   # longest side, px — gallery grid (retina-friendly)
VIEW_MAX = 1600   # longest side, px — opened modal view
THUMB_Q = 78
VIEW_Q = 82

SOURCE_EXT = {".jpg", ".jpeg", ".png"}
FORCE = "--force" in sys.argv[1:]
AUTO_CAPTION = re.compile(r"^Untitled no\. \d+$")  # placeholder, safe to renumber

DEFAULT_SIZES = """window.PRINT_SIZES = [
  { dim: "4 \\u00d7 6", price: "" },
  { dim: "5 \\u00d7 7", price: "" },
  { dim: "8 \\u00d7 10", price: "" },
  { dim: "11 \\u00d7 14", price: "" },
];"""


def natural_key(name):
    """Sort so photo2 comes before photo10."""
    return [int(t) if t.isdigit() else t.lower()
            for t in re.split(r"(\d+)", name)]


def find_originals():
    if not PHOTOS.is_dir():
        sys.exit(f"No photos/ folder found at {PHOTOS}")
    files = [p for p in PHOTOS.iterdir()
             if p.is_file() and p.suffix.lower() in SOURCE_EXT]
    files.sort(key=lambda p: natural_key(p.name))
    return files


def preserved_captions():
    """Read existing photos-data.js so hand-edited captions survive a rebuild.
    Matches on the original filename recorded in each entry's `orig:` field."""
    if not DATA_FILE.exists():
        return {}
    text = DATA_FILE.read_text(encoding="utf-8")
    pairs = re.findall(
        r'orig:\s*"([^"]+)"[^}]*?caption:\s*"((?:[^"\\]|\\.)*)"', text)
    return {os.path.basename(orig): cap for orig, cap in pairs}


def preserved_sizes():
    """Keep the existing PRINT_SIZES block (prices/dimensions) verbatim."""
    if not DATA_FILE.exists():
        return DEFAULT_SIZES
    text = DATA_FILE.read_text(encoding="utf-8")
    m = re.search(r"window\.PRINT_SIZES\s*=\s*\[[\s\S]*?\];", text)
    return m.group(0) if m else DEFAULT_SIZES


def is_stale(src, dst):
    return FORCE or not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime


def make_derivative(img, dst, max_side, quality):
    out = img.copy()
    out.thumbnail((max_side, max_side))  # preserves aspect ratio, only shrinks
    if out.mode not in ("RGB", "L"):
        out = out.convert("RGB")
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)


def build():
    originals = find_originals()
    if not originals:
        sys.exit("No images found in photos/ (looked for .jpg .jpeg .png).")

    captions = preserved_captions()
    entries = []
    made = 0

    for i, src in enumerate(originals, start=1):
        stem = src.stem
        thumb = THUMBS / f"{stem}.jpg"
        view = VIEW / f"{stem}.jpg"

        # Load once, upright, to size the view copy and (if needed) rebuild.
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)  # bake in rotation
            if is_stale(src, thumb):
                make_derivative(im, thumb, THUMB_MAX, THUMB_Q)
                made += 1
            if is_stale(src, view):
                make_derivative(im, view, VIEW_MAX, VIEW_Q)
                made += 1
            # aspect ratio comes from the view copy (already upright)
            with Image.open(view) as vw:
                w, h = vw.size

        # Auto "Untitled no. N" captions are placeholders: always renumber to
        # the current gallery position (avoids duplicates when photos are
        # inserted). Only a caption Abby actually customized is kept as-is.
        prev = captions.get(src.name)
        if prev and not AUTO_CAPTION.match(prev):
            caption = prev
        else:
            caption = f"Untitled no. {i}"
        entries.append({
            "thumb": f"photos/thumbs/{stem}.jpg",
            "view": f"photos/view/{stem}.jpg",
            "orig": f"photos/{src.name}",
            "caption": caption,
            "w": w,
            "h": h,
        })

    write_data(entries)
    print(f"{len(entries)} photos listed, {made} web copies (re)generated.")
    print("Wrote photos-data.js")


def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def write_data(entries):
    lines = []
    for e in entries:
        lines.append(
            f'  {{ thumb: "{e["thumb"]}", view: "{e["view"]}", '
            f'orig: "{e["orig"]}", caption: "{js_escape(e["caption"])}", '
            f'w: {e["w"]}, h: {e["h"]} }},'
        )
    photos_block = "window.PHOTOS = [\n" + "\n".join(lines) + "\n];"

    content = f"""/* ============================================================
   PHOTO LIST  —  GENERATED by build-photos.py. Do not add photos
   by hand here; drop image files in photos/ and re-run:

       py build-photos.py

   You MAY edit the caption text below — your edits are preserved
   on the next rebuild (matched by the orig filename).
   ============================================================ */

{photos_block}

/* ============================================================
   PRINT SIZES  —  edit dimensions / prices here (preserved on rebuild).
   Set price to "" (empty) to hide the price line.
   ============================================================ */

{preserved_sizes()}
"""
    DATA_FILE.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    build()
