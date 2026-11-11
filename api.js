/* KRYPTAA — live backend bridge.
   Loaded after catalog.js and before site.js. It does three jobs:
     1. Pulls live stock from the Worker and folds it into window.K.stock, so the
        page renders real counts instead of the snapshot baked into catalog.js.
     2. Pulls approved customer reviews and merges them into window.K.reviews.
     3. Exposes window.KAPI — checkout, coupon, track — which site.js calls.
   The follow-on scripts (journal.js, site.js, landing.js) are injected only once
   this finishes, so site.js runs a single time with live data and never double-binds
   an event listener. If the Worker is slow or down we give up after BOOT_TIMEOUT and
   boot anyway on the catalog snapshot — a dead API must never blank the shop. */
(function () {
  "use strict";

  var API = "https://kryptaa-api.kryptaa.workers.dev/";
  window.K_API = API;

  var BOOT_TIMEOUT = 2500;   /* ms to wait for stock before rendering regardless */
  var CALL_TIMEOUT = 15000;  /* ms for a user-initiated call (checkout, coupon, track) */

  /* ── fetch with a deadline. AbortController is in every browser we support;
     the try/catch is for the odd embedded webview that lacks it. ── */
  function req(path, opts, ms) {
    opts = opts || {};
    var ctl = null, timer = null;
    try { ctl = new AbortController(); opts.signal = ctl.signal; } catch (e) {}
    var p = fetch(API + path, opts);
    if (ctl) {
      timer = setTimeout(function () { try { ctl.abort(); } catch (e) {} }, ms || CALL_TIMEOUT);
      p = p.finally(function () { clearTimeout(timer); });
    }
    return p;
  }

  function postJson(path, body, ms) {
    return req(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }, ms).then(function (r) {
      if (r.status === 429) { var e = new Error("rate"); e.code = 429; throw e; }
      if (r.status === 502 || r.status === 503) { var o = new Error("offline"); o.code = r.status; throw o; }
      return r.json().then(function (d) { d.__status = r.status; return d; });
    });
  }

  /* ── stock ───────────────────────────────────────────────────────────────
     The Worker tracks the Silver Metallic Crop Set as two KV rows, '90:top' and
     '90:skirt', because the top and skirt are picked and shipped separately. The
     site sells it as one set, so a set is only sellable while BOTH halves are, and
     the number available is the smaller of the two. Any other key passes straight
     through. Products with no row (bras 81/82, anime denim 108–116) are left absent,
     which site.js reads as "not tracked" and shows as available — same as the live
     store does today. */
  function foldStock(raw) {
    if (!raw || typeof raw !== "object") return null;
    var out = {}, id;
    for (id in raw) {
      if (!Object.prototype.hasOwnProperty.call(raw, id)) continue;
      if (id === "_savedAt" || id.indexOf("90:") === 0) continue;
      out[id] = raw[id];
    }
    var top = raw["90:top"], skirt = raw["90:skirt"];
    if (top && skirt) {
      var sizes = {}, z;
      for (z in top) {
        if (!Object.prototype.hasOwnProperty.call(top, z)) continue;
        var a = Number(top[z]) || 0, b = Number(skirt[z]) || 0;
        sizes[z] = Math.min(a, b);
      }
      out["90"] = sizes;
    } else if (top || skirt) {
      /* One half missing from KV — treat the set as unsellable rather than
         overselling a half we cannot ship. */
      out["90"] = { Universal: 0 };
    }
    return out;
  }

  var stockReady = req("get-stock", {}, BOOT_TIMEOUT)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var folded = d && foldStock(d.stock);
      if (!folded) return;
      window.K = window.K || {};
      window.K.stock = folded;
      window.K.stockLive = true;
    })
    .catch(function () { /* snapshot stands */ });

  /* A review photo is customer-supplied and ends up in an <img src>. Escaping the
     HTML is not enough on its own: only let through a plain http(s) URL or a
     base64 image, so nothing can smuggle in a javascript:, data:text/html or
     other scheme. Anything else becomes empty and the card renders without a photo. */
  function safePhoto(u) {
    var s = String(u == null ? '' : u).trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (/^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/i.test(s)) return s;
    return '';
  }

  /* ── reviews ──────────────────────────────────────────────────────────────
     reviews-public returns { reviews: { "<productId>": [ {author,date,rating,size,body,photos,verified} ] } }.
     catalog.js carries a flat array where each entry has a pid. Flatten the live ones
     the same way and put them first, so newly approved reviews lead. */
  var reviewsReady = req("reviews-public", {}, BOOT_TIMEOUT)
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var by = d && d.reviews;
      if (!by || typeof by !== "object") return;
      var live = [], pid;
      for (pid in by) {
        if (!Object.prototype.hasOwnProperty.call(by, pid)) continue;
        var arr = by[pid];
        if (!Array.isArray(arr)) continue;
        for (var i = 0; i < arr.length; i++) {
          var r = arr[i] || {};
          live.push({
            pid: Number(pid), author: r.author, date: r.date, rating: r.rating,
            size: r.size, body: r.body,
            /* site.js renders `img` and `tag`, not `photos`/`verified`. Mapping to the
               wrong names silently dropped every live review photo and every
               Verified-buyer badge. */
            img: safePhoto(r.photos && r.photos[0]),
            tag: r.verified ? 'ver' : undefined
          });
        }
      }
      if (!live.length) return;
      window.K = window.K || {};
      window.K.reviews = live.concat(window.K.reviews || []);
    })
    .catch(function () {});

  /* ── analytics ────────────────────────────────────────────────────────────
     Thin wrappers so site.js never has to test for gtag/fbq being blocked by an
     ad blocker, which is common on this audience. */
  function ga(name, params) { try { if (window.gtag) window.gtag("event", name, params || {}); } catch (e) {} }
  function fb(name, params) { try { if (window.fbq) window.fbq("track", name, params || {}); } catch (e) {} }

  /* ── public surface used by site.js ── */
  window.KAPI = {
    url: API,
    ga: ga,
    fb: fb,

    /* Both pixels for one commerce moment, so a caller cannot fire half of it. */
    track: function (which, d) {
      d = d || {};
      if (which === "view_item") {
        ga("view_item", { currency: "USD", value: d.value, items: d.items });
        fb("ViewContent", { content_ids: d.ids, content_type: "product", value: d.value, currency: "USD" });
      } else if (which === "add_to_cart") {
        ga("add_to_cart", { currency: "USD", value: d.value, items: d.items });
        fb("AddToCart", { content_ids: d.ids, content_type: "product", value: d.value, currency: "USD" });
      } else if (which === "begin_checkout") {
        ga("begin_checkout", { currency: "USD", value: d.value, items: d.items });
        fb("InitiateCheckout", { content_ids: d.ids, content_type: "product", value: d.value, currency: "USD", num_items: d.count });
      } else if (which === "view_cart") {
        ga("view_cart", { currency: "USD", value: d.value, items: d.items });
      }
    },

    /* Resolves to { ok, code, percentOff } or { ok:false, reason }. */
    coupon: function (code, email) {
      return postJson("validate-coupon", { code: code, email: email || undefined });
    },

    /* Resolves to { url } — the Stripe Checkout page to send the customer to.
       Prices come from the Worker's own catalog, never from this browser, so a
       tampered cart cannot change what is charged. */
    checkout: function (cart, email, coupon) {
      return postJson("create-checkout", {
        cart: cart, coupon: coupon || null, email: email || undefined
      });
    },

    /* Step 1 (no code): { sent:true }. Step 2 (with code): { orders:[...] }. */
    order: function (email, code) {
      return postJson("track-order", { email: email, code: code || undefined });
    }
  };

  /* ── boot the rest of the site once live data is in (or we time out) ── */
  function loadChain(list, done) {
    var i = 0;
    (function next() {
      if (i >= list.length) return done && done();
      var s = document.createElement("script");
      s.src = list[i++];
      s.onload = next;
      s.onerror = next;   /* one bad file must not halt the chain */
      document.head.appendChild(s);
    })();
  }

  var self = document.currentScript;

  /* Carry this file's own ?v= onto the scripts we inject. GitHub Pages caches
     site.js and friends hard, so without it a returning visitor can run last
     week's JavaScript against this week's HTML. Bump the number in the pages and
     every file moves together. */
  var ver = "";
  try {
    var q = (self && self.src || "").split("?")[1];
    if (q) { var m = /(?:^|&)v=([^&]+)/.exec(q); if (m) ver = "?v=" + m[1]; }
  } catch (e) {}

  /* Resolve the chain against THIS script's own URL, not the page's. A page in
     /products/ or /journal/ would otherwise ask for /products/site.js and 404,
     leaving the page blank. */
  var base = "";
  try { base = (self && self.src || "").replace(/[^/]*$/, ""); } catch (e) {}

  var after = (self && self.dataset.after ? self.dataset.after : "site.js")
    .split(",").map(function (s) { return s.trim(); }).filter(Boolean)
    .map(function (s) { return (s.indexOf("?") === -1 ? s + ver : s); })
    .map(function (s) { return /^(https?:)?\/\//.test(s) ? s : base + s; });

  var booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    loadChain(after);
  }

  /* Whichever finishes first: both calls settling, or the deadline. */
  Promise.all([stockReady, reviewsReady]).then(boot, boot);
  setTimeout(boot, BOOT_TIMEOUT + 150);
})();
