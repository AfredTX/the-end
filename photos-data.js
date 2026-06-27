/* ============================================================
   PHOTO LIST  —  edit this file to manage the album.

   Each entry:
     src     : path to the image (put image files in /photos)
     caption : text shown on hover and on the order screen
     w, h    : the image's pixel width/height. Sets the container's
               aspect ratio so the photo shows uncropped. (Optional —
               if omitted, the tile falls back to 3:2.)

   To add a photo: drop the file in /photos and add a line below.
   To reorder the album: reorder the lines below.
   ============================================================ */

window.PHOTOS = [
  { src: "photos/AbbyCod032793-R1-022 3.JPG", caption: "Untitled no. 1", w: 3637, h: 2433 },
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
