(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // THEME: light/dark with pill switch
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("brew_theme");
  const initial = savedTheme || (prefersDark ? "dark" : "light");
  document.body.setAttribute("data-theme", initial);

  const labelEl = document.getElementById("themeLabel");

  // Update button a11y + label
  const applyThemeA11y = (t) => {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    if (labelEl) labelEl.textContent = t === "dark" ? "Dark" : "Light";
    if (t === "dark") {
      btn.setAttribute("aria-label", "Switch to light mode");
      btn.setAttribute("title", "Switch to light mode");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.setAttribute("aria-label", "Switch to dark mode");
      btn.setAttribute("title", "Switch to dark mode");
      btn.setAttribute("aria-pressed", "false");
    }
  };
  applyThemeA11y(initial);

  // Toggle handler
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", next);
      localStorage.setItem("brew_theme", next);
      applyThemeA11y(next);
    });
  }

  // Highlight active nav link
  const page = document.body.getAttribute("data-page");
  document.querySelectorAll(".nav-links a").forEach((a) => {
    if (a.dataset.link === page) a.classList.add("active");
  });

  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) setTimeout(() => preloader.classList.add("hide"), 500);
  });

  // Reveal-on-scroll animations
  const revealEls = document.querySelectorAll(".reveal-on-scroll");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // Back-to-top button (also show at bottom)
  const backToTop = document.getElementById("backToTop");
  const onScroll = () => {
    const scrolledToBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (window.scrollY > 500 || scrolledToBottom) {
      backToTop && backToTop.classList.add("show");
    } else {
      backToTop && backToTop.classList.remove("show");
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  backToTop &&
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );

  // Product gallery thumbs
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");
  if (mainImage && thumbs.length) {
    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        thumbs.forEach((x) => x.classList.remove("is-active"));
        t.classList.add("is-active");
        const src = t.getAttribute("data-src");
        if (src) mainImage.src = src;
      });
    });
  }

  // Hero image 360° rotation on scroll (image is sticky in CSS)
  const heroSpin = document.getElementById("heroSpin");
  if (heroSpin) {
    const rotate = () => {
      const angle = (window.scrollY * 0.2) % 360; // tweak 0.2 for speed
      heroSpin.style.transform = `rotate(${angle}deg)`;
    };
    rotate();
    window.addEventListener("scroll", rotate, { passive: true });
  }

  // Mobile/Tablet sidebar drawer
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("mobileNav");
  const backdrop = document.getElementById("backdrop");
  const drawerClose = document.getElementById("drawerClose");

  const openDrawer = () => {
    if (!drawer) return;
    document.body.classList.add("drawer-open");
    drawer.setAttribute("aria-hidden", "false");
    menuToggle && menuToggle.setAttribute("aria-expanded", "true");
    backdrop && backdrop.removeAttribute("hidden");
    const firstLink = drawer.querySelector("a");
    firstLink && firstLink.focus();
  };

  const closeDrawer = () => {
    document.body.classList.remove("drawer-open");
    drawer && drawer.setAttribute("aria-hidden", "true");
    menuToggle && menuToggle.setAttribute("aria-expanded", "false");
    backdrop && backdrop.setAttribute("hidden", "");
    menuToggle && menuToggle.focus();
  };

  menuToggle && menuToggle.addEventListener("click", openDrawer);
  drawerClose && drawerClose.addEventListener("click", closeDrawer);
  backdrop && backdrop.addEventListener("click", closeDrawer);
  drawer &&
    drawer
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });
})();
