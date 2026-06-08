/* ═══════════════════════════════════════════════════════════
   KRYPTAA — Cinematic Snap Scroll Engine  v2  WOW EDITION
   snap-scroll.js

   What creates CHILLS:
   · Letters fly in from chaos → snap into place  (back.out spring)
   · Gold particle bursts on every panel transition
   · HUD corner brackets draw themselves per panel
   · Radial gold glow EXPLODES outward on enter, fades
   · Mouse parallax: bg drifts opposite, figure follows → 3D depth
   · Continuous idle: bg slow zoom drift, figures float
   · Per-panel tailored timelines (not generic configs)

   Architecture:
     playHeroAnimation(idx)  — entrance + idle → ONE timeline (no gap)
     killHeroAnimation(idx)  — kill, reset for next entrance
     IntersectionObserver @ 55% → kill prev, play next
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── State ── */
  var activeAnimations = [];
  var panels           = [];
  var currentIdx       = 0;
  var initiated        = false;
  var MOBILE           = window.innerWidth <= 768;
  var REDUCE           = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════════════
     PARTICLE SYSTEM  — ambient gold dust + burst on transition
  ══════════════════════════════════════════════════════════ */
  var pCanvas, pCtx, pList = [];

  function initParticles() {
    pCanvas = document.getElementById('k-particles');
    if (!pCanvas || REDUCE) return;
    resize();
    window.addEventListener('resize', resize);
    var count = MOBILE ? 35 : 75;
    for (var i = 0; i < count; i++) pList.push(mkP(true));
    loopP();
  }

  function resize() {
    if (!pCanvas) return;
    pCanvas.width  = window.innerWidth;
    pCanvas.height = window.innerHeight;
    pCtx = pCanvas.getContext('2d');
  }

  function mkP(scatter) {
    var w = window.innerWidth, h = window.innerHeight;
    return {
      x:  scatter ? Math.random() * w : w / 2 + (Math.random() - .5) * 200,
      y:  scatter ? Math.random() * h : h + 10,
      vx: (Math.random() - .5) * 0.38,
      vy: -(Math.random() * 0.5 + 0.08),
      r:  Math.random() * 1.5 + 0.3,
      a:  Math.random() * 0.55 + 0.08,
      lf: Math.random()
    };
  }

  function loopP() {
    if (!pCtx) return;
    requestAnimationFrame(loopP);
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    var w = pCanvas.width, h = pCanvas.height;
    for (var i = pList.length - 1; i >= 0; i--) {
      var p = pList[i];
      p.x += p.vx; p.y += p.vy; p.lf += 0.0035;
      var a = p.a * Math.sin(p.lf * Math.PI);
      if (a <= 0 || p.y < -10 || p.x < -10 || p.x > w + 10) {
        pList.splice(i, 1);
        pList.unshift(mkP(false));
        continue;
      }
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = 'rgba(210,174,91,' + a.toFixed(2) + ')';
      pCtx.fill();
    }
  }

  function burstP(x, y, n) {
    if (!pCtx || REDUCE) return;
    n = n || 28;
    x = x || window.innerWidth  / 2;
    y = y || window.innerHeight / 2;
    for (var i = 0; i < n; i++) {
      var ang = Math.random() * Math.PI * 2;
      var spd = Math.random() * 3.5 + 0.8;
      pList.push({
        x: x, y: y,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd - 2.5,
        r: Math.random() * 2.4 + 0.5,
        a: 0.9, lf: 0
      });
    }
  }

  /* ══════════════════════════════════════════════════════════
     CHARACTER SPLIT  — wrap each letter in a span for animation
  ══════════════════════════════════════════════════════════ */
  function splitChars(el) {
    if (el._split) return el.querySelectorAll('.k-char:not(.k-sp)');
    if (el.children.length > 0) { el._split = false; return null; }
    el._split = true;
    var t = el.textContent;
    el.innerHTML = t.split('').map(function (c) {
      return c === ' '
        ? '<span class="k-char k-sp"> </span>'
        : '<span class="k-char">' + c + '</span>';
    }).join('');
    return el.querySelectorAll('.k-char:not(.k-sp)');
  }

  function blastChars(chars, tl, at, dur, gap) {
    if (!chars || !chars.length) return;
    dur = dur || 0.52;
    gap = gap || 0.02;
    tl.fromTo(Array.from(chars),
      {
        opacity: 0,
        y:        function () { return gsap.utils.random(-70, 70); },
        x:        function () { return gsap.utils.random(-35, 35); },
        rotation: function () { return gsap.utils.random(-28, 28); },
        scale: 0.25
      },
      {
        opacity: 1, y: 0, x: 0, rotation: 0, scale: 1,
        duration: dur, ease: 'back.out(1.9)',
        stagger: { each: gap, from: 'random' }
      },
      at
    );
  }

  /* ══════════════════════════════════════════════════════════
     HUD CORNERS  — L-shaped brackets that draw per panel
  ══════════════════════════════════════════════════════════ */
  function addHUD(panel) {
    if (panel.querySelector('.hud-tl')) return;
    ['hud-tl','hud-tr','hud-bl','hud-br'].forEach(function (c) {
      var el = document.createElement('div');
      el.className = 'hud-corner ' + c;
      panel.appendChild(el);
    });
  }

  function animHUD(panel, tl, at) {
    var corners = panel.querySelectorAll('.hud-corner');
    if (!corners.length) return;
    tl.fromTo(corners,
      { opacity: 0, scale: 0.2 },
      { opacity: 1, scale: 1, duration: 0.45, stagger: 0.055, ease: 'power3.out' },
      at
    );
    tl.to(corners,
      { opacity: 0.45, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.25 },
      at + 0.55
    );
  }

  /* ══════════════════════════════════════════════════════════
     GLOW BURST  — radial gold pulse on panel enter
  ══════════════════════════════════════════════════════════ */
  function glowBurst(panel) {
    if (REDUCE) return;
    var b = document.createElement('div');
    b.className = 'k-glow-burst';
    panel.appendChild(b);
    gsap.fromTo(b,
      { opacity: 0.65, scale: 0.15, xPercent: -50, yPercent: -50 },
      { opacity: 0, scale: 2.8, duration: 1.0, ease: 'power2.out',
        onComplete: function () { b.parentNode && b.parentNode.removeChild(b); }
      }
    );
  }

  /* ══════════════════════════════════════════════════════════
     MOUSE PARALLAX  — desktop: bg drifts opposite, figure follows
  ══════════════════════════════════════════════════════════ */
  function initMouseParallax() {
    if (MOBILE || REDUCE) return;
    window.addEventListener('mousemove', function (e) {
      var mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      var my = (e.clientY / window.innerHeight - 0.5) * 2;
      var panel = panels[currentIdx];
      if (!panel) return;
      var bg  = panel.querySelector('.layer-bg');
      var fig = panel.querySelector('.layer-figure');
      if (bg)  gsap.to(bg,  { x: mx * -22, y: my * -14, duration: 1.3, ease: 'power2.out', overwrite: 'auto' });
      if (fig) gsap.to(fig, { x: mx *  26, y: my *  16, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     PLAY HERO ANIMATION  — per-panel tailored cinematic timelines
  ══════════════════════════════════════════════════════════ */
  function playHeroAnimation(idx) {
    var panel = panels[idx];
    if (!panel) return;

    glowBurst(panel);
    burstP(window.innerWidth / 2, window.innerHeight * 0.55, 22);

    var tl = gsap.timeline();
    activeAnimations[idx] = tl;

    var bg  = panel.querySelector('.layer-bg');
    var fig = panel.querySelector('.layer-figure');
    var cp  = panel.querySelector('.layer-copy');

    switch (idx) {

      /* ────────────────────────────────────────────
         PANEL 0 — HERO
         BG: slam zoom-in → drift
         Figure: appear from right with spring scale → idle float
         Wordmark: scale blast from 0.7 + glow
         Eyebrow, desc, buttons: stagger up
      ──────────────────────────────────────────── */
      case 0:
        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
          tl.to(bg, { scale: 1.07, duration: 38, ease: 'none' }, 1.4);
        }
        if (fig) {
          tl.fromTo(fig, { opacity: 0, x: 60, scale: 0.86 }, { opacity: 1, x: 0, scale: 1, duration: 1.05, ease: 'power3.out' }, 0.3);
          tl.to(fig, { y: -18, duration: 5.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.35);
        }
        if (cp) {
          var lockup = cp.querySelector('.hero-brand-lockup');
          if (lockup) tl.fromTo(lockup, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.5);

          var eye0 = cp.querySelector('.eyebrow');
          if (eye0) tl.fromTo(eye0, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.72);

          var wm = cp.querySelector('.hero-wordmark-img');
          if (wm) {
            /* Don't animate filter — mismatched filter functions cause GSAP to stall */
            tl.fromTo(wm,
              { opacity: 0, scale: 0.72 },
              { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' },
              0.88
            );
            /* Idle glow via CSS class after entrance completes */
            tl.call(function () { wm.classList.add('wm-glow-active'); }, [], 1.6);
          }

          var desc0 = cp.querySelector('p');
          if (desc0) tl.fromTo(desc0, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.1);

          var btns0 = cp.querySelectorAll('.hero-actions a');
          if (btns0.length) tl.fromTo(btns0, { opacity: 0, y: 22, scale: 0.88 }, { opacity: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.12, ease: 'back.out(1.5)' }, 1.38);
        }
        animHUD(panel, tl, 1.0);
        break;

      /* ────────────────────────────────────────────
         PANEL 1 — EDITORIAL  "DEFINED BY POWER"
         Letters fly from chaos → snap into place
      ──────────────────────────────────────────── */
      case 1:
        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
          tl.to(bg, { scale: 1.058, duration: 30, ease: 'none' }, 1.6);
        }
        if (fig) {
          tl.fromTo(fig, { opacity: 0, x: 90, scale: 0.88 }, { opacity: 1, x: 0, scale: 1, duration: 1.0, ease: 'power3.out' }, 0.28);
          tl.to(fig, { y: -14, duration: 6.2, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.28);
        }
        if (cp) {
          var eye1 = cp.querySelector('.eyebrow');
          if (eye1) tl.fromTo(eye1, { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: 0.42, ease: 'power2.out' }, 0.3);

          var h2_1 = cp.querySelector('h2');
          if (h2_1) {
            var chars1 = splitChars(h2_1);
            if (chars1 && chars1.length) {
              blastChars(chars1, tl, 0.48, 0.55, 0.022);
            } else {
              tl.fromTo(h2_1, { opacity: 0, scale: 0.8, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.6)' }, 0.48);
            }
          }

          var p1 = cp.querySelector('p');
          if (p1) tl.fromTo(p1, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.35);

          var btns1 = cp.querySelectorAll('a');
          if (btns1.length) tl.fromTo(btns1, { opacity: 0, y: 20, scale: 0.86 }, { opacity: 1, y: 0, scale: 1, duration: 0.44, stagger: 0.1, ease: 'back.out(1.5)' }, 1.65);
        }
        animHUD(panel, tl, 0.85);
        break;

      /* ────────────────────────────────────────────
         PANEL 2 — COLLECTIONS  "CHOOSE THE SIGNAL"
         Headline chars blast in, cards stagger from bottom
      ──────────────────────────────────────────── */
      case 2:
        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out' }, 0);
        }
        if (cp) {
          var eye2 = cp.querySelector('.eyebrow');
          if (eye2) tl.fromTo(eye2, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0.18);

          var h2_2 = cp.querySelector('h2');
          if (h2_2) {
            var chars2 = splitChars(h2_2);
            blastChars(chars2, tl, 0.32, 0.46, 0.015);
          }

          var cards2 = cp.querySelectorAll('.category-card');
          if (cards2.length) {
            tl.fromTo(cards2,
              { opacity: 0, y: 50, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: 0.58, stagger: { each: 0.08, from: 'start' }, ease: 'power3.out' },
              0.7
            );
          }
        }
        animHUD(panel, tl, 0.5);
        break;

      /* ────────────────────────────────────────────
         PANEL 3 — BRAND VIDEO
         Video col slams in from left with scale spring
         Headline blasts, text reveals, CTA bounces in
      ──────────────────────────────────────────── */
      case 3:
        if (fig) {
          tl.fromTo(fig, { opacity: 0, x: -90, scale: 0.85 }, { opacity: 1, x: 0, scale: 1, duration: 1.15, ease: 'power3.out' }, 0.1);
          tl.to(fig, { scale: 1.025, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.25);
        }
        if (cp) {
          var bvEye = cp.querySelector('.bv-eyebrow');
          if (bvEye) tl.fromTo(bvEye, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.5);

          var bvH = cp.querySelector('.bv-headline');
          if (bvH) {
            var charsbv = splitChars(bvH);
            if (charsbv && charsbv.length) {
              blastChars(charsbv, tl, 0.65, 0.52, 0.02);
            } else {
              tl.fromTo(bvH, { opacity: 0, scale: 0.78, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.6)' }, 0.65);
            }
          }

          var bvBody = cp.querySelector('.bv-body');
          if (bvBody) tl.fromTo(bvBody, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.35);

          var bvCta = cp.querySelector('.bv-cta');
          if (bvCta) tl.fromTo(bvCta, { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' }, 1.6);
        }
        animHUD(panel, tl, 0.65);
        break;

      /* ────────────────────────────────────────────
         PANEL 4 — FEATURED PRODUCTS
         Product cards slam in staggered from bottom
      ──────────────────────────────────────────── */
      case 4:
        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' }, 0);
        }
        if (cp) {
          var eye4 = cp.querySelector('.eyebrow');
          if (eye4) tl.fromTo(eye4, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0.18);

          var h2_4 = cp.querySelector('h2');
          if (h2_4) {
            var chars4 = splitChars(h2_4);
            blastChars(chars4, tl, 0.32, 0.42, 0.015);
          }

          var sec4btn = cp.querySelector('.k-btn-outline');
          if (sec4btn) tl.fromTo(sec4btn, { opacity: 0 }, { opacity: 1, duration: 0.32 }, 0.35);

          var prods = cp.querySelectorAll('.product-card');
          if (prods.length) {
            tl.fromTo(prods,
              { opacity: 0, y: 60, scale: 0.86, rotation: function (i) { return (i % 2 === 0 ? 1 : -1) * 2; } },
              { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.65, stagger: { each: 0.1, from: 'start' }, ease: 'power3.out' },
              0.58
            );
          }
        }
        animHUD(panel, tl, 0.5);
        break;

      /* ────────────────────────────────────────────
         PANEL 5 — COLLAB / HEAVYWEIGHT TEES
         T-shirt images fly in from different angles
         Headline blasts, extra particle burst
      ──────────────────────────────────────────── */
      case 5:
        burstP(window.innerWidth * 0.65, window.innerHeight * 0.5, 45);

        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
          tl.to(bg, { scale: 1.06, duration: 28, ease: 'none' }, 1.4);
        }
        if (fig) {
          var cimgs = fig.querySelectorAll('.collab-img');
          if (cimgs.length) {
            tl.fromTo(cimgs,
              {
                opacity: 0,
                y: function (i) { return [100, -80, 120][i] || 80; },
                x: function (i) { return [40, -30, 60][i] || 30; },
                scale: 0.65,
                rotation: function (i) { return [-6, 5, -8][i] || -4; }
              },
              {
                opacity: 1, y: 0, x: 0, scale: 1, rotation: 0,
                duration: 1.1, stagger: 0.15, ease: 'power3.out'
              },
              0.25
            );
            /* Idle: each tee floats at different phase */
            cimgs.forEach(function (img, i) {
              tl.to(img, { y: [-12, -18, -10][i] || -12, duration: 4 + i * 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 1.35 + i * 0.3);
            });
          }
        }
        if (cp) {
          var ceye = cp.querySelector('.eyebrow');
          if (ceye) tl.fromTo(ceye, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.42, ease: 'power2.out' }, 0.5);

          var ch2 = cp.querySelector('h2');
          if (ch2) {
            var charsc = splitChars(ch2);
            if (charsc && charsc.length) {
              blastChars(charsc, tl, 0.65, 0.56, 0.025);
            } else {
              tl.fromTo(ch2, { opacity: 0, scale: 0.76, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.6)' }, 0.65);
            }
          }

          var cp5 = cp.querySelector('p');
          if (cp5) tl.fromTo(cp5, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, 1.5);

          var cbtn = cp.querySelector('.k-btn-gold');
          if (cbtn) tl.fromTo(cbtn, { opacity: 0, scale: 0.82 }, { opacity: 1, scale: 1, duration: 0.46, ease: 'back.out(1.7)' }, 1.8);
        }
        animHUD(panel, tl, 0.75);
        break;

      /* ────────────────────────────────────────────
         PANEL 6 — BRAND STORY
         "NOT FOR EVERYONE" — letters blast in
         Stats count up with stagger
         CTA bounces in last
      ──────────────────────────────────────────── */
      case 6:
        if (bg) {
          tl.fromTo(bg, { opacity: 0, scale: 1.07 }, { opacity: 1, scale: 1, duration: 1.35, ease: 'power3.out' }, 0);
          tl.to(bg, { scale: 1.045, duration: 26, ease: 'none' }, 1.35);
        }
        if (cp) {
          var bstag = cp.querySelector('.bs-tag');
          if (bstag) tl.fromTo(bstag, { opacity: 0 }, { opacity: 1, duration: 0.38 }, 0.28);

          var bsh2 = cp.querySelector('.bs-headline');
          if (bsh2) {
            var charsBs = splitChars(bsh2);
            if (charsBs && charsBs.length) {
              blastChars(charsBs, tl, 0.4, 0.56, 0.02);
            } else {
              /* Has nested spans/br — animate whole element with slam */
              tl.fromTo(bsh2, { opacity: 0, scale: 0.75, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.5)' }, 0.4);
            }
          }

          var bsbody = cp.querySelector('.bs-body');
          if (bsbody) tl.fromTo(bsbody, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 1.4);

          var bsstats = cp.querySelectorAll('.bs-stat');
          if (bsstats.length) {
            tl.fromTo(bsstats,
              { opacity: 0, y: 34, scale: 0.82 },
              { opacity: 1, y: 0, scale: 1, duration: 0.52, stagger: 0.1, ease: 'back.out(1.5)' },
              1.85
            );
          }

          var bscta = cp.querySelector('.k-btn-gold');
          if (bscta) tl.fromTo(bscta, { opacity: 0, scale: 0.78 }, { opacity: 1, scale: 1, duration: 0.44, ease: 'back.out(1.8)' }, 2.2);
        }
        animHUD(panel, tl, 0.95);
        break;

      /* ────────────────────────────────────────────
         DEFAULT — JOIN DROP + FOOTER
      ──────────────────────────────────────────── */
      default:
        if (cp) {
          var joinEls = cp.querySelectorAll('.jd-eyebrow, .jd-headline, .jd-sub, .jd-form, .jd-fine');
          if (joinEls.length) {
            tl.fromTo(joinEls, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out' }, 0.2);
          }
        }
        break;
    }
  }

  /* ══════════════════════════════════════════════════════════
     KILL + RESET
  ══════════════════════════════════════════════════════════ */
  function killHeroAnimation(idx) {
    if (activeAnimations[idx]) {
      activeAnimations[idx].kill();
      activeAnimations[idx] = null;
    }
    var panel = panels[idx];
    if (!panel) return;

    var bg  = panel.querySelector('.layer-bg');
    var fig = panel.querySelector('.layer-figure');
    var cp  = panel.querySelector('.layer-copy');

    if (bg)  gsap.set(bg,  { opacity: 0, scale: 1, x: 0, y: 0 });
    if (fig) gsap.set(fig, { opacity: 0, scale: 1, x: 0, y: 0, rotation: 0 });

    if (cp) {
      /* Reset char spans */
      var chars = cp.querySelectorAll('.k-char');
      if (chars.length) gsap.set(chars, { opacity: 0, y: 0, x: 0, rotation: 0, scale: 1 });

      /* Reset all other copy children — note: avoid h1 wrapper (animate inner img instead) */
      var sel = [
        '.eyebrow','h2','p','.hero-wordmark-img','.hero-brand-lockup',
        '.hero-actions a','.k-btn-gold','.k-btn-outline','.bv-eyebrow',
        '.bv-headline','.bv-body','.bv-cta','.bs-tag','.bs-headline',
        '.bs-body','.bs-stats','.bs-stat','.category-card','.product-card',
        '.collab-img','.jd-eyebrow','.jd-headline','.jd-sub','.jd-form','.jd-fine'
      ].join(',');
      var els = cp.querySelectorAll(sel);
      if (els.length) gsap.set(els, { opacity: 0, y: 20, x: 0, scale: 1, rotation: 0 });
      /* Remove idle glow CSS class */
      var wm = cp.querySelector('.hero-wordmark-img');
      if (wm) wm.classList.remove('wm-glow-active');
    }
  }

  /* ══════════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════════ */
  function initSnapScroll() {
    if (initiated) return;
    if (typeof gsap === 'undefined' || gsap.__fallback) return;
    initiated = true;

    panels = Array.from(document.querySelectorAll('.snap-panel'));
    if (!panels.length) return;

    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add('k-snap-active');

    /* HUD corners on every panel */
    panels.forEach(function (p) { addHUD(p); });

    if (!REDUCE) {
      initMouseParallax();
      /* Defer particle init by one rAF so GSAP ticker starts first */
      requestAnimationFrame(function() { initParticles(); });
    }

    /* Play panel 0 immediately */
    playHeroAnimation(0);

    /* Watch panels */
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

  /* ── Boot ── */
  document.addEventListener('kryptaa:revealed', function () { setTimeout(initSnapScroll, 350); });
  window.addEventListener('load', function () {
    if (document.body.classList.contains('is-loaded')) setTimeout(initSnapScroll, 600);
  });

})();
