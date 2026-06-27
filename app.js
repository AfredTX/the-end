/* ============================================================
   the end — gallery + order flow
   ============================================================ */

/* ----------------------------------------------------------------
   CONFIG — replace these two values before going live.

   1. WEB3FORMS_ACCESS_KEY: get a free key in seconds at
      https://web3forms.com  (enter the email orders should go to,
      they mail you a key). Orders are delivered to that inbox.

   2. RECIPIENT_LABEL: just shown in the order email subject.
   ---------------------------------------------------------------- */
const WEB3FORMS_ACCESS_KEY = "5b8d6f26-406a-4be0-87f1-36569fd627aa"; // <-- replace
const RECIPIENT_LABEL = "the end — print order";

/* ---------------------------------------------------------------- */

const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-title");
const sizeOptions = document.getElementById("size-options");
const orderForm = document.getElementById("order-form");
const fieldPhoto = document.getElementById("field-photo");
const fieldSize = document.getElementById("field-size");
const formStatus = document.getElementById("form-status");

const photos = window.PHOTOS || [];
const sizes = window.PRINT_SIZES || [];

let lastFocused = null;

/* ---------------------- Build the gallery ---------------------- */
function buildGallery() {
  if (!photos.length) {
    gallery.innerHTML = "<p style='text-align:center;color:#6b6b6b'>No photos yet.</p>";
    return;
  }
  photos.forEach((photo, index) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", photo.caption || "Photo");
    if (photo.w && photo.h) tile.style.aspectRatio = photo.w + " / " + photo.h;

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.caption || "";
    img.loading = "lazy";

    const caption = document.createElement("span");
    caption.className = "tile__caption";
    caption.textContent = photo.caption || "";

    tile.append(img, caption);
    tile.addEventListener("click", () => openModal(index));
    gallery.appendChild(tile);
  });
}

/* ---------------------- Build size choices --------------------- */
function buildSizes() {
  sizeOptions.innerHTML = "";
  sizes.forEach((size, i) => {
    const wrap = document.createElement("div");
    wrap.className = "size-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "size_choice";
    input.id = "size-" + i;
    input.value = size.dim;
    if (i === 0) input.checked = true;

    const label = document.createElement("label");
    label.setAttribute("for", "size-" + i);

    const dim = document.createElement("span");
    dim.className = "size-option__dim";
    dim.textContent = size.dim;
    label.appendChild(dim);

    if (size.price) {
      const price = document.createElement("span");
      price.className = "size-option__price";
      price.textContent = size.price;
      label.appendChild(price);
    }

    wrap.append(input, label);
    sizeOptions.appendChild(wrap);
  });
}

/* ---------------------- Modal open / close -------------------- */
function openModal(index) {
  const photo = photos[index];
  lastFocused = document.activeElement;

  modalImage.src = photo.src;
  modalImage.alt = photo.caption || "";
  modalImage.style.aspectRatio = photo.w && photo.h ? photo.w + " / " + photo.h : "";
  modalCaption.textContent = photo.caption || "";
  fieldPhoto.value = photo.caption || photo.src;

  resetStatus();
  orderForm.reset();
  buildSizes();

  modal.hidden = false;
  document.body.style.overflow = "hidden";
  const firstInput = orderForm.querySelector("input[type=radio]");
  if (firstInput) firstInput.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocused) lastFocused.focus();
}

modal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.hidden) closeModal();
});

/* ---------------------- Status helpers ------------------------ */
function resetStatus() {
  formStatus.textContent = "";
  formStatus.className = "form-status";
}
function setStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = "form-status" + (type ? " is-" + type : "");
}

/* ---------------------- Submit the order ---------------------- */
orderForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const chosen = orderForm.querySelector("input[name=size_choice]:checked");
  if (!chosen) {
    setStatus("Please choose a print size.", "error");
    return;
  }
  fieldSize.value = chosen.value;

  if (WEB3FORMS_ACCESS_KEY === "YOUR-WEB3FORMS-ACCESS-KEY") {
    setStatus(
      "Order form not configured yet (missing Web3Forms key). See app.js.",
      "error"
    );
    return;
  }

  const submitBtn = orderForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  setStatus("Sending…");

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: RECIPIENT_LABEL + ": " + fieldPhoto.value + " (" + fieldSize.value + ")",
    from_name: "the end — website",
    photo: fieldPhoto.value,
    print_size: fieldSize.value,
    buyer_name: orderForm.buyer_name.value,
    buyer_email: orderForm.buyer_email.value,
    note: orderForm.note.value,
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      setStatus("Request sent. Abby will follow up by email soon.", "success");
      orderForm.reset();
    } else {
      setStatus("Something went wrong. Please try again.", "error");
    }
  } catch (err) {
    setStatus("Network error. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

/* ---------------------- Go --------------------------------- */
buildGallery();
buildSizes();
