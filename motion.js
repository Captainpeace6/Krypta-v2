(function () {
  const doc = document;
  const body = doc.body;

  const NEW_PRODUCT_IDS = new Set([108, 109, 111, 112, 113, 50, 51, 52, 60, 61, 62]);

  /* ── Mailchimp audience subscribe (KRYPTAA Drop List, us12) ──
     JSONP endpoint — Mailchimp's subscribe API has no CORS headers,
     so a script-tag callback is the only browser-side option. */
  const MC_POST = "https://gmail.us12.list-manage.com/subscribe/post?u=450fbc81f41740fcc252b9629&id=010b1e7bb0&f_id=00e455e0f0";
  const MC_JSONP = "https://gmail.us12.list-manage.com/subscribe/post-json?u=450fbc81f41740fcc252b9629&id=010b1e7bb0&f_id=00e455e0f0";
  const MC_HONEYPOT = "b_450fbc81f41740fcc252b9629_010b1e7bb0";
  function mcSubscribe(email, product, done) {
    const cb = "kMcCb" + Math.floor(Math.random() * 1e9);
    window[cb] = (resp) => {
      window[cb] = undefined;
      /* "already subscribed" counts as success for the visitor */
      done(!!resp && (resp.result === "success" || /already/i.test(resp.msg || "")));
    };
    const s = doc.createElement("script");
    s.src = MC_JSONP + "&EMAIL=" + encodeURIComponent(email) + (product ? "&PRODUCT=" + encodeURIComponent(product) : "") + "&c=" + cb;
    s.onerror = () => { window[cb] = undefined; done(false); };
    doc.head.appendChild(s);
  }

  /* Restock notify strips are rendered per product card — delegate one listener */
  doc.addEventListener("submit", (e) => {
    const form = e.target.closest ? e.target.closest("[data-notify-card]") : null;
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const product = form.querySelector('input[name="PRODUCT"]');
    mcSubscribe(input.value, product ? product.value : "", (ok) => {
      if (ok) {
        form.innerHTML = '<span class="notify-strip-done">✓ You\'re on the list.</span>';
      } else {
        const btn = form.querySelector("button");
        if (btn) btn.textContent = "Retry";
      }
    });
  });

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
  let wishlist = safeStorage.get("k_wishlist", "[]");
  let selectedSize = null;

  function saveWishlist() { safeStorage.set("k_wishlist", wishlist); }
  function toggleWishlist(id) {
    const n = Number(id);
    const idx = wishlist.indexOf(n);
    if (idx === -1) wishlist.push(n); else wishlist.splice(idx, 1);
    saveWishlist();
    updateWishlistUI();
  }
  function updateWishlistUI() {
    const count = wishlist.length;
    const badge = doc.getElementById("kWishCount");
    if (badge) { badge.textContent = count; badge.style.display = count > 0 ? "" : "none"; }
    doc.querySelectorAll("[data-wish]").forEach((btn) => {
      const active = wishlist.includes(Number(btn.dataset.wish));
      btn.classList.toggle("k-wish-active", active);
      btn.setAttribute("aria-label", active ? "Remove from wishlist" : "Save to wishlist");
    });
  }

  function mountChrome() {
    body.insertAdjacentHTML("afterbegin", `
      <div class="k-anno-bar" role="note">Drop 001 Live &nbsp;·&nbsp; Free Shipping Over $75</div>
      <nav id="navbar" class="site-nav">
        <div class="nav-left">
          <button class="nav-toggle" type="button" data-menu-toggle aria-label="Open menu"><span></span><span></span></button>
          <div class="nav-links" id="desktopNav">${navLinks()}</div>
        </div>
        <a class="nav-brand" href="index.html" aria-label="KRYPTAA home">
          <img src="imgs/kryptaa-sigil.webp" alt="KRYPTAA" class="nav-logo-img">
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
          <button class="k-curr-toggle" type="button" id="kCurrToggle" aria-label="Switch currency"><span id="kCurrLabel">$ USD</span></button>
          <button class="k-wish-nav" type="button" id="kWishNav" aria-label="Wishlist"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><span class="k-wish-count" id="kWishCount" style="display:none">0</span></button>
          <button class="cart-trigger" type="button" data-cart-open><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M7 8V5.5C7 3.57 8.34 2 10 2C11.66 2 13 3.57 13 5.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M2.5 8H17.5L16 20H4L2.5 8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M7 13H13" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/></svg><span class="cart-trigger-label">BAG</span><span class="cart-count-pill" id="cartCountNav">0</span></button>
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
        ${mobileNavHTML()}
      </div>
      <div class="cart-overlay" id="cartOverlay" data-cart-close></div>
      <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag">
        <div class="cart-header">
          <h3>Bag (<span id="cartCount">0</span>)</h3>
          <button class="cart-close-btn" type="button" data-cart-close>Close</button>
        </div>
        <div class="cart-shipping-progress" id="cartShippingBar"></div>
        <div class="cart-body" id="cartItemsList"></div>
        <div class="cart-also-viewed" id="cartAlsoViewed"></div>
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
        <div class="sg-tabs">
          <button class="sg-tab active" data-sg-tab="tees" type="button">T-Shirts</button>
          <button class="sg-tab" data-sg-tab="denim" type="button">Denim</button>
          <button class="sg-tab" data-sg-tab="track" type="button">Track Pants</button>
        </div>
        <div class="sg-body">
          <!-- T-SHIRTS -->
          <div class="sg-panel active" id="sgTees">
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
            <p class="sg-note">Oversized fit — size down for a structured look, size up for a dramatic shoulder drop.</p>
          </div>
          <!-- DENIM -->
          <div class="sg-panel" id="sgDenim">
            <div class="sg-eyebrow">Wide-Leg Denim — Waist &amp; Inseam (in)</div>
            <div class="sg-table-wrap">
              <table class="sg-table">
                <thead><tr><th>SIZE</th><th>WAIST (in)</th><th>HIP (in)</th><th>THIGH (in)</th><th>INSEAM (in)</th><th>RISE (in)</th></tr></thead>
                <tbody>
                  <tr class="sg-highlight"><td class="sg-size">S</td><td>26″–28″</td><td>34″–36″</td><td>23″</td><td>30″</td><td>11″</td></tr>
                  <tr><td class="sg-size">M</td><td>29″–31″</td><td>37″–39″</td><td>25″</td><td>30½″</td><td>11½″</td></tr>
                  <tr><td class="sg-size">L</td><td>32″–34″</td><td>40″–42″</td><td>27″</td><td>31″</td><td>12″</td></tr>
                  <tr><td class="sg-size">XL</td><td>35″–37″</td><td>43″–45″</td><td>29″</td><td>31″</td><td>12½″</td></tr>
                </tbody>
              </table>
            </div>
            <p class="sg-note">All jeans are mid-to-high rise with a relaxed wide-leg cut. Measure your natural waist for the most accurate fit.</p>
          </div>
          <!-- TRACK PANTS -->
          <div class="sg-panel" id="sgTrack">
            <div class="sg-eyebrow">Street Track Pants — Hip &amp; Length (in)</div>
            <div class="sg-table-wrap">
              <table class="sg-table">
                <thead><tr><th>SIZE</th><th>WAIST (in)</th><th>HIP (in)</th><th>INSEAM (in)</th><th>LENGTH (in)</th></tr></thead>
                <tbody>
                  <tr><td class="sg-size">XS</td><td>22″–24″</td><td>32″–34″</td><td>27″</td><td>39″</td></tr>
                  <tr class="sg-highlight"><td class="sg-size">S</td><td>24″–26″</td><td>34″–36″</td><td>28″</td><td>40″</td></tr>
                  <tr><td class="sg-size">M</td><td>26″–28″</td><td>36″–38″</td><td>29″</td><td>41″</td></tr>
                  <tr><td class="sg-size">L</td><td>28″–30″</td><td>38″–40″</td><td>30″</td><td>42″</td></tr>
                  <tr><td class="sg-size">XL</td><td>— Sold Out —</td><td>—</td><td>—</td><td>—</td></tr>
                </tbody>
              </table>
            </div>
            <p class="sg-note">Elasticated waist with drawstring — fits true to size. XL is currently unavailable.</p>
          </div>
        </div>
      </aside>

      <div class="sticky-drop-bar" id="stickyDropBar">
        <img src="imgs/kryptaa-sigil.webp" alt="" class="sdb-sigil">
        <span class="sdb-text">Drop 001 — SS26 · Limited Units</span>
        <a class="k-btn-gold sdb-btn" href="index.html">Shop Now</a>
        <button class="sdb-close" type="button" id="sdbClose" aria-label="Dismiss">✕</button>
      </div>
    `);
    markActiveNav();

    /* Scroll-to-top button */
    body.insertAdjacentHTML("beforeend", `<button id="scrollTopBtn" aria-label="Back to top" title="Back to top">&#8593;</button>`);
    doc.getElementById("scrollTopBtn")?.addEventListener("click", () => {
      const target = Math.max(0, window.scrollY - window.innerHeight);
      if (window.kLenis) { window.kLenis.scrollTo(target, { duration: 1.1 }); }
      else { window.scrollTo({ top: target, behavior: "smooth" }); }
    });

    /* Mobile sticky bag bar — not shown on checkout page */
    if (body.dataset.page !== "checkout" && body.dataset.page !== "product") {
      body.insertAdjacentHTML("beforeend", `
        <div class="mobile-bag-bar" id="mobileBagBar" aria-label="Shopping bag summary">
          <div class="mbb-left">
            <span class="mbb-label">Bag</span>
            <span class="mbb-count" id="mbbCount">0</span>
            <span class="mbb-total" id="mbbTotal">$0.00</span>
          </div>
          <button class="mbb-cta" type="button" data-cart-open>View Bag →</button>
        </div>
      `);
    }

    /* WhatsApp float button — replace +919999999999 with real number */
    body.insertAdjacentHTML("beforeend", `
      <a class="wa-float" href="https://wa.me/919999999999?text=Hi%20KRYPTAA%20%E2%80%94%20I%20have%20a%20question%20about%20my%20order" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="#fff">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    `);

    /* Cookie consent banner */
    if (!safeStorage.get("k_cookie", '"pending"').replace(/"/g,'').match(/^(accepted|declined)$/)) {
      body.insertAdjacentHTML("beforeend", `
        <div class="k-cookie-bar" id="kCookieBar" role="dialog" aria-label="Cookie consent">
          <p class="k-cookie-text">We use cookies to improve your experience. By continuing you accept our use of cookies. <a href="info.html" tabindex="-1">Learn more</a></p>
          <div class="k-cookie-actions">
            <button class="k-cookie-accept" id="kCookieAccept" type="button">Accept</button>
            <button class="k-cookie-decline" id="kCookieDecline" type="button">Decline</button>
          </div>
        </div>
      `);
      setTimeout(function () {
        var bar = doc.getElementById("kCookieBar");
        if (bar) bar.classList.add("kcb-visible");
      }, 2800);
      function dismissCookie(choice) {
        safeStorage.set("k_cookie", choice);
        var bar = doc.getElementById("kCookieBar");
        if (bar) { bar.classList.remove("kcb-visible"); setTimeout(() => bar.remove(), 500); }
      }
      doc.getElementById("kCookieAccept")?.addEventListener("click", () => dismissCookie("accepted"));
      doc.getElementById("kCookieDecline")?.addEventListener("click", () => dismissCookie("declined"));
    }

    /* Quick-view modal */
    body.insertAdjacentHTML("beforeend", `
      <div class="k-qv-overlay" id="kQvOverlay" role="dialog" aria-modal="true" aria-label="Quick view">
        <div class="k-qv-modal" id="kQvModal">
          <button class="k-qv-close" id="kQvClose" aria-label="Close">✕</button>
          <div class="k-qv-gallery" id="kQvGallery">
            <img class="k-qv-img" id="kQvImg" src="" alt="">
            <button class="k-qv-arrow k-qv-prev" id="kQvPrev" type="button" aria-label="Previous image">&#8249;</button>
            <button class="k-qv-arrow k-qv-next" id="kQvNext" type="button" aria-label="Next image">&#8250;</button>
            <div class="k-qv-dots" id="kQvDots"></div>
          </div>
          <div class="k-qv-content">
            <div class="k-qv-kicker" id="kQvKicker"></div>
            <div class="k-qv-name" id="kQvName"></div>
            <div class="k-qv-price" id="kQvPrice"></div>
            <div class="k-qv-sizes" id="kQvSizes"></div>
            <button class="k-btn-gold k-qv-add" id="kQvAddBtn" type="button">Add To Bag</button>
            <a class="k-qv-view-full" id="kQvLink" href="#">View Full Details →</a>
          </div>
        </div>
      </div>
    `);

    /* Exit-intent popup */
    if (!sessionStorage.getItem("k_exit_shown")) {
      body.insertAdjacentHTML("beforeend", `
        <div class="k-exit-popup" id="kExitPopup" role="dialog" aria-modal="true" aria-label="Join the drop">
          <div class="k-exit-box">
            <button class="k-exit-close" id="kExitClose" aria-label="Close">✕</button>
            <div class="k-exit-eyebrow">— Wait —</div>
            <div class="k-exit-heading">Don't Miss The Drop</div>
            <div class="k-exit-sub">Every piece is limited. Get early access before they're gone.</div>
            <form class="k-exit-form" action="${MC_POST}" method="POST" id="kExitForm">
              <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="${MC_HONEYPOT}" tabindex="-1" value=""></div>
              <input class="k-exit-input" type="email" name="EMAIL" placeholder="your@email.com" required>
              <button class="k-exit-btn" type="submit">Lock In</button>
            </form>
            <button class="k-exit-no" id="kExitNo">No thanks, I'll miss out</button>
          </div>
        </div>
      `);

      const closeExitPopup = () => {
        const p = doc.getElementById("kExitPopup");
        if (p) { p.classList.remove("open"); setTimeout(() => p.remove(), 350); }
      };
      doc.getElementById("kExitClose")?.addEventListener("click", closeExitPopup);
      doc.getElementById("kExitNo")?.addEventListener("click", closeExitPopup);
      doc.getElementById("kExitForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = e.target.querySelector('input[type="email"]');
        mcSubscribe(input.value, "", () => {});
        setTimeout(closeExitPopup, 800);
      });

      let exitFired = false;
      doc.addEventListener("mouseleave", (e) => {
        if (!exitFired && e.clientY < 8) {
          exitFired = true;
          sessionStorage.setItem("k_exit_shown", "1");
          setTimeout(() => doc.getElementById("kExitPopup")?.classList.add("open"), 200);
        }
      });
    }

    /* Review modal */
    body.insertAdjacentHTML("beforeend", `
      <div class="rv-modal-overlay" id="rvModalOverlay">
        <div class="rv-modal-box" role="dialog" aria-modal="true" aria-label="Write a review">
          <button class="rv-modal-close" id="rvModalClose" aria-label="Close">✕</button>
          <div class="rv-modal-title">Write a Review</div>
          <div class="rv-star-selector" id="rvStarSelector">
            <button type="button" class="rv-star-btn" data-rv-star="1">★</button>
            <button type="button" class="rv-star-btn" data-rv-star="2">★</button>
            <button type="button" class="rv-star-btn" data-rv-star="3">★</button>
            <button type="button" class="rv-star-btn" data-rv-star="4">★</button>
            <button type="button" class="rv-star-btn active" data-rv-star="5">★</button>
          </div>
          <form class="rv-modal-form" id="rvModalForm" action="#" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="product" id="rvProduct" value="">
            <input type="hidden" name="rating" id="rvRating" value="5">
            <input class="rv-input" type="text" name="name" placeholder="Your name" required>
            <input class="rv-input" type="text" name="size" placeholder="Size worn (e.g. M, L, Universal)">
            <textarea class="rv-textarea" name="review" rows="4" placeholder="Share your experience with this piece…" required></textarea>
            <div class="rv-img-upload-wrap">
              <div class="rv-img-upload-label">Photos <span class="rv-img-upload-hint">Optional · up to 3 images</span></div>
              <div class="rv-img-upload-row">
                <label class="rv-img-pick-btn" for="rvImgInput">+ Add Photos<input type="file" id="rvImgInput" name="photos" accept="image/*" multiple></label>
                <div class="rv-img-preview" id="rvImgPreview"></div>
              </div>
            </div>
            <button class="k-btn-gold rv-submit" type="submit">Submit Review</button>
          </form>
          <div class="rv-sent" id="rvSent">✓ Thank you — your review will appear after moderation.</div>
        </div>
      </div>
    `);

    let rvRating = 5;
    const rvStarBtns = doc.querySelectorAll("[data-rv-star]");
    function setRvStars(n) {
      rvRating = n;
      doc.getElementById("rvRating").value = n;
      rvStarBtns.forEach((b) => b.classList.toggle("active", Number(b.dataset.rvStar) <= n));
    }
    rvStarBtns.forEach((b) => {
      b.addEventListener("click", () => setRvStars(Number(b.dataset.rvStar)));
    });

    doc.getElementById("rvModalClose")?.addEventListener("click", () => {
      doc.getElementById("rvModalOverlay")?.classList.remove("open");
    });
    doc.getElementById("rvModalOverlay")?.addEventListener("click", (e) => {
      if (e.target === doc.getElementById("rvModalOverlay")) doc.getElementById("rvModalOverlay").classList.remove("open");
    });
    doc.getElementById("rvModalForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector(".rv-submit");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      /* Downscale photos client-side so the JSON payload stays small */
      const shrink = (file) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const max = 1000;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const c = doc.createElement("canvas");
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(img.src);
          resolve(c.toDataURL("image/jpeg", 0.75));
        };
        img.onerror = () => { URL.revokeObjectURL(img.src); resolve(null); };
        img.src = URL.createObjectURL(file);
      });

      const files = Array.prototype.slice.call(doc.getElementById("rvImgInput")?.files || [], 0, 3);
      Promise.all(files.map(shrink))
        .then((photos) => fetch("https://kryptaa-backend.netlify.app/.netlify/functions/submit-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product: doc.getElementById("rvProduct").value,
            rating: doc.getElementById("rvRating").value,
            name: form.querySelector('input[name="name"]').value,
            size: form.querySelector('input[name="size"]').value,
            review: form.querySelector('textarea[name="review"]').value,
            photos: photos.filter(Boolean),
          }),
        }))
        .then((r) => {
          if (!r.ok) throw new Error("send failed");
          form.style.display = "none";
          doc.getElementById("rvSent").style.display = "block";
        })
        .catch(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = "Failed — Try Again";
        });
    });

    var rvImgInput = doc.getElementById("rvImgInput");
    var rvImgPreview = doc.getElementById("rvImgPreview");
    if (rvImgInput && rvImgPreview) {
      rvImgInput.addEventListener("change", function () {
        rvImgPreview.innerHTML = "";
        var files = Array.prototype.slice.call(rvImgInput.files, 0, 3);
        files.forEach(function (file) {
          var reader = new FileReader();
          reader.onload = function (e) {
            var thumb = doc.createElement("div");
            thumb.className = "rv-img-thumb";
            var img = doc.createElement("img");
            img.src = e.target.result;
            img.alt = "Preview";
            thumb.appendChild(img);
            var rm = doc.createElement("button");
            rm.type = "button";
            rm.className = "rv-img-thumb-rm";
            rm.textContent = "✕";
            rm.addEventListener("click", function () { thumb.remove(); });
            thumb.appendChild(rm);
            rvImgPreview.appendChild(thumb);
          };
          reader.readAsDataURL(file);
        });
      });
    }
  }

  function navLinks() {
    const configs = ["men", "women", "women_wear", "women_st", "tees", "anime"].map((key) => window.CATEGORY_CONFIGS[key]);
    return configs.map((item) => `<a href="${item.href}" data-nav="${item.href}">${item.nav}</a>`).join("") +
      `<a href="lookbook.html" data-nav="lookbook.html">Lookbook</a>` +
      `<a href="info.html" data-nav="info.html">Shipping &amp; Returns</a>`;
  }

  function mobileNavHTML() {
    /* Category image tiles — Men / Women */
    const menCfg = window.CATEGORY_CONFIGS.men;
    const womenCfg = window.CATEGORY_CONFIGS.women;
    const menImg = "imgs/jeans-dual-dragon.jpg";
    const womenImg = "imgs/w-white-dragon.webp";
    return `
      <div class="mm-nav-tiles">
        <a class="mm-nav-tile" href="${menCfg.href}" data-nav="${menCfg.href}">
          <img src="${menImg}" alt="Men's Collection" loading="lazy">
          <div class="mm-tile-label">
            <span class="mm-tile-eyebrow">Collection</span>
            <span class="mm-tile-name">Men</span>
          </div>
        </a>
        <a class="mm-nav-tile" href="${womenCfg.href}" data-nav="${womenCfg.href}">
          <img src="${womenImg}" alt="Women's Collection" loading="lazy">
          <div class="mm-tile-label">
            <span class="mm-tile-eyebrow">Collection</span>
            <span class="mm-tile-name">Women</span>
          </div>
        </a>
      </div>
      <div class="mm-nav-section-label">More</div>
      <div class="mm-nav-wide">
        <a href="women-wear.html" data-nav="women-wear.html">Women Wear</a>
        <a href="t-shirts.html" data-nav="t-shirts.html">T-Shirts</a>
        <a href="anime.html" data-nav="anime.html">Anime Denim</a>
        <a href="women-streetwear-trousers.html" data-nav="women-streetwear-trousers.html">Street Wear Track Pants</a>
        <a href="lookbook.html" data-nav="lookbook.html">Lookbook</a>
        <a href="checkout.html" data-nav="checkout.html">Bag &amp; Checkout</a>
        <a href="info.html" data-nav="info.html">Shipping &amp; Returns</a>
        <a href="track.html" data-nav="track.html">Track My Order</a>
      </div>
      <div class="mm-curr-row">
        <span class="mm-curr-label-text">Currency</span>
        <button type="button" id="kCurrToggleMobile" class="mm-curr-btn" aria-label="Switch currency"><span id="kCurrLabelMobile">$ USD</span></button>
      </div>
    `;
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
    const scrollTopBtn = doc.getElementById("scrollTopBtn");
    const updateScrollState = () => {
      const y = window.scrollY || 0;
      doc.documentElement.style.setProperty("--scroll-y", y.toFixed(0));
      if (nav) nav.classList.toggle("scrolled", y > 34);
      if (scrollTopBtn) scrollTopBtn.classList.toggle("visible", y > 320);
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
      x += (tx - x) * 0.12;
      y += (ty - y) * 0.12;
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
      const qvBtn = event.target.closest("[data-qv]");
      const qvOverlay = event.target.closest("#kQvOverlay");
      const qvClose = event.target.closest("#kQvClose");
      const qvPrev = event.target.closest("#kQvPrev");
      const qvNext = event.target.closest("#kQvNext");
      const qvDot = event.target.closest("[data-qv-dot]");
      const wishBtn = event.target.closest("[data-wish]");
      const currToggle = event.target.closest("#kCurrToggle") || event.target.closest("#kCurrToggleMobile");

      if (menuToggle) body.classList.toggle("menu-open");
      if (cartOpen) openCart();
      if (cartClose) closeCart();
      if (qtyButton) updateCartQty(qtyButton.dataset.cartQty, Number(qtyButton.dataset.delta));
      if (removeButton) removeFromCart(removeButton.dataset.cartRemove);
      if (sgOpen) {
        event.preventDefault();
        const cat = sgOpen.dataset.sizeGuide || "";
        const tab = (cat === "men" || cat === "women") ? "denim" : cat === "women_st" ? "track" : "tees";
        openSizeGuide(tab);
      }
      if (sgClose) closeSizeGuide();
      if (quickSize) { event.preventDefault(); event.stopPropagation(); handleQuickSize(quickSize); }
      if (quickAdd) { event.preventDefault(); event.stopPropagation(); handleQuickAdd(quickAdd); }
      if (qvBtn) { event.preventDefault(); event.stopPropagation(); openQuickView(Number(qvBtn.dataset.qv)); }
      if (qvClose || (qvOverlay && event.target === qvOverlay)) closeQuickView();
      if (qvPrev) { event.stopPropagation(); qvShow(qvIdx - 1); }
      if (qvNext) { event.stopPropagation(); qvShow(qvIdx + 1); }
      if (qvDot) { event.stopPropagation(); qvShow(Number(qvDot.dataset.qvDot)); }
      if (wishBtn) { event.preventDefault(); event.stopPropagation(); toggleWishlist(wishBtn.dataset.wish); }
      if (currToggle) {
        try {
          const curr = localStorage.getItem("k_currency") || "USD";
          localStorage.setItem("k_currency", curr === "USD" ? "INR" : "USD");
          window.location.reload();
        } catch (e) {}
      }
    });
  }

  let qvImages = [];
  let qvIdx = 0;

  function qvShow(idx) {
    qvIdx = ((idx % qvImages.length) + qvImages.length) % qvImages.length;
    const img = doc.getElementById("kQvImg");
    if (img) img.src = qvImages[qvIdx];
    doc.querySelectorAll(".k-qv-dot").forEach((d, i) => d.classList.toggle("active", i === qvIdx));
    const hasMany = qvImages.length > 1;
    const prev = doc.getElementById("kQvPrev");
    const next = doc.getElementById("kQvNext");
    if (prev) prev.style.display = hasMany ? "" : "none";
    if (next) next.style.display = hasMany ? "" : "none";
  }

  function openQuickView(productId) {
    const product = typeof getProductById === "function" ? getProductById(productId) : null;
    if (!product) return;
    const overlay = doc.getElementById("kQvOverlay");
    if (!overlay) return;

    qvImages = product.gallery ? product.gallery.map((g) => g.src) : [product.img];

    const dotsEl = doc.getElementById("kQvDots");
    if (dotsEl) {
      dotsEl.innerHTML = qvImages.map((_, i) =>
        `<button class="k-qv-dot${i === 0 ? " active" : ""}" type="button" data-qv-dot="${i}" aria-label="Image ${i + 1}"></button>`
      ).join("");
    }

    const imgEl = doc.getElementById("kQvImg");
    imgEl.alt = product.name;
    if (imgEl && !imgEl._qvSwipe) {
      imgEl._qvSwipe = true;
      let sx = 0;
      imgEl.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
      imgEl.addEventListener("touchend", (e) => {
        const diff = sx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) qvShow(qvIdx + (diff > 0 ? 1 : -1));
      });
    }

    qvShow(0);

    doc.getElementById("kQvKicker").textContent = product.collection;
    doc.getElementById("kQvName").textContent = product.name;
    doc.getElementById("kQvPrice").textContent = formatPrice(product.price);
    doc.getElementById("kQvLink").href = `product-detail?id=${product.id}`;
    const sizesEl = doc.getElementById("kQvSizes");
    const addBtn = doc.getElementById("kQvAddBtn");
    if (product.category === "women_wear") {
      sizesEl.innerHTML = `<span class="qv-universal-size">Universal Size — Fits XS–XL</span>`;
      addBtn.dataset.qvSize = "Universal";
      addBtn.dataset.qvProduct = product.id;
    } else {
      sizesEl.innerHTML = product.sizes.map((s) => { const so = (product.soldOutSizes || []).includes(s); return `<button class="k-qv-size-btn${so ? " is-sold-out" : ""}" type="button" data-qv-size="${s}"${so ? " disabled" : ""}>${s}</button>`; }).join("");
      sizesEl.querySelectorAll(".k-qv-size-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          sizesEl.querySelectorAll(".k-qv-size-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          doc.getElementById("kQvAddBtn").dataset.qvSize = btn.dataset.qvSize;
          doc.getElementById("kQvAddBtn").dataset.qvProduct = product.id;
        });
      });
      addBtn.dataset.qvSize = "";
      addBtn.dataset.qvProduct = product.id;
    }
    addBtn.textContent = "Add To Bag";
    addBtn.onclick = () => {
      const size = addBtn.dataset.qvSize;
      if (!size) { addBtn.textContent = "Pick a size first ↑"; setTimeout(() => { addBtn.textContent = "Add To Bag"; }, 1400); return; }
      addToCart(String(addBtn.dataset.qvProduct), size);
      addBtn.textContent = "✓ Added";
      setTimeout(() => { addBtn.textContent = "Add To Bag"; closeQuickView(); }, 1200);
    };
    overlay.classList.add("open");
  }

  function closeQuickView() {
    doc.getElementById("kQvOverlay")?.classList.remove("open");
  }

  function openSizeGuide(tabId) {
    const panel = doc.getElementById("sizeGuidePanel");
    const overlay = doc.getElementById("sizeGuideOverlay");
    if (!panel) return;

    /* Switch tab if specified: "tees" | "denim" | "track" */
    if (tabId) {
      panel.querySelectorAll(".sg-tab").forEach((t) => t.classList.toggle("active", t.dataset.sgTab === tabId));
      panel.querySelectorAll(".sg-panel").forEach((p) => p.classList.toggle("active", p.id === "sg" + tabId.charAt(0).toUpperCase() + tabId.slice(1)));
    }

    panel.classList.add("open");
    overlay?.classList.add("open");
    body.classList.add("sg-open");

    /* Wire tab clicks once */
    if (!panel._sgTabsBound) {
      panel._sgTabsBound = true;
      panel.querySelectorAll(".sg-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const tid = tab.dataset.sgTab;
          panel.querySelectorAll(".sg-tab").forEach((t) => t.classList.toggle("active", t === tab));
          panel.querySelectorAll(".sg-panel").forEach((p) => p.classList.toggle("active", p.id === "sg" + tid.charAt(0).toUpperCase() + tid.slice(1)));
        });
      });
    }
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
    const cartDrawer = doc.getElementById("cartDrawer");
    cartDrawer?.classList.add("open");
    doc.getElementById("cartOverlay")?.classList.add("open");
    body.classList.add("cart-open");
    renderCartContent();
    if (cartDrawer && !cartDrawer._swipeReady) {
      cartDrawer._swipeReady = true;
      let sx = 0;
      cartDrawer.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
      cartDrawer.addEventListener("touchend", (e) => { if (e.changedTouches[0].clientX - sx > 60) closeCart(); });
    }
  }

  function closeCart() {
    doc.getElementById("cartDrawer")?.classList.remove("open");
    doc.getElementById("cartOverlay")?.classList.remove("open");
    body.classList.remove("cart-open");
  }

  function showToast(msg) {
    let toast = doc.getElementById("kToast");
    if (!toast) {
      toast = doc.createElement("div");
      toast.id = "kToast";
      toast.className = "k-toast";
      doc.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  /* Meta Pixel event helper — base pixel + fbq are defined in each page's <head> */
  function fbTrack(eventName, params) {
    if (typeof window.fbq === "function") window.fbq("track", eventName, params || {});
  }

  function addToCart(productId, size, qty) {
    qty = qty && qty > 0 ? qty : 1;
    const product = getProductById(productId);
    if (!product || !size) return;

    fbTrack("AddToCart", {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      value: (product.price || 0) * qty,
      currency: "USD",
    });

    const key = `${product.id}-${size}`;
    const existing = cart.find((item) => item.key === key);
    if (existing) existing.qty += qty;
    else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        size,
        qty
      });
    }

    persistCart();
    pulseCart();
    showToast(`Added to bag ✓`);
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

    /* Sync mobile bag bar */
    const bagBar = doc.getElementById("mobileBagBar");
    const mbbCount = doc.getElementById("mbbCount");
    const mbbTotal = doc.getElementById("mbbTotal");
    if (bagBar) {
      bagBar.classList.toggle("mbb-visible", totalQty > 0);
      if (mbbCount) mbbCount.textContent = totalQty;
      if (mbbTotal) mbbTotal.textContent = formatPrice(totalVal);
    }

    /* Free-shipping progress bar (threshold matches backend: $75) */
    const FREE_SHIP = 75;
    const shippingBar = doc.getElementById("cartShippingBar");
    if (shippingBar) {
      const remaining = Math.max(0, FREE_SHIP - totalVal);
      const pct = Math.min(100, (totalVal / FREE_SHIP) * 100).toFixed(1);
      shippingBar.innerHTML = remaining > 0
        ? `<div class="csp-text">Add <strong>${formatPrice(remaining)}</strong> more for free shipping</div><div class="csp-track"><div class="csp-fill" style="width:${pct}%"></div></div>`
        : `<div class="csp-text" style="color:rgba(125,186,125,0.85)">✓ &nbsp;Free shipping unlocked</div><div class="csp-track"><div class="csp-fill" style="width:100%;background:rgba(125,186,125,0.7)"></div></div>`;
    }

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

    /* Customers also viewed */
    const alsoViewed = doc.getElementById("cartAlsoViewed");
    if (alsoViewed) {
      const inCartIds = new Set(cart.map((i) => i.id));
      const cats = [...new Set(cart.map((i) => { const p = typeof getProductById === "function" ? getProductById(i.id) : null; return p ? p.category : null; }).filter(Boolean))];
      const avPicks = (window.PRODUCTS || []).filter((p) => cats.includes(p.category) && !inCartIds.has(p.id) && !/archive/i.test(p.availability || "")).slice(0, 3);
      alsoViewed.innerHTML = avPicks.length > 0
        ? `<div class="cav-label">You may also like</div><div class="cav-row">${avPicks.map((p) => `<a class="cav-card" href="product-detail.html?id=${p.id}"><img src="${p.img}" alt="${p.name}" loading="lazy"><div class="cav-name">${p.name}</div><div class="cav-price">${formatPrice(p.price)}</div></a>`).join("")}</div>`
        : "";
    }
  }

  function productCard(product) {
    const isTee = product.category === "tees" || product.category === "tops";
    const isAnime = product.category === "anime";
    const isArchive = /archive/i.test(product.availability);
    const isLowStock = /low.?quantity|low.?stock/i.test(product.availability);
    const isSoldOut = !isAnime && isArchive;
    const isNew = NEW_PRODUCT_IDS.has(product.id);
    return `
      <article class="product-card reveal${isSoldOut ? " is-sold-out" : ""}">
        <a class="product-card-link" href="product-detail?id=${product.id}" aria-label="View ${product.name}">
          <div class="product-card-media">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
            ${isNew ? `<div class="k-new-badge">New</div>` : ""}
            ${isSoldOut ? `<div class="sold-out-stamp">Archive</div>` : ""}
            <button class="k-wish-btn${wishlist.includes(product.id) ? " k-wish-active" : ""}" type="button" data-wish="${product.id}" aria-label="${wishlist.includes(product.id) ? "Remove from wishlist" : "Save to wishlist"}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button class="k-qv-btn" type="button" data-qv="${product.id}" aria-label="Quick view ${product.name}">Quick View</button>
          </div>
          <div class="product-card-content">
            <div class="product-card-kicker">${product.collection}</div>
            <h3>${product.name}</h3>
            <p class="product-card-desc">${product.desc}</p>
            <div class="product-card-tags">${product.tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}</div>
            <div class="product-card-footer">
              ${isAnime ? `<span class="product-price preorder-badge">Contact to Order</span>` : `<span class="product-price">${formatPrice(product.price)}</span>`}
              ${isLowStock ? `<span class="low-stock-badge">Only a few left</span>` : isArchive ? `` : `<span class="tag-list">${product.availability}</span>`}
            </div>
          </div>
        </a>
        ${isArchive ? `
          <div class="notify-strip">
            <div class="notify-strip-label">Notify me when back</div>
            <form class="notify-strip-row" action="${MC_POST}" method="POST" data-notify-card>
              <input type="hidden" name="PRODUCT" value="${product.name}">
              <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="${MC_HONEYPOT}" tabindex="-1" value=""></div>
              <input type="email" name="EMAIL" placeholder="your@email.com" required>
              <button type="submit">Notify</button>
            </form>
          </div>
        ` : `
        <div class="product-card-quick">
          ${product.category === "women_wear" ? `
          <div class="quick-sizes"><span class="quick-universal">Universal — Fits XS–XL</span></div>
          <button class="quick-add-btn ready" type="button" data-product-id="${product.id}" data-selected-size="Universal">Add to Bag</button>
          ` : `
          <div class="quick-sizes">
            ${product.sizes.map((s) => { const so = (product.soldOutSizes || []).includes(s); return `<button class="quick-size-btn${so ? " is-sold-out" : ""}" type="button" data-size="${s}" data-product="${product.id}"${so ? " disabled" : ""}>${s}</button>`; }).join("")}
            ${(isTee || product.category === "men" || product.category === "women" || product.category === "women_st") ? `<button class="quick-sg-btn" type="button" data-size-guide="${product.category}" title="Size Guide">?</button>` : ""}
          </div>
          <button class="quick-add-btn" type="button" data-product-id="${product.id}">Add to Bag</button>
          `}
        </div>
        `}
      </article>
    `;
  }

  function renderHome() {
    const heroMedia = doc.getElementById("homeHeroMedia");
    if (heroMedia) {
      heroMedia.innerHTML = getProductsByIds([1, 14, 70]).map((product) => `<img src="${product.hero || product.img}" alt="${product.name} — KRYPTAA">`).join("");
    }

    const collectionGrid = doc.getElementById("collectionGrid");
    if (collectionGrid) {
      const keys = ["men", "women", "tees", "women_wear", "women_st"];
      collectionGrid.innerHTML = keys.map((key) => {
        const config = getCategoryConfig(key);
        const cover = getProductsByIds(config.heroIds)[0];
        return `
          <a class="category-card reveal" href="${config.href}" data-cat="${key}">
            <img src="${cover.img}" alt="${config.title}">
            <div class="category-card-content">
              <div class="eyebrow">${config.label}</div>
              <h3>${config.nav}</h3>
              <p>${config.description}</p>
            </div>
          </a>
        `;
      }).join("");
    }

    const editorialImage = doc.getElementById("editorialImage");
    if (editorialImage) {
      editorialImage.innerHTML = `<img src="imgs/kryptaa-brand-frame.jpg" alt="KRYPTAA Defined by Power, Driven by Aura">`;
    }

    const featured = doc.getElementById("featuredProducts");
    if (featured) featured.innerHTML = getFeaturedProducts().slice(0, 4).map(productCard).join("");

    const rvStrip = doc.getElementById("recentlyViewedStrip");
    if (rvStrip) {
      try {
        const rvIds = JSON.parse(localStorage.getItem("k_recently_viewed") || "[]");
        const rvProds = rvIds.slice(0, 3).map((vid) => typeof getProductById === "function" ? getProductById(String(vid)) : null).filter(Boolean);
        if (rvProds.length > 0) {
          rvStrip.style.display = "";
          rvStrip.innerHTML = `<div class="rv-strip-header"><span class="eyebrow">Your History</span><h2 class="rv-strip-title">Recently Viewed</h2></div><div class="rv-strip-row">${rvProds.map(productCard).join("")}</div>`;
        }
      } catch(e) {}
    }
  }

  function renderShop() {
    const category = getPageCategory();
    const config = getCategoryConfig(category);
    const products = getProductsByCategory(category);
    try { localStorage.setItem("k_last_shop", window.location.pathname); } catch(e) {}

    doc.title = `${config.title} — KRYPTAA Gothic Streetwear`;
    setText("shopTitle", config.title);
    setText("shopLabel", config.label);
    setText("shopDescription", config.description);
    setText("shopCount", `${products.length} pieces`);

    /* Dynamic SEO for shop pages */
    const _sm = (attr, key, val) => { let t = doc.querySelector(`meta[${attr}="${key}"]`); if (!t) { t = doc.createElement("meta"); t.setAttribute(attr, key); doc.head.appendChild(t); } t.setAttribute("content", val); };
    const _coverImg = config.heroIds && config.heroIds.length ? (getProductsByIds([config.heroIds[0]])[0] || {}) : {};
    const _ogImg = `https://www.kryptaa.com/${_coverImg.img || "imgs/kryptaa-sigil.webp"}`;
    _sm("name", "description", config.description);
    _sm("property", "og:title", `${config.title} — KRYPTAA`);
    _sm("property", "og:description", config.description);
    _sm("property", "og:image", _ogImg);
    _sm("name", "twitter:image", _ogImg);

    const heroMedia = doc.getElementById("shopHeroMedia");
    if (heroMedia) {
      heroMedia.innerHTML = getProductsByIds(config.heroIds).map((product) => `<img src="${product.img}" alt="${product.name} — KRYPTAA">`).join("");
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
        grid.classList.toggle("is-grid", layout === "grid");
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

    doc.title = `${product.name} — KRYPTAA`;

    fbTrack("ViewContent", {
      content_ids: [String(product.id)],
      content_name: product.name,
      content_type: "product",
      value: product.price || 0,
      currency: "USD",
    });

    selectedSize = product.category === "women_wear" ? "Universal" : null;
    let pdQty = 1;

    /* Track recently viewed */
    (function() {
      try {
        var rv = JSON.parse(localStorage.getItem("k_recently_viewed") || "[]");
        rv = rv.filter(function(vid) { return String(vid) !== String(product.id); });
        rv.unshift(product.id);
        localStorage.setItem("k_recently_viewed", JSON.stringify(rv.slice(0, 6)));
      } catch(e) {}
    })();

    /* #8 / #9 — Update meta description + OG tags for SEO */
    const setMeta = (attr, key, val) => {
      let tag = doc.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) { tag = doc.createElement("meta"); tag.setAttribute(attr, key); doc.head.appendChild(tag); }
      tag.setAttribute("content", val);
    };
    setMeta("name", "description", product.desc);
    setMeta("property", "og:title", `${product.name} — KRYPTAA`);
    setMeta("property", "og:description", product.desc);
    setMeta("property", "og:image", `https://www.kryptaa.com/${product.img}`);
    setMeta("property", "og:url", `https://www.kryptaa.com/product-detail?id=${product.id}`);

    /* Canonical URL */
    let canonicalTag = doc.querySelector("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = doc.createElement("link");
      canonicalTag.rel = "canonical";
      doc.head.appendChild(canonicalTag);
    }
    canonicalTag.href = `https://www.kryptaa.com/product-detail?id=${product.id}`;

    /* JSON-LD Product structured data */
    let ldTag = doc.getElementById("k-jsonld");
    if (!ldTag) { ldTag = doc.createElement("script"); ldTag.id = "k-jsonld"; ldTag.type = "application/ld+json"; doc.head.appendChild(ldTag); }
    ldTag.textContent = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.desc,
      "image": [`https://www.kryptaa.com/${product.img}`],
      "brand": { "@type": "Brand", "name": "KRYPTAA" },
      "offers": {
        "@type": "Offer",
        "url": `https://www.kryptaa.com/product-detail?id=${product.id}`,
        "priceCurrency": "USD",
        "price": product.price,
        "availability": /sold.?out|archive/i.test(product.availability)
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "KRYPTAA" }
      }
    });

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

    const isArchivePDP = /archive/i.test(product.availability);
    const isAnimePDP = product.category === "anime";

    target.innerHTML = `
      <nav class="k-breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Home</a>
        <span class="bc-sep">›</span>
        <a href="${getCategoryConfig(product.category).href}">${getCategoryConfig(product.category).nav}</a>
        <span class="bc-sep">›</span>
        <span class="bc-current">${product.name}</span>
      </nav>
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
          <button class="pdp-review-anchor" type="button" id="pdpReviewAnchor" aria-label="Jump to reviews"></button>
          <p>${product.story}</p>
          <div class="detail-tags">${product.tags.map((tag) => `<span>${tag}</span>`).join("")}${/low.?quantity|low.?stock/i.test(product.availability) ? `<span class="low-stock-badge">Only a few left</span>` : /archive/i.test(product.availability) ? `` : `<span>${product.availability}</span>`}</div>
          <div class="buy-panel">
            ${isAnimePDP ? `
            <div class="anime-contact-wrap">
              <div class="eyebrow" style="margin-bottom:16px;letter-spacing:0.2em;">Preorder — Contact to Reserve</div>
              <a class="k-btn-gold anime-contact-btn" href="https://www.instagram.com/kryptaa__/" target="_blank" rel="noopener" style="display:block;text-align:center;padding:16px 24px;text-decoration:none;font-family:var(--f-mono);font-size:0.72rem;letter-spacing:0.18em;text-transform:uppercase;color:#060606;background:var(--k-gold);border:none;">Contact to Order</a>
              <div class="preorder-timeline" style="margin-top:16px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <span>Est. Dispatch Aug – Sep 2026 · DM us on Instagram to confirm your order</span>
              </div>
            </div>
            ` : `
            <div>
              ${product.category === "women_wear" ? `
              <div class="size-row-header"><div class="eyebrow">Size</div></div>
              <div class="universal-size-badge">Universal Size — Fits XS–XL</div>
              ` : `
              <div class="size-row-header">
                <div class="eyebrow">Select Size</div>
                ${product.sizeChart ? `<button class="inline-sc-btn" id="inlineSizeChartBtn" type="button">Size Chart</button>` : ""}
              </div>
              <div class="size-selector" id="sizeSelector">
                ${product.sizes.map((size) => { const so = (product.soldOutSizes || []).includes(size); return `<button class="size-chip${so ? " is-sold-out" : ""}" type="button" data-size="${size}"${so ? " disabled" : ""}>${size}</button>`; }).join("")}
              </div>
              <div class="pdp-stock-note" id="pdpStockNote"></div>
              <div class="size-tip">${product.fit ? product.fit.split(".")[0] + "." : "KRYPTAA fits true to oversized — size up for a more dramatic shoulder."}</div>
              `}
            </div>
            <div class="pdp-returns-hint">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Free returns within 7 days
            </div>
            <div class="pdp-add-row">
              <div class="qty-stepper" id="pdpQtyStepper">
                <button type="button" id="pdpQtyMinus">−</button>
                <span class="qty-stepper-val" id="pdpQtyVal">1</span>
                <button type="button" id="pdpQtyPlus">+</button>
              </div>
              <button class="k-btn-gold" type="button" id="addToBagBtn">Add To Bag</button>
            </div>
            ${isArchivePDP ? `
            <div class="notify-pdp-box">
              <div class="notify-pdp-title">— Notify Me —</div>
              <div class="notify-pdp-sub">This piece is currently unavailable. Drop your email and we&apos;ll reach out the moment it restocks.</div>
              ${product.restockDate ? `<div class="notify-restock-note">Est. Restock — ${product.restockDate}</div>` : ''}
              <form class="notify-pdp-row" action="${MC_POST}" method="POST" id="notifyPdpForm">
                <input type="hidden" name="PRODUCT" value="${product.name}">
                <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="${MC_HONEYPOT}" tabindex="-1" value=""></div>
                <input type="email" name="EMAIL" placeholder="your@email.com" required>
                <button type="submit">Notify Me</button>
              </form>
              <div class="notify-sent" id="notifySent">✓ You&apos;re on the list — we&apos;ll let you know.</div>
            </div>` : ``}
            `}
          </div>
        </div>
      </section>
      <section class="pdp-lookbook-cta reveal">
        <div class="section-shell">
          <a href="lookbook.html" class="pdp-lookbook-link">
            <span class="eyebrow">Drop 001</span>
            <span>See the Full Look →</span>
          </a>
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
      <section class="faq-section">
        <div class="section-shell">
          <div class="section-head reveal" style="margin-bottom:clamp(24px,4vw,48px)">
            <div class="eyebrow">Need to know</div>
            <h2>FAQ</h2>
          </div>
          <div class="faq-grid reveal">
            <details class="faq-item">
              <summary>What's your return policy?</summary>
              <p class="faq-answer">We accept returns within 14 days of delivery on unworn items with original tags attached. Email us with your order number to start the process. Items marked as final sale or pre-order are non-refundable.</p>
            </details>
            <details class="faq-item">
              <summary>How long does shipping take?</summary>
              <p class="faq-answer">US: 5–7 business days. India: 10–15 business days. Rest of world: 10–18 business days. Tracking is sent automatically via Stripe after your order is confirmed.</p>
            </details>
            <details class="faq-item">
              <summary>How do I pick the right size?</summary>
              <p class="faq-answer">${product.fit || "KRYPTAA garments are cut oversized. For a structured silhouette go true to size; for a more dramatic drape size up. Use the Size Chart button above the selector for exact measurements."}</p>
            </details>
            <details class="faq-item">
              <summary>Is this product in stock or pre-order?</summary>
              <p class="faq-answer">This piece is currently listed as: <strong>${product.availability}</strong>. Pre-order items ship once production is complete — we'll email you with an update. In-stock items ship within 3 business days.</p>
            </details>
            <details class="faq-item">
              <summary>Do you ship to India?</summary>
              <p class="faq-answer">Yes — India is fully supported at checkout. Enter your full address and use +91 in the phone field. Duties and taxes may apply on delivery depending on your state.</p>
            </details>
          </div>
        </div>
      </section>
      <section class="reviews-section" id="reviewsSection">
        <div class="section-shell">
          <div class="section-head reveal">
            <div>
              <div class="eyebrow">What people say</div>
              <h2>Customer Reviews</h2>
            </div>
            <button class="k-btn-gold write-review-btn" type="button" id="writeReviewBtn">Write a Review</button>
          </div>
          <div id="reviewsSummary"></div>
          <div id="reviewsGrid"></div>
        </div>
      </section>
      <section class="pdp-pairs" id="pdpPairs"></section>
      <section class="pdp-related" id="pdpRelated"></section>
      <div class="pdp-sticky-bar" id="pdpStickyBar">
        <div class="psb-info">
          <span class="psb-name">${product.name}</span>
          <span class="psb-size-sel" id="psbSize"></span>
        </div>
        <span class="psb-price">${formatPrice(product.price)}</span>
        ${isAnimePDP
          ? `<a class="k-btn-gold psb-btn" href="https://www.instagram.com/kryptaa__/" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center;justify-content:center;">Contact to Order</a>`
          : `<button class="k-btn-gold psb-btn" type="button" id="psbAddBtn">Add To Bag</button>`}
      </div>
    `;

    doc.querySelectorAll("[data-size]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedSize = button.dataset.size;
        doc.querySelectorAll("[data-size]").forEach((btn) => btn.classList.toggle("active", btn === button));
        const psbSizeEl = doc.getElementById("psbSize");
        if (psbSizeEl) psbSizeEl.textContent = ` · ${selectedSize}`;
        const stockNote = doc.getElementById("pdpStockNote");
        if (stockNote) {
          const sData = window.STOCK_DATA && window.STOCK_DATA[product.id];
          const qty = sData && sData[selectedSize] !== undefined ? sData[selectedSize] : (window.DEFAULT_STOCK || 30);
          stockNote.innerHTML = qty <= 5
            ? `<span class="pdp-stock-warn"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Only ${qty} left in size ${selectedSize}</span>`
            : "";
        }
      });
    });

    /* Qty stepper */
    const qtyValEl = doc.getElementById("pdpQtyVal");
    doc.getElementById("pdpQtyMinus")?.addEventListener("click", () => {
      if (pdQty > 1) { pdQty--; if (qtyValEl) qtyValEl.textContent = pdQty; }
    });
    doc.getElementById("pdpQtyPlus")?.addEventListener("click", () => {
      if (pdQty < 9) { pdQty++; if (qtyValEl) qtyValEl.textContent = pdQty; }
    });

    doc.getElementById("addToBagBtn")?.addEventListener("click", () => {
      if (!selectedSize) {
        doc.getElementById("sizeSelector")?.classList.add("sizes-required");
        setTimeout(() => doc.getElementById("sizeSelector")?.classList.remove("sizes-required"), 450);
        return;
      }
      addToCart(product.id, selectedSize, pdQty);
    });

    doc.getElementById("notifyPdpForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = e.target.querySelector('input[name="EMAIL"]').value;
      const prod = e.target.querySelector('input[name="PRODUCT"]');
      mcSubscribe(email, prod ? prod.value : "", (ok) => {
        if (ok) {
          e.target.style.display = "none";
          const sent = doc.getElementById("notifySent");
          if (sent) sent.style.display = "block";
        } else {
          const btn = e.target.querySelector("button");
          if (btn) btn.textContent = "Retry";
        }
      });
    });

    /* ── Sticky PDP buy bar (mobile) — show when buy panel scrolls away ── */
    (function () {
      var stickyBar = doc.getElementById("pdpStickyBar");
      var buyPanel = doc.querySelector(".buy-panel");
      var psbBtn = doc.getElementById("psbAddBtn");
      if (!stickyBar || !buyPanel) return;
      psbBtn && psbBtn.addEventListener("click", function () {
        if (!selectedSize) {
          doc.getElementById("sizeSelector")?.classList.add("sizes-required");
          setTimeout(() => doc.getElementById("sizeSelector")?.classList.remove("sizes-required"), 450);
          /* Scroll buy panel back into view so user sees the size selector */
          buyPanel.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        addToCart(product.id, selectedSize, pdQty);
      });
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          var visible = entries[0].isIntersecting;
          stickyBar.classList.toggle("psb-visible", !visible);
        }, { threshold: 0.15 }).observe(buyPanel);
      }
    })();

    /* ── "Pair it with" — cross-category complementary products ── */
    (function () {
      var pairsSection = doc.getElementById("pdpPairs");
      if (!pairsSection || typeof getProductsByIds !== "function") return;
      const PAIRS = { men: [1, 3, 4, 5], women: [1, 3, 4, 5], tees: [10, 11, 12, 14, 30, 31], women_st: [1, 3, 4, 5], anime: [1, 3, 4, 5] };
      const pairIds = (PAIRS[product.category] || []).filter((id) => id !== product.id);
      const pairs = getProductsByIds(pairIds).slice(0, 3);
      if (!pairs.length) { pairsSection.style.display = "none"; return; }
      pairsSection.innerHTML = `
        <div class="section-shell">
          <div class="section-head reveal">
            <div><div class="eyebrow">Complete the Look</div><h2>Pair It With</h2></div>
          </div>
          <div class="pdp-pairs-grid">
            ${pairs.map((p) => `
              <a class="pdp-pair-card reveal" href="product-detail?id=${p.id}">
                <div class="pdp-pair-img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
                <div class="pdp-pair-info">
                  <div class="pdp-pair-name">${p.name}</div>
                  <div class="pdp-pair-price">${formatPrice(p.price)}</div>
                </div>
              </a>
            `).join("")}
          </div>
        </div>
      `;
      pairsSection.querySelectorAll(".reveal").forEach(function (el) {
        var obs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(el);
      });
    })();

    /* ── Customer reviews ── */
    (function () {
      var revSection = doc.getElementById("reviewsSection");
      var summaryEl = doc.getElementById("reviewsSummary");
      var gridEl = doc.getElementById("reviewsGrid");
      if (!revSection || !summaryEl || !gridEl) return;

      var allRevs = (window.REVIEWS && window.REVIEWS[product.id]) || [];

      /* Populate the top anchor */
      var anchorEl = doc.getElementById("pdpReviewAnchor");
      if (anchorEl) {
        if (allRevs.length) {
          var avg2 = allRevs.reduce(function (s, r) { return s + r.rating; }, 0) / allRevs.length;
          var filled = Math.round(avg2);
          var starStr = Array.from({ length: 5 }, function (_, i) {
            return '<span class="pdp-ra-star' + (i < filled ? ' on' : '') + '">★</span>';
          }).join("");
          anchorEl.innerHTML = starStr +
            '<span class="pdp-ra-score">' + avg2.toFixed(1) + '</span>' +
            '<span class="pdp-ra-count">(' + allRevs.length + ' review' + (allRevs.length > 1 ? 's' : '') + ')</span>' +
            '<span class="pdp-ra-cta">Write a Review ↓</span>';
        } else {
          anchorEl.innerHTML = '<span class="pdp-ra-none">No reviews yet — Be the first ↓</span>';
        }
        anchorEl.addEventListener("click", function () {
          var target = doc.getElementById("reviewsSection");
          if (!target) return;
          if (window.kLenis) { window.kLenis.scrollTo(target, { offset: -80, duration: 1.1 }); }
          else { target.scrollIntoView({ behavior: "smooth", block: "start" }); }
        });
      }

      function starsHtml(n) {
        return '<span class="rv-stars">' +
          Array.from({ length: 5 }, function (_, i) {
            return '<span class="rv-star' + (i < n ? ' filled' : '') + '">★</span>';
          }).join("") + '</span>';
      }

      if (allRevs.length) {
        var avg = allRevs.reduce(function (s, r) { return s + r.rating; }, 0) / allRevs.length;
        summaryEl.innerHTML = '<div class="rv-summary">' +
          starsHtml(Math.round(avg)) +
          '<span class="rv-avg">' + avg.toFixed(1) + '</span>' +
          '<span class="rv-count">(' + allRevs.length + ' review' + (allRevs.length > 1 ? 's' : '') + ')</span>' +
          '</div>';
        gridEl.innerHTML = '<div class="rv-grid">' +
          allRevs.map(function (r) {
            return '<div class="rv-card reveal">' +
              '<div class="rv-card-header">' +
                starsHtml(r.rating) +
                '<span class="rv-card-author">' + r.author + '</span>' +
                '<span class="rv-card-date">' + r.date + '</span>' +
              '</div>' +
              (r.size ? '<div class="rv-card-size">Size: ' + r.size + '</div>' : '') +
              '<p class="rv-card-body">' + r.body + '</p>' +
              (r.images && r.images.length ? '<div class="rv-card-imgs">' + r.images.map(function (img) {
                return '<img class="rv-card-img" src="' + img + '" alt="Customer photo" loading="lazy">';
              }).join("") + '</div>' : '') +
              '</div>';
          }).join("") +
          '</div>';
      } else {
        summaryEl.innerHTML = '<p class="rv-empty">No reviews yet. Be the first to share your thoughts.</p>';
      }

      gridEl.querySelectorAll(".reveal").forEach(function (el) {
        var obs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(el);
      });

      doc.getElementById("writeReviewBtn")?.addEventListener("click", function () {
        doc.getElementById("rvProduct").value = product.name;
        doc.getElementById("rvModalForm").style.display = "";
        doc.getElementById("rvSent").style.display = "none";
        doc.getElementById("rvModalOverlay")?.classList.add("open");
      });
    })();

    /* ── "You might also like" — same-category products ── */
    (function () {
      var relSection = doc.getElementById("pdpRelated");
      if (!relSection || typeof getProductsByCategory !== "function") return;
      var related = getProductsByCategory(product.category)
        .filter(function (p) { return String(p.id) !== String(product.id); })
        .slice(0, 4);
      if (!related.length) { relSection.style.display = "none"; return; }
      relSection.innerHTML = `
        <div class="section-shell">
          <div class="section-head reveal">
            <div>
              <div class="eyebrow">Same Collection</div>
              <h2>You Might Also Like</h2>
            </div>
          </div>
          <div class="pdp-related-grid">
            ${related.map(productCard).join("")}
          </div>
        </div>
      `;
      relSection.querySelectorAll(".reveal, .product-card").forEach(function (el, i) {
        el.style.transitionDelay = (i * 55) + "ms";
        var obs = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); }
        }, { threshold: 0.1 });
        obs.observe(el);
      });
    })();

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

    /* ── Filmstrip reveal controller (desktop only) ──
       Show on mouse-enter, auto-hide after 3s idle, instant-hide on image click */
    (function () {
      if (window.innerWidth <= 880) return;
      var pgGallery = doc.querySelector('.pg-gallery');
      var pgThumbsEl = doc.getElementById('pgThumbs');
      var pgMainWrap = doc.querySelector('.pg-main-wrap');
      if (!pgGallery || !pgThumbsEl) return;
      var hideTimer = null;
      var lastMX = 0, lastMY = 0;
      function openStrip() {
        pgThumbsEl.classList.add('is-open');
        resetIdleTimer();
      }
      function closeStrip() {
        clearTimeout(hideTimer);
        pgThumbsEl.classList.remove('is-open');
      }
      function resetIdleTimer() {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(closeStrip, 3000);
      }
      pgGallery.addEventListener('mouseenter', function (e) {
        lastMX = e.clientX; lastMY = e.clientY;
        openStrip();
      });
      /* Only reset the 3s timer when mouse moves >4px — filters out
         trackpad/optical-mouse micro-jitter that looks like "no movement" */
      pgGallery.addEventListener('mousemove', function (e) {
        var dx = Math.abs(e.clientX - lastMX);
        var dy = Math.abs(e.clientY - lastMY);
        if (dx < 4 && dy < 4) return;
        lastMX = e.clientX; lastMY = e.clientY;
        if (!pgThumbsEl.classList.contains('is-open')) openStrip();
        else resetIdleTimer();
      });
      pgGallery.addEventListener('mouseleave', function () {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(closeStrip, 800);
      });
      pgMainWrap && pgMainWrap.addEventListener('click', function (e) {
        if (!e.target.closest('.pg-thumb') && !e.target.closest('.pg-arrow')) closeStrip();
      });
    })();

    /* ── Magnifier Glass ── */
    if (product.noZoom) return;
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

  function initCurrency() {
    try {
      const curr = localStorage.getItem("k_currency") || "USD";
      const text = curr === "INR" ? "₹ INR" : "$ USD";
      const label = doc.getElementById("kCurrLabel");
      if (label) label.textContent = text;
      const labelMob = doc.getElementById("kCurrLabelMobile");
      if (labelMob) labelMob.textContent = text;
    } catch (e) {}
  }

  doc.addEventListener("DOMContentLoaded", () => {
    mountChrome();
    bindChromeEvents();
    initPage();
    renderCartContent();
    updateWishlistUI();
    initCurrency();
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

/* ── Live stock updates: sold-out blocking + low-stock badges ── */
window.__onStockUpdated = function () {
  var sd = window.STOCK_DATA;
  if (!sd) return;

  /* Update sold-out state on quick-add size buttons (shop / listing pages) */
  document.querySelectorAll('.quick-size-btn[data-product][data-size]').forEach(function (btn) {
    var id = parseInt(btn.dataset.product, 10);
    var sz = btn.dataset.size;
    var stock = sd[id];
    if (!stock) return;
    var qty = stock[sz] != null ? stock[sz] : 99;
    var soldOut = qty === 0;
    btn.classList.toggle('is-sold-out', soldOut);
    btn.disabled = soldOut;
  });

  /* Update sold-out state on PDP size chips */
  var pdpMatch = window.location.search.match(/[?&]id=(\d+)/);
  if (pdpMatch) {
    var pdpId = parseInt(pdpMatch[1], 10);
    var pdpStock = sd[pdpId];
    if (pdpStock) {
      document.querySelectorAll('.size-chip[data-size]').forEach(function (chip) {
        var qty = pdpStock[chip.dataset.size] != null ? pdpStock[chip.dataset.size] : 99;
        chip.classList.toggle('is-sold-out', qty === 0);
        chip.disabled = qty === 0;
      });
    }
  }

  /* Update low-stock badges on product cards */
  document.querySelectorAll('.product-card').forEach(function (card) {
    var sizeBtn = card.querySelector('.quick-size-btn[data-product]');
    if (!sizeBtn) return;
    var id = parseInt(sizeBtn.dataset.product, 10);
    var stock = sd[id];
    if (!stock) return;
    var sizes = Object.keys(stock);
    var totalQty = sizes.reduce(function (s, k) { return s + stock[k]; }, 0);
    var minQty = Math.min.apply(null, sizes.map(function (k) { return stock[k]; }));
    var footer = card.querySelector('.product-card-footer');
    if (!footer) return;
    var badge = footer.querySelector('.low-stock-badge');
    if (totalQty === 0) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'low-stock-badge'; footer.appendChild(badge); }
      badge.textContent = 'Sold Out';
    } else if (minQty <= 3) {
      if (!badge) { badge = document.createElement('span'); badge.className = 'low-stock-badge'; footer.appendChild(badge); }
      badge.textContent = minQty === 0 ? 'Almost Gone' : 'Only ' + minQty + ' left';
    } else if (badge) {
      badge.remove();
    }
  });
};
