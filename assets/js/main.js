// Build4Kids Family Studio — Static Site v2
(() => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const lightbox = document.getElementById("image-lightbox");
  const lightboxImg = document.getElementById("image-lightbox-img");
  const galleryButtons = document.querySelectorAll(".gallery-open-btn");

  if (!lightbox || !lightboxImg || !galleryButtons.length) return;

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  };

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Capture d’écran agrandie";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  galleryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      const src = button.getAttribute("data-full-src") || image?.getAttribute("src");
      if (!src) return;
      openLightbox(src, image?.alt);
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-lightbox-close]")) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();
