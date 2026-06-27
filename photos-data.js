/* ============================================================
   PHOTO LIST  —  edit this file to manage the album.

   Each entry:
     src     : path to the image (put image files in /photos)
     caption : text shown on hover and on the order screen
     w, h    : OPTIONAL. The page now measures each image's true
               displayed size automatically (EXIF rotation included), so
               you don't need these. They only act as an early hint to
               avoid a brief layout shift before the image loads.

   To add a photo: drop the file in /photos and add a line below.
   To reorder the album: reorder the lines below.
   ============================================================ */

window.PHOTOS = [
  { src: "photos/AbbyCod032793-R1-022 3.JPG", caption: "Untitled no. 1", w: 2433, h: 3637 }, // EXIF-rotated to portrait
  { src: "photos/AbbyCod032793-R1-026 2.JPG", caption: "Untitled no. 2", w: 3637, h: 2433 },
  { src: "photos/AbbyCod_AbbyCod-R1-E030.JPG", caption: "Untitled no. 3", w: 3637, h: 2433 },
  { src: "photos/AbbyCod_AbbyCod-R2-018-7A 3.JPG", caption: "Untitled no. 4", w: 2433, h: 3637 },
];

/* ============================================================
   PRINT SIZES  —  placeholders. Edit dimensions / prices here.
   Set price to "" (empty) to hide the price line.
   ============================================================ */

window.PRINT_SIZES = [
  { dim: "4 × 6", price: "" },
  { dim: "5 × 7", price: "" },
  { dim: "8 × 10", price: "" },
  { dim: "11 × 14", price: "" },
];
