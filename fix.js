document.addEventListener('DOMContentLoaded', function () {

// =============================================
// STYLES: Mobile menu + desktop dropdown fix
// =============================================
var st = document.createElement('style');
st.textContent = [
  '#mobileMenu{display:none;position:fixed!important;top:56px;left:0;right:0;background:#060608!important;z-index:500!important;padding:8px 0!important;border-bottom:2px solid #c8ff00;}',
  '#mobileMenu a{display:flex!important;align-items:center!important;gap:12px!important;padding:18px 24px!important;font-family:"Bebas Neue",sans-serif!important;font-size:28px!important;letter-spacing:.1em!important;color:#f0ede8!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;background:#060608!important;}',
  '#mobileMenu a:hover,#mobileMenu a:active{color:#c8ff00!important;background:#0a0a0d!important;}',
  '.nav-cat.js-dd:hover .nav-dropdown{display:none;}',
  '.nav-cat.js-dd.open .nav-dropdown{display:block!important;}',
  '.nav-dropdown{position:absolute;top:calc(100% + 4px);left:0;background:#0a0a0d;border:1px solid #1e1e26;min-width:160px;z-index:600;padding:4px 0;}',
  '.nav-dropdown a{display:block!important;padding:12px 18px!important;font-family:"Space Mono",monospace!important;font-size:0.6rem!important;letter-spacing:.15em!important;text-transform:uppercase!important;color:#555560!important;text-decoration:none!important;border-bottom:1px solid #1e1e26!important;}',
  '.nav-dropdown a:hover{color:#c8ff00!important;background:#111116!important;}',
  '@media(max-width:768px){',
  '.nav-cat-strip{position:fixed!important;top:56px;left:0;right:0;z-index:400;display:flex!important;overflow-x:auto;background:#0a0a0d;border-bottom:1px solid #1e1e26;scrollbar-width:none;}',
  '.nav-cat-strip::-webkit-scrollbar{display:none;}',
  '.nav-cat-strip a{flex-shrink:0;padding:9px 14px;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:#555560;text-decoration:none;border-right:1px solid #1e1e26;white-space:nowrap;}',
  '.nav-cat-strip a:hover{color:#c8ff00;background:#111116;}',
  'body{padding-top:92px!important;}',
  'nav{position:fixed!important;top:0;left:0;right:0;z-index:450!important;}',
  '}'
].join('');
document.head.appendChild(st);

// =============================================
// DESKTOP: Shop dropdown click-toggle fix
// =============================================
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

// =============================================
// MOBILE: Category strip below nav
// =============================================
if (!document.querySelector('.nav-cat-strip')) {
  var strip = document.createElement('div');
  strip.className = 'nav-cat-strip';
  strip.innerHTML = '<a href="#tees">T-Shirts</a><a href="#mens">Mens</a><a href="#anime">Anime</a><a href="#womens">Womens</a><a href="#womenstops">Tops</a><a href="#tab-track">Track</a>';
  var nav = document.querySelector('nav');
  if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
}

// =============================================
// MOBILE: Hamburger menu
// =============================================
var mobileMenu = document.getElementById('mobileMenu');
var ham = document.getElementById('hamburgerBtn');
if (mobileMenu && ham) {
  var iconMap = {tees:'👕',mens:'👖',womens:'👗',womenstops:'🔺'};
  Array.from(mobileMenu.querySelectorAll('a')).forEach(function(a) {
    if (a.querySelector('.mob-icon')) return;
    var href = (a.getAttribute('href')||'').replace('#','');
    var span = document.createElement('span');
    span.className = 'mob-icon';
    span.style.cssText = 'font-size:20px;width:28px;text-align:center;flex-shrink:0;';
    span.textContent = iconMap[href] || '→';
    a.insertBefore(span, a.firstChild);
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

// =============================================
// CART PERSISTENCE
// =============================================
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

// =============================================
// EXISTING: Track pants, checkout btn, prices
// =============================================
var s=document.querySelector('#womensSlider');
if(s) Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var btn=document.querySelector('.cart-checkout');
if(btn) btn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});
document.querySelectorAll('.card,[class*=card]').forEach(function(card){var pid=card.dataset&&(card.dataset.pid||card.dataset.id);if(pid&&pm[parseInt(pid)]!==undefined){var el=card.querySelector('[class*=price],[class*=Price]');if(el)el.textContent='$'+pm[parseInt(pid)];}});

// =============================================
// V2: NAV LOGO — Replace with gold KRYPTAA image
// =============================================
(function() {
  var logoSelectors = [
    '.nav-logo img', '.nav-logo', '.logo img', '.logo',
    'nav a img', 'nav .brand img', 'nav .brand',
    'header .logo', 'header a img', '.navbar-brand img', '.navbar-brand'
  ];
  var logoEl = null;
  for (var i = 0; i < logoSelectors.length; i++) {
    var el = document.querySelector(logoSelectors[i]);
    if (el) { logoEl = el; break; }
  }
  if (logoEl) {
    if (logoEl.tagName === 'IMG') {
      logoEl.src = 'imgs/kryptaa-logo-gold.png';
      logoEl.alt = 'KRYPTAA';
      logoEl.style.cssText = 'height:38px;width:auto;object-fit:contain;';
    } else {
      var img = document.createElement('img');
      img.src = 'imgs/kryptaa-logo-gold.png';
      img.alt = 'KRYPTAA';
      img.style.cssText = 'height:38px;width:auto;object-fit:contain;display:block;';
      logoEl.innerHTML = '';
      logoEl.appendChild(img);
    }
  }
})();

// =============================================
// V2: FOOTER LOGO — Replace with gold KRYPTAA image
// =============================================
(function() {
  var footerImg = document.querySelector('footer img[alt="KRYPTAA"]');
  if (!footerImg) footerImg = document.querySelector('footer img');
  if (footerImg) {
    footerImg.src = 'imgs/kryptaa-logo-gold.png';
    footerImg.alt = 'KRYPTAA';
    footerImg.style.cssText = 'height:52px;width:auto;object-fit:contain;display:block;margin:0 auto;';
  }
})();

// =============================================
// V2: HERO — Cinematic banner replacement
// =============================================
(function() {

  var heroStyle = document.createElement('style');
  heroStyle.textContent = `
    @keyframes kryptaa-fade-in {
      from { opacity: 0; transform: translateY(18px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes kryptaa-glow-pulse {
      0%,100% { opacity: 0.55; filter: blur(60px); }
      50%      { opacity: 0.85; filter: blur(72px); }
    }
    @keyframes kryptaa-tagline-in {
      from { opacity: 0; letter-spacing: 0.5em; }
      to   { opacity: 1; letter-spacing: 0.22em; }
    }
    @keyframes kryptaa-sub-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes kryptaa-btn-in {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #kryptaa-hero-v2 {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
      overflow: hidden;
    }
    #kryptaa-hero-v2::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      background-size: 180px 180px;
      opacity: 0.45;
      pointer-events: none;
      z-index: 0;
    }
    #kryptaa-hero-v2 .hero-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -54%);
      width: 520px;
      height: 260px;
      background: radial-gradient(ellipse at center, #c8a000 0%, #7a5800 40%, transparent 75%);
      animation: kryptaa-glow-pulse 4s ease-in-out infinite;
      z-index: 1;
      pointer-events: none;
    }
    #kryptaa-hero-v2 .hero-inner {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 40px 24px;
    }
    #kryptaa-hero-v2 .hero-logo {
      width: min(480px, 82vw);
      height: auto;
      animation: kryptaa-fade-in 1.4s cubic-bezier(0.16,1,0.3,1) forwards;
      opacity: 0;
      margin-bottom: 28px;
      filter: drop-shadow(0 0 32px rgba(200,160,0,0.25));
    }
    #kryptaa-hero-v2 .hero-tagline {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(18px, 4vw, 30px);
      color: #e8d080;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      animation: kryptaa-tagline-in 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s forwards;
      opacity: 0;
      margin-bottom: 10px;
    }
    #kryptaa-hero-v2 .hero-subtitle {
      font-family: 'Space Mono', monospace;
      font-size: clamp(9px, 1.8vw, 13px);
      color: #555560;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      animation: kryptaa-sub-in 1s ease 1.1s forwards;
      opacity: 0;
      margin-bottom: 38px;
    }
    #kryptaa-hero-v2 .hero-cta {
      display: inline-block;
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(14px, 2.5vw, 18px);
      letter-spacing: 0.2em;
      color: #000;
      background: #c8ff00;
      border: none;
      padding: 14px 44px;
      cursor: pointer;
      text-decoration: none;
      text-transform: uppercase;
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
      animation: kryptaa-btn-in 1s ease 1.4s forwards;
      opacity: 0;
      transition: background 0.2s, color 0.2s, transform 0.15s;
    }
    #kryptaa-hero-v2 .hero-cta:hover {
      background: #fff;
      color: #000;
      transform: scale(1.04);
    }
  `;
  document.head.appendChild(heroStyle);

  var heroHTML = `
    <div id="kryptaa-hero-v2">
      <div class="hero-glow"></div>
      <div class="hero-inner">
        <img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA" />
        <div class="hero-tagline">Defined By Power</div>
        <div class="hero-subtitle">Gothic &amp; Streetwear Collection &mdash; Since &apos;26</div>
        <a class="hero-cta" href="#mens">Shop The Drop</a>
      </div>
    </div>
  `;

  var heroSelectors = [
    '.hero-section', '#hero', '.hero', '[class*="hero"]',
    'section.banner', '.banner-section', '#banner',
    'main > section:first-child', 'main > div:first-child',
    'body > section:first-of-type'
  ];
  var existing = null;
  for (var i = 0; i < heroSelectors.length; i++) {
    var el = document.querySelector(heroSelectors[i]);
    if (el && el.offsetHeight > 40) { existing = el; break; }
  }

  if (existing) {
    existing.outerHTML = heroHTML;
  } else {
    var navEl = document.querySelector('nav') || document.querySelector('header');
    if (navEl && navEl.parentNode) {
      var tmp = document.createElement('div');
      tmp.innerHTML = heroHTML;
      navEl.parentNode.insertBefore(tmp.firstElementChild, navEl.nextSibling);
    } else {
      document.body.insertAdjacentHTML('afterbegin', heroHTML);
    }
  }

})();

}); // end DOMContentLoaded
