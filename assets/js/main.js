// Build4Kids Family Studio — Static Site helpers
(() => {
  const supportedLanguages = ["fr", "en", "pt", "es", "it", "de"];
  const defaultLanguage = "fr";
  const storageKey = "build4kids-language";
  const html = document.documentElement;
  const currentLanguage = html.dataset.lang || html.lang || defaultLanguage;
  const yearNode = document.getElementById("y");

  if (yearNode) yearNode.textContent = new Date().getFullYear();

  const normalizeBrowserLanguage = () => {
    const candidates = [navigator.language, ...(navigator.languages || [])]
      .filter(Boolean)
      .map((value) => value.toLowerCase().slice(0, 2));

    return candidates.find((value) => supportedLanguages.includes(value)) || defaultLanguage;
  };

  const buildLocalizedPath = (targetLanguage) => {
    const url = new URL(window.location.href);
    const segments = url.pathname.split("/").filter(Boolean);
    const hasPrefix = supportedLanguages.includes(segments[0]);
    const cleanSegments = hasPrefix ? segments.slice(1) : segments;
    const nextSegments = targetLanguage === defaultLanguage ? cleanSegments : [targetLanguage, ...cleanSegments];
    const pathname = `/${nextSegments.join("/")}`.replace(/\/$/, "") || "/";
    return `${pathname}${url.search}${url.hash}`;
  };

  document.querySelectorAll("[data-lang-link]").forEach((link) => {
    const { lang } = link.dataset;
    if (!lang) return;

    if (lang === currentLanguage) link.setAttribute("aria-current", "page");

    link.addEventListener("click", () => {
      window.localStorage.setItem(storageKey, lang);
    });
  });

  const pathnameSegments = window.location.pathname.split("/").filter(Boolean);
  const alreadyLocalized = supportedLanguages.includes(pathnameSegments[0]) && pathnameSegments[0] !== defaultLanguage;

  if (alreadyLocalized) {
    window.localStorage.setItem(storageKey, currentLanguage);
  } else {
    const preferredLanguage = window.localStorage.getItem(storageKey) || normalizeBrowserLanguage();
    if (preferredLanguage && preferredLanguage !== defaultLanguage && supportedLanguages.includes(preferredLanguage)) {
      const target = buildLocalizedPath(preferredLanguage);
      if (target !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.location.replace(target);
        return;
      }
    }
  }

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
    lightboxImg.alt = alt || "Enlarged screenshot";
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
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });
})();
