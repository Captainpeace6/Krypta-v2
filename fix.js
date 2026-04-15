document.addEventListener('DOMContentLoaded', function () {

// ═══════════════════════════════════════════════════
// § 1  GLOBAL DESIGN SYSTEM
// ═══════════════════════════════════════════════════
var G = document.createElement('style');
G.textContent = `
  :root {
    --k-black:#000; --k-deep:#060608; --k-dark:#0a0a0d;
    --k-mid:#111116; --k-border:#1e1e26; --k-muted:#555560;
    --k-off:#f0ede8; --k-white:#fff;
    --k-gold:#c8a84b; --k-gold-hi:#e8d080; --k-lime:#c8ff00;
  }
  @keyframes k-fade-up   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
  @keyframes k-glow-pulse{ 0%,100%{opacity:.45;filter:blur(65px)} 50%{opacity:.85;filter:blur(85px)} }
  @keyframes k-slow-drift{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-14px) scale(1.02)} }
  @keyframes k-scan      { from{transform:translateY(-100%)} to{transform:translateY(200vh)} }
  @keyframes k-flicker   { 0%,97%,100%{opacity:1} 98%{opacity:.82} }
  @keyframes k-tag-in    { from{opacity:0;letter-spacing:.5em} to{opacity:1;letter-spacing:.22em} }
  @keyframes k-sub-in    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes k-btn-in    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes k-corner-in { from{opacity:0} to{opacity:.5} }

  *,*::before,*::after{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000!important;color:#f0ede8!important;font-family:'Barlow Condensed',sans-serif!important;-webkit-font-smoothing:antialiased}

  /* Shared section eyebrow */
  .k-eyebrow{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:rgba(200,168,75,.6);display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:20px}
  .k-eyebrow::before,.k-eyebrow::after{content:'';width:40px;height:1px;background:rgba(200,168,75,.25)}

  /* Gold gothic divider */
  .k-divider{display:flex;align-items:center;gap:16px;padding:28px 48px;background:#000}
  .k-divider::before,.k-divider::after{content:'';flex:1;max-width:280px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.2),transparent)}
  .k-divider-txt{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.4em;color:rgba(200,168,75,.3);text-transform:uppercase}

  /* Product cards global upgrade */
  .card,[class*="card"]{background:#0a0a0d!important;border:1px solid #1e1e26!important;transition:transform .3s ease,box-shadow .3s ease,border-color .3s!important;overflow:hidden!important}
  .card:hover,[class*="card"]:hover{transform:translateY(-4px) scale(1.02)!important;box-shadow:0 14px 44px rgba(0,0,0,.5),0 0 22px rgba(200,168,75,.07)!important;border-color:rgba(200,168,75,.22)!important}
  .card img,[class*="card"] img{transition:transform .5s ease!important}
  .card:hover img,[class*="card"]:hover img{transform:scale(1.07)!important}
  [class*="price"],[class*="Price"]{font-family:'Space Mono',monospace!important;color:#e8d080!important}
  [class*="name"],h3,h4{font-family:'Bebas Neue',sans-serif!important;letter-spacing:.08em!important;color:#f0ede8!important}

  /* Add-to-cart buttons */
  [class*="add-to-cart"],button[class*="cart"],button[class*="add"]{font-family:'Bebas Neue',sans-serif!important;letter-spacing:.15em!important;background:transparent!important;border:1px solid rgba(200,255,0,.4)!important;color:#c8ff00!important;transition:background .2s,color .2s!important}
  [class*="add-to-cart"]:hover,button[class*="cart"]:hover,button[class*="add"]:hover{background:#c8ff00!important;color:#000!important}

  /* Section headers */
  section h2,[id*="section"] h2,[id*="mens"] h2,[id*="womens"] h2,[id*="anime"] h2{font-family:'Bebas Neue',sans-serif!important;font-size:clamp(28px,5vw,52px)!important;letter-spacing:.12em!important;color:#fff!important}
`;
document.head.appendChild(G);

// ═══════════════════════════════════════════════════
// § 2  NAV REDESIGN
// ═══════════════════════════════════════════════════
var NAV = document.createElement('style');
NAV.textContent = `
  nav{
    position:fixed!important;top:0;left:0;right:0;
    height:62px!important;
    background:rgba(6,6,8,.97)!important;
    backdrop-filter:blur(14px)!important;
    -webkit-backdrop-filter:blur(14px)!important;
    border-bottom:1px solid rgba(200,168,75,.1)!important;
    display:flex!important;align-items:center!important;
    justify-content:space-between!important;
    padding:0 36px!important;
    z-index:450!important;
  }
  /* Center nav links */
  .k-nav-links{
    position:absolute;left:50%;transform:translateX(-50%);
    display:flex;align-items:center;gap:26px;
  }
  .k-nav-links > a{
    font-family:'Bebas Neue',sans-serif!important;font-size:13px!important;
    letter-spacing:.15em!important;color:rgba(240,237,232,.6)!important;
    text-decoration:none!important;text-transform:uppercase!important;
    transition:color .2s!important;white-space:nowrap!important;
  }
  .k-nav-links > a:hover{color:#e8d080!important}

  /* SHOP dropdown wrapper */
  .k-nav-dd{position:relative}
  .k-nav-dd-label{
    font-family:'Bebas Neue',sans-serif;font-size:13px;
    letter-spacing:.15em;color:rgba(240,237,232,.6);
    cursor:pointer;text-transform:uppercase;user-select:none;
    transition:color .2s;
  }
  .k-nav-dd:hover .k-nav-dd-label,.k-nav-dd.open .k-nav-dd-label{color:#e8d080}
  .k-nav-dd-menu{
    display:none;position:absolute;top:calc(100% + 16px);left:50%;
    transform:translateX(-50%);
    background:#0a0a0d;border:1px solid #1e1e26;
    border-top:1px solid rgba(200,168,75,.3);
    min-width:200px;padding:8px 0;z-index:700;
  }
  .k-nav-dd.open .k-nav-dd-menu{display:block!important}
  .k-nav-dd-menu a{
    display:block!important;padding:11px 20px!important;
    font-family:'Space Mono',monospace!important;font-size:8px!important;
    letter-spacing:.2em!important;text-transform:uppercase!important;
    color:#555560!important;text-decoration:none!important;
    border-bottom:1px solid #1a1a22!important;transition:color .15s,background .15s!important;
  }
  .k-nav-dd-menu a:last-child{border-bottom:none!important}
  .k-nav-dd-menu a:hover{color:#e8d080!important;background:#111116!important}

  /* Hide old nav-cat dropdown on desktop, keep center links */
  @media(min-width:901px){
    .nav-cat-strip{display:none!important}
    #hamburgerBtn{display:none!important}
    #mobileMenu{display:none!important}
    body{padding-top:62px!important}
  }
  @media(max-width:900px){
    .k-nav-links{display:none!important}
    body{padding-top:62px!important}
    .nav-cat-strip{display:none!important}
  }
  #mobileMenu{
    display:none;position:fixed!important;top:62px;left:0;right:0;
    background:#060608!important;z-index:500!important;
    padding:8px 0!important;
    border-bottom:1px solid rgba(200,168,75,.12);
    max-height:calc(100vh - 62px);overflow-y:auto;
  }
  #mobileMenu a{
    display:flex!important;align-items:center!important;gap:14px!important;
    padding:15px 24px!important;font-family:'Bebas Neue',sans-serif!important;
    font-size:20px!important;letter-spacing:.1em!important;
    color:#f0ede8!important;text-decoration:none!important;
    border-bottom:1px solid #1a1a22!important;
  }
  #mobileMenu a:hover{color:#e8d080!important;background:#0a0a0d!important}
`;
document.head.appendChild(NAV);

// Inject center nav links
var nav = document.querySelector('nav');
if (nav && !document.querySelector('.k-nav-links')) {
  var cl = document.createElement('div');
  cl.className = 'k-nav-links';
  cl.innerHTML = `
    <div class="k-nav-dd" id="k-shop-dd">
      <span class="k-nav-dd-label">SHOP ▾</span>
      <div class="k-nav-dd-menu">
        <a href="men.html">Men's Collection</a>
        <a href="women.html">Women's Collection</a>
        <a href="jeans.html">All Jeans</a>
        <a href="t-shirts.html">T-Shirts</a>
        <a href="track-pants.html">Track Pants</a>
      </div>
    </div>
    <a href="men.html">MEN</a>
    <a href="women.html">WOMEN</a>
    <a href="jeans.html">JEANS</a>
    <a href="t-shirts.html">T-SHIRTS</a>
    <a href="track-pants.html">TRACK PANTS</a>
    <a href="#k-size-guide">SIZE GUIDE</a>
  `;
  nav.appendChild(cl);
  var shopDd = document.getElementById('k-shop-dd');
  if (shopDd) {
    shopDd.querySelector('.k-nav-dd-label').addEventListener('click', function(e) {
      e.stopPropagation(); shopDd.classList.toggle('open');
    });
    document.addEventListener('click', function(e) { if(!shopDd.contains(e.target)) shopDd.classList.remove('open'); });
  }
}

// Keep existing desktop dropdown for compatibility
var navCat = document.querySelector('.nav-cat');
var navDrop = document.querySelector('.nav-dropdown');
if (navCat && navDrop) {
  navCat.classList.add('js-dd');
  var sl = navCat.querySelector('a');
  if (sl) { sl.addEventListener('click', function(e){ e.preventDefault(); navCat.classList.toggle('open'); }); }
  document.addEventListener('click', function(e){ if(!navCat.contains(e.target)) navCat.classList.remove('open'); });
  navDrop.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ navCat.classList.remove('open'); }); });
}

// ═══════════════════════════════════════════════════
// § 3  LOGO REPLACEMENTS
// ═══════════════════════════════════════════════════
(function(){
  var sels = ['.nav-logo img','.nav-logo','.logo img','.logo','nav a img','nav .brand img','nav .brand'];
  var el = null;
  for (var i=0;i<sels.length;i++){var e=document.querySelector(sels[i]);if(e){el=e;break;}}
  if (el) {
    if (el.tagName==='IMG'){el.src='imgs/kryptaa-logo-gold.png';el.alt='KRYPTAA';el.style.cssText='height:36px;width:auto;object-fit:contain;';}
    else {var img=document.createElement('img');img.src='imgs/kryptaa-logo-gold.png';img.alt='KRYPTAA';img.style.cssText='height:36px;width:auto;object-fit:contain;display:block;';el.innerHTML='';el.appendChild(img);}
  }
  var fi=document.querySelector('footer img[alt="KRYPTAA"]')||document.querySelector('footer img');
  if (fi){fi.src='imgs/kryptaa-logo-gold.png';fi.alt='KRYPTAA';fi.style.cssText='height:50px;width:auto;object-fit:contain;display:block;margin:0 auto;';}
})();

// ═══════════════════════════════════════════════════
// § 4  HERO — Cinematic, enriched
// ═══════════════════════════════════════════════════
var HS = document.createElement('style');
HS.textContent = `
  #kryptaa-hero-v2{
    position:relative;width:100%;min-height:100vh;
    display:flex;align-items:center;justify-content:center;
    background:#000;overflow:hidden;
  }
  /* noise grain */
  #kryptaa-hero-v2::before{
    content:'';position:absolute;inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-size:200px 200px;opacity:.5;pointer-events:none;z-index:0;
  }
  /* vignette */
  #kryptaa-hero-v2::after{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.75) 100%);
    pointer-events:none;z-index:1;
  }
  .hero-glow{
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-52%);
    width:640px;height:320px;
    background:radial-gradient(ellipse at center,rgba(200,168,75,.65) 0%,rgba(120,80,15,.35) 40%,transparent 70%);
    animation:k-glow-pulse 5s ease-in-out infinite;
    z-index:2;pointer-events:none;
  }
  /* gothic corner frames */
  .hero-corner{
    position:absolute;width:90px;height:90px;z-index:3;
    animation:k-corner-in 2.2s ease 1s forwards;opacity:0;
  }
  .hero-corner--tl{top:44px;left:44px}
  .hero-corner--tr{top:44px;right:44px;transform:scaleX(-1)}
  .hero-corner--bl{bottom:44px;left:44px;transform:scaleY(-1)}
  .hero-corner--br{bottom:44px;right:44px;transform:scale(-1)}
  /* horizontal accent lines */
  .hero-hline{
    position:absolute;left:8%;right:8%;height:1px;
    background:linear-gradient(90deg,transparent,rgba(200,168,75,.25),transparent);
    z-index:3;animation:k-corner-in 2s ease 1.2s forwards;opacity:0;
  }
  .hero-hline--top{top:17%}
  .hero-hline--bot{bottom:17%}
  /* inner content */
  #kryptaa-hero-v2 .hero-inner{
    position:relative;z-index:4;
    display:flex;flex-direction:column;align-items:center;
    text-align:center;padding:40px 24px;max-width:680px;
  }
  .hero-logo{
    width:min(500px,78vw);height:auto;
    animation:k-fade-up 1.4s cubic-bezier(.16,1,.3,1) forwards;
    opacity:0;margin-bottom:26px;
    filter:drop-shadow(0 0 44px rgba(200,168,75,.28));
  }
  .hero-tagline{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(22px,5vw,42px);
    color:#e8d080;letter-spacing:.22em;text-transform:uppercase;
    animation:k-tag-in 1.2s cubic-bezier(.16,1,.3,1) .7s forwards;
    opacity:0;margin-bottom:12px;
  }
  .hero-subtitle{
    font-family:'Space Mono',monospace;font-size:clamp(9px,1.8vw,12px);
    color:#555560;letter-spacing:.2em;text-transform:uppercase;
    animation:k-sub-in 1s ease 1.1s forwards;
    opacity:0;margin-bottom:40px;
  }
  .hero-cta{
    display:inline-block;font-family:'Bebas Neue',sans-serif;
    font-size:clamp(14px,2.5vw,18px);letter-spacing:.2em;
    color:#000;background:#c8ff00;border:none;
    padding:15px 56px;cursor:pointer;text-decoration:none;text-transform:uppercase;
    clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
    animation:k-btn-in 1s ease 1.4s forwards;opacity:0;
    transition:background .2s,transform .15s,box-shadow .2s;
  }
  .hero-cta:hover{background:#fff!important;transform:scale(1.05)!important;box-shadow:0 0 32px rgba(200,255,0,.18)!important}
  .hero-scroll{
    position:absolute;bottom:28px;left:50%;transform:translateX(-50%);
    z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;
    animation:k-sub-in 1s ease 2s forwards;opacity:0;
  }
  .hero-scroll span{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.3em;color:#3a3a44;text-transform:uppercase}
  .hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(200,168,75,.4),transparent);animation:k-slow-drift 2.5s ease-in-out infinite}
`;
document.head.appendChild(HS);

var cornerSVG = '<svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L4 36M4 4L36 4" stroke="rgba(200,168,75,0.55)" stroke-width="1"/><path d="M4 4L22 22" stroke="rgba(200,168,75,0.18)" stroke-width="0.5"/><circle cx="4" cy="4" r="2.5" fill="rgba(200,168,75,0.45)"/><path d="M18 4L18 9M4 18L9 18" stroke="rgba(200,168,75,0.25)" stroke-width="0.5"/></svg>';

var heroHTML = '<div id="kryptaa-hero-v2"><div class="hero-glow"></div>' +
  '<div class="hero-corner hero-corner--tl">' + cornerSVG + '</div>' +
  '<div class="hero-corner hero-corner--tr">' + cornerSVG + '</div>' +
  '<div class="hero-corner hero-corner--bl">' + cornerSVG + '</div>' +
  '<div class="hero-corner hero-corner--br">' + cornerSVG + '</div>' +
  '<div class="hero-hline hero-hline--top"></div>' +
  '<div class="hero-hline hero-hline--bot"></div>' +
  '<div class="hero-inner">' +
    '<img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/>' +
    '<div class="hero-tagline">Defined By Power</div>' +
    '<div class="hero-subtitle">Gothic &amp; Streetwear Collection \u2014 Since \u201926</div>' +
    '<a class="hero-cta" href="#k-categories">Shop The Drop</a>' +
  '</div>' +
  '<div class="hero-scroll"><span>Scroll</span><div class="hero-scroll-line"></div></div>' +
  '</div>';

var heroSels = ['.hero-section','#hero','.hero','[class*="hero"]','section.banner','.banner-section','#banner','main > section:first-child','main > div:first-child','body > section:first-of-type'];
var oldHero = null;
for (var i=0;i<heroSels.length;i++){var e=document.querySelector(heroSels[i]);if(e&&e.offsetHeight>40){oldHero=e;break;}}
if (oldHero) { oldHero.outerHTML = heroHTML; }
else {
  var ne=document.querySelector('nav')||document.querySelector('header');
  if (ne&&ne.parentNode){var t=document.createElement('div');t.innerHTML=heroHTML;ne.parentNode.insertBefore(t.firstElementChild,ne.nextSibling);}
  else document.body.insertAdjacentHTML('afterbegin',heroHTML);
}

// ═══════════════════════════════════════════════════
// § 5  BRAND STORY
// ═══════════════════════════════════════════════════
var BS = document.createElement('style');
BS.textContent = `
  #k-brand-story{
    background:#060608;padding:100px 48px;text-align:center;
    position:relative;overflow:hidden;
  }
  #k-brand-story::before{
    content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at center,rgba(200,168,75,.04),transparent 70%);
    pointer-events:none;
  }
  #k-brand-story .bs-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(38px,8vw,80px);letter-spacing:.08em;
    color:#fff;margin-bottom:40px;line-height:.95;
  }
  #k-brand-story .bs-body{
    max-width:540px;margin:0 auto;
    font-family:'Barlow Condensed',sans-serif;
    font-size:clamp(17px,2.5vw,22px);font-weight:300;
    line-height:1.85;color:rgba(240,237,232,.6);letter-spacing:.04em;
  }
  #k-brand-story .bs-body strong{color:#e8d080;font-weight:400}
`;
document.head.appendChild(BS);

var brandHTML = '<section id="k-brand-story">' +
  '<div class="k-eyebrow">The World of Kryptaa</div>' +
  '<h2 class="bs-title">THE WORLD<br>OF KRYPTAA</h2>' +
  '<p class="bs-body">Kryptaa is not fashion.<br>It is <strong>energy</strong>. It is <strong>presence</strong>.<br>Built for those who move different.<br><br><strong>Dark. Precise. Unapologetic.</strong></p>' +
  '</section>';

// ═══════════════════════════════════════════════════
// § 6  CATEGORY PREVIEW GRID
// ═══════════════════════════════════════════════════
var CP = document.createElement('style');
CP.textContent = `
  #k-categories{background:#000;padding:80px 32px}
  #k-categories .cat-hdr{text-align:center;margin-bottom:48px}
  #k-categories .cat-hdr h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(30px,6vw,58px);letter-spacing:.1em;color:#fff;margin:0 0 8px}
  #k-categories .cat-hdr p{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.3em;color:#555560;text-transform:uppercase}
  .k-cat-grid{
    display:grid;grid-template-columns:repeat(12,1fr);
    gap:10px;max-width:1260px;margin:0 auto;
  }
  .k-cc{position:relative;overflow:hidden;cursor:pointer;text-decoration:none;display:block;background:#0a0a0d;border:1px solid #1e1e26}
  .k-cc:nth-child(1){grid-column:span 7;grid-row:span 2;min-height:500px}
  .k-cc:nth-child(2){grid-column:span 5;min-height:245px}
  .k-cc:nth-child(3){grid-column:span 5;min-height:245px}
  .k-cc:nth-child(4){grid-column:span 4;min-height:210px}
  .k-cc:nth-child(5){grid-column:span 4;min-height:210px}
  .k-cc:nth-child(6){grid-column:span 4;min-height:210px}
  @media(max-width:768px){.k-cc:nth-child(n){grid-column:span 12!important;min-height:200px!important}}
  @media(min-width:769px) and (max-width:1024px){
    .k-cc:nth-child(1){grid-column:span 12;min-height:320px}
    .k-cc:nth-child(2),.k-cc:nth-child(3){grid-column:span 6}
    .k-cc:nth-child(4),.k-cc:nth-child(5),.k-cc:nth-child(6){grid-column:span 4}
  }
  .k-cc .cc-bg{
    position:absolute;inset:0;background-size:cover;background-position:center;
    transition:transform .7s cubic-bezier(.16,1,.3,1),filter .4s;
    filter:brightness(.45) saturate(.7);
  }
  .k-cc:hover .cc-bg{transform:scale(1.07);filter:brightness(.55) saturate(.85)}
  .k-cc .cc-ov{
    position:absolute;inset:0;
    background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.05) 60%);
    transition:background .4s;
  }
  .k-cc .cc-gold{
    position:absolute;bottom:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#c8a84b,transparent);
    transform:scaleX(0);transition:transform .4s ease;
  }
  .k-cc:hover .cc-gold{transform:scaleX(1)}
  .k-cc .cc-body{position:absolute;bottom:0;left:0;right:0;padding:22px;z-index:2}
  .cc-body .cc-lbl{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.35em;color:rgba(200,168,75,.65);text-transform:uppercase;margin-bottom:5px}
  .cc-body h3{font-family:'Bebas Neue',sans-serif!important;font-size:clamp(26px,4vw,52px)!important;letter-spacing:.07em!important;color:#fff!important;margin:0 0 8px!important;line-height:1!important;transition:color .3s!important}
  .k-cc:hover .cc-body h3{color:#e8d080!important}
  .cc-body .cc-cta{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.25em;color:rgba(240,237,232,.4);text-transform:uppercase;display:flex;align-items:center;gap:8px;transition:color .3s,gap .3s}
  .k-cc:hover .cc-cta{color:#c8a84b;gap:12px}
  .cc-cta::after{content:'\u2192'}
`;
document.head.appendChild(CP);

var catHTML = '<section id="k-categories">' +
  '<div class="cat-hdr"><h2>SHOP THE COLLECTION</h2><p>Explore the full drop</p></div>' +
  '<div class="k-cat-grid">' +
  '<a class="k-cc" href="men.html"><div class="cc-bg" style="background-image:url(\'imgs/jeans-gold-dragon.jpg\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Collection</div><h3>Men</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '<a class="k-cc" href="women.html"><div class="cc-bg" style="background-image:url(\'imgs/w-vintage-dragon.jpg\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Collection</div><h3>Women</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '<a class="k-cc" href="jeans.html"><div class="cc-bg" style="background-image:url(\'imgs/jeans-dual-dragon.jpg\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Category</div><h3>Jeans</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '<a class="k-cc" href="t-shirts.html"><div class="cc-bg" style="background-image:url(\'imgs/img-angel.png\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Category</div><h3>T-Shirts</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '<a class="k-cc" href="track-pants.html"><div class="cc-bg" style="background-image:url(\'imgs/jeans-grey-cargo.jpg\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Category</div><h3>Track Pants</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '<a class="k-cc" href="jeans.html"><div class="cc-bg" style="background-image:url(\'imgs/anime-gojo.jpg\')"></div><div class="cc-ov"></div><div class="cc-gold"></div><div class="cc-body"><div class="cc-lbl">Category</div><h3>Anime</h3><div class="cc-cta">Shop Now</div></div></a>' +
  '</div></section>';

// ═══════════════════════════════════════════════════
// § 7  VIDEO / MOTION SECTION
// ═══════════════════════════════════════════════════
var VS = document.createElement('style');
VS.textContent = `
  #k-video-section{
    position:relative;width:100%;height:68vh;min-height:380px;
    overflow:hidden;display:flex;align-items:center;justify-content:center;
    background:#000;
  }
  .v-placeholder{
    position:absolute;inset:0;
    background:radial-gradient(ellipse at 25% 55%,rgba(40,22,4,.85),transparent 50%),
               radial-gradient(ellipse at 75% 45%,rgba(15,6,0,.8),transparent 50%),
               linear-gradient(180deg,#000 0%,#080502 50%,#000 100%);
    overflow:hidden;
  }
  .v-smoke{position:absolute;border-radius:50%;filter:blur(70px);mix-blend-mode:screen}
  .v-s1{width:620px;height:420px;background:radial-gradient(ellipse,rgba(60,34,8,.55),transparent 70%);top:5%;left:-8%;animation:k-slow-drift 9s ease-in-out infinite}
  .v-s2{width:520px;height:360px;background:radial-gradient(ellipse,rgba(40,20,4,.45),transparent 70%);top:15%;right:-4%;animation:k-slow-drift 11s ease-in-out -3s infinite}
  .v-s3{width:420px;height:300px;background:radial-gradient(ellipse,rgba(80,50,12,.25),transparent 70%);bottom:0;left:28%;animation:k-slow-drift 13s ease-in-out -6s infinite}
  /* real video goes here */
  #k-video-section video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55}
  .v-overlay{
    position:absolute;inset:0;
    background:linear-gradient(to bottom,rgba(0,0,0,.45) 0%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.55) 100%);
    z-index:2;
  }
  .v-scan{
    position:absolute;width:100%;height:2px;
    background:linear-gradient(90deg,transparent,rgba(200,168,75,.12),transparent);
    animation:k-scan 7s linear infinite;z-index:3;pointer-events:none;
  }
  .v-content{position:relative;z-index:4;text-align:center;padding:0 24px}
  .v-eyebrow{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.4em;color:rgba(200,168,75,.55);text-transform:uppercase;margin-bottom:18px}
  .v-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(52px,12vw,120px);letter-spacing:.05em;
    color:rgba(255,255,255,.9);line-height:.95;
    animation:k-flicker 9s ease infinite;
    text-shadow:0 0 70px rgba(200,168,75,.18);
  }
  .v-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.35em;color:rgba(200,168,75,.4);text-transform:uppercase;margin-top:18px}
`;
document.head.appendChild(VS);

var videoHTML = '<section id="k-video-section">' +
  '<div class="v-placeholder"><div class="v-smoke v-s1"></div><div class="v-smoke v-s2"></div><div class="v-smoke v-s3"></div></div>' +
  '<!-- To add real video: replace v-placeholder with <video autoplay muted loop playsinline src="your-video.mp4"></video> -->' +
  '<div class="v-overlay"></div><div class="v-scan"></div>' +
  '<div class="v-content">' +
    '<div class="v-eyebrow">\u2014 Drop 001 \u2014</div>' +
    '<div class="v-title">ENTER<br>THE SYSTEM</div>' +
    '<div class="v-sub">Campaign film coming soon</div>' +
  '</div></section>';

// ═══════════════════════════════════════════════════
// §  INJECT ALL HOMEPAGE SECTIONS (after hero)
// ═══════════════════════════════════════════════════
var heroEl = document.getElementById('kryptaa-hero-v2');
if (heroEl) {
  heroEl.insertAdjacentHTML('afterend',
    videoHTML +
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Collection \u2736</span></div>' +
    catHTML +
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Identity \u2736</span></div>' +
    brandHTML
  );
}

// ═══════════════════════════════════════════════════
// § 8  SIZE GUIDE SECTION
// ═══════════════════════════════════════════════════
var sgCSS = document.createElement('style');
sgCSS.textContent = `
  #k-size-guide{background:#060608;padding:80px 48px;text-align:center}
  #k-size-guide h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5vw,52px);letter-spacing:.1em;color:#fff;margin-bottom:8px}
  #k-size-guide .sg-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.25em;color:#555560;text-transform:uppercase;margin-bottom:40px}
  .sg-table{width:100%;max-width:700px;margin:0 auto;border-collapse:collapse}
  .sg-table th{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center}
  .sg-table td{font-family:'Space Mono',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center;letter-spacing:.05em}
  .sg-table tr:hover td{color:#f0ede8;background:#0a0a0d}
`;
document.head.appendChild(sgCSS);

var sgHTML = '<section id="k-size-guide">' +
  '<div class="k-eyebrow">Sizing</div>' +
  '<h2>SIZE GUIDE</h2>' +
  '<p class="sg-sub">Measure twice. Order once.</p>' +
  '<table class="sg-table"><thead><tr><th>SIZE</th><th>WAIST (in)</th><th>HIP (in)</th><th>INSEAM (in)</th></tr></thead>' +
  '<tbody>' +
  '<tr><td>28</td><td>28"</td><td>36"</td><td>30"</td></tr>' +
  '<tr><td>30</td><td>30"</td><td>38"</td><td>30"</td></tr>' +
  '<tr><td>32</td><td>32"</td><td>40"</td><td>31"</td></tr>' +
  '<tr><td>34</td><td>34"</td><td>42"</td><td>31"</td></tr>' +
  '<tr><td>36</td><td>36"</td><td>44"</td><td>32"</td></tr>' +
  '</tbody></table>' +
  '</section>';

// Inject size guide before footer
var footer = document.querySelector('footer');
if (footer) {
  footer.insertAdjacentHTML('beforebegin', '<div class="k-divider"><span class="k-divider-txt">\u2736 Size Guide \u2736</span></div>' + sgHTML);
} else {
  document.body.insertAdjacentHTML('beforeend', sgHTML);
}

// ═══════════════════════════════════════════════════
// § 9  MOBILE MENU (full rebuild)
// ═══════════════════════════════════════════════════
var mm = document.getElementById('mobileMenu');
var ham = document.getElementById('hamburgerBtn');
if (mm && ham) {
  var strip = document.querySelector('.nav-cat-strip');
  if (strip) strip.remove();
  mm.innerHTML =
    '<a href="men.html">\uD83D\uDC56 MEN</a>' +
    '<a href="women.html">\uD83D\uDC57 WOMEN</a>' +
    '<a href="jeans.html">\uD83D\uDD25 JEANS</a>' +
    '<a href="t-shirts.html">\uD83D\uDC55 T-SHIRTS</a>' +
    '<a href="track-pants.html">\u26A1 TRACK PANTS</a>' +
    '<a href="#k-size-guide">\uD83D\uDCCF SIZE GUIDE</a>';
  ham.onclick = null;
  ham.addEventListener('click', function(e){ e.stopPropagation(); mm.style.display = mm.style.display==='block'?'none':'block'; });
  document.addEventListener('click', function(e){ if(!ham.contains(e.target)&&!mm.contains(e.target)) mm.style.display='none'; });
  mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.style.display='none'; }); });
}

// ═══════════════════════════════════════════════════
// § 10  CART PERSISTENCE (unchanged)
// ═══════════════════════════════════════════════════
var _sync=window.syncCart;
window.syncCart=function(){if(_sync)_sync.apply(this,arguments);if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));};
var _add=window.addCart;
window.addCart=function(){var r=_add?_add.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var _addById=window.addCartById;
window.addCartById=function(){var r=_addById?_addById.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var saved=[];
try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
if(saved.length>0){
  var att=0,ri=setInterval(function(){
    if(++att>30){clearInterval(ri);return;}
    if(window.cart!==undefined&&typeof window.syncCart==='function'){
      if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}
      clearInterval(ri);
    }
  },100);
}
window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

// ═══════════════════════════════════════════════════
// § 11  EXISTING FIXES
// ═══════════════════════════════════════════════════
var s=document.querySelector('#womensSlider');
if(s)Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var chkBtn=document.querySelector('.cart-checkout');
if(chkBtn)chkBtn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});
document.querySelectorAll('.card,[class*=card]').forEach(function(card){var pid=card.dataset&&(card.dataset.pid||card.dataset.id);if(pid&&pm[parseInt(pid)]!==undefined){var el=card.querySelector('[class*=price],[class*=Price]');if(el)el.textContent='$'+pm[parseInt(pid)];}});

}); // end DOMContentLoaded
