(() => {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  onReady(() => {
    injectGlobalFixStyles();
    fixHeader();
    fixHeroSpacing();
    removeHomepageSections(["JEANS", "ANIME"]);
    makeCardsClickable();
    cleanCategoryPages();
    enhanceButtonsAndLinks();
  });

  function injectGlobalFixStyles() {
    const style = document.createElement("style");
    style.id = "kryptaa-fix-styles";
    style.textContent = `
      /* ===== GLOBAL ===== */
      html {
        scroll-behavior: smooth;
      }

      body {
        overflow-x: hidden;
      }

      /* ===== HEADER / NAV ===== */
      header, .header, .site-header, nav, .navbar {
        overflow: visible !important;
      }

      .site-header,
      header,
      .header,
      .navbar {
        min-height: 72px !important;
      }

      nav ul,
      .nav-links,
      .menu,
      .header-menu {
        display: flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 26px !important;
      }

      nav a,
      .nav-links a,
      .menu a,
      .header-menu a {
        white-space: nowrap !important;
        letter-spacing: 0.14em !important;
        font-size: 13px !important;
      }

      /* ===== LOGO ===== */
      .site-logo img,
      .logo img,
      header img[alt*="Krypta" i],
      header img[alt*="KRYPTAA" i] {
        height: 42px !important;
        width: auto !important;
        max-width: 220px !important;
        object-fit: contain !important;
      }

      .site-logo,
      .logo,
      .brand,
      .brand-logo {
        display: flex !important;
        align-items: center !important;
      }

      /* ===== HERO / SPACING ===== */
      .hero,
      .hero-section,
      .landing-hero,
      .banner {
        padding-top: 110px !important;
        padding-bottom: 70px !important;
      }

      .hero + section,
      .hero-section + section,
      .landing-hero + section,
      .banner + section {
        margin-top: 0 !important;
      }

      /* remove giant empty spacing blocks */
      .spacer,
      .empty-space,
      .gap-block {
        display: none !important;
      }

      /* tighter section spacing */
      section {
        margin-top: 0 !important;
      }

      .section-title,
      h1, h2 {
        margin-bottom: 18px !important;
      }

      /* ===== CARD CLICKABILITY ===== */
      .category-card,
      .collection-card,
      .product-card,
      .shop-card,
      .tile,
      .grid-item {
        cursor: pointer !important;
        transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease !important;
      }

      .category-card:hover,
      .collection-card:hover,
      .product-card:hover,
      .shop-card:hover,
      .tile:hover,
      .grid-item:hover {
        transform: translateY(-2px) scale(1.01) !important;
        box-shadow: 0 12px 30px rgba(196, 154, 44, 0.18) !important;
        filter: brightness(1.05) !important;
      }

      /* ===== CATEGORY GRID ===== */
      .category-grid,
      .collection-grid,
      .product-grid {
        gap: 20px !important;
      }

      /* ===== BUTTONS ===== */
      button,
      .btn,
      .button,
      .cta,
      a.btn {
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease !important;
      }

      button:hover,
      .btn:hover,
      .button:hover,
      .cta:hover,
      a.btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 8px 22px rgba(196, 154, 44, 0.22) !important;
      }

      /* ===== RESPONSIVE ===== */
      @media (max-width: 1200px) {
        nav ul,
        .nav-links,
        .menu,
        .header-menu {
          gap: 18px !important;
        }

        nav a,
        .nav-links a,
        .menu a,
        .header-menu a {
          font-size: 12px !important;
          letter-spacing: 0.12em !important;
        }

        .site-logo img,
        .logo img,
        header img[alt*="Krypta" i],
        header img[alt*="KRYPTAA" i] {
          height: 36px !important;
          max-width: 190px !important;
        }
      }

      @media (max-width: 900px) {
        nav ul,
        .nav-links,
        .menu,
        .header-menu {
          gap: 12px !important;
        }

        nav a,
        .nav-links a,
        .menu a,
        .header-menu a {
          font-size: 11px !important;
          letter-spacing: 0.08em !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function fixHeader() {
    // Remove duplicate nav labels if accidental overlap happened from duplicated text nodes
    const navContainers = Array.from(document.querySelectorAll("nav, .navbar, .header-menu, .nav-links, .menu"));

    navContainers.forEach((container) => {
      const links = Array.from(container.querySelectorAll("a"));
      const seen = new Set();

      links.forEach((link) => {
        const text = normalizeText(link.textContent);
        if (!text) return;

        // Remove duplicate "SHOPSHOP" style or exact duplicate links
        if (seen.has(text)) {
          link.remove();
        } else {
          seen.add(text);
        }

        if (text.includes("SHOPSHOP")) {
          link.textContent = "SHOP";
        }
      });
    });

    // Make logo larger even if it is text-based
    const logoCandidates = Array.from(document.querySelectorAll("a, div, span")).filter((el) => {
      const txt = normalizeText(el.textContent);
      return txt === "KRYPTAA" || txt === "KRYPTA";
    });

    logoCandidates.forEach((el) => {
      el.style.fontSize = "24px";
      el.style.fontWeight = "700";
      el.style.letterSpacing = "0.08em";
      el.style.display = "inline-flex";
      el.style.alignItems = "center";
    });
  }

  function fixHeroSpacing() {
    const enterSystemEl = findElementByText("ENTER THE SYSTEM");
    if (enterSystemEl) {
      const heroSection = enterSystemEl.closest("section, .hero, .hero-section, .banner, .landing-hero") || enterSystemEl.parentElement;

      if (heroSection) {
        heroSection.style.minHeight = "auto";
        heroSection.style.paddingBottom = "50px";
        heroSection.style.marginBottom = "0";
      }

      // remove empty siblings below hero if they have no meaningful content
      let next = heroSection ? heroSection.nextElementSibling : null;
      if (next && next.textContent.trim().length < 40) {
        next.style.display = "none";
      }
    }
  }

  function removeHomepageSections(sectionNames = []) {
    const isHome =
      location.pathname.endsWith("/") ||
      location.pathname.endsWith("/index.html") ||
      location.pathname === "/Krypta-v2/" ||
      location.pathname.endsWith("/Krypta-v2/index.html");

    if (!isHome) return;

    const cards = Array.from(document.querySelectorAll("section, article, div"));

    cards.forEach((el) => {
      const txt = normalizeText(el.textContent);
      if (!txt) return;

      for (const name of sectionNames) {
        if (txt.includes(name)) {
          // try not to remove the whole body accidentally
          const area = el.closest(".category-card, .collection-card, .shop-card, .tile, article, section, .grid-item") || el;
          if (area && area !== document.body && area.textContent.length < 500) {
            area.remove();
          }
        }
      }
    });
  }

  function makeCardsClickable() {
    const clickableCards = document.querySelectorAll(
      ".category-card, .collection-card, .product-card, .shop-card, .tile, .grid-item"
    );

    clickableCards.forEach((card) => {
      const link = card.querySelector("a[href]");
      if (!link) return;

      card.addEventListener("click", (e) => {
        const target = e.target;
        const tag = target.tagName ? target.tagName.toLowerCase() : "";

        if (tag === "a" || tag === "button" || target.closest("a, button")) return;
        window.location.href = link.href;
      });
    });
  }

  function cleanCategoryPages() {
    const path = location.pathname.toLowerCase();

    // Example: if on t-shirts or track pants page, tighten layout
    if (
      path.includes("t-shirts") ||
      path.includes("track-pants") ||
      path.includes("men") ||
      path.includes("women")
    ) {
      document.querySelectorAll("section").forEach((section) => {
        section.style.marginBottom = "0";
      });
    }

    // Optional: remove jeans/anime cards from any page where they appear as homepage leftover blocks
    ["JEANS", "ANIME"].forEach((name) => {
      const el = findElementByText(name);
      if (el && !path.includes("jeans")) {
        const block = el.closest(".category-card, .collection-card, .shop-card, .tile, article, section, .grid-item");
        if (block && block.textContent.length < 500) {
          block.remove();
        }
      }
    });
  }

  function enhanceButtonsAndLinks() {
    const allLinks = document.querySelectorAll("a[href]");
    allLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      a.style.cursor = "pointer";
    });
  }

  function findElementByText(text) {
    const target = normalizeText(text);
    const nodes = Array.from(document.querySelectorAll("body *"));
    return nodes.find((node) => normalizeText(node.textContent) === target);
  }

  function normalizeText(str) {
    return (str || "").replace(/\s+/g, " ").trim().toUpperCase();
  }
})();
