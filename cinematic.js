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

    // Save session so returning from shop skips the preloader
    try { sessionStorage.setItem('k_entered', '1'); } catch (e) {}

    // Give the page a beat to paint before init scroll effects
    setTimeout(function () {
      if (IS_HOME) {
        initLenis();
        waitForSections(function () {
          injectTypingSection();
          initScrollEffects();
        });
      }
    }, 120);
  }

  /* ─────────────────────────────────────────────
     7. LENIS SMOOTH SCROLL
  ───────────────────────────────────────────── */
  function initLenis() {
    if (REDUCE || MOBILE) return; // keep native on iOS Safari
    if (typeof Lenis === 'undefined') return;

    try {
      var lenis = new Lenis({
        duration: 1.15,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        smooth: true,
        smoothTouch: false
      });

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        (function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        })(0);
      }
    } catch (e) { /* Lenis failed — silent fallback */ }
  }

  /* ─────────────────────────────────────────────
     8. WAIT FOR FIX.JS SECTIONS
  ───────────────────────────────────────────── */
  function waitForSections(cb) {
    var tries = 0;
    function check() {
      var hero = document.getElementById('kryptaa-hero-v2');
      var cats = document.getElementById('k-categories');
      if (hero && cats) {
        cb();
      } else if (tries++ < 30) {
        setTimeout(check, 80);
      }
    }
    check();
  }

  /* ─────────────────────────────────────────────
     9. INJECT TYPING SECTION HTML
  ───────────────────────────────────────────── */
  function injectTypingSection() {
    if (document.getElementById('k-typing-section')) return;

    var videoSec = document.getElementById('k-video-section');
    if (!videoSec) return;

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

    videoSec.insertAdjacentHTML('afterend', html);
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

  /* ── GSAP path ── */
  function initGSAPEffects() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero inner — subtle upward drift + fade
    var heroInner = document.querySelector('#kryptaa-hero-v2 .hero-inner');
    if (heroInner) {
      gsap.to(heroInner, {
        y: -70, opacity: 0.25, ease: 'none',
        scrollTrigger: {
          trigger: '#kryptaa-hero-v2',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Brand story — text rise
    var brandH2 = document.querySelector('#k-brand-story h2');
    if (brandH2) {
      gsap.fromTo(brandH2,
        { y: 50, opacity: 0 },
        { y: 0,  opacity: 1,
          scrollTrigger: {
            trigger: '#k-brand-story',
            start: 'top 78%',
            end:   'top 30%',
            scrub: 1.2
          }
        }
      );
    }
    var brandP = document.querySelector('#k-brand-story p');
    if (brandP) {
      gsap.fromTo(brandP,
        { y: 35, opacity: 0 },
        { y: 0,  opacity: 1,
          scrollTrigger: {
            trigger: '#k-brand-story',
            start: 'top 70%',
            end:   'top 20%',
            scrub: 1.4
          }
        }
      );
    }

    // Video section — text scale up
    var vidText = document.querySelector('#k-video-section > div:last-child');
    if (vidText) {
      gsap.fromTo(vidText,
        { scale: 0.86, opacity: 0 },
        { scale: 1,    opacity: 1,
          scrollTrigger: {
            trigger: '#k-video-section',
            start: 'top 72%',
            end:   'top 10%',
            scrub: 1.5
          }
        }
      );
    }

    // How-it-works — stagger steps
    var steps = document.querySelectorAll('#k-how-it-works [style*="background:#060608;padding:40px"]');
    steps.forEach(function (step, i) {
      gsap.fromTo(step,
        { y: 40, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.7,
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.12
        }
      );
    });
  }

  /* ── CSS IntersectionObserver fallback ── */
  function initCSSEffects() {
    var targets = [
      '#k-brand-story',
      '#k-video-section',
      '#k-how-it-works',
      '#k-typing-section'
    ];

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('k-vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) {
        el.classList.add('k-reveal');
        obs.observe(el);
      }
    });
  }

  /* ── Category rows appear one by one ── */
  function initCategoryReveal() {
    var rows = document.querySelectorAll('#k-categories > div > a');
    if (!rows.length) return;

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('k-cat-vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    rows.forEach(function (row, i) {
      row.style.transitionDelay = (i * 0.06) + 's';
      obs.observe(row);
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
      if (IS_HOME) {
        setTimeout(function () {
          initLenis();
          waitForSections(function () {
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
