/* ═══════════════════════════════════════════════════════════
   KRYPTAA — Cinematic Experience Engine v1
   cinematic.js

   Features:
   1. Preloader  — terminal system messages + gold progress bar
   2. Entry screen — floating logo + CLICK TO ENTER
   3. Crystal shatter — canvas particle break on enter
   4. Void tunnel — expanding black circle transition
   5. Cinematic scroll — GSAP ScrollTrigger parallax + reveals
   6. Scroll-typed text — characters tied to scroll progress
   7. Lenis smooth scroll — buttery inertia scrolling
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     0. CONSTANTS
  ───────────────────────────────────────────── */
  var MQ     = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCE = MQ.matches;
  var MOBILE = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  var path   = window.location.pathname;
  var IS_HOME = path === '/' ||
                path.endsWith('/index.html') ||
                path.endsWith('/Krypta-v2/') ||
                path === '/Krypta-v2';

  var PRELOAD_DURATION = REDUCE ? 400  : 2400; // ms
  var SHATTER_DURATION = REDUCE ? 0    : 900;  // ms

  /* ─────────────────────────────────────────────
     1. GRAIN OVERLAY
  ───────────────────────────────────────────── */
  function initGrain() {
    if (document.getElementById('k-grain')) return;
    var g = document.createElement('div');
    g.id = 'k-grain';
    document.body.appendChild(g);
  }

  /* ─────────────────────────────────────────────
     2. PRELOADER
  ───────────────────────────────────────────── */
  var MESSAGES = [
    '{KRYPTAA SYSTEM}',
    '{INITIALIZING AURA}',
    '{LOADING UNDERGROUND SIGNAL}',
    '{SYNCING COLLECTION DATA}',
    '{CALIBRATING DROP 001}',
    '{DEFINED BY POWER}'
  ];

  function initPreloader() {
    var el = document.getElementById('k-preloader');
    if (!el) return;

    var lineEls = el.querySelectorAll('.k-pre-line');
    var fill    = el.querySelector('.k-pre-fill');
    var pctEl   = el.querySelector('.k-pre-pct');

    // Pre-fill the text labels
    lineEls.forEach(function (ln, i) {
      ln.textContent = MESSAGES[i] || '';
    });

    // Stagger lines in
    lineEls.forEach(function (ln, i) {
      setTimeout(function () { ln.classList.add('k-lit'); }, 180 + i * 120);
    });

    // Highlight active line cycling
    var activeIdx = 0;
    var msgTimer = setInterval(function () {
      lineEls.forEach(function (ln) { ln.classList.remove('k-active'); });
      if (lineEls[activeIdx]) lineEls[activeIdx].classList.add('k-active');
      activeIdx = (activeIdx + 1) % lineEls.length;
    }, PRELOAD_DURATION / (lineEls.length || 6));

    // Progress counter
    var start = Date.now();
    function tick() {
      var t = Math.min((Date.now() - start) / PRELOAD_DURATION, 1);
      // Ease: smooth step
      var p = t * t * (3 - 2 * t);
      var pct = Math.floor(p * 100);
      if (fill)  fill.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        clearInterval(msgTimer);
        if (pctEl) pctEl.textContent = '100%';
        if (fill)  fill.style.width  = '100%';
        setTimeout(transitionToEntry, REDUCE ? 60 : 280);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ─────────────────────────────────────────────
     3. ENTRY SCREEN
  ───────────────────────────────────────────── */
  function transitionToEntry() {
    var pre   = document.getElementById('k-preloader');
    var entry = document.getElementById('k-entry');
    if (!entry) { revealSite(); return; }

    if (pre) {
      pre.classList.add('k-out');
      setTimeout(function () { pre.style.display = 'none'; }, 560);
    }

    entry.classList.add('k-show');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        entry.classList.add('k-visible');
      });
    });
  }

  /* ─────────────────────────────────────────────
     4. CRYSTAL PARTICLE SHATTER
  ───────────────────────────────────────────── */
  function initEntryBtn() {
    var btn = document.getElementById('k-enter-btn');
    if (!btn) return;

    function handleEnter(e) {
      if (e.type === 'touchend') e.preventDefault();
      btn.removeEventListener('click',    handleEnter);
      btn.removeEventListener('touchend', handleEnter);
      btn.classList.add('k-clicked');
      if (REDUCE) {
        revealSite();
      } else {
        startShatter(btn);
      }
    }
    btn.addEventListener('click',    handleEnter);
    btn.addEventListener('touchend', handleEnter, { passive: false });
  }

  function startShatter(btn) {
    var canvas = document.getElementById('k-shatter-canvas');
    if (!canvas) { revealSite(); return; }

    var rect  = btn.getBoundingClientRect();
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    var ctx    = canvas.getContext('2d');
    var cx     = rect.left + rect.width  / 2;
    var cy     = rect.top  + rect.height / 2;
    var count  = MOBILE ? 38 : 78;

    // Fragment colors: gold, silver, dark glass, bright shard
    var COLORS = [
      '#FF5500','#d4b020','#FF7733','#a08020',
      '#d0cdc0','#888880','#404038','#f8f0d8',
      '#1a1810','#c0b890'
    ];

    var frags = [];
    for (var i = 0; i < count; i++) {
      var ang   = Math.random() * Math.PI * 2;
      var spd   = 1.8 + Math.random() * (MOBILE ? 5 : 9);
      var sz    = 3   + Math.random() * (MOBILE ? 9 : 16);
      var sides = Math.random() < 0.5 ? 3 : 4; // tri or quad
      frags.push({
        x:   cx + (Math.random() - 0.5) * rect.width  * 0.9,
        y:   cy + (Math.random() - 0.5) * rect.height * 0.9,
        vx:  Math.cos(ang) * spd,
        vy:  Math.sin(ang) * spd - Math.random() * 2.5,
        rot: Math.random() * Math.PI * 2,
        av:  (Math.random() - 0.5) * 0.18,
        sz:  sz,
        sides: sides,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.75 + Math.random() * 0.25
      });
    }

    var t0 = Date.now();
    function draw() {
      var elapsed  = Date.now() - t0;
      var progress = Math.min(elapsed / SHATTER_DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var j = 0; j < frags.length; j++) {
        var f   = frags[j];
        var life = Math.max(0, 1 - progress * 1.35);
        if (life <= 0) continue;

        f.x   += f.vx;
        f.y   += f.vy;
        f.vy  += 0.28;     // gravity
        f.vx  *= 0.975;    // air friction
        f.rot += f.av;

        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.globalAlpha = life * f.alpha;

        // Main shard
        ctx.fillStyle = f.color;
        ctx.beginPath();
        if (f.sides === 3) {
          ctx.moveTo( 0,         -f.sz);
          ctx.lineTo( f.sz*0.75,  f.sz*0.55);
          ctx.lineTo(-f.sz*0.75,  f.sz*0.55);
        } else {
          ctx.moveTo(-f.sz*0.5, -f.sz*0.6);
          ctx.lineTo( f.sz*0.7, -f.sz*0.3);
          ctx.lineTo( f.sz*0.5,  f.sz*0.55);
          ctx.lineTo(-f.sz*0.65, f.sz*0.3);
        }
        ctx.closePath();
        ctx.fill();

        // Highlight edge — glass shimmer
        ctx.strokeStyle = 'rgba(255,255,255,' + (life * 0.45) + ')';
        ctx.lineWidth   = 0.6;
        ctx.stroke();

        ctx.restore();
      }

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        startVoidTransition();
      }
    }
    requestAnimationFrame(draw);
  }

  /* ─────────────────────────────────────────────
     5. VOID TUNNEL TRANSITION
  ───────────────────────────────────────────── */
  function startVoidTransition() {
    var ring = document.getElementById('k-void-ring');
    if (!ring) { revealSite(); return; }

    ring.style.display = 'block';
    // Force reflow so the transition fires
    void ring.offsetWidth;
    ring.classList.add('k-expand');

    setTimeout(revealSite, 680);
  }

  /* ─────────────────────────────────────────────
     6. REVEAL MAIN SITE
  ───────────────────────────────────────────── */
  function revealSite() {
    var entry = document.getElementById('k-entry');
    var pre   = document.getElementById('k-preloader');

    [pre, entry].forEach(function (el) {
      if (!el) return;
      el.style.transition = 'opacity 0.45s ease';
      el.style.opacity    = '0';
      setTimeout(function () { el.style.display = 'none'; }, 460);
    });

    document.body.style.overflow = '';
    document.body.classList.add('is-loaded');

    // Save session so returning from shop skips the preloader
    try { sessionStorage.setItem('k_entered', '1'); } catch (e) {}

    // Give the page a beat to paint before init scroll effects
    setTimeout(function () {
      if (IS_HOME) {
        waitForHome(function () {
          injectTypingSection();
          initScrollEffects();
        });
      }
    }, 120);
  }

  /* ─────────────────────────────────────────────
     7. LENIS SMOOTH SCROLL (motion.js handles it; this is a no-op backup)
  ───────────────────────────────────────────── */
  function initLenis() {
    /* Lenis is already started by motion.js initMotion(). No-op here. */
  }

  /* ─────────────────────────────────────────────
     8. WAIT FOR CODEX HOME SECTIONS
  ───────────────────────────────────────────── */
  function waitForHome(cb) {
    var tries = 0;
    function check() {
      // Codex homepage uses .v3-hero and #collectionGrid (rendered by motion.js renderHome)
      var hero = document.querySelector('.v3-hero');
      var grid = document.getElementById('collectionGrid');
      if (hero && grid && grid.children.length > 0) {
        cb();
      } else if (tries++ < 40) {
        setTimeout(check, 80);
      } else {
        cb(); // give up waiting, run anyway
      }
    }
    check();
  }

  /* ─────────────────────────────────────────────
     9. INJECT TYPING SECTION HTML
  ───────────────────────────────────────────── */
  function injectTypingSection() {
    if (document.getElementById('k-typing-section')) return;

    // Insert after the last .home-section (featured products section)
    var sections = document.querySelectorAll('.home-section');
    var anchor   = sections.length ? sections[sections.length - 1] : null;
    if (!anchor) return;

    var lines = [
      { cls: 'k-type-hero', text: 'NO APOLOGIES' },
      { cls: 'k-type-tag',  text: '{DRIVEN BY AURA. DEFINED BY POWER.}' },
      { cls: 'k-type-tag',  text: '{DROP 001 — LIMITED UNITS — SS26}' },
      { cls: 'k-type-tag',  text: '{GOTHIC & STREETWEAR — BUILT DIFFERENT}' },
      { cls: 'k-type-tag',  text: '{THE SIGNAL IS LIVE}' }
    ];

    var inner = lines.map(function (l) {
      return '<span class="' + l.cls + ' k-type-line" data-text="' + l.text + '"></span>';
    }).join('');

    var html = '<section id="k-typing-section">'
             + '<div class="k-ts-noise"></div>'
             + inner
             + '</section>';

    anchor.insertAdjacentHTML('afterend', html);
  }

  /* ─────────────────────────────────────────────
     10. SCROLL EFFECTS
  ───────────────────────────────────────────── */
  function initScrollEffects() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      initGSAPEffects();
    } else {
      initCSSEffects();
    }
    initCategoryReveal();
    initTypingText();
  }

  /* ── GSAP path — targets Codex homepage selectors ── */
  function initGSAPEffects() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero copy — subtle upward drift
    var heroCopy = document.querySelector('.v3-hero .hero-copy');
    if (heroCopy) {
      gsap.to(heroCopy, {
        y: -60, opacity: 0.3, ease: 'none',
        scrollTrigger: {
          trigger: '.v3-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Editorial split — text rise
    var editCopy = document.querySelector('.editorial-copy');
    if (editCopy) {
      gsap.fromTo(editCopy,
        { y: 50, opacity: 0 },
        { y: 0,  opacity: 1,
          scrollTrigger: {
            trigger: '.editorial-split',
            start: 'top 80%',
            end:   'top 30%',
            scrub: 1.2
          }
        }
      );
    }

    // Editorial image — parallax
    var editImg = document.querySelector('.editorial-image');
    if (editImg) {
      gsap.fromTo(editImg,
        { y: 30, opacity: 0 },
        { y: 0,  opacity: 1,
          scrollTrigger: {
            trigger: '.editorial-split',
            start: 'top 75%',
            end:   'top 20%',
            scrub: 1.4
          }
        }
      );
    }

    // Collection grid cards — stagger in
    var catCards = document.querySelectorAll('.category-card');
    if (catCards.length) {
      gsap.fromTo(catCards,
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, stagger: 0.1,
          scrollTrigger: {
            trigger: '.category-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  /* ── CSS IntersectionObserver fallback ── */
  function initCSSEffects() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('k-vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.home-section, #k-typing-section').forEach(function (el) {
      el.classList.add('k-reveal');
      obs.observe(el);
    });
  }

  /* ── Category cards appear one by one ── */
  function initCategoryReveal() {
    var cards = document.querySelectorAll('.category-card');
    if (!cards.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('k-cat-vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    cards.forEach(function (card, i) {
      card.style.transitionDelay = (i * 0.06) + 's';
      obs.observe(card);
    });
  }

  /* ─────────────────────────────────────────────
     11. SCROLL-TRIGGERED TYPING TEXT
  ───────────────────────────────────────────── */
  function initTypingText() {
    var lines = document.querySelectorAll('.k-type-line');
    if (!lines.length) return;

    // Prep lines — store full text, start empty
    lines.forEach(function (el) {
      var full = el.getAttribute('data-text') || el.textContent.trim();
      el.setAttribute('data-text', full);
      el.textContent = '';
    });

    // Which line is being actively typed (has cursor)
    var activeEl = null;

    function updateAll() {
      lines.forEach(function (el) {
        var full     = el.getAttribute('data-text') || '';
        var rect     = el.getBoundingClientRect();
        var winH     = window.innerHeight;
        // Start revealing when element enters bottom 80%, finish at 15% from top
        var startPx  = winH * 0.85;
        var endPx    = winH * 0.15;
        var progress = (startPx - rect.top) / (startPx - endPx);
        progress     = Math.max(0, Math.min(1, progress));

        var chars = Math.round(progress * full.length);
        el.textContent = full.slice(0, chars);

        // Cursor blink on the line currently being typed
        if (progress > 0 && progress < 1) {
          if (activeEl && activeEl !== el) activeEl.classList.remove('k-typing-cursor');
          el.classList.add('k-typing-cursor');
          activeEl = el;
        } else {
          el.classList.remove('k-typing-cursor');
          if (activeEl === el) activeEl = null;
        }
      });
    }

    window.addEventListener('scroll', updateAll, { passive: true });
    // Run once after a short delay so initial positions compute correctly
    setTimeout(updateAll, 80);
  }

  /* ─────────────────────────────────────────────
     12. MAIN INIT
  ───────────────────────────────────────────── */
  function init() {
    // Grain overlay on every page
    initGrain();

    var pre   = document.getElementById('k-preloader');
    var entry = document.getElementById('k-entry');

    // If already entered this session, skip the whole intro
    var alreadyIn = false;
    try { alreadyIn = sessionStorage.getItem('k_entered') === '1'; } catch (e) {}

    if (alreadyIn || REDUCE) {
      // Quick skip: hide overlays, show site, init scroll
      [pre, entry].forEach(function (el) { if (el) el.style.display = 'none'; });
      document.body.style.overflow = '';
      document.body.classList.add('is-loaded');
      if (IS_HOME) {
        setTimeout(function () {
          waitForHome(function () {
            injectTypingSection();
            initScrollEffects();
          });
        }, 200);
      }
      return;
    }

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    initEntryBtn();
    initPreloader();
  }

  // Run on DOMContentLoaded or immediately if already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
