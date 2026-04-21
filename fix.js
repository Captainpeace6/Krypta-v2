/* ═══════════════════════════════════════════════
   KRYPTAA fix.js — V2 Complete
   All 7 improvements — Apr 2026
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

// ─────────────────────────────────────────────────
// § 0  INJECT ALL CSS OVERRIDES
// ─────────────────────────────────────────────────
var st = document.createElement('style');
st.textContent = [

  /* ── FIX 1: Nav logo — width-based so portrait image spreads wide ── */
  '.nav-logo { height: auto !important; display: flex !important; align-items: center !important; overflow: visible !important; }',
  '.nav-logo img, .nav-logo-img { width: 180px !important; height: auto !important; max-height: none !important; display: block !important; object-fit: contain !important; filter: drop-shadow(0 0 14px rgba(200,168,75,.35)) !important; }',

  /* ── FIX 3: Announcement bar stays sticky ── */
  '.announcement-bar, [class*="announce"], [class*="ticker"], [class*="promo-bar"] { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; z-index: 600 !important; }',
  'nav { top: 36px !important; }',

  /* ── FIX 4: Quick-add on hover ── */
  '.p-card .quick-add { display: none; position: absolute; bottom: 0; left: 0; right: 0; background: rgba(6,6,8,.95); padding: 14px 16px; border-top: 1px solid #1e1e26; z-index: 10; }',
  '.p-card:hover .quick-add { display: block; }',
  '.p-card { position: relative; }',
  '.p-card-img { overflow: hidden !important; }',
  '.quick-add-sizes { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }',
  '.quick-add-sz { font-family: "Space Mono",monospace; font-size: .48rem; padding: 5px 9px; border: 1px solid #1e1e26; background: none; color: #555560; cursor: pointer; transition: all .15s; }',
  '.quick-add-sz:hover, .quick-add-sz.sel { border-color: #c8ff00 !important; color: #c8ff00 !important; }',
  '.quick-add-btn { width: 100%; font-family: "Bebas Neue",sans-serif; font-size: 13px; letter-spacing: .14em; padding: 10px; background: #c8ff00; color: #000; border: none; cursor: pointer; clip-path: polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%); transition: background .2s; }',
  '.quick-add-btn:hover { background: #fff; }',

  /* ── Mobile nav strip ── */
  '@media(max-width:768px){',
  '.nav-cat-strip { position: fixed !important; top: 136px !important; left: 0; right: 0; z-index: 400; display: flex !important; overflow-x: auto; background: #0a0a0d; border-bottom: 1px solid #1e1e26; scrollbar-width: none; }',
  '.nav-cat-strip::-webkit-scrollbar { display: none; }',
  '.nav-cat-strip a { flex-shrink: 0; padding: 9px 14px; font-family: "Space Mono",monospace; font-size: 8px; letter-spacing: .15em; text-transform: uppercase; color: #555560; text-decoration: none; border-right: 1px solid #1e1e26; white-space: nowrap; }',
  '.nav-cat-strip a:hover { color: #c8ff00; background: #111116; }',
  'body { padding-top: 160px !important; }',
  '}',

  /* ── Desktop body offset for sticky announce bar + nav ── */
  '@media(min-width:769px){',
  'body { padding-top: 136px !important; }',
  '}',

  /* ── FIX 7: Footer email signup ── */
  '.footer-email-section { border-top: 1px solid #1e1e26; padding: 60px 40px; text-align: center; background: #060608; }',
  '.footer-email-title { font-family: "Bebas Neue",sans-serif; font-size: clamp(32px,4vw,52px); letter-spacing: .08em; color: #f0ede8; margin-bottom: 8px; }',
  '.footer-email-sub { font-family: "Space Mono",monospace; font-size: .55rem; color: #555560; letter-spacing: .15em; margin-bottom: 28px; text-transform: uppercase; }',
  '.footer-email-row { display: flex; gap: 0; max-width: 480px; margin: 0 auto; }',
  '.footer-email-input { flex: 1; font-family: "Space Mono",monospace; font-size: .6rem; padding: 15px 18px; background: #0a0a0d; border: 1px solid #1e1e26; border-right: none; color: #f0ede8; outline: none; letter-spacing: .08em; }',
  '.footer-email-input::placeholder { color: #333340; }',
  '.footer-email-input:focus { border-color: #c8ff00; }',
  '.footer-email-btn { font-family: "Bebas Neue",sans-serif; font-size: 14px; letter-spacing: .16em; padding: 15px 28px; background: #c8ff00; color: #000; border: none; cursor: pointer; white-space: nowrap; transition: background .2s; }',
  '.footer-email-btn:hover { background: #fff; }',

  /* ── Mobile menu ── */
  '#mobileMenu { display: none; position: fixed !important; top: 100px; left: 0; right: 0; background: #060608 !important; z-index: 500 !important; padding: 8px 0 !important; border-bottom: 2px solid #c8ff00; max-height: calc(100vh - 100px); overflow-y: auto; }',
  '#mobileMenu a { display: flex !important; align-items: center !important; gap: 12px !important; padding: 18px 24px !important; font-family: "Bebas Neue",sans-serif !important; font-size: 28px !important; letter-spacing: .1em !important; color: #f0ede8 !important; text-decoration: none !important; border-bottom: 1px solid #1e1e26 !important; }',
  '#mobileMenu a:hover { color: #c8ff00 !important; background: #0a0a0d !important; }',

  /* ── Category editorial rows ── */
  '#k-categories .k-cat-grid { display: flex; flex-direction: column; gap: 0; }',
  '#k-categories .k-cat-grid a { transition: background .3s; }',
  '#k-categories .k-cat-grid a:hover { background: #080808 !important; }',
  '#k-categories .k-cat-grid a:hover div { transform: scale(1.04); }',

  /* ── Dropdown ── */
  '.nav-cat.js-dd:hover .nav-dropdown { display: none; }',
  '.nav-cat.js-dd.open .nav-dropdown { display: block !important; }',
  '.nav-dropdown { position: absolute; top: calc(100% + 4px); left: 0; background: #0a0a0d; border: 1px solid #1e1e26; min-width: 180px; z-index: 700; padding: 4px 0; }',
  '.nav-dropdown a { display: block !important; padding: 12px 18px !important; font-family: "Space Mono",monospace !important; font-size: .6rem !important; letter-spacing: .15em !important; text-transform: uppercase !important; color: #555560 !important; text-decoration: none !important; border-bottom: 1px solid #1e1e26 !important; }',
  '.nav-dropdown a:hover { color: #c8ff00 !important; background: #111116 !important; }',

].join('\n');
document.head.appendChild(st);

// ─────────────────────────────────────────────────
// § 1  STICKY ANNOUNCEMENT BAR
// ─────────────────────────────────────────────────
var annBar = document.querySelector('.announcement-bar, [class*="announce"], [class*="ticker"]');
if (annBar) {
  annBar.style.cssText += 'position:fixed!important;top:0!important;left:0!important;right:0!important;z-index:600!important;';
}

// ─────────────────────────────────────────────────
// § 2  NAV LOGO — width-based fix
// ─────────────────────────────────────────────────
(function() {
  var tryFix = function() {
    var img = document.querySelector('.nav-logo-img, .nav-logo img');
    if (img) {
      img.style.cssText = 'width:180px!important;height:auto!important;max-height:none!important;display:block!important;object-fit:contain!important;filter:drop-shadow(0 0 14px rgba(200,168,75,.35))!important;';
      var parent = img.parentElement;
      if (parent) parent.style.cssText += 'height:auto!important;overflow:visible!important;display:flex!important;align-items:center!important;';
    }
  };
  tryFix();
  setTimeout(tryFix, 200);
  setTimeout(tryFix, 800);
})();

// ─────────────────────────────────────────────────
// § 3  DESKTOP SHOP DROPDOWN
// ─────────────────────────────────────────────────
var navCat = document.querySelector('.nav-cat');
var navDrop = document.querySelector('.nav-dropdown');
if (navCat && navDrop) {
  navCat.classList.add('js-dd');
  var shopLink = navCat.querySelector('a');
  if (shopLink) {
    shopLink.addEventListener('click', function(e) { e.preventDefault(); navCat.classList.toggle('open'); });
  }
  document.addEventListener('click', function(e) { if (!navCat.contains(e.target)) navCat.classList.remove('open'); });
  navDrop.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', function() { navCat.classList.remove('open'); }); });
}

// ─────────────────────────────────────────────────
// § 4  MOBILE NAV STRIP + HAMBURGER (FIX 6 — Tops + Anime added)
// ─────────────────────────────────────────────────
if (!document.querySelector('.nav-cat-strip')) {
  var strip = document.createElement('div');
  strip.className = 'nav-cat-strip';
  strip.innerHTML = '<a href="men.html">Men</a><a href="women.html">Women</a><a href="t-shirts.html">T-Shirts</a><a href="women-tops.html">Tops</a><a href="anime.html">Anime</a><a href="track-pants.html">Track</a>';
  var nav = document.querySelector('nav');
  if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
}

var mobileMenu = document.getElementById('mobileMenu');
var ham = document.getElementById('hamburgerBtn');
if (mobileMenu && ham) {
  var existingHrefs = Array.from(mobileMenu.querySelectorAll('a')).map(function(a){ return a.getAttribute('href'); });
  if (existingHrefs.indexOf('women-tops.html') === -1) {
    var tLink = document.createElement('a'); tLink.href = 'women-tops.html'; tLink.textContent = 'Women Tops'; mobileMenu.appendChild(tLink);
  }
  if (existingHrefs.indexOf('anime.html') === -1) {
    var aLink = document.createElement('a'); aLink.href = 'anime.html'; aLink.textContent = 'Anime'; mobileMenu.appendChild(aLink);
  }
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
var _sync = window.syncCart;
window.syncCart = function() { if(_sync) _sync.apply(this,arguments); if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); };
var _add = window.addCart;
window.addCart = function() { var r=_add?_add.apply(this,arguments):undefined; if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); return r; };
var _addById = window.addCartById;
window.addCartById = function() { var r=_addById?_addById.apply(this,arguments):undefined; if(window.cart) localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart)); return r; };
var saved=[];
try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
if (saved.length > 0) {
  var att=0, ri=setInterval(function(){
    if(++att>30){clearInterval(ri);return;}
    if(window.cart!==undefined && typeof window.syncCart==='function'){
      if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}
      clearInterval(ri);
    }
  },100);
}
window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

// ─────────────────────────────────────────────────
// § 6  PRICES + CHECKOUT
// ─────────────────────────────────────────────────
var s=document.querySelector('#womensSlider');
if(s) Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var checkoutBtn=document.querySelector('.cart-checkout');
if(checkoutBtn) checkoutBtn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});
document.querySelectorAll('.card,[class*=card]').forEach(function(card){var pid=card.dataset&&(card.dataset.pid||card.dataset.id);if(pid&&pm[parseInt(pid)]!==undefined){var el=card.querySelector('[class*=price],[class*=Price]');if(el)el.textContent='$'+pm[parseInt(pid)];}});

// ─────────────────────────────────────────────────
// § 7  HOMEPAGE — hero, brand story, categories, video, email
// ─────────────────────────────────────────────────
var path = window.location.pathname;
var isHome = path.endsWith('/') || path.endsWith('/Krypta-v2/') || path.endsWith('index.html') || path === '/Krypta-v2';

if (isHome) {

  // Hero CSS
  var heroCSS = document.createElement('style');
  heroCSS.textContent = '@keyframes kfadeIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes kglowPulse{0%,100%{opacity:.5;filter:blur(60px)}50%{opacity:.85;filter:blur(80px)}}@keyframes ktagIn{from{opacity:0;letter-spacing:.5em}to{opacity:1;letter-spacing:.2em}}@keyframes ksubIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes kbtnIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}#kryptaa-hero-v2{position:relative;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden}#kryptaa-hero-v2::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E");background-size:180px;opacity:.45;pointer-events:none;z-index:0}.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-54%);width:560px;height:280px;background:radial-gradient(ellipse at center,#c8a000 0%,#7a5800 40%,transparent 75%);animation:kglowPulse 4s ease-in-out infinite;z-index:1;pointer-events:none}.hero-inner{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 24px}.hero-logo{width:min(520px,82vw);height:auto;animation:kfadeIn 1.4s cubic-bezier(.16,1,.3,1) forwards;opacity:0;margin-bottom:28px;filter:drop-shadow(0 0 40px rgba(200,160,0,.3))}.hero-tagline{font-family:"Bebas Neue",sans-serif;font-size:clamp(18px,4vw,32px);color:#e8d080;letter-spacing:.2em;text-transform:uppercase;animation:ktagIn 1.2s cubic-bezier(.16,1,.3,1) .7s forwards;opacity:0;margin-bottom:10px}.hero-subtitle{font-family:"Space Mono",monospace;font-size:clamp(9px,1.8vw,13px);color:#555560;letter-spacing:.18em;text-transform:uppercase;animation:ksubIn 1s ease 1.1s forwards;opacity:0;margin-bottom:38px}.hero-cta{display:inline-block;font-family:"Bebas Neue",sans-serif;font-size:clamp(14px,2.5vw,18px);letter-spacing:.2em;color:#000;background:#c8ff00;border:none;padding:15px 48px;cursor:pointer;text-decoration:none;text-transform:uppercase;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);animation:kbtnIn 1s ease 1.4s forwards;opacity:0;transition:background .2s,transform .15s}.hero-cta:hover{background:#fff;transform:scale(1.04)}.hero-scroll{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;animation:ksubIn 1s ease 2s forwards;opacity:0}.hero-scroll-label{font-family:"Space Mono",monospace;font-size:.42rem;letter-spacing:.28em;color:#333340;text-transform:uppercase}.hero-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,#c8a000,transparent)}';
  document.head.appendChild(heroCSS);

  var heroHTML = '<div id="kryptaa-hero-v2"><div class="hero-glow"></div><div class="hero-inner"><img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/><div class="hero-tagline">Defined By Power</div><div class="hero-subtitle">Gothic &amp; Streetwear Collection &mdash; Since \'26</div><a class="hero-cta" href="#k-categories">Shop The Drop</a></div><div class="hero-scroll"><div class="hero-scroll-label">Scroll</div><div class="hero-scroll-line"></div></div></div>';

  // Replace existing hero
  var heroFound = false;
  var heroTries = ['.hero-section','#hero','.hero','[class*="hero"]','section:first-of-type'];
  for (var h=0; h<heroTries.length; h++) {
    var hEl = document.querySelector(heroTries[h]);
    if (hEl && hEl.offsetHeight > 40 && !hEl.id.startsWith('k-')) {
      hEl.outerHTML = heroHTML; heroFound = true; break;
    }
  }
  if (!heroFound) {
    var navRef = document.querySelector('nav') || document.querySelector('header');
    if (navRef && navRef.parentNode) {
      var tmp = document.createElement('div');
      tmp.innerHTML = heroHTML;
      navRef.parentNode.insertBefore(tmp.firstElementChild, navRef.nextSibling);
    }
  }

  // Brand story
  var brandHTML = '<section id="k-brand-story" style="padding:80px 40px;text-align:center;border-top:1px solid #1e1e26;border-bottom:1px solid #1e1e26;background:#060608;"><div style="max-width:700px;margin:0 auto;"><div style="font-family:\'Space Mono\',monospace;font-size:.52rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:20px;">The World of KRYPTAA</div><h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(38px,6vw,76px);letter-spacing:.06em;color:#f0ede8;line-height:.88;margin-bottom:28px;">Built for those<br><span style="color:#c8a000;">who refuse</span><br>to disappear</h2><p style="font-family:\'Space Mono\',monospace;font-size:.58rem;color:#555560;letter-spacing:.08em;line-height:2;max-width:540px;margin:0 auto;">Gothic roots. Streetwear edge. Every piece is made for the ones who move in silence but hit different when they walk in. SS26 Drop 001 — limited, intentional, unapologetic.</p></div></section>';

  // FIX 2: Full editorial category rows
  function makeCatRow(link, imgSrc, eyebrow, title, accentColor, reverse) {
    var flexDir = reverse ? 'row-reverse' : 'row';
    var gradDir = reverse ? 'to left' : 'to right';
    return '<a href="' + link + '" style="display:flex;flex-direction:' + flexDir + ';align-items:stretch;min-height:260px;overflow:hidden;border-bottom:1px solid #1e1e26;text-decoration:none;position:relative;background:#060608;transition:background .3s;">' +
      '<div style="width:42%;position:relative;overflow:hidden;flex-shrink:0;">' +
        '<video autoplay muted loop playsinline preload="none" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5;"></video>' +
        '<div style="position:absolute;inset:0;background-image:url(\'' + imgSrc + '\');background-size:cover;background-position:center;transition:transform .6s ease;"></div>' +
        '<div style="position:absolute;inset:0;background:linear-gradient(' + gradDir + ',rgba(6,6,8,.9) 0%,transparent 60%);"></div>' +
      '</div>' +
      '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 52px;">' +
        '<div style="font-family:\'Space Mono\',monospace;font-size:.48rem;letter-spacing:.28em;text-transform:uppercase;color:#555560;margin-bottom:14px;">' + eyebrow + '</div>' +
        '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(40px,6vw,72px);letter-spacing:.05em;color:#f0ede8;line-height:.88;margin-bottom:22px;">' + title + '</div>' +
        '<div style="display:inline-flex;align-items:center;gap:14px;font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.22em;color:' + accentColor + ';text-transform:uppercase;">Shop Now <span style="width:36px;height:1px;background:' + accentColor + ';display:inline-block;"></span></div>' +
      '</div>' +
    '</a>';
  }

  var catHTML = '<section id="k-categories" style="border-top:1px solid #1e1e26;">' +
    '<div style="padding:40px;border-bottom:1px solid #1e1e26;display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:12px;">' +
      '<div><div style="font-family:\'Space Mono\',monospace;font-size:.52rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:10px;">The Collection</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(36px,6vw,76px);letter-spacing:.05em;color:#f0ede8;line-height:.88;">SHOP THE DROP</div></div>' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.5rem;letter-spacing:.15em;color:#555560;">SS26 — 6 Categories</div>' +
    '</div>' +
    '<div>' +
      makeCatRow('men.html','imgs/jeans-gold-dragon.jpg','Mens Collection','DENIM<br>& JEANS','#c8ff00', false) +
      makeCatRow('women.html','imgs/w-vintage-dragon.jpg','Womens Collection','WOMEN\'S<br>EDIT','#c8a000', true) +
      makeCatRow('t-shirts.html','imgs/img-angel.png','Drop 001','T-SHIRTS<br>& TOPS','#c8ff00', false) +
      makeCatRow('women-tops.html','imgs/img-glorious.png','New Arrivals','WOMEN<br>TOPS','#c8a000', true) +
      makeCatRow('anime.html','imgs/anime-gojo.jpg','Category Drop','ANIME<br>DENIM','#c8ff00', false) +
      makeCatRow('track-pants.html','imgs/jeans-dual-dragon.jpg','Drop 002','TRACK<br>PANTS','#c8a000', true) +
    '</div>' +
  '</section>';

  // Video section
  var videoHTML = '<section id="k-video-section" style="position:relative;height:580px;overflow:hidden;display:flex;align-items:center;justify-content:center;">' +
    '<video autoplay muted loop playsinline preload="metadata" src="imgs/Background.mp4" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;"></video>' +
    '<div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(0,0,0,.78) 0%,rgba(10,5,20,.55) 100%);"></div>' +
    '<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);pointer-events:none;"></div>' +
    '<div style="position:relative;z-index:2;text-align:center;">' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.52rem;letter-spacing:.32em;color:#555560;text-transform:uppercase;margin-bottom:22px;">— Drop 001 —</div>' +
      '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(68px,11vw,140px);line-height:.82;letter-spacing:.04em;color:#f0ede8;text-shadow:0 0 60px rgba(200,160,0,.15);">ENTER<br>THE SYSTEM</div>' +
      '<div style="width:60px;height:1px;background:#c8a000;margin:26px auto;"></div>' +
      '<div style="font-family:\'Space Mono\',monospace;font-size:.58rem;letter-spacing:.22em;color:#555560;">Kryptaa — SS26</div>' +
    '</div>' +
  '</section>';

  // FIX 7: Email signup section
  var emailHTML = '<div class="footer-email-section">' +
    '<div class="footer-email-title">JOIN THE UNDERGROUND</div>' +
    '<div class="footer-email-sub">Early access &nbsp;·&nbsp; Drop alerts &nbsp;·&nbsp; Members only</div>' +
    '<div class="footer-email-row">' +
      '<input class="footer-email-input" type="email" placeholder="YOUR@EMAIL.COM"/>' +
      '<button class="footer-email-btn" onclick="(function(btn){var inp=btn.previousElementSibling;if(inp.value&&inp.value.includes(\'@\')){btn.textContent=\'JOINED ✓\';btn.style.background=\'#c8a000\';inp.disabled=true;btn.disabled=true;}else{inp.style.borderColor=\'#ff4444\';setTimeout(function(){inp.style.borderColor=\'\';},1200);};})(this);">JOIN</button>' +
    '</div>' +
  '</div>';

  // Inject all sections in order
  setTimeout(function() {
    var hero = document.getElementById('kryptaa-hero-v2');
    if (hero) {
      if (!document.getElementById('k-brand-story')) hero.insertAdjacentHTML('afterend', brandHTML);
      var brand = document.getElementById('k-brand-story');
      if (brand && !document.getElementById('k-categories')) brand.insertAdjacentHTML('afterend', catHTML);
      var cat = document.getElementById('k-categories');
      if (cat && !document.getElementById('k-video-section')) cat.insertAdjacentHTML('afterend', videoHTML);
    }
    var footer = document.querySelector('footer');
    if (footer && !document.querySelector('.footer-email-section')) {
      footer.insertAdjacentHTML('beforebegin', emailHTML);
    }
    // Footer logo bigger
    var fLogo = document.querySelector('footer img');
    if (fLogo) fLogo.style.cssText = 'width:200px!important;height:auto!important;display:block!important;margin:0 auto!important;object-fit:contain!important;';
  }, 100);
}

// ─────────────────────────────────────────────────
// § 8  FIX 5: QUICK-ADD on all category pages
// ─────────────────────────────────────────────────
setTimeout(function() {
  document.querySelectorAll('.p-card').forEach(function(card) {
    if (card.querySelector('.quick-add')) return;
    var imgEl = card.querySelector('img');
    var isJeans = imgEl && (imgEl.src.includes('jeans') || imgEl.src.includes('anime') || imgEl.src.includes('dragon') || imgEl.src.includes('baki') || imgEl.src.includes('gojo') || imgEl.src.includes('jjk') || imgEl.src.includes('death') || imgEl.src.includes('piece') || imgEl.src.includes('horror') || imgEl.src.includes('skull') || imgEl.src.includes('flame') || imgEl.src.includes('cargo') || imgEl.src.includes('butterfly') || imgEl.src.includes('split') || imgEl.src.includes('rip') || imgEl.src.includes('vintage') || imgEl.src.includes('distressed') || imgEl.src.includes('baggy'));
    var sizes = isJeans ? ['28','30','32','34','36'] : ['XS','S','M','L','XL'];
    var qa = document.createElement('div');
    qa.className = 'quick-add';
    qa.innerHTML = '<div class="quick-add-sizes">' +
      sizes.map(function(sz) {
        return '<button class="quick-add-sz" onclick="this.parentElement.querySelectorAll(\'.quick-add-sz\').forEach(function(b){b.classList.remove(\'sel\')});this.classList.add(\'sel\');this.closest(\'.p-card\').dataset.qs=\'' + sz + '\';">' + sz + '</button>';
      }).join('') +
    '</div><button class="quick-add-btn" onclick="(function(b){var c=b.closest(\'.p-card\');var sz=c.dataset.qs;if(!sz){b.textContent=\'SELECT SIZE FIRST\';setTimeout(function(){b.textContent=\'ADD TO CART\';},1400);return;}c.dataset.selectedSize=sz;var addBtn=c.querySelector(\'.add-btn\');if(addBtn){addBtn.click();}else{b.textContent=\'ADDED ✓\';b.style.background=\'#c8a000\';setTimeout(function(){b.textContent=\'ADD TO CART\';b.style.background=\'\';},1600);};})(this);">ADD TO CART</button>';
    card.appendChild(qa);
  });
}, 900);

// Footer logo on category pages too
setTimeout(function() {
  var fLogo = document.querySelector('footer img');
  if (fLogo && !fLogo.style.width) {
    fLogo.style.cssText = 'width:200px!important;height:auto!important;display:block!important;margin:0 auto!important;object-fit:contain!important;';
  }
}, 400);

}); // end DOMContentLoaded
