(function () {
  const doc = document;
  const body = doc.body;

  if (typeof window.gsap === "undefined") {
    window.gsap = {
      __fallback: true,
      registerPlugin() {},
      to(targets, vars = {}) { applyStyle(targets, vars); },
      from(targets) { applyStyle(targets, { opacity: 1, transform: "none" }); },
      set(targets, vars = {}) { applyStyle(targets, vars); }
    };
  }

  if (typeof window.ScrollTrigger === "undefined") {
    window.ScrollTrigger = { __fallback: true, refresh() {} };
  }

  if (typeof window.Lenis === "undefined") {
    window.Lenis = function LenisFallback() {
      this.raf = function rafFallback() {};
    };
  }

  function applyStyle(targets, vars) {
    const list = typeof targets === "string"
      ? doc.querySelectorAll(targets)
      : targets instanceof Element
        ? [targets]
        : targets || [];

    list.forEach((el) => {
      if (!el || !el.style) return;
      if ("opacity" in vars) el.style.opacity = vars.opacity;
      if ("transform" in vars) el.style.transform = vars.transform;
      if ("x" in vars || "y" in vars || "scale" in vars) el.style.transform = "none";
    });
  }

  const safeStorage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key) || fallback); }
      catch (err) { return JSON.parse(fallback); }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch (err) {}
    }
  };

  let cart = safeStorage.get("kryptaa_cart", "[]");
  let selectedSize = null;

  function mountChrome() {
    body.insertAdjacentHTML("afterbegin", `
      <nav id="navbar" class="site-nav">
        <div class="nav-left">
          <button class="nav-toggle" type="button" data-menu-toggle aria-label="Open menu"><span></span><span></span></button>
          <div class="nav-links" id="desktopNav">${navLinks()}</div>
        </div>
        <a class="nav-brand" href="index.html" aria-label="KRYPTAA home">
          <img src="imgs/kryptaa-sigil.png" alt="KRYPTAA" class="nav-logo-img">
        </a>
        <div class="nav-right">
          <div class="nav-social-icons">
            <a class="nsb-icon" href="https://www.instagram.com/kryptaa__/" data-social="instagram" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a class="nsb-icon" href="https://www.tiktok.com/@kryptaa2426" data-social="tiktok" target="_blank" rel="noopener" aria-label="TikTok">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/></svg>
            </a>
            <a class="nsb-icon" href="https://www.facebook.com" data-social="facebook" target="_blank" rel="noopener" aria-label="Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
          <button class="cart-trigger" type="button" data-cart-open><span>Bag</span><span class="cart-count-pill" id="cartCountNav">0</span></button>
        </div>
      </nav>
      <div class="mobile-menu" id="mobileMenu">
        <div class="mm-socials">
          <a class="mm-social-link" href="https://www.instagram.com/kryptaa__/" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            <span>Instagram</span>
          </a>
          <a class="mm-social-link" href="https://www.tiktok.com/@kryptaa2426" target="_blank" rel="noopener" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z"/></svg>
            <span>TikTok</span>
          </a>
          <a class="mm-social-link" href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Facebook</span>
          </a>
        </div>
        ${navLinks()}
      </div>
      <div class="cart-overlay" id="cartOverlay" data-cart-close></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag">
        <div class="cart-header">
          <h3>Bag (<span id="cartCount">0</span>)</h3>
          <button class="cart-close-btn" type="button" data-cart-close>Close</button>
        </div>
        <div class="cart-body" id="cartItemsList"></div>
        <div class="cart-footer">
          <div class="cart-total"><span>Total</span><span id="cartTotalAmount">$0.00</span></div>
          <a class="k-btn-gold" href="checkout.html" style="display:block;text-align:center;">Checkout</a>
        </div>
      </aside>

      <div class="size-guide-overlay" id="sizeGuideOverlay" data-sg-close></div>
      <aside class="size-guide-panel" id="sizeGuidePanel" aria-label="Size guide">
        <div class="sg-header">
          <h3 class="sg-title">Size Guide</h3>
          <button class="sg-close" type="button" data-sg-close aria-label="Close size guide">✕</button>
        </div>
        <div class="sg-body">
          <div class="sg-eyebrow">Oversized T-Shirt — US Standard</div>
          <div class="sg-table-wrap">
            <table class="sg-table">
              <thead><tr><th>SIZE</th><th>CHEST (in)</th><th>WAIST (in)</th><th>ARM LENGTH (in)</th><th>NECKLINE (in)</th></tr></thead>
              <tbody>
                <tr><td class="sg-size">XS</td><td>34″–36″</td><td>30″–32″</td><td>25″–25½</td><td>14″–14½</td></tr>
                <tr class="sg-highlight"><td class="sg-size">S</td><td>38″–40″</td><td>33″–35″</td><td>25½–26</td><td>14½–15</td></tr>
                <tr><td class="sg-size">M</td><td>42″–44″</td><td>36″–38″</td><td>26″–26½</td><td>15″–15¼</td></tr>
                <tr><td class="sg-size">L</td><td>46″–48″</td><td>39″–41″</td><td>26½–27</td><td>15½–16</td></tr>
                <tr><td class="sg-size">XL</td><td>50″–52″</td><td>42″–44″</td><td>27–27½</td><td>16½–16½</td></tr>
                <tr><td class="sg-size">XXL</td><td>54″–56″</td><td>45″–47″</td><td>27⅔–28</td><td>16½–17</td></tr>
              </tbody>
            </table>
          </div>
          <p class="sg-note">All measurements in inches. This is an oversized fit — size down for a more structured look, size up for a dramatic shoulder.</p>
          <div class="sg-measurements">
            <div class="sg-meas"><span class="sg-meas-dot" style="background:#d2ae5b"></span>Chest Width</div>
            <div class="sg-meas"><span class="sg-meas-dot" style="background:#e87722"></span>Waist Width</div>
            <div class="sg-meas"><span class="sg-meas-dot" style="background:#65f2d0"></span>Arm Length</div>
            <div class="sg-meas"><span class="sg-meas-dot" style="background:#9b59b6"></span>Neckline</div>
          </div>
        </div>
      </aside>

      <div class="sticky-drop-bar" id="stickyDropBar">
        <img src="imgs/kryptaa-sigil.png" alt="" class="sdb-sigil">
        <span class="sdb-text">Drop 001 — SS26 · Limited Units</span>
        <a class="k-btn-gold sdb-btn" href="index.html">Shop Now</a>
        <button class="sdb-close" type="button" id="sdbClose" aria-label="Dismiss">✕</button>
      </div>
    `);
    markActiveNav();
  }

  function navLinks() {
    const configs = ["men", "women", "women_st", "tees", "anime"].map((key) => window.CATEGORY_CONFIGS[key]);
    return configs.map((item) => `<a href="${item.href}" data-nav="${item.href}">${item.nav}</a>`).join("");
  }

  function markActiveNav() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    doc.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === current) link.classList.add("active");
    });
  }

  function initMotion() {
    const isHome = body.dataset.page === 'home';

    /* Home page uses CSS scroll-snap (snap-scroll.js) — Lenis conflicts with it.
       All other pages get Lenis smooth scrolling. */
    if (!isHome) {
      const lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      window.kLenis = lenis;

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    const nav = doc.getElementById("navbar");
    const updateScrollState = () => {
      const y = window.scrollY || 0;
      doc.documentElement.style.setProperty("--scroll-y", y.toFixed(0));
      if (nav) nav.classList.toggle("scrolled", y > 34);
    };
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    // Sticky drop bar
    const stickyBar = doc.getElementById("stickyDropBar");
    let sdbDismissed = false;
    const sdbCloseBtn = doc.getElementById("sdbClose");
    if (sdbCloseBtn) sdbCloseBtn.addEventListener("click", () => { sdbDismissed = true; stickyBar?.classList.remove("visible"); });
    window.addEventListener("scroll", () => {
      if (sdbDismissed || !stickyBar) return;
      const heroH = (doc.querySelector(".v3-hero")?.offsetHeight || window.innerHeight) * 0.6;
      stickyBar.classList.toggle("visible", window.scrollY > heroH);
    }, { passive: true });

    initRevealObserver();
    initCursor();

    if (!window.gsap.__fallback && !window.ScrollTrigger.__fallback && !isHome) {
      /* Skip on home — snap-scroll.js owns hero animations there */
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".hero-title, .shop-hero h1", {
        y: 56,
        opacity: 0,
        duration: 1.15,
        stagger: 0.08,
        ease: "power4.out"
      });
      gsap.to(".hero-media", {
        yPercent: 8,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: ".v3-hero", start: "top top", end: "bottom top", scrub: true }
      });
    }
  }

  function initRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });

    doc.querySelectorAll(".reveal, .product-card, .story-card").forEach((el, index) => {
      el.style.transitionDelay = `${Math.min(index % 8, 7) * 55}ms`;
      observer.observe(el);
    });
  }

  function initCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cursor = doc.createElement("div");
    cursor.className = "lux-cursor";
    body.appendChild(cursor);

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;

    window.addEventListener("mousemove", (event) => {
      tx = event.clientX;
      ty = event.clientY;
      cursor.classList.add("active");
    }, { passive: true });

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    };
    tick();

    body.addEventListener("mouseover", (event) => {
      if (event.target.closest("a, button, .product-card, .category-card, .size-chip")) cursor.classList.add("hovering");
    });
    body.addEventListener("mouseout", (event) => {
      if (event.target.closest("a, button, .product-card, .category-card, .size-chip")) cursor.classList.remove("hovering");
    });
  }

  function bindChromeEvents() {
    body.addEventListener("click", (event) => {
      const menuToggle = event.target.closest("[data-menu-toggle]");
      const cartOpen = event.target.closest("[data-cart-open]");
      const cartClose = event.target.closest("[data-cart-close]");
      const qtyButton = event.target.closest("[data-cart-qty]");
      const removeButton = event.target.closest("[data-cart-remove]");
      const sgOpen = event.target.closest("[data-size-guide]");
      const sgClose = event.target.closest("[data-sg-close]");
      const quickSize = event.target.closest(".quick-size-btn");
      const quickAdd = event.target.closest(".quick-add-btn");

      if (menuToggle) body.classList.toggle("menu-open");
      if (cartOpen) openCart();
      if (cartClose) closeCart();
      if (qtyButton) updateCartQty(qtyButton.dataset.cartQty, Number(qtyButton.dataset.delta));
      if (removeButton) removeFromCart(removeButton.dataset.cartRemove);
      if (sgOpen) { event.preventDefault(); openSizeGuide(); }
      if (sgClose) closeSizeGuide();
      if (quickSize) { event.preventDefault(); event.stopPropagation(); handleQuickSize(quickSize); }
      if (quickAdd) { event.preventDefault(); event.stopPropagation(); handleQuickAdd(quickAdd); }
    });
  }

  function openSizeGuide() {
    doc.getElementById("sizeGuidePanel")?.classList.add("open");
    doc.getElementById("sizeGuideOverlay")?.classList.add("open");
    body.classList.add("sg-open");
  }

  function closeSizeGuide() {
    doc.getElementById("sizeGuidePanel")?.classList.remove("open");
    doc.getElementById("sizeGuideOverlay")?.classList.remove("open");
    body.classList.remove("sg-open");
  }

  function handleQuickSize(btn) {
    const card = btn.closest(".product-card");
    card.querySelectorAll(".quick-size-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    const addBtn = card.querySelector(".quick-add-btn");
    if (addBtn) { addBtn.dataset.selectedSize = btn.dataset.size; addBtn.classList.add("ready"); }
  }

  function handleQuickAdd(btn) {
    const size = btn.dataset.selectedSize;
    if (!size) {
      btn.textContent = "Pick a size ↑";
      setTimeout(() => { btn.textContent = "Add to Bag"; }, 1400);
      return;
    }
    addToCart(btn.dataset.productId, size);
    btn.textContent = "✓ Added";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "Add to Bag";
      btn.classList.remove("added", "ready");
      btn.closest(".product-card").querySelectorAll(".quick-size-btn").forEach((b) => b.classList.remove("selected"));
      delete btn.dataset.selectedSize;
    }, 2000);
  }

  function openCart() {
    doc.getElementById("cartDrawer")?.classList.add("open");
    doc.getElementById("cartOverlay")?.classList.add("open");
    body.classList.add("cart-open");
    renderCartContent();
  }

  function closeCart() {
    doc.getElementById("cartDrawer")?.classList.remove("open");
    doc.getElementById("cartOverlay")?.classList.remove("open");
    body.classList.remove("cart-open");
  }

  function addToCart(productId, size) {
    const product = getProductById(productId);
    if (!product || !size) return;

    const key = `${product.id}-${size}`;
    const existing = cart.find((item) => item.key === key);
    if (existing) existing.qty += 1;
    else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        size,
        qty: 1
      });
    }

    persistCart();
    pulseCart();
    openCart();
    renderCheckoutSummary();
  }

  function updateCartQty(key, delta) {
    const item = cart.find((entry) => entry.key === key);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter((entry) => entry.key !== key);
    persistCart();
    renderCartContent();
    renderCheckoutSummary();
  }

  function removeFromCart(key) {
    cart = cart.filter((entry) => entry.key !== key);
    persistCart();
    renderCartContent();
    renderCheckoutSummary();
  }

  function persistCart() {
    safeStorage.set("kryptaa_cart", cart);
  }

  function pulseCart() {
    const trigger = doc.querySelector(".cart-trigger");
    if (!trigger) return;
    trigger.classList.remove("is-pulsing");
    void trigger.offsetWidth;
    trigger.classList.add("is-pulsing");
  }

  function renderCartContent() {
    const container = doc.getElementById("cartItemsList");
    const countNav = doc.getElementById("cartCountNav");
    const countDrawer = doc.getElementById("cartCount");
    const totalAmount = doc.getElementById("cartTotalAmount");
    if (!container) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (countNav) countNav.textContent = totalQty;
    if (countDrawer) countDrawer.textContent = totalQty;
    if (totalAmount) totalAmount.textContent = formatPrice(totalVal);

    if (!cart.length) {
      container.innerHTML = `<div class="cart-empty">Your bag is empty</div>`;
      return;
    }

    container.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Size ${item.size} / ${formatPrice(item.price)}</div>
          <div class="cart-row">
            <div class="qty-control" aria-label="Quantity">
              <button class="qty-btn" type="button" data-cart-qty="${item.key}" data-delta="-1">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" type="button" data-cart-qty="${item.key}" data-delta="1">+</button>
            </div>
            <button class="cart-line-remove" type="button" data-cart-remove="${item.key}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function productCard(product) {
    const isTee = product.category === "tees" || product.category === "tops";
    const isAnime = product.category === "anime";
    return `
      <article class="product-card reveal">
        <a class="product-card-link" href="product-detail?id=${product.id}" aria-label="View ${product.name}">
          <div class="product-card-media">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-card-content">
            <div class="product-card-kicker">${product.collection}</div>
            <h3>${product.name}</h3>
            <p class="product-card-desc">${product.desc}</p>
            <div class="product-card-tags">${product.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="product-card-footer">
              ${isAnime ? `<span class="product-price preorder-badge">Preorder Only</span>` : `<span class="product-price">${formatPrice(product.price)}</span>`}
              <span class="tag-list">${product.availability}</span>
            </div>
          </div>
        </a>
        <div class="product-card-quick">
          <div class="quick-sizes">
            ${product.sizes.map((s) => `<button class="quick-size-btn" type="button" data-size="${s}" data-product="${product.id}">${s}</button>`).join("")}
            ${isTee ? `<button class="quick-sg-btn" type="button" data-size-guide title="Size Guide">?</button>` : ""}
          </div>
          <button class="quick-add-btn" type="button" data-product-id="${product.id}">Add to Bag</button>
        </div>
      </article>
    `;
  }

  function renderHome() {
    const heroMedia = doc.getElementById("homeHeroMedia");
    if (heroMedia) {
      heroMedia.innerHTML = getProductsByIds([1, 14, 60]).map((product) => `<img src="${product.img}" alt="">`).join("");
    }

    const collectionGrid = doc.getElementById("collectionGrid");
    if (collectionGrid) {
      const keys = ["men", "women", "tees"];
      collectionGrid.innerHTML = keys.map((key) => {
        const config = getCategoryConfig(key);
        const cover = getProductsByIds(config.heroIds)[0];
        return `
          <a class="category-card reveal" href="${config.href}">
            <img src="${cover.img}" alt="${config.title}">
            <div class="category-card-content">
              <div class="eyebrow">${config.label}</div>
              <h3>${config.title}</h3>
              <p>${config.description}</p>
            </div>
          </a>
        `;
      }).join("");
    }

    const editorialImage = doc.getElementById("editorialImage");
    if (editorialImage) {
      editorialImage.innerHTML = `<img src="imgs/kryptaa-brand-frame.jpg" alt="KRYPTAA Driven by Aura, Defined by Power">`;
    }

    const featured = doc.getElementById("featuredProducts");
    if (featured) featured.innerHTML = getFeaturedProducts().slice(0, 4).map(productCard).join("");
  }

  function renderShop() {
    const category = getPageCategory();
    const config = getCategoryConfig(category);
    const products = getProductsByCategory(category);

    doc.title = `${config.title} - KRYPTAA Luxury v3`;
    setText("shopTitle", config.title);
    setText("shopLabel", config.label);
    setText("shopDescription", config.description);
    setText("shopCount", `${products.length} pieces`);

    const heroMedia = doc.getElementById("shopHeroMedia");
    if (heroMedia) {
      heroMedia.innerHTML = getProductsByIds(config.heroIds).map((product) => `<img src="${product.img}" alt="">`).join("");
    }

    const grid = doc.getElementById("productsGrid");
    if (grid) grid.innerHTML = products.map(productCard).join("");
    bindLayoutToggle();
  }

  function bindLayoutToggle() {
    const grid = doc.getElementById("productsGrid");
    if (!grid) return;
    doc.querySelectorAll("[data-layout]").forEach((button) => {
      button.addEventListener("click", () => {
        const layout = button.dataset.layout;
        grid.classList.toggle("is-cinematic", layout === "cinematic");
        grid.classList.toggle("is-dense", layout === "dense");
        doc.querySelectorAll("[data-layout]").forEach((btn) => btn.classList.toggle("active", btn === button));
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    });
  }

  function renderProductDetail() {
    const target = doc.getElementById("productDetail");
    if (!target) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const product = id && typeof getProductById === "function" ? getProductById(id) : null;
    if (!product) {
      target.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:20px;padding:60px 24px;text-align:center;">
          <div style="font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:0.3em;color:rgba(210,174,91,0.55);text-transform:uppercase;margin-bottom:8px;">Error 404</div>
          <h2 style="font-size:clamp(1.4rem,4vw,2.8rem);color:#f0ede8;margin:0;">Product Not Found</h2>
          <p style="font-family:'Space Mono',monospace;font-size:0.6rem;color:rgba(240,237,230,0.45);letter-spacing:0.08em;max-width:400px;">This piece may have sold out or the link has expired.</p>
          <a href="men.html" style="display:inline-block;font-family:'Space Mono',monospace;font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:#d2ae5b;border:1px solid rgba(210,174,91,0.35);padding:12px 28px;text-decoration:none;margin-top:8px;">Back to Shop</a>
        </div>
      `;
      return;
    }

    doc.title = `${product.name} - KRYPTAA`;
    selectedSize = null;

    const storyCards = [
      ["Technical Details", product.technical],
      ["Artistic Concept", product.artisticConcept],
      ["Fit & Sizing", product.fit],
      ["Material System", product.materials],
      ["Print / Finish", product.finish],
      ["Shipping Notes", product.shipping],
      ["Brand Connection", product.brandConnection]
    ];

    const gallery = product.gallery && product.gallery.length ? product.gallery : [{src: product.hero || product.img, label: "Front"}];
    const galleryHTML = `
      <div class="pg-main-wrap">
        <img class="pg-main-img" id="pgMainImg" src="${gallery[0].src}" alt="${product.name}">
        <div class="pg-label" id="pgLabel">${gallery[0].label}</div>
        <div class="pg-counter" id="pgCounter">1 / ${gallery.length}</div>
        ${gallery.length > 1 ? `
        <button class="pg-arrow pg-prev" id="pgPrev" aria-label="Previous view">&#8592;</button>
        <button class="pg-arrow pg-next" id="pgNext" aria-label="Next view">&#8594;</button>
        ` : ""}
      </div>
      ${gallery.length > 1 ? `
      <div class="pg-thumbs" id="pgThumbs">
        ${gallery.map((item, i) => `<button class="pg-thumb${i === 0 ? " active" : ""}" data-idx="${i}" aria-label="${item.label}"><img src="${item.src}" alt="${item.label}" loading="lazy"><span>${item.label}</span></button>`).join("")}
      </div>
      ` : ""}
    `;

    target.innerHTML = `
      <div class="detail-back-row">
        <a class="detail-back-btn" href="${getCategoryConfig(product.category).href}" aria-label="Back to shop">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </a>
      </div>
      <section class="detail-hero section-shell">
        <div class="detail-media pg-gallery reveal">
          ${galleryHTML}
        </div>
        <div class="detail-copy reveal">
          <a class="eyebrow" href="${getCategoryConfig(product.category).href}">${product.collection}</a>
          <h1 class="detail-title">${product.name}</h1>
          <div class="detail-price">${formatPrice(product.price)}</div>
          <p>${product.story}</p>
          <div class="detail-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}<span>${product.availability}</span></div>
          <div class="buy-panel">
            <div>
              <div class="size-row-header">
                <div class="eyebrow">Select Size</div>
                ${product.sizeChart ? `<button class="inline-sc-btn" id="inlineSizeChartBtn" type="button">Size Chart</button>` : ""}
              </div>
              <div class="size-selector" id="sizeSelector">
                ${product.sizes.map((size) => `<button class="size-chip" type="button" data-size="${size}">${size}</button>`).join("")}
              </div>
            </div>
            <button class="k-btn-gold" type="button" id="addToBagBtn">Add To Bag</button>
          </div>
        </div>
      </section>
      <section class="story-section">
        <div class="section-shell">
          <div class="section-head reveal">
            <div>
              <div class="eyebrow">Garment Story</div>
              <h2>Built With Intent</h2>
            </div>
          </div>
          <div class="story-grid">
            ${storyCards.map(([title, copy]) => `
              <article class="story-card reveal">
                <div class="eyebrow">${product.name.split(" ")[0]}</div>
                <h3>${title}</h3>
                <p>${copy}</p>
              </article>
            `).join("")}
          </div>
        </div>
      </section>
    `;

    doc.querySelectorAll("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSize = button.dataset.size;
        doc.querySelectorAll("[data-size]").forEach((btn) => btn.classList.toggle("active", btn === button));
      });
    });

    doc.getElementById("addToBagBtn")?.addEventListener("click", () => {
      if (!selectedSize) {
        doc.getElementById("sizeSelector")?.classList.add("sizes-required");
        setTimeout(() => doc.getElementById("sizeSelector")?.classList.remove("sizes-required"), 450);
        return;
      }
      addToCart(product.id, selectedSize);
    });

    /* ── Inline Size Chart Modal (all pants with sizeChart field) ── */
    if (product.sizeChart) {
      var existingScModal = doc.getElementById("pdSizeChartModal");
      if (existingScModal) existingScModal.remove();

      var scModal = doc.createElement("div");
      scModal.id = "pdSizeChartModal";
      scModal.className = "size-chart-modal";
      scModal.setAttribute("role", "dialog");
      scModal.setAttribute("aria-modal", "true");
      scModal.innerHTML = `
        <div class="size-chart-backdrop" id="pdSizeChartBackdrop"></div>
        <div class="size-chart-panel">
          <button class="size-chart-close" id="pdSizeChartClose" aria-label="Close size chart">✕</button>
          <div class="size-chart-eyebrow">${product.name} — Drop 001</div>
          <h3 class="size-chart-title">Size Guide</h3>
          <img src="${product.sizeChart}" alt="Size chart for ${product.name}" class="size-chart-img">
        </div>
      `;
      doc.body.appendChild(scModal);

      function openScModal() { scModal.classList.add("is-open"); doc.body.style.overflow = "hidden"; }
      function closeScModal() { scModal.classList.remove("is-open"); doc.body.style.overflow = ""; }

      doc.getElementById("inlineSizeChartBtn")?.addEventListener("click", openScModal);
      doc.getElementById("pdSizeChartClose")?.addEventListener("click", closeScModal);
      doc.getElementById("pdSizeChartBackdrop")?.addEventListener("click", closeScModal);
      doc.addEventListener("keydown", function scKey(e) {
        if (e.key === "Escape") closeScModal();
      });
    }

    /* ── Gallery slider ── */
    if (gallery.length > 1) {
      var pgIdx = 0;
      var pgMain = doc.getElementById("pgMainImg");
      var pgLbl = doc.getElementById("pgLabel");
      var pgCtr = doc.getElementById("pgCounter");
      var pgThumbs = doc.getElementById("pgThumbs");

      function pgShow(idx) {
        pgIdx = (idx + gallery.length) % gallery.length;
        pgMain.style.opacity = "0";
        setTimeout(function () {
          pgMain.src = gallery[pgIdx].src;
          pgMain.onload = function () { pgMain.style.opacity = "1"; };
          pgMain.style.opacity = "1";
        }, 120);
        pgLbl.textContent = gallery[pgIdx].label;
        pgCtr.textContent = (pgIdx + 1) + " / " + gallery.length;
        doc.querySelectorAll(".pg-thumb").forEach(function (t, i) { t.classList.toggle("active", i === pgIdx); });
        if (pgThumbs) {
          var activeThumb = pgThumbs.querySelectorAll(".pg-thumb")[pgIdx];
          if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      }

      doc.getElementById("pgPrev")?.addEventListener("click", function () { pgShow(pgIdx - 1); });
      doc.getElementById("pgNext")?.addEventListener("click", function () { pgShow(pgIdx + 1); });
      doc.querySelectorAll(".pg-thumb").forEach(function (t) {
        t.addEventListener("click", function () { pgShow(Number(t.dataset.idx)); });
      });

      /* Swipe support */
      var pgTouchX = 0;
      pgMain.addEventListener("touchstart", function (e) { pgTouchX = e.touches[0].clientX; }, { passive: true });
      pgMain.addEventListener("touchend", function (e) {
        var diff = pgTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) pgShow(pgIdx + (diff > 0 ? 1 : -1));
      });
    }

    /* ── Magnifier Glass ── */
    (function() {
      var wrap = doc.querySelector('.pg-main-wrap');
      var img  = doc.getElementById('pgMainImg');
      if (!wrap || !img) return;
      var lens = doc.createElement('div');
      lens.className = 'pg-magnifier';
      wrap.appendChild(lens);
      var ZOOM = 2.6, SIZE = 140;
      lens.style.cssText = 'display:none;position:absolute;width:'+SIZE+'px;height:'+SIZE+'px;border-radius:50%;border:2px solid rgba(210,174,91,0.85);box-shadow:0 0 0 1px rgba(210,174,91,0.25),0 0 20px rgba(210,174,91,0.18),0 8px 32px rgba(0,0,0,0.8);pointer-events:none;z-index:8;overflow:hidden;background-repeat:no-repeat;';
      var overlay = doc.createElement('div');
      overlay.style.cssText = 'position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.10),transparent 55%);pointer-events:none;z-index:1;';
      lens.appendChild(overlay);

      /* Calculate the actual rendered image bounds for object-fit: contain */
      function getImgBounds() {
        var wW = wrap.offsetWidth, wH = wrap.offsetHeight;
        var nW = img.naturalWidth || wW, nH = img.naturalHeight || wH;
        var scale = Math.min(wW / nW, wH / nH);
        var rW = nW * scale, rH = nH * scale;
        return { x: (wW - rW) / 2, y: (wH - rH) / 2, w: rW, h: rH, nW: nW, nH: nH };
      }

      function move(e) {
        var rect = wrap.getBoundingClientRect();
        var mx = (e.clientX - rect.left);
        var my = (e.clientY - rect.top);
        if (mx < 0 || my < 0 || mx > rect.width || my > rect.height) { lens.style.display='none'; return; }

        /* Hide near left/right arrow zones (first/last 60px) */
        if (mx < 64 || mx > rect.width - 64) { lens.style.display='none'; return; }

        var b = getImgBounds();
        /* Cursor must be over the actual image (not letterbox area) */
        var ix = mx - b.x, iy = my - b.y;
        if (ix < 0 || iy < 0 || ix > b.w || iy > b.h) { lens.style.display='none'; return; }

        lens.style.display = 'block';
        var lx = Math.min(Math.max(mx - SIZE/2, 0), rect.width - SIZE);
        var ly = Math.min(Math.max(my - SIZE/2, 0), rect.height - SIZE);
        lens.style.left = lx + 'px';
        lens.style.top  = ly + 'px';

        /* Map cursor → natural image coords → background-position */
        var normX = ix / b.w;
        var normY = iy / b.h;
        var bgX = -(normX * b.nW * ZOOM - SIZE/2);
        var bgY = -(normY * b.nH * ZOOM - SIZE/2);
        lens.style.backgroundImage    = 'url(' + img.src + ')';
        lens.style.backgroundSize     = (b.nW * ZOOM) + 'px ' + (b.nH * ZOOM) + 'px';
        lens.style.backgroundPosition = bgX + 'px ' + bgY + 'px';
      }
      wrap.addEventListener('mousemove', move, { passive: true });
      wrap.addEventListener('mouseleave', function() { lens.style.display='none'; });
      wrap.style.cursor = 'crosshair';
    })();
  }

  function renderCheckoutSummary() {
    const list = doc.getElementById("checkoutItems");
    const total = doc.getElementById("checkoutTotal");
    if (!list || !total) return;
    const totalVal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    total.textContent = formatPrice(totalVal);

    if (!cart.length) {
      list.innerHTML = `<div class="cart-empty">Your bag is empty</div>`;
      return;
    }

    list.innerHTML = cart.map((item) => `
      <div class="checkout-item">
        <img src="${item.img}" alt="${item.name}">
        <div>
          <div class="checkout-name">${item.name}</div>
          <div class="checkout-meta">Size ${item.size} / Qty ${item.qty} / ${formatPrice(item.price * item.qty)}</div>
        </div>
      </div>
    `).join("");
  }

  function setText(id, value) {
    const el = doc.getElementById(id);
    if (el) el.textContent = value;
  }

  function initPage() {
    const page = body.dataset.page;
    if (page === "home") renderHome();
    if (page === "shop") renderShop();
    if (page === "product") renderProductDetail();
    /* checkout page renders its own summary via inline script in checkout.html */
  }

  doc.addEventListener("DOMContentLoaded", () => {
    mountChrome();
    bindChromeEvents();
    initPage();
    renderCartContent();
    initMotion();
    /* is-loaded is set by cinematic.js after entry; set it here only on non-home pages */
    if (body.dataset.page !== "home") window.setTimeout(() => body.classList.add("is-loaded"), 520);
  });

  window.openCart = openCart;
  window.closeCart = closeCart;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.renderCartContent = renderCartContent;

  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      cart = safeStorage.get("kryptaa_cart", "[]");
      renderCartContent();
    }
  });
})();

/* ── Brand Story canvas particle animation ── */
(function () {
  var canvas = document.getElementById("bsCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var particles = [];
  var W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.5 + 0.1,
      da: (Math.random() - 0.5) * 0.004
    };
  }

  function init() {
    resize();
    particles = [];
    var count = Math.floor((W * H) / 5800);
    for (var i = 0; i < count; i++) particles.push(makeParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var gold = "210,174,91";
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.da;
      if (p.alpha <= 0.05 || p.alpha >= 0.65) p.da *= -1;
      if (p.x < -4) p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
      if (p.y < -4) p.y = H + 4;
      if (p.y > H + 4) p.y = -4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + gold + "," + p.alpha + ")";
      ctx.fill();
    }

    /* faint connecting lines between close particles */
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = "rgba(210,174,91," + (0.06 * (1 - dist / 90)) + ")";
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", function () { init(); });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(); draw(); });
  } else {
    init(); draw();
  }
})();
