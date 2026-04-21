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
  /* Fix 1+2: Nav logo — width-based */
  '.nav-logo{height:auto!important;display:flex!important;align-items:center!important;overflow:visible!important;}',
  '.nav-logo img,.nav-logo-img{width:180px!important;height:auto!important;max-height:none!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 14px rgba(200,168,75,.35))!important;}',

  /* Fix 7: Ticker — bigger font, no overlap */
  '.ticker{font-size:11px!important;letter-spacing:.2em!important;white-space:nowrap!important;overflow:hidden!important;line-height:1.4!important;}',
  '.ticker-track{display:flex!important;align-items:center!important;gap:0!important;}',

  /* Body offset */
  'body{padding-top:100px!important;}',
  '@media(max-width:768px){body{padding-top:130px!important;}}',

  /* Mobile strip */
  '.nav-cat-strip{position:fixed!important;top:66px;left:0;right:0;z-index:400;display:flex!important;overflow-x:auto;background:#0a0a0d;border-bottom:1px solid #1e1e26;scrollbar-width:none;}',
  '.nav-cat-strip::-webkit-scrollbar{display:none;}',
  '.nav-cat-strip a{flex-shrink:0;padding:9px 14px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#555560;text-decoration:none;border-right:1px solid #1e1e26;white-space:nowrap;}',
  '.nav-cat-strip a:hover{color:#c8ff00;background:#111116;}',

  /* Mobile menu */
  '#mobileMenu{display:none;position:fixed!important;top:66px;left:0;right:0;background:#060608!important;z-index:500!important;padding:8px 0!important;border-bottom:2px solid #c8ff00;max-height:calc(100vh - 66px);overflow-y:auto;}',
  '#mobileMenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:16px 24px!important;font-family:"Bebas Neue",sans-serif!important;font-size:26px!important;letter-spacing:.1em!important;color:#f0ede8!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
  '#mobileMenu a:hover{color:#c8ff00!important;background:#0a0a0d!important;}',

  /* Fix 9: How It Works redesign */
  '.how-section{background:#060608!important;border-top:1px solid #1e1e26!important;border-bottom:1px solid #1e1e26!important;}',

  /* Footer logo */
  'footer img{width:200px!important;height:auto!important;display:block!important;margin:0 auto!important;object-fit:contain!important;}',

  /* Dropdown */
  '.nav-cat.js-dd:hover .nav-dropdown{display:none;}',
  '.nav-cat.js-dd.open .nav-dropdown{display:block!important;}',
  '.nav-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#0a0a0d;border:1px solid #1e1e26;min-width:180px;z-index:700;padding:4px 0;}',
  '.nav-dropdown a{display:block!important;padding:12px 18px!important;font-family:"Space Mono",monospace!important;font-size:.58rem!important;letter-spacing:.15em!important;text-transform:uppercase!important;color:#555560!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
  '.nav-dropdown a:hover{color:#c8ff00!important;background:#111116!important;}',

  /* Email signup */
  '.k-email-section{border-top:1px solid #1e1e26;padding:60px 40px;text-align:center;background:#060608;}',
  '.k-email-title{font-family:"Bebas Neue",sans-serif;font-size:clamp(32px,4vw,52px);letter-spacing:.08em;color:#f0ede8;margin-bottom:8px;}',
  '.k-email-sub{font-family:"Space Mono",monospace;font-size:.52rem;color:#555560;letter-spacing:.15em;margin-bottom:28px;text-transform:uppercase;}',
  '.k-email-row{display:flex;max-width:460px;margin:0 auto;}',
  '.k-email-inp{flex:1;font-family:"Space Mono",monospace;font-size:.58rem;padding:14px 16px;background:#0a0a0d;border:1px solid #1e1e26;border-right:none;color:#f0ede8;outline:none;}',
  '.k-email-inp::placeholder{color:#333340;}',
  '.k-email-inp:focus{border-color:#c8ff00;}',
  '.k-email-btn{font-family:"Bebas Neue",sans-serif;font-size:14px;letter-spacing:.16em;padding:14px 26px;background:#c8ff00;color:#000;border:none;cursor:pointer;white-space:nowrap;transition:background .2s;}',
  '.k-email-btn:hover{background:#fff;}',
].join('\n');
document.head.appendChild(st);

// ─────────────────────────────────────────────────
// § 1  FIX 1+2: NAV LOGO — width-based
// ─────────────────────────────────────────────────
(function fixLogo() {
  var apply = function() {
    var img = document.querySelector('.nav-logo-img, .nav-logo img');
    if (img) {
      img.style.cssText = 'width:180px!important;height:auto!important;max-height:none!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 14px rgba(200,168,75,.35))!important;';
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
  hCSS.textContent = '@keyframes kfadeIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}@keyframes kglowPulse{0%,100%{opacity:.5;filter:blur(60px)}50%{opacity:.85;filter:blur(80px)}}@keyframes ktagIn{from{opacity:0;letter-spacing:.5em}to{opacity:1;letter-spacing:.2em}}@keyframes ksubIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}@keyframes kbtnIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}#kryptaa-hero-v2{position:relative;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden}#kryptaa-hero-v2::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E");background-size:180px;opacity:.45;pointer-events:none;z-index:0}.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:560px;height:280px;background:radial-gradient(ellipse at center,#c8a000 0%,#7a5800 40%,transparent 75%);animation:kglowPulse 4s ease-in-out infinite;z-index:1;pointer-events:none}.hero-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 24px}.hero-logo{width:min(520px,82vw);height:auto;animation:kfadeIn 1.4s cubic-bezier(.16,1,.3,1) forwards;opacity:0;margin-bottom:28px;filter:drop-shadow(0 0 40px rgba(200,160,0,.3))}.hero-tagline{font-family:"Bebas Neue",sans-serif;font-size:clamp(18px,4vw,32px);color:#e8d080;letter-spacing:.2em;text-transform:uppercase;animation:ktagIn 1.2s cubic-bezier(.16,1,.3,1) .7s forwards;opacity:0;margin-bottom:10px}.hero-subtitle{font-family:"Space Mono",monospace;font-size:clamp(9px,1.8vw,13px);color:#555560;letter-spacing:.18em;text-transform:uppercase;animation:ksubIn 1s ease 1.1s forwards;opacity:0;margin-bottom:38px}.hero-cta{display:inline-block;font-family:"Bebas Neue",sans-serif;font-size:clamp(14px,2.5vw,18px);letter-spacing:.2em;color:#000;background:#c8ff00;border:none;padding:15px 48px;cursor:pointer;text-decoration:none;text-transform:uppercase;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);animation:kbtnIn 1s ease 1.4s forwards;opacity:0;transition:background .2s,transform .15s}.hero-cta:hover{background:#fff;transform:scale(1.04)}.hero-scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:ksubIn 1s ease 2s forwards;opacity:0}.hero-scroll-lbl{font-family:"Space Mono",monospace;font-size:.42rem;letter-spacing:.28em;color:#333340;text-transform:uppercase}.hero-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,#c8a000,transparent)}';
  document.head.appendChild(hCSS);

  // ── Hero HTML (Fix 1: uses gold logo image in center) ──
  var heroHTML = '<div id="kryptaa-hero-v2"><div class="hero-glow"></div><div class="hero-inner"><img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/><div class="hero-tagline">Defined By Power</div><div class="hero-subtitle">Gothic &amp; Streetwear Collection &mdash; Since \'26</div><a class="hero-cta" href="#k-categories">Shop The Drop</a></div><div class="hero-scroll"><div class="hero-scroll-lbl">Scroll</div><div class="hero-scroll-line"></div></div></div>';

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
  var brandHTML = '<section id="k-brand-story" style="padding:80px 40px;text-align:center;border-top:1px solid #1e1e26;border-bottom:1px solid #1e1e26;background:#060608;"><div style="max-width:700px;margin:0 auto;"><div style="font-family:\'Space Mono\',monospace;font-size:.52rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:20px;">The World of KRYPTAA</div><h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(38px,6vw,76px);letter-spacing:.06em;color:#f0ede8;line-height:.88;margin-bottom:28px;">Built for those<br><span style="color:#c8a000;">who refuse</span><br>to disappear</h2><p style="font-family:\'Space Mono\',monospace;font-size:.58rem;color:#555560;letter-spacing:.08em;line-height:2;max-width:540px;margin:0 auto;">Gothic roots. Streetwear edge. Every piece is made for the ones who move in silence but hit different when they walk in. SS26 Drop 001 — limited, intentional, unapologetic.</p></div></section>';

  // ── Fix 3+4: Category rows — full editorial, all 8 categories ──
  function makeCatRow(link, imgSrc, eyebrow, title, accentColor, flip) {
    var fdir = flip ? 'row-reverse' : 'row';
    var gdir = flip ? 'to left' : 'to right';
    return '<a href="' + link + '" style="display:flex;flex-direction:' + fdir + ';align-items:stretch;min-height:260px;overflow:hidden;border-bottom:1px solid #1e1e26;text-decoration:none;background:#060608;transition:background .3s;">' +
      '<div style="width:42%;position:relative;overflow:hidden;flex-shrink:0;">' +
        '<video autoplay muted loop playsinline preload="none" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45;"></video>' +
        '<div style="position:absolute;inset:0;background-image:url(\'' + imgSrc + '\');background-size:cover;background-position:center;transition:transform .6s ease;"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(' + gdir + ',rgba(6,6,8,.92) 0%,transparent 65%);"></div>' +
      '</div>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 52px;">' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:.46rem;letter-spacing:.28em;text-transform:uppercase;color:#555560;margin-bottom:14px;">' + eyebrow + '</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(38px,5vw,68px);letter-spacing:.05em;color:#f0ede8;line-height:.88;margin-bottom:22px;">' + title + '</div>' +
        '<div style="display:inline-flex;align-items:center;gap:14px;font-family:\'Space Mono\',monospace;font-size:.48rem;letter-spacing:.22em;color:' + accentColor + ';text-transform:uppercase;">Shop Now <span style="width:32px;height:1px;background:' + accentColor + ';display:inline-block;"></span></div>' +
      '</div>' +
    '</a>';
  }

  var catHTML = '<section id="k-categories" style="border-top:1px solid #1e1e26;">' +
    '<div style="padding:40px;border-bottom:1px solid #1e1e26;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px;">' +
      '<div><div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:10px;">The Collection</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(36px,6vw,76px);letter-spacing:.05em;color:#f0ede8;line-height:.88;">SHOP THE DROP</div></div>' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.46rem;letter-spacing:.15em;color:#555560;">SS26 — 8 Categories</div>' +
    '</div>' +
    '<div>' +
      makeCatRow('men.html','imgs/jeans-gold-dragon.jpg','Mens Collection','MEN\'S<br>JEANS','#c8ff00', false) +
      makeCatRow('women.html','imgs/w-vintage-dragon.jpg','Womens Collection','WOMEN\'S<br>JEANS','#c8a000', true) +
      makeCatRow('t-shirts.html','imgs/img-angel.png','Drop 001','T-SHIRTS','#c8ff00', false) +
      makeCatRow('women-tops.html','imgs/img-glorious.png','New Arrivals','WOMEN<br>TOPS','#c8a000', true) +
      makeCatRow('anime.html','imgs/anime-gojo.jpg','Category Drop','ANIME<br>DENIM','#c8ff00', false) +
      makeCatRow('track-pants.html','imgs/jeans-dual-dragon.jpg','Mens Drop 002','TRACK<br>PANTS','#c8a000', true) +
      makeCatRow('women-track-pants.html','imgs/w-grey-baggy.jpg','Womens Drop 002','WOMEN<br>TRACK PANTS','#c8ff00', false) +
      makeCatRow('anime.html','imgs/anime-jjk1.jpg','Limited Series','ANIME<br>COLLECTION','#c8a000', true) +
    '</div>' +
  '</section>';

  // ── Video section ──
  var videoHTML = '<section id="k-video-section" style="position:relative;height:560px;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
    '<video autoplay muted loop playsinline preload="metadata" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;"></video>' +
    '<div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.78) 0%,rgba(10,5,20,.55) 100%);"></div>' +
    '<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);pointer-events:none;"></div>' +
    '<div style="position:relative;z-index:2;text-align:center;">' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:22px;">— Drop 001 —</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(68px,11vw,140px);line-height:.82;letter-spacing:.04em;color:#f0ede8;">ENTER<br>THE SYSTEM</div>' +
      '<div style="width:60px;height:1px;background:#c8a000;margin:26px auto;"></div>' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.58rem;letter-spacing:.22em;color:#555560;">Kryptaa — SS26</div>' +
    '</div>' +
  '</section>';

  // ── Fix 9: HOW IT WORKS — completely redesigned, dark gothic editorial ──
  var howHTML = '<section id="k-how-it-works" style="padding:80px 40px;background:#060608;border-top:1px solid #1e1e26;border-bottom:1px solid #1e1e26;">' +
    '<div style="max-width:900px;margin:0 auto;">' +
      '<div style="text-align:center;margin-bottom:60px;">' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:14px;">The Process</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(40px,6vw,76px);letter-spacing:.05em;color:#f0ede8;line-height:.9;">HOW IT WORKS</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#1e1e26;">' +
        '<div style="background:#060608;padding:40px 32px;position:relative;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">01</div>' +
          '<div style="width:32px;height:1px;background:#c8a000;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">PICK YOUR DROP</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Browse the collection. Select your size. Every piece is limited — once it\'s gone, it\'s gone.</div>' +
        '</div>' +
        '<div style="background:#060608;padding:40px 32px;border-left:1px solid #1e1e26;border-right:1px solid #1e1e26;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">02</div>' +
          '<div style="width:32px;height:1px;background:#c8ff00;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">SECURE YOUR ORDER</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Checkout via Stripe. Fully encrypted. Straightforward — no accounts needed, just your piece.</div>' +
        '</div>' +
        '<div style="background:#060608;padding:40px 32px;">' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:72px;color:#1e1e26;line-height:1;margin-bottom:16px;">03</div>' +
          '<div style="width:32px;height:1px;background:#c8a000;margin-bottom:20px;"></div>' +
          '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:22px;letter-spacing:.1em;color:#f0ede8;margin-bottom:12px;">SHIPS TO YOU</div>' +
          '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;color:#555560;line-height:1.8;letter-spacing:.05em;">Pre-orders ship in 2–3 weeks. You get a tracking number. Free shipping over $75.</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>';

  // ── Fix 8: Origin section — remove logo, keep only KRYPTAA symbol ──
  // Fix 2: Footer logo — same gold image, 200px wide
  var emailHTML = '<div class="k-email-section">' +
    '<div class="k-email-title">JOIN THE UNDERGROUND</div>' +
    '<div class="k-email-sub">Early access &nbsp;·&nbsp; Drop alerts &nbsp;·&nbsp; Members only</div>' +
    '<div class="k-email-row"><input class="k-email-inp" type="email" placeholder="YOUR@EMAIL.COM"/>' +
    '<button class="k-email-btn" onclick="(function(b){var i=b.previousElementSibling;if(i.value&&i.value.includes(\'@\')){b.textContent=\'JOINED ✓\';b.style.background=\'#c8a000\';i.disabled=true;b.disabled=true;}else{i.style.borderColor=\'#ff4444\';setTimeout(function(){i.style.borderColor=\'\';},1200);}})(this);">JOIN</button>' +
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
      filter: drop-shadow(0 0 14px rgba(200,168,75,.45)) !important;
    }

    /* Hide desktop cat strip */
    @media(min-width:769px) { .nav-cat-strip { display: none !important; } }

    /* Footer brand logo — single, centered, big */
    .k-footer-brand { text-align: center; padding: 40px 20px 24px; }
    .k-footer-brand img { width: 260px; height: auto; display: block; margin: 0 auto 24px; object-fit: contain; filter: drop-shadow(0 0 24px rgba(200,168,75,.3)); }
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
      navImg.style.cssText = 'width:120px!important;height:auto!important;max-height:none!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 14px rgba(200,168,75,.45))!important;';
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
