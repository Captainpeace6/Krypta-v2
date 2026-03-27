document.addEventListener('DOMContentLoaded', function () {

  // =============================================
  // FIX 1 & 2 & 3: MOBILE MENU
  // - Make hamburger + top nav buttons clickable
  // - Add icons to menu links
  // - Make category text bigger, darker bg, more visible
  // =============================================
  var styleEl = document.createElement('style');
  styleEl.textContent = `
    /* FIX 1: Make top nav buttons always clickable on mobile */
    @media (max-width: 768px) {
      nav { position: fixed !important; top: 0; left: 0; right: 0; z-index: 999 !important; }
      .nav-hamburger { display: flex !important; z-index: 1000 !important; pointer-events: all !important; cursor: pointer !important; }
      .nav-cart { z-index: 1000 !important; pointer-events: all !important; cursor: pointer !important; }
      body { padding-top: 56px; }
    }

    /* FIX 3: Mobile menu categories - bigger, more visible */
    .mobile-menu a {
      font-family: 'Bebas Neue', sans-serif !important;
      font-size: 26px !important;
      letter-spacing: .1em !important;
      color: var(--white) !important;
      padding: 16px 24px !important;
      display: flex !important;
      align-items: center !important;
      gap: 14px !important;
      border-bottom: 1px solid rgba(200,255,0,0.15) !important;
      background: rgba(10,10,13,0.6) !important;
      text-decoration: none !important;
      transition: background .2s, color .2s !important;
    }
    .mobile-menu a:hover, .mobile-menu a:active {
      background: rgba(200,255,0,0.08) !important;
      color: var(--accent) !important;
    }
    .mobile-menu a .mob-icon {
      font-size: 20px;
      width: 28px;
      text-align: center;
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(styleEl);

  // FIX 2: Add icons to mobile menu links
  var mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    var iconMap = {
      'tees': '👕',
      'mens': '👖',
      'womens': '👗',
      'womenstops': '🔺',
      'anime': '⚡',
      'trackpants': '🩲',
      '#': '📏'
    };
    Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
      if (a.querySelector('.mob-icon')) return; // already added
      var href = a.getAttribute('href') || '';
      var key = href.replace('#', '');
      var icon = iconMap[key] || '→';
      var span = document.createElement('span');
      span.className = 'mob-icon';
      span.textContent = icon;
      a.insertBefore(span, a.firstChild);
    });
  }

  // FIX 1: Ensure hamburger toggle works
  var ham = document.getElementById('hamburgerBtn');
  if (ham && mobileMenu) {
    // Remove existing onclick and re-attach to be safe
    ham.onclick = null;
    ham.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = mobileMenu.style.display === 'block';
      mobileMenu.style.display = isOpen ? 'none' : 'block';
    });
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.style.display = 'none';
      }
    });
    // Close when a link is clicked
    Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
      a.addEventListener('click', function() {
        mobileMenu.style.display = 'none';
      });
    });
  }

  // =============================================
  // FIX 4: Cart persistence — save cart to
  // localStorage on EVERY change, load on page load
  // =============================================
  // Patch the addToCart / cart system to always sync to localStorage
  var cartSyncInterval = setInterval(function() {
    if (window.cart && window.cart.length > 0) {
      localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
    }
  }, 500);

  // When navigating away, save cart
  window.addEventListener('beforeunload', function() {
    if (window.cart && window.cart.length > 0) {
      localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart));
    }
  });

  // Restore cart from localStorage on page load
  var savedCart = [];
  try { savedCart = JSON.parse(localStorage.getItem('kryptaa_cart') || '[]'); } catch(e) {}
  if (savedCart.length > 0 && (!window.cart || window.cart.length === 0)) {
    // Wait for the cart system to initialize then restore
    var restoreAttempts = 0;
    var restoreInterval = setInterval(function() {
      restoreAttempts++;
      if (restoreAttempts > 20) { clearInterval(restoreInterval); return; }
      if (typeof window.addToCart === 'function' || typeof window.renderCart === 'function') {
        // Cart system is ready — restore items
        window.cart = savedCart;
        if (typeof window.renderCart === 'function') window.renderCart();
        if (typeof window.updateCartCount === 'function') window.updateCartCount();
        // Update bag count in nav
        var bagCount = document.querySelector('.nav-cart .bag-count, .bag-count, #cartCount');
        if (bagCount) {
          var total = savedCart.reduce(function(s,i){ return s+(i.qty||1); }, 0);
          bagCount.textContent = total;
        }
        clearInterval(restoreInterval);
      }
    }, 200);
  }

  // =============================================
  // FIX 5: Checkout page — show ALL product images
  // (handled in checkout.html — fix.js not needed here)
  // =============================================

  // =============================================
  // EXISTING: Remove track pants from womens slider
  // =============================================
  var s = document.querySelector('#womensSlider');
  if (s) {
    Array.from(s.querySelectorAll('.card')).forEach(function(c) {
      var n = c.querySelector('h3,h4,[class*=name]');
      if (n && n.textContent.toLowerCase().includes('track pant')) c.remove();
    });
  }

  // =============================================
  // EXISTING: Checkout button
  // =============================================
  var btn = document.querySelector('.cart-checkout');
  if (btn) {
    btn.addEventListener('click', function() {
      localStorage.setItem('kryptaa_cart', JSON.stringify(window.cart || []));
      window.location.href = 'checkout.html';
    });
  }

  // =============================================
  // EXISTING: Price overrides by product ID
  // =============================================
  var priceMap = {
    10: 98, 11: 118, 12: 77, 13: 60, 14: 75,
    15: 70, 16: 65, 17: 62, 18: 68, 19: 59,
    20: 64, 21: 70, 22: 65, 23: 67, 24: 69,
    25: 70, 32: 77, 33: 69, 34: 70
  };

  [window.MENS || [], window.WOMENS || []].forEach(function(arr) {
    arr.forEach(function(p) {
      if (priceMap[p.id] !== undefined) p.price = priceMap[p.id];
    });
  });

  document.querySelectorAll('.card,[class*=card]').forEach(function(card) {
    var pid = card.dataset && (card.dataset.pid || card.dataset.id);
    if (pid && priceMap[parseInt(pid)] !== undefined) {
      var priceEl = card.querySelector('[class*=price],[class*=Price]');
      if (priceEl) priceEl.textContent = '$' + priceMap[parseInt(pid)];
    }
  });

});
