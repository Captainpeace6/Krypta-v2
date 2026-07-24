/* ═══════════════════════════════════════════════════════════
   KRYPTAA — Immersive Layer
   1) Gold ember field drifting over the hero (cursor-reactive)
   2) Custom magnetic cursor ring (desktop)
   3) Magnetic hero CTA buttons (desktop)
   Self-contained. Skips heavy work on mobile / reduced-motion.
   Seeds lazily so it survives the "click to enter" intro.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var mqFine   = window.matchMedia("(pointer: fine)");
  var mqMobile = window.matchMedia("(max-width: 767px)");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (!mqReduce.matches) initEmbers();
    if (mqFine.matches && !mqReduce.matches) {
      initCursor();
      initMagnetic();
    }
  });

  /* ---------- 1) Gold ember field over the hero ---------- */
  function initEmbers() {
    var hero = document.querySelector(".v3-hero[data-hero]") || document.querySelector(".v3-hero");
    if (!hero) return;

    var canvas = document.createElement("canvas");
    canvas.className = "immersive-embers";
    canvas.setAttribute("aria-hidden", "true");
    hero.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, running = true, seeded = false, looping = false;
    var mouse = { x: -9999, y: -9999 };
    var COUNT = mqMobile.matches ? 24 : 68;
    var parts = [];

    /* pre-render one glow sprite — far cheaper than per-particle shadowBlur */
    var sprite = document.createElement("canvas");
    sprite.width = sprite.height = 26;
    var sc = sprite.getContext("2d");
    var g = sc.createRadialGradient(13, 13, 0, 13, 13, 13);
    g.addColorStop(0.0, "rgba(240,214,140,0.95)");
    g.addColorStop(0.35, "rgba(210,174,91,0.55)");
    g.addColorStop(1.0, "rgba(210,174,91,0)");
    sc.fillStyle = g;
    sc.fillRect(0, 0, 26, 26);

    function resize() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = Math.max(1, W * dpr); canvas.height = Math.max(1, H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(first) {
      return {
        x: Math.random() * W,
        y: first ? Math.random() * H : H + Math.random() * 60,
        r: Math.random() * 2.2 + 0.6,
        vy: -(Math.random() * 0.4 + 0.12),
        vx: (Math.random() - 0.5) * 0.3,
        t: Math.random() * Math.PI * 2,
        tw: Math.random() * 0.03 + 0.008,
        base: Math.random() * 0.4 + 0.3
      };
    }

    function frame() {
      if (!running || !seeded) { looping = false; return; }
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) {                          /* gentle cursor repel */
          var dd = Math.sqrt(d2) + 0.001, f = (1 - d2 / 14000) * 0.9;
          p.x += (dx / dd) * f; p.y += (dy / dd) * f;
        }
        p.x += p.vx; p.y += p.vy; p.t += p.tw;
        if (p.y < -20) { parts[i] = spawn(false); continue; }
        var a = Math.max(0, Math.sin(p.t) * 0.35 + p.base);
        var s = p.r * 7;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    }
    function startLoop() {
      if (!looping && running && seeded) { looping = true; requestAnimationFrame(frame); }
    }
    function seedIfReady() {
      if (!seeded && W > 0 && H > 0) {
        for (var i = 0; i < COUNT; i++) parts.push(spawn(true));
        seeded = true;
      }
      startLoop();
    }

    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", function () { mouse.x = mouse.y = -9999; });

    resize();
    seedIfReady();

    /* Hero starts 0×0 behind the "click to enter" intro — seed once it gets a size */
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () { resize(); seedIfReady(); }).observe(hero);
    }
    /* Pause when the hero scrolls out of view (saves battery) */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          running = en.isIntersecting;
          if (running) startLoop();
        });
      }, { threshold: 0.03 }).observe(hero);
    }
    document.addEventListener("kryptaa:revealed", function () { resize(); seedIfReady(); });
    var rt;
    window.addEventListener("resize", function () {
      clearTimeout(rt); rt = setTimeout(function () { resize(); seedIfReady(); }, 200);
    });
  }

  /* ---------- 2) Custom magnetic cursor ---------- */
  function initCursor() {
    var ring = document.createElement("div");
    ring.className = "immersive-cursor";
    document.body.appendChild(ring);

    var x = window.innerWidth / 2, y = window.innerHeight / 2, tx = x, ty = y;
    window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });

    var sel = "a,button,[role=\"button\"],input,textarea,select,label,.quick-size-btn,.quick-add-btn,.nav-toggle";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest && e.target.closest(sel)) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest && e.target.closest(sel)) ring.classList.remove("is-hover");
    });
    document.documentElement.addEventListener("mouseleave", function () { ring.style.opacity = "0"; });
    document.documentElement.addEventListener("mouseenter", function () { ring.style.opacity = "1"; });

    (function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      ring.style.transform = "translate(" + x + "px," + y + "px)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 3) Magnetic hero CTA buttons ---------- */
  function initMagnetic() {
    var btns = document.querySelectorAll(".v3-hero .k-btn-gold, .v3-hero .k-btn-outline");
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + (mx * 0.28) + "px," + (my * 0.5) + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }
})();
