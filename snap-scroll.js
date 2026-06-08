/* ═══════════════════════════════════════════════════════════
   KRYPTAA — Snap Scroll Cinematic Engine  v1
   snap-scroll.js

   Architecture (TikTok spec):
   · playHeroAnimation(idx) — entrance + idle as ONE continuous GSAP timeline
     stored in activeAnimations[idx]
   · killHeroAnimation(idx) — kills timeline, resets layers for re-entrance
   · goTo pattern: kill OLD → play NEW (IntersectionObserver fires this)
   · On first reveal → playHeroAnimation(0)

   Layer convention (add to HTML):
     .layer-bg     — background (zoom-in entrance → slow idle scale drift)
     .layer-figure — mid-ground asset (slide-in entrance → float idle)
     .layer-copy   — foreground text (children stagger-reveal)
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var activeAnimations = [];
  var panels           = [];
  var currentIdx       = 0;
  var initiated        = false;

  /* Per-panel animation specs — index matches panel order in HTML */
  var ANIM = [
    /* 0 — Hero */
    {
      bg:     { dur: 1.2, fromScale: 1.05, idleScale: 1.066, idleDur: 30 },
      figure: { fromY: 0, fromX: 0, dur: 0, idleY: -8, idleDur: 6, delay: 1.4 },
      copy:   { stagger: 0.09, delay: 0.45 }
    },
    /* 1 — Editorial "Defined By Power" */
    {
      bg:     { dur: 1.4, fromScale: 1.06, idleScale: 1.055, idleDur: 25 },
      figure: { fromY: 60, fromX: 60, dur: 0.9, idleY: -10, idleDur: 5.5, delay: 0.3 },
      copy:   { fromX: -40, stagger: 0.1, delay: 0.35 }
    },
    /* 2 — Collections */
    {
      bg:   { dur: 1.0, fromScale: 1.02 },
      copy: { stagger: 0.055, delay: 0.2 }
    },
    /* 3 — Brand Video */
    {
      bg:     { dur: 1.4, fromScale: 1.05, idleScale: 1.04, idleDur: 28 },
      figure: { fromX: -60, fromY: 0, dur: 1.0, idleY: -6, idleDur: 6, delay: 0.4 },
      copy:   { fromX: 50, stagger: 0.11, delay: 0.55 }
    },
    /* 4 — Featured Products */
    {
      bg:   { dur: 0.9, fromScale: 1.02 },
      copy: { stagger: 0.05, delay: 0.15 }
    },
    /* 5 — Brand Story */
    {
      bg:   { dur: 1.2, fromScale: 1.03, idleScale: 1.04, idleDur: 22 },
      copy: { stagger: 0.14, delay: 0.4 }
    },
    /* 6+ — Join Drop / Footer */
    {
      copy: { stagger: 0.1, delay: 0.2 }
    }
  ];

  /* Elements inside .layer-copy to stagger */
  var COPY_SEL = [
    '.eyebrow', 'h2', 'h1', 'p', 'a.k-btn-gold', 'a.k-btn-outline',
    '.bs-stat', '.cd-unit', '.cd-sep', '.cd-label', '.cd-sub',
    '.jd-eyebrow', '.jd-headline', '.jd-sub', '.jd-form', '.jd-fine',
    '.bv-eyebrow', '.bv-headline', '.bv-body', '.bv-cta',
    '.bs-tag', '.bs-headline', '.bs-body', '.bs-stats'
  ].join(', ');

  /* ── Play entrance + idle for one panel ── */
  function playHeroAnimation(idx) {
    var panel = panels[idx];
    if (!panel) return;

    var conf = ANIM[Math.min(idx, ANIM.length - 1)];
    var tl   = gsap.timeline();
    activeAnimations[idx] = tl;

    var bg     = panel.querySelector('.layer-bg');
    var figure = panel.querySelector('.layer-figure');
    var copy   = panel.querySelector('.layer-copy');

    /* BG: opacity 0→1, scale fromScale→1, then idle drift (no gap) */
    if (bg && conf.bg) {
      tl.fromTo(bg,
        { opacity: 0, scale: conf.bg.fromScale || 1.04 },
        { opacity: 1, scale: 1, duration: conf.bg.dur, ease: 'power3.out' },
        0
      );
      if (conf.bg.idleScale) {
        tl.to(bg,
          { scale: conf.bg.idleScale, duration: conf.bg.idleDur, ease: 'none' },
          conf.bg.dur  /* starts exactly where entrance ends — no gap */
        );
      }
    }

    /* FIGURE: slide + fade entrance, then idle float (no gap) */
    if (figure && conf.figure) {
      var fDelay = conf.figure.delay != null ? conf.figure.delay : 0.25;
      tl.fromTo(figure,
        { opacity: 0, y: conf.figure.fromY || 0, x: conf.figure.fromX || 0 },
        { opacity: 1, y: 0, x: 0, duration: conf.figure.dur || 0.8, ease: 'power3.out' },
        fDelay
      );
      if (conf.figure.idleY) {
        tl.to(figure,
          { y: conf.figure.idleY, duration: conf.figure.idleDur || 5,
            ease: 'sine.inOut', yoyo: true, repeat: -1 },
          fDelay + (conf.figure.dur || 0.8)
        );
      }
    }

    /* COPY: stagger children reveal */
    if (copy && conf.copy) {
      var els = copy.querySelectorAll(COPY_SEL);
      if (!els.length) els = copy.children.length ? copy.children : [copy];
      tl.fromTo(Array.from(els),
        { opacity: 0, y: 24, x: conf.copy.fromX || 0 },
        { opacity: 1, y: 0,  x: 0,
          duration: 0.65, ease: 'power2.out',
          stagger: conf.copy.stagger || 0.08 },
        conf.copy.delay || 0.4
      );
    }
  }

  /* ── Kill a panel's timeline and reset to initial hidden state ── */
  function killHeroAnimation(idx) {
    if (activeAnimations[idx]) {
      activeAnimations[idx].kill();
      activeAnimations[idx] = null;
    }
    var panel = panels[idx];
    if (!panel) return;

    var bg     = panel.querySelector('.layer-bg');
    var figure = panel.querySelector('.layer-figure');
    var copy   = panel.querySelector('.layer-copy');

    if (bg)     gsap.set(bg,     { opacity: 0, clearProps: 'scale,transform' });
    if (figure) gsap.set(figure, { opacity: 0, clearProps: 'y,x,transform' });
    if (copy) {
      var els = copy.querySelectorAll(COPY_SEL);
      if (els.length) gsap.set(Array.from(els), { opacity: 0, y: 24, x: 0 });
    }
  }

  /* ── Init snap scroll ── */
  function initSnapScroll() {
    if (initiated) return;
    if (typeof gsap === 'undefined' || gsap.__fallback) return;
    initiated = true;

    panels = Array.from(document.querySelectorAll('.snap-panel'));
    if (!panels.length) return;

    /* Activate CSS scroll snap on html element */
    document.documentElement.classList.add('k-snap-active');

    gsap.registerPlugin(ScrollTrigger);

    /* Play first panel immediately */
    playHeroAnimation(0);

    /* IntersectionObserver — fires when panel crosses 55% visibility */
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = panels.indexOf(entry.target);
        if (idx === -1 || idx === currentIdx) return;
        var prev = currentIdx;
        currentIdx = idx;
        killHeroAnimation(prev);
        playHeroAnimation(idx);
      });
    }, { threshold: 0.55 });

    panels.forEach(function (p) { obs.observe(p); });
  }

  /* ── Boot hooks ── */
  document.addEventListener('kryptaa:revealed', function () {
    setTimeout(initSnapScroll, 350);
  });

  /* Fallback: session-skipped preloader sets is-loaded immediately */
  window.addEventListener('load', function () {
    if (document.body.classList.contains('is-loaded')) {
      setTimeout(initSnapScroll, 600);
    }
  });

})();
