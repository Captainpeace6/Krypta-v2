/* ═══════════════════════════════════════════════
   KRYPTAA fix.js — V2 Final
   9 Changes addressed
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

// ─────────────────────────────────────────────────
// § 0  GLOBAL CSS
// ─────────────────────────────────────────────────
var st = document.createElement('style');
st.textContent = [
  /* Fix 1+2: Nav logo — height-based so it fits the nav bar */
  '.nav-logo{height:auto!important;display:flex!important;align-items:center!important;overflow:visible!important;}',
  '.site-nav .nav-logo-img{width:auto!important;height:48px!important;max-width:none!important;max-height:48px!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 18px rgba(210,174,91,0.55)) brightness(1.12) contrast(1.08)!important;}',
  '@media(max-width:880px){.site-nav .nav-logo-img{height:42px!important;}}',

  /* Fix 7: Ticker — bigger font, no overlap */
  '.ticker{font-size:11px!important;letter-spacing:.2em!important;white-space:nowrap!important;overflow:hidden!important;line-height:1.4!important;}',
  '.ticker-track{display:flex!important;align-items:center!important;gap:0!important;}',

  /* Body offset — home page hero is full-screen, nav floats over it */
  'body{padding-top:100px!important;}',
  'body[data-page="home"]{padding-top:0!important;}',
  '@media(max-width:768px){body{padding-top:130px!important;}}',
  '@media(max-width:768px){body[data-page="home"]{padding-top:0!important;}}',

  /* Mobile strip — sit flush below nav using actual nav height */
  '.nav-cat-strip{position:fixed!important;top:var(--nav-h,108px);left:0;right:0;z-index:400;display:flex!important;overflow-x:auto;background:#0a0a0d;border-bottom:1px solid #1e1e26;scrollbar-width:none;}',
  'body[data-page="home"] .nav-cat-strip{display:none!important;}',
  '.nav-cat-strip::-webkit-scrollbar{display:none;}',
  '.nav-cat-strip a{flex-shrink:0;padding:9px 14px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#555560;text-decoration:none;border-right:1px solid #1e1e26;white-space:nowrap;}',
  '.nav-cat-strip a:hover{color:#FF5500;background:#111116;}',

  /* Mobile menu */
  '#mobileMenu{display:none;position:fixed!important;top:var(--nav-h,68px);left:0;right:0;background:#060608!important;z-index:500!important;padding:8px 0!important;border-bottom:2px solid #FF5500;max-height:calc(100vh - var(--nav-h,68px));overflow-y:auto;}',
  '#mobileMenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:16px 24px!important;font-family:"Bebas Neue",sans-serif!important;font-size:26px!important;letter-spacing:.1em!important;color:#f0ede8!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
  '#mobileMenu a:hover{color:#FF5500!important;background:#0a0a0d!important;}',

  /* Fix 9: How It Works redesign */
  '.how-section{background:#060608!important;border-top:1px solid #1e1e26!important;border-bottom:1px solid #1e1e26!important;}',

  /* Footer logo */
  'footer img{width:200px!important;height:auto!important;display:block!important;margin:0 auto!important;object-fit:contain!important;}',

  /* Dropdown */
  '.nav-cat.js-dd:hover .nav-dropdown{display:none;}',
  '.nav-cat.js-dd.open .nav-dropdown{display:block!important;}',
  '.nav-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#0a0a0d;border:1px solid #1e1e26;min-width:180px;z-index:700;padding:4px 0;}',
  '.nav-dropdown a{display:block!important;padding:12px 18px!important;font-family:"Space Mono",monospace!important;font-size:.58rem!important;letter-spacing:.15em!important;text-transform:uppercase!important;color:#555560!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
  '.nav-dropdown a:hover{color:#FF5500!important;background:#111116!important;}',

  /* Email signup */
  '.k-email-section{border-top:1px solid #1e1e26;padding:60px 40px;text-align:center;background:#060608;}',
  '.k-email-title{font-family:"Bebas Neue",sans-serif;font-size:clamp(32px,4vw,52px);letter-spacing:.08em;color:#f0ede8;margin-bottom:8px;}',
  '.k-email-sub{font-family:"Space Mono",monospace;font-size:.52rem;color:#555560;letter-spacing:.15em;margin-bottom:28px;text-transform:uppercase;}',
  '.k-email-row{display:flex;max-width:460px;margin:0 auto;}',
  '.k-email-inp{flex:1;font-family:"Space Mono",monospace;font-size:.58rem;padding:14px 16px;background:#0a0a0d;border:1px solid #1e1e26;border-right:none;color:#f0ede8;outline:none;}',
  '.k-email-inp::placeholder{color:#333340;}',
  '.k-email-inp:focus{border-color:#FF5500;}',
  '.k-email-btn{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:.16em;padding:14px 26px;background:#FF5500;color:#000;border:none;cursor:pointer;white-space:nowrap;transition:background .2s;}',
  '.k-email-btn:hover{background:#fff;}',
].join('\n');
document.head.appendChild(st);

// ─────────────────────────────────────────────────
// § 1  FIX 1+2: NAV LOGO — height-based, fits nav bar
// ─────────────────────────────────────────────────
(function fixLogo() {
  var apply = function() {
    var img = document.querySelector('.site-nav .nav-logo-img, .site-nav .nav-logo img');
    if (img) {
      img.style.cssText = 'width:auto!important;height:44px!important;max-height:44px!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 18px rgba(210,174,91,0.55)) brightness(1.12) contrast(1.08)!important;';
      var p = img.parentElement;
      if (p) p.style.cssText += 'height:auto!important;overflow:visible!important;';
    }
  };
  apply(); setTimeout(apply, 300); setTimeout(apply, 800);
})();

// ─────────────────────────────────────────────────
// § 2  FIX 7: TICKER — readable, no overlap
// ─────────────────────────────────────────────────
(function fixTicker() {
  var ticker = document.querySelector('.ticker');
  if (!ticker) return;
  var track = ticker.querySelector('.ticker-track, [class*="track"]');
  if (track) {
    track.style.cssText = 'display:flex;align-items:center;animation-duration:30s!important;';
    // Make each item readable
    track.querySelectorAll('span, div').forEach(function(el) {
      el.style.cssText += 'font-size:11px!important;letter-spacing:.18em!important;white-space:nowrap!important;padding:0 12px!important;';
    });
  }
})();

// ─────────────────────────────────────────────────
// § 3  DROPDOWN
// ─────────────────────────────────────────────────
var navCat = document.querySelector('.nav-cat');
var navDrop = document.querySelector('.nav-dropdown');
if (navCat && navDrop) {
  navCat.classList.add('js-dd');
  var shopLink = navCat.querySelector('a');
  if (shopLink) shopLink.addEventListener('click', function(e) { e.preventDefault(); navCat.classList.toggle('open'); });
  document.addEventListener('click', function(e) { if (!navCat.contains(e.target)) navCat.classList.remove('open'); });
}

// ─────────────────────────────────────────────────
// § 4  MOBILE NAV STRIP + MENU (Fix 6 — Tops + Anime + Women Track Pants)
// ─────────────────────────────────────────────────
if (!document.querySelector('.nav-cat-strip')) {
  var strip = document.createElement('div');
  strip.className = 'nav-cat-strip';
  strip.innerHTML = '<a href="men.html">Men Jeans</a><a href="women.html">Women Jeans</a><a href="t-shirts.html">T-Shirts</a><a href="women-tops.html">Women Tops</a><a href="women-track-pants.html">Women Track</a><a href="anime.html">Anime</a><a href="track-pants.html">Track Pants</a>';
  var nav = document.querySelector('nav');
  if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
}

var mobileMenu = document.getElementById('mobileMenu');
var ham = document.getElementById('hamburgerBtn');
if (mobileMenu && ham) {
  var existing = Array.from(mobileMenu.querySelectorAll('a')).map(function(a){ return a.getAttribute('href'); });
  var toAdd = [
    {href:'women-tops.html', label:'Women Tops'},
    {href:'women-track-pants.html', label:'Women Track Pants'},
    {href:'anime.html', label:'Anime Denim'}
  ];
  toAdd.forEach(function(item) {
    if (existing.indexOf(item.href) === -1) {
      var a = document.createElement('a'); a.href = item.href; a.textContent = item.label; mobileMenu.appendChild(a);
    }
  });
  ham.onclick = null;
  ham.addEventListener('click', function(e) {
    e.stopPropagation();
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function(e) {
    if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) mobileMenu.style.display = 'none';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', function() { mobileMenu.style.display = 'none'; }); });
}

// ─────────────────────────────────────────────────
// § 5  CART PERSISTENCE
// ─────────────────────────────────────────────────
var _sync=window.syncCart; window.syncCart=function(){if(_sync)_sync.apply(this,arguments);if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));};
var _add=window.addCart; window.addCart=function(){var r=_add?_add.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var _addById=window.addCartById; window.addCartById=function(){var r=_addById?_addById.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var saved=[];try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
if(saved.length>0){var att=0,ri=setInterval(function(){if(++att>30){clearInterval(ri);return;}if(window.cart!==undefined&&typeof window.syncCart==='function'){if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}clearInterval(ri);}},100);}
window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

// ─────────────────────────────────────────────────
// § 6  PRICES + CHECKOUT
// ─────────────────────────────────────────────────
var s=document.querySelector('#womensSlider');
if(s)Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var cbtn=document.querySelector('.cart-checkout');
if(cbtn)cbtn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});

// ─────────────────────────────────────────────────
// § 7  HOMEPAGE SECTIONS
// ─────────────────────────────────────────────────
var path = window.location.pathname;
var isHome = path.endsWith('/') || path.endsWith('/Krypta-v2/') || path.endsWith('index.html') || path === '/Krypta-v2';

if (isHome) {

  // ── FIX 6: HIDE entire original website below our sections ──
  // Kill all original sections from index.html that appear after our video
  var toHide = ['.email-bar','#emailBar','.countdown-bar','.preorder-banner','.how-section','#tees','.section-border','[id="mens"]','[id="womens"]','[id="womenstops"]','[id="tab-track"]'];
  // Wait briefly for DOM then nuke
  setTimeout(function() {
    // Hide everything after k-video-section
    var vid = document.getElementById('k-video-section');
    var email = document.querySelector('.k-email-section');
    var footer = document.querySelector('footer');
    if (vid) {
      var el = vid.nextElementSibling;
      while (el && el !== footer && !el.classList.contains('k-email-section')) {
        el.style.display = 'none';
        el = el.nextElementSibling;
      }
    }
    // Also hide by class
    document.querySelectorAll('.email-bar,.countdown-bar,.preorder-banner,.how-section,.section-border').forEach(function(el) {
      el.style.display = 'none';
    });
    document.querySelectorAll('.section').forEach(function(el) {
      if (!el.id || ['tees','mens','womens','tab-track','womenstops'].indexOf(el.id) !== -1) {
        el.style.display = 'none';
      }
    });
    document.querySelectorAll('#tees,#mens,#womens,#tab-track,#womenstops,#emailBar').forEach(function(el) {
      el.style.display = 'none';
    });
  }, 50);

  // ── Hero CSS ──
  var hCSS = document.createElement('style');
  hCSS.textContent = '@keyframes kfadeIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}@keyframes kglowPulse{0%,100%{opacity:.5;filter:blur(60px)}50%{opacity:.85;filter:blur(80px)}}@keyframes ktagIn{from{opacity:0;letter-spacing:.5em}to{opacity:1;letter-spacing:.2em}}@keyframes ksubIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes kbtnIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}#kryptaa-hero-v2{position:relative;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden}#kryptaa-hero-v2::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E");background-size:180px;opacity:.45;pointer-events:none;z-index:0}.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:560px;height:280px;background:radial-gradient(ellipse at center,rgba(255,85,0,0.55) 0%,rgba(180,40,0,0.2) 50%,transparent 76%);animation:kglowPulse 4s ease-in-out infinite;z-index:1;pointer-events:none}.hero-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 24px}.hero-logo{width:min(520px,82vw);height:auto;animation:kfadeIn 1.4s cubic-bezier(.16,1,.3,1) forwards;opacity:0;margin-bottom:28px;filter:drop-shadow(0 0 40px rgba(255,85,0,.3))}.hero-tagline{font-family:"Bebas Neue",sans-serif;font-size:clamp(18px,4vw,32px);color:#FF5500;letter-spacing:.2em;text-transform:uppercase;animation:ktagIn 1.2s cubic-bezier(.16,1,.3,1) .7s forwards;opacity:0;margin-bottom:10px}.hero-subtitle{font-family:"Space Mono",monospace;font-size:clamp(9px,1.8vw,13px);color:#555560;letter-spacing:.18em;text-transform:uppercase;animation:ksubIn 1s ease 1.1s forwards;opacity:0;margin-bottom:38px}.hero-cta{display:inline-block;font-family:"Bebas Neue",sans-serif;font-size:clamp(14px,2.5vw,18px);letter-spacing:.2em;color:#000;background:#FF5500;border:none;padding:15px 48px;cursor:pointer;text-decoration:none;text-transform:uppercase;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);animation:kbtnIn 1s ease 1.4s forwards;opacity:0;transition:background .2s,transform .15s}.hero-cta:hover{background:#fff;transform:scale(1.04)}.hero-scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:ksubIn 1s ease 2s forwards;opacity:0}.hero-scroll-lbl{font-family:"Space Mono",monospace;font-size:.42rem;letter-spacing:.28em;color:#333340;text-transform:uppercase}.hero-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,#FF5500,transparent)}';
  document.head.appendChild(hCSS);

  // ── Hero HTML (Fix 1: uses gold logo image in center) ──
  var heroHTML = '<div id="kryptaa-hero-v2"><div class="hero-glow"></div><div class="hero-inner"><img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/><div class="hero-tagline">Driven By Aura</div><div class="hero-subtitle">Drop 001 &nbsp;&mdash;&nbsp; Gothic &amp; Streetwear &nbsp;&mdash;&nbsp; SS26</div><a class="hero-cta" href="#k-categories">Enter The Drop</a></div><div class="hero-scroll"><div class="hero-scroll-lbl">Scroll</div><div class="hero-scroll-line"></div></div></div>';

  // Replace existing hero
  var heroTries = ['.hero-section','#hero','.hero','[class*="hero"]'];
  var placed = false;
  for (var h=0; h<heroTries.length; h++) {
    var hEl = document.querySelector(heroTries[h]);
    if (hEl && hEl.offsetHeight > 40 && hEl.id !== 'kryptaa-hero-v2') {
      hEl.outerHTML = heroHTML; placed = true; break;
    }
  }
  if (!placed) {
    var navRef = document.querySelector('nav') || document.querySelector('header');
    if (navRef && navRef.parentNode) {
      var tmp = document.createElement('div'); tmp.innerHTML = heroHTML;
      navRef.parentNode.insertBefore(tmp.firstElementChild, navRef.nextSibling);
    }
  }

  // ── Brand story ──
  var brandHTML = '<section id="k-brand-story" style="padding:100px 40px;text-align:center;border-top:1px solid rgba(255,85,0,0.12);border-bottom:1px solid rgba(255,85,0,0.12);background:#000;position:relative;overflow:hidden;"><div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:300px;background:radial-gradient(ellipse at center,rgba(255,85,0,0.06) 0%,transparent 70%);pointer-events:none;"></div><div style="max-width:720px;margin:0 auto;position:relative;z-index:1;"><div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.38em;color:rgba(255,85,0,0.6);text-transform:uppercase;margin-bottom:24px;border:1px solid rgba(255,85,0,0.2);display:inline-block;padding:6px 18px;">{KRYPTAA // SS26}</div><h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(44px,7vw,88px);letter-spacing:.04em;color:#f0ede8;line-height:.86;margin-bottom:32px;">Not for<br><span style="color:#FF5500;">everyone.</span><br>Built for you.</h2><p style="font-family:\'Space Mono\',monospace;font-size:.58rem;color:#555560;letter-spacing:.1em;line-height:2;max-width:500px;margin:0 auto 36px;">Gothic roots. Streetwear edge. No compromises. Drop 001 is a limited signal — designed for those who move different.</p><a href="#k-categories" style="display:inline-block;font-family:\'Space Mono\',monospace;font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:#FF5500;border:1px solid rgba(255,85,0,0.4);padding:12px 32px;text-decoration:none;transition:all .2s;">View The Drop &rsaquo;</a></div></section>';

  // ── Fix 3+4: Category rows — full editorial, all 8 categories ──
  function makeCatRow(link, imgSrc, eyebrow, title, accentColor, reverse) {
    var flexDir = reverse ? 'row-reverse' : 'row';
    var gradDir = reverse ? 'to left' : 'to right';
    var rightBg = reverse ? 'linear-gradient(to right, #060608 0%, #0d0a00 60%, #141008 100%)' : 'linear-gradient(to left, #060608 0%, #0d0a00 60%, #141008 100%)';
    return '<a href="' + link + '" style="display:flex;flex-direction:' + flexDir + ';align-items:stretch;min-height:320px;overflow:hidden;border-bottom:1px solid #1e1e26;text-decoration:none;position:relative;background:#060608;transition:background .3s;">' +
      '<div style="width:48%;position:relative;overflow:hidden;flex-shrink:0;">' +
        '<video autoplay muted loop playsinline preload="none" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45;"></video>' +
        '<div style="position:absolute;inset:0;background-image:url('' + imgSrc + '');background-size:cover;background-position:center top;transition:transform .6s ease;"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(' + gradDir + ',rgba(6,6,8,.85) 0%,transparent 55%);"></div>' +
      '</div>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:48px 52px;background:' + rightBg + ';position:relative;">' +
        '<div style="position:absolute;inset:0;background:url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E') center/180px;opacity:.4;pointer-events:none;"></div>' +
        '<div style="position:relative;z-index:1;">' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.48rem;letter-spacing:.28em;text-transform:uppercase;color:#555560;margin-bottom:14px;border-left:2px solid ' + accentColor + ';padding-left:12px;">' + eyebrow + '</div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(44px,5.5vw,80px);letter-spacing:.04em;color:#f0ede8;line-height:.88;margin-bottom:24px;text-shadow:0 2px 40px rgba(0,0,0,.8);">' + title + '</div>' +
          '<div style="display:inline-flex;align-items:center;gap:14px;font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.22em;color:' + accentColor + ';text-transform:uppercase;border-top:1px solid #1e1e26;padding-top:18px;margin-top:4px;">Shop Now <span style="width:40px;height:1px;background:' + accentColor + ';display:inline-block;"></span></div>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  var catHTML = '<section id="k-categories" style="border-top:1px solid rgba(255,85,0,0.12);">' +
    '<div style="padding:72px 40px 52px;border-bottom:1px solid rgba(255,85,0,0.12);text-align:center;background:#000;">' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.36em;color:rgba(255,85,0,0.6);text-transform:uppercase;margin-bottom:18px;">{The Collection — SS26}</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(52px,8vw,110px);letter-spacing:.04em;color:#f0ede8;line-height:.86;margin-bottom:24px;">THE DROP</div>' +
      '<div style="width:60px;height:1px;background:#FF5500;margin:0 auto;box-shadow:0 0 12px rgba(255,85,0,0.6);"></div>' +
    '</div>' +
    '<div>' +
      makeCatRow('men.html','imgs/jeans-gold-dragon.jpg','Mens Collection','MEN\'S<br>JEANS','#FF5500', false) +
      makeCatRow('women.html','imgs/w-vintage-dragon.jpg','Womens Collection','WOMEN\'S<br>JEANS','#FF5500', true) +
      makeCatRow('t-shirts.html','imgs/img-angel.png','Drop 001','T-SHIRTS','#FF5500', false) +
      makeCatRow('women-tops.html','imgs/img-glorious.png','New Arrivals','WOMEN<br>TOPS','#FF5500', true) +
      makeCatRow('anime.html','imgs/anime-gojo.jpg','Category Drop','ANIME<br>DENIM','#FF5500', false) +
      makeCatRow('track-pants.html','imgs/jeans-dual-dragon.jpg','Mens Drop 002','TRACK<br>PANTS','#FF5500', true) +
      makeCatRow('women-track-pants.html','imgs/w-grey-baggy.jpg','Womens Drop 002','WOMEN<br>TRACK PANTS','#FF5500', false) +
      makeCatRow('anime.html','imgs/anime-jjk1.jpg','Limited Series','ANIME<br>COLLECTION','#FF5500', true) +
    '</div>' +
  '</section>';

  // ── Video section ──
  var videoHTML = '<section id="k-video-section" style="position:relative;height:clamp(480px,60vw,680px);overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
    '<video autoplay muted loop playsinline preload="metadata" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45;"></video>' +
    '<div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.6) 0%,rgba(0,0,0,.82) 100%);"></div>' +
    '<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.05) 2px,rgba(0,0,0,.05) 4px);pointer-events:none;"></div>' +
    '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:300px;background:radial-gradient(ellipse at center,rgba(255,85,0,0.1) 0%,transparent 68%);pointer-events:none;"></div>' +
    '<div style="position:relative;z-index:2;text-align:center;padding:0 20px;">' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.36em;color:rgba(255,85,0,0.55);text-transform:uppercase;margin-bottom:24px;border:1px solid rgba(255,85,0,0.18);display:inline-block;padding:5px 16px;">Drop 001 — Limited</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(72px,12vw,150px);line-height:.8;letter-spacing:.03em;color:#f0ede8;text-shadow:0 0 80px rgba(255,85,0,0.15);">NO<br>APOLOGIES</div>' +
      '<div style="width:1px;height:48px;background:linear-gradient(to bottom,#FF5500,transparent);margin:28px auto 0;"></div>' +
    '</div>' +
  '</section>';

  // ── Fix 9: HOW IT WORKS — completely redesigned, dark gothic editorial ──
  var howHTML = '<section id="k-how-it-works" style="padding:80px 40px;background:#060608;border-top:1px solid #1e1e26;border-bottom:1px solid #1e1e26;">' +
    '<div style="max-width:900px;margin:0 auto;">' +
      '<div style="text-align:center;margin-bottom:60px;">' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.36em;color:rgba(255,85,0,0.55);text-transform:uppercase;margin-bottom:14px;border:1px solid rgba(255,85,0,0.18);display:inline-block;padding:5px 16px;">{The Process}</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(40px,6vw,76px);letter-spacing:.05em;color:#f0ede8;line-height:.9;margin-top:18px;">HOW IT WORKS</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1e1e26;">' +
        '<div style="background:#060608;padding:40px 32px;position:relative;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">01</div>' +
          '<div style="width:32px;height:1px;background:#FF5500;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">PICK YOUR DROP</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Browse the collection. Select your size. Every piece is limited — once it\'s gone, it\'s gone.</div>' +
        '</div>' +
        '<div style="background:#060608;padding:40px 32px;border-left:1px solid #1e1e26;border-right:1px solid #1e1e26;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">02</div>' +
          '<div style="width:32px;height:1px;background:#FF5500;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">SECURE YOUR ORDER</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Checkout via Stripe. Fully encrypted. Straightforward — no accounts needed, just your piece.</div>' +
        '</div>' +
        '<div style="background:#060608;padding:40px 32px;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">03</div>' +
          '<div style="width:32px;height:1px;background:#FF5500;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">SHIPS TO YOU</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Pre-orders ship in 2–3 weeks. You get a tracking number. Free shipping over $75.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';

  // ── Fix 8: Origin section — remove logo, keep only KRYPTAA symbol ──
  // Fix 2: Footer logo — same gold image, 200px wide
  var emailHTML = '<div class="k-email-section">' +
    '<div class="k-email-title">STAY IN THE SIGNAL</div>' +
    '<div class="k-email-sub">Early drops &nbsp;·&nbsp; Exclusive access &nbsp;·&nbsp; No noise</div>' +
    '<div class="k-email-row"><input class="k-email-inp" type="email" placeholder="YOUR@EMAIL.COM"/>' +
    '<button class="k-email-btn" onclick="(function(b){var i=b.previousElementSibling;if(i.value&&i.value.includes(\'@\')){b.textContent=\'JOINED ✓\';b.style.background=\'#FF5500\';i.disabled=true;b.disabled=true;}else{i.style.borderColor=\'#ff4444\';setTimeout(function(){i.style.borderColor=\'\';},1200);}})(this);">JOIN</button>' +
    '</div></div>';

  // ── Inject all in order ──
  setTimeout(function() {
    // Hero should already be placed above
    var hero = document.getElementById('kryptaa-hero-v2');
    if (hero && !document.getElementById('k-brand-story')) hero.insertAdjacentHTML('afterend', brandHTML);
    var brand = document.getElementById('k-brand-story');
    if (brand && !document.getElementById('k-categories')) brand.insertAdjacentHTML('afterend', catHTML);
    var cat = document.getElementById('k-categories');
    if (cat && !document.getElementById('k-video-section')) cat.insertAdjacentHTML('afterend', videoHTML);
    var vid = document.getElementById('k-video-section');
    if (vid && !document.getElementById('k-how-it-works')) vid.insertAdjacentHTML('afterend', howHTML);

    // Email before footer
    var footer = document.querySelector('footer');
    if (footer && !document.querySelector('.k-email-section')) footer.insertAdjacentHTML('beforebegin', emailHTML);

    // Fix 2: Footer logo size
    var fLogo = document.querySelector('footer img');
    if (fLogo) fLogo.style.cssText = 'width:200px!important;height:auto!important;display:block!important;margin:0 auto 24px!important;object-fit:contain!important;';

    // Fix 8: Origin section — hide any non-kryptaa logo inside it
    var originEl = Array.from(document.querySelectorAll('section,div')).find(function(el) {
      return el.innerText && el.innerText.includes('BORN FROM THE UNDERGROUND');
    });
    if (originEl) {
      // Hide any img that isn't the main logo
      originEl.querySelectorAll('img').forEach(function(img) {
        img.style.display = 'none';
      });
      // If there's a KRYPTAA text element, make sure it stays
      originEl.querySelectorAll('[class*="logo-text"],[class*="brand"]').forEach(function(el) {
        el.style.display = 'block';
      });
    }

    // Hide original sections again after inject (belt + suspenders)
    document.querySelectorAll('.email-bar,.countdown-bar,.preorder-banner,.how-section,.section-border').forEach(function(el) {
      el.style.display = 'none';
    });
    ['tees','mens','womens','tab-track','womenstops','emailBar'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
      // Also hide the parent section wrapper
      if (el && el.parentElement && el.parentElement.classList.contains('section')) el.parentElement.style.display = 'none';
    });
    document.querySelectorAll('.section').forEach(function(el) {
      if (!el.id.startsWith('k-')) el.style.display = 'none';
    });

  }, 80);
}

// ─────────────────────────────────────────────────
// § 8  FOOTER LOGO — all pages
// ─────────────────────────────────────────────────
setTimeout(function() {
  var fLogo = document.querySelector('footer img');
  if (fLogo) fLogo.style.cssText = 'width:200px!important;height:auto!important;display:block!important;margin:0 auto 24px!important;object-fit:contain!important;';
}, 500);





}); // end DOMContentLoaded

// ═══════════════════════════════════════════════════
// KRYPTAA — CLEAN TARGETED FIXES v4
// ═══════════════════════════════════════════════════
(function kryptaaFixes() {

  // ── CSS ──
  var css = document.createElement('style');
  css.textContent = `
    /* Announcement bar .ticker */
    .ticker { font-size: 14px !important; padding: 10px 0 !important; height: auto !important; min-height: 36px !important; }
    .ticker * { font-size: 14px !important; }
    .proof-bar { font-size: 14px !important; padding: 10px 0 !important; }

    /* Nav — taller to fit logo */
    nav { min-height: 120px !important; }
    nav > div, nav > .nav-inner, nav > .container { min-height: 120px !important; align-items: center !important; }

    /* Nav logo — wide so portrait image is visible */
    .nav-logo, .nav-logo a { height: auto !important; overflow: visible !important; display: flex !important; align-items: center !important; }
    .nav-logo img, .nav-logo-img {
      width: 120px !important;
      height: auto !important;
      max-height: none !important;
      display: block !important;
      object-fit: contain !important;
      filter: drop-shadow(0 0 14px rgba(255,85,0,.45)) !important;
    }

    /* Hide desktop cat strip */
    @media(min-width:769px) { .nav-cat-strip { display: none !important; } }

    /* Footer brand logo — single, centered, big */
    .k-footer-brand { text-align: center; padding: 40px 20px 24px; }
    .k-footer-brand img { width: 260px; height: auto; display: block; margin: 0 auto 24px; object-fit: contain; filter: drop-shadow(0 0 24px rgba(255,85,0,.3)); }
  `;
  document.head.appendChild(css);

  function run() {

    // ── 1. Announcement bar — .ticker ──
    document.querySelectorAll('.ticker, .proof-bar').forEach(function(el) {
      el.style.cssText += 'font-size:14px!important;padding:10px 0!important;min-height:36px!important;height:auto!important;';
    });

    // ── 2. Nav logo — swap src + make wide ──
    var navImg = document.querySelector('.nav-logo-img, .nav-logo img');
    if (navImg) {
      navImg.src = 'imgs/kryptaa-logo-gold.png';
      navImg.style.cssText = 'width:120px!important;height:auto!important;max-height:none!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 14px rgba(255,85,0,.45))!important;';
      var wrap = navImg.parentElement;
      if (wrap) wrap.style.cssText += 'height:auto!important;overflow:visible!important;';
    }

    // ── 3. Footer — remove ALL existing footer logos + inject ONE centered logo ──
    var footer = document.querySelector('footer');
    if (footer) {

      // Remove any previously injected brand logo divs
      footer.querySelectorAll('.footer-brand-logo, .footer-logo-wrap, .k-footer-brand').forEach(function(el) {
        el.parentNode.removeChild(el);
      });

      // Find the "Streetwear from the underground" text node
      var streetwearEl = null;
      Array.from(footer.querySelectorAll('*')).forEach(function(el) {
        if (el.children.length === 0 && el.textContent.indexOf('Streetwear from') !== -1) {
          streetwearEl = el;
        }
      });

      if (streetwearEl) {
        // Find the section container holding this text
        var container = streetwearEl.closest('div') || streetwearEl.parentElement;
        // Walk up to get a proper column/section container
        while (container && container !== footer && container.offsetWidth < 200) {
          container = container.parentElement;
        }

        if (container && container !== footer) {
          // Build the centered logo block
          var logoBlock = document.createElement('div');
          logoBlock.className = 'k-footer-brand';
          logoBlock.innerHTML = '<img src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/>';
          // Insert at the very start of this container
          container.insertBefore(logoBlock, container.firstChild);
        }
      }

      // Hide the ORIGINAL footer logo image (it was the old base64 one we don't want)
      var origFooterImg = footer.querySelector(':not(.k-footer-brand) > img, :not(.k-footer-brand) img:not(.k-footer-brand img)');
      if (origFooterImg && !origFooterImg.closest('.k-footer-brand')) {
        origFooterImg.style.display = 'none';
      }
    }

    // ── 4. Kill desktop duplicate strip ──
    if (window.innerWidth >= 769) {
      var strip = document.querySelector('.nav-cat-strip');
      if (strip) strip.style.display = 'none';
    }
  }

  run();
  setTimeout(run, 500);
  setTimeout(run, 1200);

})();

}); // end DOMContentLoaded


// ─────────────────────────────────────────────────
// NAV LINK FIX — point to correct separate pages
// ─────────────────────────────────────────────────
(function fixNavLinks() {

  // Map anchor hrefs → correct page files
  var linkMap = {
    '#tees':       't-shirts.html',
    '#mens':       'men.html',
    '#womens':     'women.html',
    '#womenstops': 'women-tops.html',
    '#anime':      'anime.html',
    '#track':      'track-pants.html',
    '#trackpants': 'track-pants.html',
    '#jeans':      'jeans.html',
    '#sizeguide':  'men.html',
    '#size-guide': 'men.html',
  };

  function fix() {
    // Fix all anchor links in nav
    document.querySelectorAll('a[href]').forEach(function(a) {
      var href = a.getAttribute('href');
      if (!href) return;
      // Skip if already pointing to a .html file
      if (href.indexOf('.html') !== -1) return;
      // Check if it matches our map
      var key = href.toLowerCase().replace(/s/g,'');
      if (linkMap[key]) {
        a.href = linkMap[key];
      }
    });

    // Also add full nav with correct links if missing
    var nav = document.querySelector('nav');
    if (nav && !nav.querySelector('a[href="men.html"]')) {
      // Inject proper nav links
      var existingLinks = nav.querySelector('.nav-links, ul');
      if (existingLinks) {
        existingLinks.innerHTML = [
          '<li><a href="men.html">Men's Jeans</a></li>',
          '<li><a href="women.html">Women's Jeans</a></li>',
          '<li><a href="t-shirts.html">T-Shirts</a></li>',
          '<li><a href="women-tops.html">Women Tops</a></li>',
          '<li><a href="anime.html">Anime</a></li>',
          '<li><a href="track-pants.html">Track Pants</a></li>',
        ].join('');
        // Style the links
        existingLinks.querySelectorAll('a').forEach(function(a) {
          a.style.cssText = 'font-family:"Space Mono",monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:#888;text-decoration:none;transition:color .2s;';
          a.addEventListener('mouseenter', function(){this.style.color='#FF5500';});
          a.addEventListener('mouseleave', function(){this.style.color='#888';});
        });
      }
    }

    // Fix mobile menu too
    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a[href]').forEach(function(a) {
        var href = a.getAttribute('href');
        if (!href || href.indexOf('.html') !== -1) return;
        var key = href.toLowerCase().replace(/s/g,'');
        if (linkMap[key]) a.href = linkMap[key];
      });
    }
  }

  fix();
  setTimeout(fix, 500);
  setTimeout(fix, 1500);
})();
