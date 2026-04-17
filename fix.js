document.addEventListener('DOMContentLoaded', function () {

// ═══════════════════════════════════════════════════
// § 1  GLOBAL DESIGN SYSTEM + SECTION CLEANUP
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
  @keyframes k-glow-pulse{ 0%,100%{opacity:.45;filter:blur(65px)} 50%{opacity:.88;filter:blur(88px)} }
  @keyframes k-slow-drift{ 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.025)} }
  @keyframes k-scan      { from{top:-2px} to{top:100%} }
  @keyframes k-flicker   { 0%,96%,100%{opacity:1} 97%{opacity:.8} 98%{opacity:1} 99%{opacity:.85} }
  @keyframes k-tag-in    { from{opacity:0;letter-spacing:.5em} to{opacity:1;letter-spacing:.22em} }
  @keyframes k-sub-in    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes k-btn-in    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  @keyframes k-corner-in { from{opacity:0} to{opacity:.5} }
  @keyframes k-smoke-a   { 0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:.5} 50%{transform:translateY(-20px) translateX(10px) scale(1.05);opacity:.7} }
  @keyframes k-smoke-b   { 0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:.4} 50%{transform:translateY(-14px) translateX(-8px) scale(1.03);opacity:.6} }
  @keyframes k-smoke-c   { 0%,100%{transform:translateY(0) scale(1);opacity:.3} 50%{transform:translateY(-10px) scale(1.04);opacity:.5} }

  *,*::before,*::after{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000!important;color:#f0ede8!important;font-family:'Barlow Condensed',sans-serif!important;-webkit-font-smoothing:antialiased}

  /* HIDE ALL OLD CONFLICTING NAV + SECTIONS */
  nav ul.nav-links, nav .nav-links, nav ol.nav-links { display:none!important }
  nav li.nav-cat > a { display:none!important }
  .nav-cat > a { display:none!important }
  .nav-cat .nav-dropdown { display:none!important }
  .nav-cat-strip { display:none!important }
  .how-section { display:none!important }
  .story-section { display:none!important }
  .archive-section { display:none!important }
  .newsletter { display:none!important }
  /* Hide old product grids from homepage - not needed, we have featured section */
  section.section { display:none!important }

  /* Shared eyebrow */
  .k-eyebrow{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;text-transform:uppercase;color:rgba(200,168,75,.6);display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:20px}
  .k-eyebrow::before,.k-eyebrow::after{content:'';width:36px;height:1px;background:rgba(200,168,75,.22)}

  /* Gothic divider */
  .k-divider{display:flex;align-items:center;gap:16px;padding:20px 48px;background:#000}
  .k-divider::before,.k-divider::after{content:'';flex:1;max-width:260px;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.18),transparent)}
  .k-divider-txt{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.4em;color:rgba(200,168,75,.28);text-transform:uppercase}

  /* Product card global */
  .card,[class*="card"]{background:#0a0a0d!important;border:1px solid #1e1e26!important;transition:transform .3s ease,box-shadow .3s ease,border-color .3s!important;overflow:hidden!important}
  [class*="price"],[class*="Price"]{font-family:'Space Mono',monospace!important;color:#e8d080!important}
`;
document.head.appendChild(G);

// ═══════════════════════════════════════════════════
// § 2  NAV
// ═══════════════════════════════════════════════════
var NAV = document.createElement('style');
NAV.textContent = `
  nav{
    position:fixed!important;top:0;left:0;right:0;
    height:66px!important;
    background:rgba(6,6,8,.97)!important;
    backdrop-filter:blur(16px)!important;
    -webkit-backdrop-filter:blur(16px)!important;
    border-bottom:1px solid rgba(200,168,75,.1)!important;
    display:flex!important;align-items:center!important;
    justify-content:space-between!important;
    padding:0 40px!important;
    z-index:450!important;
  }
  .nav-logo-img, nav a img, nav img { height:44px!important;width:auto!important;object-fit:contain!important;filter:drop-shadow(0 0 12px rgba(200,168,75,.2))!important; }
  .k-nav-center{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:32px;}
  .k-nav-center > a{font-family:'Bebas Neue',sans-serif!important;font-size:13px!important;letter-spacing:.12em!important;color:rgba(240,237,232,.6)!important;text-decoration:none!important;text-transform:uppercase!important;transition:color .2s!important;white-space:nowrap!important;padding:4px 0!important;}
  .k-nav-center > a:hover{color:#e8d080!important}
  .k-nav-dd{position:relative}
  .k-nav-dd-label{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;color:rgba(240,237,232,.6);cursor:pointer;text-transform:uppercase;user-select:none;transition:color .2s;padding:4px 0;}
  .k-nav-dd:hover .k-nav-dd-label,.k-nav-dd.open .k-nav-dd-label{color:#e8d080}
  .k-nav-dd-menu{display:none;position:absolute;top:calc(100% + 18px);left:50%;transform:translateX(-50%);background:#0a0a0d;border:1px solid #1e1e26;border-top:1px solid rgba(200,168,75,.3);min-width:190px;padding:6px 0;z-index:700;}
  .k-nav-dd.open .k-nav-dd-menu{display:block!important}
  .k-nav-dd-menu a{display:block!important;padding:11px 20px!important;font-family:'Space Mono',monospace!important;font-size:8px!important;letter-spacing:.18em!important;text-transform:uppercase!important;color:#555560!important;text-decoration:none!important;border-bottom:1px solid #1a1a22!important;transition:color .15s,background .15s!important;}
  .k-nav-dd-menu a:last-child{border-bottom:none!important}
  .k-nav-dd-menu a:hover{color:#e8d080!important;background:#111116!important}
  @media(min-width:901px){body{padding-top:66px!important}#hamburgerBtn{display:none!important}#mobileMenu{display:none!important}}
  @media(max-width:900px){.k-nav-center{display:none!important}body{padding-top:66px!important}}
  #mobileMenu{display:none;position:fixed!important;top:66px;left:0;right:0;background:#060608!important;z-index:500!important;padding:8px 0!important;border-bottom:1px solid rgba(200,168,75,.12);max-height:calc(100vh - 66px);overflow-y:auto;}
  #mobileMenu a{display:flex!important;align-items:center!important;gap:14px!important;padding:15px 24px!important;font-family:'Bebas Neue',sans-serif!important;font-size:20px!important;letter-spacing:.1em!important;color:#f0ede8!important;text-decoration:none!important;border-bottom:1px solid #1a1a22!important;transition:color .2s,background .2s!important;}
  #mobileMenu a:hover{color:#e8d080!important;background:#0a0a0d!important}
`;
document.head.appendChild(NAV);

var nav = document.querySelector('nav');
if (nav && !document.querySelector('.k-nav-center')) {
  var cn = document.createElement('div');
  cn.className = 'k-nav-center';
  cn.innerHTML = `
    <div class="k-nav-dd" id="k-shop-dd">
      <span class="k-nav-dd-label">SHOP ▾</span>
      <div class="k-nav-dd-menu">
        <a href="men.html">Men's Collection</a>
        <a href="women.html">Women's Collection</a>
        <a href="t-shirts.html">T-Shirts</a>
        <a href="track-pants.html">Track Pants</a>
      </div>
    </div>
    <a href="men.html">MEN</a>
    <a href="women.html">WOMEN</a>
    <a href="t-shirts.html">T-SHIRTS</a>
    <a href="track-pants.html">TRACK PANTS</a>
    <a href="#k-size-guide">SIZE GUIDE</a>
  `;
  nav.appendChild(cn);
  var shopDd = document.getElementById('k-shop-dd');
  if (shopDd) {
    shopDd.querySelector('.k-nav-dd-label').addEventListener('click', function(e){ e.stopPropagation(); shopDd.classList.toggle('open'); });
    document.addEventListener('click', function(e){ if(!shopDd.contains(e.target)) shopDd.classList.remove('open'); });
  }
}

// ═══════════════════════════════════════════════════
// § 3  LOGO REPLACEMENTS
// ═══════════════════════════════════════════════════
(function(){
  var sels=['.nav-logo img','.nav-logo','.logo img','.logo','nav a img','nav .brand img','nav .brand'];
  var el=null;
  for(var i=0;i<sels.length;i++){var e=document.querySelector(sels[i]);if(e){el=e;break;}}
  if(el){
    if(el.tagName==='IMG'){el.src='imgs/kryptaa-logo-gold.png';el.alt='KRYPTAA';el.style.cssText='height:44px;width:auto;object-fit:contain;filter:drop-shadow(0 0 12px rgba(200,168,75,.2));';}
    else{var img=document.createElement('img');img.src='imgs/kryptaa-logo-gold.png';img.alt='KRYPTAA';img.style.cssText='height:44px;width:auto;object-fit:contain;display:block;filter:drop-shadow(0 0 12px rgba(200,168,75,.2));';el.innerHTML='';el.appendChild(img);}
  }
  var fi=document.querySelector('footer img[alt="KRYPTAA"]')||document.querySelector('footer img');
  if(fi){fi.src='imgs/kryptaa-logo-gold.png';fi.alt='KRYPTAA';fi.style.cssText='height:50px;width:auto;object-fit:contain;display:block;margin:0 auto;';}
})();

// ═══════════════════════════════════════════════════
// § 4  HERO
// ═══════════════════════════════════════════════════
var HS = document.createElement('style');
HS.textContent = `
  #kryptaa-hero-v2{position:relative;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#000;overflow:hidden;margin-bottom:0!important;}
  #kryptaa-hero-v2::before{content:'';position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");background-size:200px 200px;opacity:.5;pointer-events:none;z-index:0;}
  #kryptaa-hero-v2::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,.75) 100%);pointer-events:none;z-index:1;}
  .hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-52%);width:680px;height:340px;background:radial-gradient(ellipse at center,rgba(200,168,75,.65) 0%,rgba(120,80,15,.3) 40%,transparent 70%);animation:k-glow-pulse 5s ease-in-out infinite;z-index:2;pointer-events:none;}
  .hero-corner{position:absolute;width:80px;height:80px;z-index:3;animation:k-corner-in 2.2s ease 1s forwards;opacity:0;}
  .hero-corner--tl{top:44px;left:44px}.hero-corner--tr{top:44px;right:44px;transform:scaleX(-1)}.hero-corner--bl{bottom:44px;left:44px;transform:scaleY(-1)}.hero-corner--br{bottom:44px;right:44px;transform:scale(-1)}
  .hero-hline{position:absolute;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.22),transparent);z-index:3;animation:k-corner-in 2s ease 1.2s forwards;opacity:0;}
  .hero-hline--top{top:17%}.hero-hline--bot{bottom:17%}
  #kryptaa-hero-v2 .hero-inner{position:relative;z-index:4;display:flex;flex-direction:column;align-items:center;text-align:center;padding:40px 24px;max-width:700px;}
  .hero-logo{width:min(540px,80vw);height:auto;animation:k-fade-up 1.4s cubic-bezier(.16,1,.3,1) forwards;opacity:0;margin-bottom:28px;filter:drop-shadow(0 0 44px rgba(200,168,75,.28));}
  .hero-tagline{font-family:'Bebas Neue',sans-serif;font-size:clamp(22px,5vw,44px);color:#e8d080;letter-spacing:.22em;text-transform:uppercase;animation:k-tag-in 1.2s cubic-bezier(.16,1,.3,1) .7s forwards;opacity:0;margin-bottom:12px;}
  .hero-subtitle{font-family:'Space Mono',monospace;font-size:clamp(9px,1.8vw,12px);color:#555560;letter-spacing:.2em;text-transform:uppercase;animation:k-sub-in 1s ease 1.1s forwards;opacity:0;margin-bottom:44px;}
  .hero-cta{display:inline-block;font-family:'Bebas Neue',sans-serif;font-size:clamp(14px,2.5vw,17px);letter-spacing:.22em;color:#000;background:#c8ff00;border:none;padding:15px 58px;cursor:pointer;text-decoration:none;text-transform:uppercase;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);animation:k-btn-in 1s ease 1.4s forwards;opacity:0;transition:background .2s,transform .15s,box-shadow .2s;}
  .hero-cta:hover{background:#fff!important;transform:scale(1.05)!important;box-shadow:0 0 32px rgba(200,255,0,.18)!important}
  .hero-scroll{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;animation:k-sub-in 1s ease 2s forwards;opacity:0;}
  .hero-scroll span{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.3em;color:#3a3a44;text-transform:uppercase}
  .hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(200,168,75,.4),transparent);animation:k-slow-drift 2.5s ease-in-out infinite}
`;
document.head.appendChild(HS);

var cornerSVG='<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L4 34M4 4L34 4" stroke="rgba(200,168,75,0.55)" stroke-width="1"/><path d="M4 4L20 20" stroke="rgba(200,168,75,0.18)" stroke-width="0.5"/><circle cx="4" cy="4" r="2.5" fill="rgba(200,168,75,0.45)"/></svg>';
var heroHTML='<div id="kryptaa-hero-v2"><div class="hero-glow"></div><div class="hero-corner hero-corner--tl">'+cornerSVG+'</div><div class="hero-corner hero-corner--tr">'+cornerSVG+'</div><div class="hero-corner hero-corner--bl">'+cornerSVG+'</div><div class="hero-corner hero-corner--br">'+cornerSVG+'</div><div class="hero-hline hero-hline--top"></div><div class="hero-hline hero-hline--bot"></div><div class="hero-inner"><img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/><div class="hero-tagline">Defined By Power</div><div class="hero-subtitle">Gothic &amp; Streetwear Collection \u2014 Since \u201926</div><a class="hero-cta" href="#k-categories">Shop The Drop</a></div><div class="hero-scroll"><span>Scroll</span><div class="hero-scroll-line"></div></div></div>';
var heroSels=['.hero-section','#hero','.hero','[class*="hero"]','section.banner','.banner-section','#banner','main > section:first-child'];
var oldHero=null;for(var i=0;i<heroSels.length;i++){var e=document.querySelector(heroSels[i]);if(e&&e.offsetHeight>40){oldHero=e;break;}}
if(oldHero){oldHero.outerHTML=heroHTML;}
else{var ne=document.querySelector('nav')||document.querySelector('header');if(ne&&ne.parentNode){var t=document.createElement('div');t.innerHTML=heroHTML;ne.parentNode.insertBefore(t.firstElementChild,ne.nextSibling);}else document.body.insertAdjacentHTML('afterbegin',heroHTML);}

// ═══════════════════════════════════════════════════
// § 5  VIDEO SECTION
// ═══════════════════════════════════════════════════
var VS=document.createElement('style');
VS.textContent=`
  #k-video-section{position:relative;width:100%;height:65vh;min-height:360px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#000;margin:0!important;}
  .v-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 60%,rgba(45,25,5,.9) 0%,transparent 55%),radial-gradient(ellipse at 80% 40%,rgba(20,8,0,.85) 0%,transparent 55%),linear-gradient(180deg,#000 0%,#060300 40%,#000 100%);}
  .v-smoke-1{position:absolute;width:700px;height:500px;border-radius:50%;filter:blur(80px);mix-blend-mode:screen;background:radial-gradient(ellipse,rgba(55,32,8,.6) 0%,transparent 70%);top:-10%;left:-8%;animation:k-smoke-a 10s ease-in-out infinite;pointer-events:none}
  .v-smoke-2{position:absolute;width:580px;height:420px;border-radius:50%;filter:blur(70px);mix-blend-mode:screen;background:radial-gradient(ellipse,rgba(40,22,4,.5) 0%,transparent 70%);top:10%;right:-5%;animation:k-smoke-b 13s ease-in-out infinite -3s;pointer-events:none}
  .v-smoke-3{position:absolute;width:460px;height:360px;border-radius:50%;filter:blur(60px);mix-blend-mode:screen;background:radial-gradient(ellipse,rgba(70,40,8,.35) 0%,transparent 70%);bottom:-5%;left:25%;animation:k-smoke-c 16s ease-in-out infinite -7s;pointer-events:none}
  #k-video-section video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.55;z-index:1}
  .v-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.5) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.55) 100%);z-index:2;}
  .v-scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.15),transparent);animation:k-scan 8s linear infinite;z-index:3;pointer-events:none;}
  .v-content{position:relative;z-index:4;text-align:center;padding:0 24px;}
  .v-eyebrow{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.45em;color:rgba(200,168,75,.5);text-transform:uppercase;margin-bottom:20px}
  .v-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(54px,12vw,128px);letter-spacing:.04em;color:rgba(255,255,255,.92);line-height:.92;animation:k-flicker 10s ease infinite;text-shadow:0 0 80px rgba(200,168,75,.15);}
  .v-divider-line{width:40px;height:1px;background:rgba(200,168,75,.35);margin:20px auto}
  .v-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.35em;color:rgba(200,168,75,.4);text-transform:uppercase}
`;
document.head.appendChild(VS);
var videoHTML='<section id="k-video-section"><video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1" src="imgs/Background.mp4"></video><div class="v-overlay"></div><div class="v-scan-line"></div><div class="v-content"><div class="v-eyebrow">\u2014 Drop 001 \u2014</div><div class="v-title">ENTER<br>THE SYSTEM</div><div class="v-divider-line"></div><div class="v-sub">Kryptaa \u2014 SS26</div></div></section>';

// ═══════════════════════════════════════════════════
// § 6  CATEGORY GRID — 4 cards
// ═══════════════════════════════════════════════════
var CP=document.createElement('style');
CP.textContent=`
  #k-categories{background:#000;padding:72px 32px}
  #k-categories .cat-hdr{text-align:center;margin-bottom:44px}
  #k-categories .cat-hdr h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5.5vw,56px);letter-spacing:.1em;color:#fff;margin:0 0 8px}
  #k-categories .cat-hdr p{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.28em;color:#555560;text-transform:uppercase}
  .k-cat-grid{display:grid;grid-template-columns:7fr 5fr;grid-template-rows:auto auto;gap:10px;max-width:1260px;margin:0 auto;}
  .k-cc:nth-child(1){grid-row:1/3;min-height:580px}
  .k-cc:nth-child(2){min-height:284px}
  .k-cc:nth-child(3){min-height:284px}
  .k-cc:nth-child(4){grid-column:1/3;min-height:200px}
  @media(max-width:768px){.k-cat-grid{grid-template-columns:1fr 1fr;grid-template-rows:auto}.k-cc:nth-child(1){grid-row:auto;grid-column:span 2;min-height:240px}.k-cc:nth-child(2){grid-column:span 1;min-height:200px}.k-cc:nth-child(3){grid-column:span 1;min-height:200px}.k-cc:nth-child(4){grid-column:span 2;min-height:180px}}
  @media(max-width:480px){.k-cat-grid{grid-template-columns:1fr}.k-cc:nth-child(n){grid-column:span 1!important;min-height:200px!important}}
  .k-cc{position:relative;overflow:hidden;cursor:pointer;text-decoration:none;display:block;background:#0a0a0d;border:1px solid #1e1e26;transition:border-color .4s;}
  .k-cc:hover{border-color:rgba(200,168,75,.3)}
  .k-cc .cc-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:transform .7s cubic-bezier(.16,1,.3,1),filter .4s;filter:brightness(.38) saturate(.65);}
  .k-cc:hover .cc-bg{transform:scale(1.06);filter:brightness(.5) saturate(.8)}
  .k-cc .cc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.05) 65%);}
  .k-cc .cc-line{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(200,168,75,.7),transparent);transform:scaleX(0);transform-origin:center;transition:transform .45s cubic-bezier(.16,1,.3,1);}
  .k-cc:hover .cc-line{transform:scaleX(1)}
  .k-cc .cc-body{position:absolute;bottom:0;left:0;right:0;padding:24px 28px;z-index:2}
  .cc-body .cc-lbl{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.35em;color:rgba(200,168,75,.65);text-transform:uppercase;margin-bottom:6px}
  .cc-body h3{font-family:'Bebas Neue',sans-serif!important;font-size:clamp(30px,4.5vw,58px)!important;letter-spacing:.06em!important;color:#fff!important;margin:0 0 10px!important;line-height:.95!important;transition:color .3s,transform .3s!important}
  .k-cc:hover .cc-body h3{color:#e8d080!important;transform:translateY(-2px)!important}
  .cc-body .cc-cta{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.25em;color:rgba(240,237,232,.35);text-transform:uppercase;display:inline-flex;align-items:center;gap:8px;transition:color .3s,gap .35s;}
  .k-cc:hover .cc-cta{color:rgba(200,168,75,.8);gap:13px}
  .cc-cta::after{content:'\u2192';transition:transform .3s}
  .k-cc:hover .cc-cta::after{transform:translateX(3px)}
`;
document.head.appendChild(CP);
var catHTML='<section id="k-categories"><div class="cat-hdr"><div class="k-eyebrow">The Collection</div><h2>SHOP THE DROP</h2><p>Select your entry point</p></div><div class="k-cat-grid"><a class="k-cc" href="men.html"><div class="cc-bg" style="background-image:url(\'imgs/jeans-gold-dragon.jpg\')"></div><div class="cc-ov"></div><div class="cc-line"></div><div class="cc-body"><div class="cc-lbl">Collection</div><h3>Men</h3><div class="cc-cta">Shop Now</div></div></a><a class="k-cc" href="women.html"><div class="cc-bg" style="background-image:url(\'imgs/w-vintage-dragon.jpg\')"></div><div class="cc-ov"></div><div class="cc-line"></div><div class="cc-body"><div class="cc-lbl">Collection</div><h3>Women</h3><div class="cc-cta">Shop Now</div></div></a><a class="k-cc" href="t-shirts.html"><div class="cc-bg" style="background-image:url(\'imgs/img-glorious.png\')"></div><div class="cc-ov"></div><div class="cc-line"></div><div class="cc-body"><div class="cc-lbl">Category</div><h3>T-Shirts</h3><div class="cc-cta">Shop Now</div></div></a><a class="k-cc" href="track-pants.html"><div class="cc-bg" style="background-image:url(\'imgs/jeans-grey-cargo.jpg\')"></div><div class="cc-ov"></div><div class="cc-line"></div><div class="cc-body"><div class="cc-lbl">Coming Drop 002</div><h3>Track Pants</h3><div class="cc-cta">Preview</div></div></a></div></section>';

// ═══════════════════════════════════════════════════
// § 7  FEATURED PIECES — links to product.html
// ═══════════════════════════════════════════════════
var FP=document.createElement('style');
FP.textContent=`
  #k-featured{background:#060608;padding:80px 32px}
  #k-featured .fp-header{text-align:center;margin-bottom:48px}
  #k-featured .fp-header h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5.5vw,56px);letter-spacing:.1em;color:#fff;margin:0 0 8px}
  #k-featured .fp-header p{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.28em;color:#555560;text-transform:uppercase}
  .k-fp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1260px;margin:0 auto 48px;}
  @media(max-width:900px){.k-fp-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:480px){.k-fp-grid{gap:10px}}
  .k-fp-card{display:block;text-decoration:none;background:#0a0a0d;border:1px solid #1e1e26;overflow:hidden;cursor:pointer;transition:transform .35s ease,box-shadow .35s ease,border-color .35s;}
  .k-fp-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(0,0,0,.6),0 0 24px rgba(200,168,75,.08);border-color:rgba(200,168,75,.22)}
  .k-fp-img{position:relative;overflow:hidden;padding-top:125%}
  .k-fp-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .6s ease}
  .k-fp-card:hover .k-fp-img img{transform:scale(1.08)}
  .k-fp-tag{position:absolute;top:10px;left:10px;background:#c8ff00;color:#000;font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.18em;padding:4px 9px;text-transform:uppercase;z-index:2}
  .k-fp-info{padding:16px 16px 18px}
  .k-fp-name{font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:.08em;color:#f0ede8;margin-bottom:4px;transition:color .2s}
  .k-fp-card:hover .k-fp-name{color:#e8d080}
  .k-fp-price{font-family:'Space Mono',monospace;font-size:11px;color:#e8d080;margin-bottom:12px}
  .k-fp-btn{display:block;width:100%;text-align:center;background:transparent;border:1px solid rgba(200,255,0,.35);color:#c8ff00;font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:.2em;padding:9px;text-transform:uppercase;text-decoration:none;transition:background .2s,color .2s;}
  .k-fp-btn:hover{background:#c8ff00;color:#000}
  .fp-view-all{display:block;width:fit-content;margin:0 auto;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:.2em;color:rgba(240,237,232,.5);text-decoration:none;text-transform:uppercase;border:1px solid rgba(240,237,232,.15);padding:12px 40px;transition:color .2s,border-color .2s;}
  .fp-view-all:hover{color:#e8d080;border-color:rgba(200,168,75,.4)}
`;
document.head.appendChild(FP);
var featuredHTML='<section id="k-featured"><div class="fp-header"><div class="k-eyebrow">Selected Pieces</div><h2>DROP 001</h2><p>Curated from the collection</p></div><div class="k-fp-grid"><a class="k-fp-card" href="product.html?id=102"><div class="k-fp-img"><div class="k-fp-tag">SIGNATURE</div><img src="imgs/jeans-dual-dragon.jpg" alt="Dual Dragon Denim" loading="lazy"></div><div class="k-fp-info"><div class="k-fp-name">Dual Dragon Denim</div><div class="k-fp-price">$98</div><div class="k-fp-btn">View Product</div></div></a><a class="k-fp-card" href="product.html?id=101"><div class="k-fp-img"><div class="k-fp-tag">DROP 001</div><img src="imgs/jeans-gold-dragon.jpg" alt="Gold Dragon Denim" loading="lazy"></div><div class="k-fp-info"><div class="k-fp-name">Gold Dragon Denim</div><div class="k-fp-price">$75</div><div class="k-fp-btn">View Product</div></div></a><a class="k-fp-card" href="product.html?id=201"><div class="k-fp-img"><div class="k-fp-tag">FEATURED</div><img src="imgs/w-vintage-dragon.jpg" alt="Vintage Dragon" loading="lazy"></div><div class="k-fp-info"><div class="k-fp-name">Vintage Dragon</div><div class="k-fp-price">$70</div><div class="k-fp-btn">View Product</div></div></a><a class="k-fp-card" href="product.html?id=304"><div class="k-fp-img"><div class="k-fp-tag">NEW</div><img src="imgs/img-glorious.png" alt="Glorious Tee" loading="lazy"></div><div class="k-fp-info"><div class="k-fp-name">Glorious Tee</div><div class="k-fp-price">$35</div><div class="k-fp-btn">View Product</div></div></a></div><a class="fp-view-all" href="men.html">View Full Collection</a></section>';

// ═══════════════════════════════════════════════════
// § 8  BRAND MANIFESTO
// ═══════════════════════════════════════════════════
var BM=document.createElement('style');
BM.textContent=`
  #k-brand-story{background:#000;padding:100px 48px;text-align:center;position:relative;overflow:hidden}
  #k-brand-story::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(200,168,75,.035),transparent 65%);pointer-events:none}
  #k-brand-story .bs-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(38px,8vw,84px);letter-spacing:.07em;color:#fff;margin-bottom:36px;line-height:.92}
  #k-brand-story .bs-body{max-width:520px;margin:0 auto;font-family:'Barlow Condensed',sans-serif;font-size:clamp(17px,2.5vw,22px);font-weight:300;line-height:1.85;color:rgba(240,237,232,.55);letter-spacing:.04em}
  #k-brand-story .bs-body strong{color:#e8d080;font-weight:400}
  .bs-divider{width:1px;height:60px;background:linear-gradient(to bottom,transparent,rgba(200,168,75,.4),transparent);margin:36px auto}
  #k-brand-story .bs-cta{display:inline-block;margin-top:8px;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.35em;color:rgba(200,168,75,.55);text-transform:uppercase;text-decoration:none;border-bottom:1px solid rgba(200,168,75,.2);padding-bottom:4px;transition:color .2s,border-color .2s;}
  #k-brand-story .bs-cta:hover{color:#e8d080;border-color:rgba(200,168,75,.5)}
`;
document.head.appendChild(BM);
var brandHTML='<section id="k-brand-story"><div class="k-eyebrow">Identity</div><h2 class="bs-title">THE WORLD<br>OF KRYPTAA</h2><p class="bs-body">Kryptaa is not fashion.<br>It is <strong>energy</strong>. It is <strong>presence</strong>.<br>Built for those who move different.<br><br><strong>Dark. Precise. Unapologetic.</strong></p><div class="bs-divider"></div><a class="bs-cta" href="men.html">Explore the Collection</a></section>';

// ═══════════════════════════════════════════════════
// INJECT ALL SECTIONS
// ═══════════════════════════════════════════════════
var heroEl=document.getElementById('kryptaa-hero-v2');
if(heroEl){
  heroEl.insertAdjacentHTML('afterend',
    videoHTML+
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Collection \u2736</span></div>'+
    catHTML+
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Selected \u2736</span></div>'+
    featuredHTML+
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Identity \u2736</span></div>'+
    brandHTML
  );
}

// Size guide
var sgHTML='<section id="k-size-guide" style="background:#060608;padding:80px 48px;text-align:center"><div class="k-eyebrow">Sizing</div><h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:clamp(28px,5vw,52px);letter-spacing:.1em;color:#fff;margin-bottom:8px">SIZE GUIDE</h2><p style="font-family:\'Space Mono\',monospace;font-size:8px;letter-spacing:.25em;color:#555560;text-transform:uppercase;margin-bottom:40px">Measure twice. Order once.</p><table style="width:100%;max-width:680px;margin:0 auto;border-collapse:collapse"><thead><tr><th style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center">SIZE</th><th style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center">WAIST</th><th style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center">HIP</th><th style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center">INSEAM</th></tr></thead><tbody><tr><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">28</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">28"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">36"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">30"</td></tr><tr><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">30</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">30"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">38"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">30"</td></tr><tr><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">32</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">32"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">40"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">31"</td></tr><tr><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">34</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">34"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">42"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center">31"</td></tr><tr><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;text-align:center">36</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;text-align:center">36"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;text-align:center">44"</td><td style="font-family:\'Space Mono\',monospace;font-size:9px;color:#555560;padding:10px 16px;text-align:center">32"</td></tr></tbody></table></section>';
var footer=document.querySelector('footer');
if(footer){footer.insertAdjacentHTML('beforebegin',sgHTML);}

// ═══════════════════════════════════════════════════
// § 9  HIDE OLD SECTIONS
// ═══════════════════════════════════════════════════
setTimeout(function(){
  ['.how-section','.story-section','.archive-section','.newsletter','#newsletter','section.section'].forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){el.style.display='none';});
  });
},50);

// ═══════════════════════════════════════════════════
// § 10  MOBILE MENU
// ═══════════════════════════════════════════════════
var mm=document.getElementById('mobileMenu');
var ham=document.getElementById('hamburgerBtn');
if(mm&&ham){
  var strip=document.querySelector('.nav-cat-strip');if(strip)strip.remove();
  mm.innerHTML='<a href="index.html">\uD83C\uDFE0 HOME</a><a href="men.html">\uD83D\uDC56 MEN</a><a href="women.html">\uD83D\uDC57 WOMEN</a><a href="t-shirts.html">\uD83D\uDC55 T-SHIRTS</a><a href="track-pants.html">\u26A1 TRACK PANTS</a><a href="#k-size-guide">\uD83D\uDCCF SIZE GUIDE</a>';
  ham.onclick=null;
  ham.addEventListener('click',function(e){e.stopPropagation();mm.style.display=mm.style.display==='block'?'none':'block';});
  document.addEventListener('click',function(e){if(!ham.contains(e.target)&&!mm.contains(e.target))mm.style.display='none';});
  mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mm.style.display='none';});});
}

// ═══════════════════════════════════════════════════
// § 11  CART PERSISTENCE
// ═══════════════════════════════════════════════════
var _sync=window.syncCart;window.syncCart=function(){if(_sync)_sync.apply(this,arguments);if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));};
var _add=window.addCart;window.addCart=function(){var r=_add?_add.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var _addById=window.addCartById;window.addCartById=function(){var r=_addById?_addById.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var saved=[];try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
if(saved.length>0){var att=0,ri=setInterval(function(){if(++att>30){clearInterval(ri);return;}if(window.cart!==undefined&&typeof window.syncCart==='function'){if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}clearInterval(ri);}},100);}
window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

// ═══════════════════════════════════════════════════
// § 12  EXISTING FIXES
// ═══════════════════════════════════════════════════
var s=document.querySelector('#womensSlider');
if(s)Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var chkBtn=document.querySelector('.cart-checkout');
if(chkBtn)chkBtn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});

}); // end DOMContentLoaded
