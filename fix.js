/* ═══════════════════════════════════════════════
   KRYPTAA fix.js — V2 Complete
   Layered scroll · Video categories · Product UX
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

// ─────────────────────────────────────────────────
// § 0  SHARED VIDEO PATH
// ─────────────────────────────────────────────────
var BG_VIDEO = 'imgs/Background.mp4';

// ─────────────────────────────────────────────────
// § 1  GLOBAL CSS
// ─────────────────────────────────────────────────
var G = document.createElement('style');
G.textContent = `
  :root {
    --k-black:#000; --k-deep:#060608; --k-dark:#0a0a0d;
    --k-border:#1e1e26; --k-muted:#555560; --k-off:#f0ede8;
    --k-gold:#c8a84b; --k-gold-hi:#e8d080; --k-lime:#c8ff00;
  }

  /* ── Global resets ── */
  *,*::before,*::after{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#000!important;color:#f0ede8!important;
    font-family:'Barlow Condensed',sans-serif!important;
    -webkit-font-smoothing:antialiased;overflow-x:hidden}

  /* ── Hide old conflicting sections ── */
  nav ul.nav-links,nav .nav-links,nav li.nav-cat>a,.nav-cat>a,
  .nav-cat .nav-dropdown,.nav-cat-strip{display:none!important}
  .how-section,.story-section,.archive-section,.newsletter,
  #newsletter,section.section,.reviews-section,.policy-strip{display:none!important}

  /* ── Keyframes ── */
  @keyframes k-fade-up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
  @keyframes k-glow-pulse{0%,100%{opacity:.45;filter:blur(65px)}50%{opacity:.88;filter:blur(88px)}}
  @keyframes k-drift{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.025)}}
  @keyframes k-scan{from{top:-2px}to{top:100%}}
  @keyframes k-flicker{0%,96%,100%{opacity:1}97%{opacity:.8}98%{opacity:1}99%{opacity:.85}}
  @keyframes k-tag-in{from{opacity:0;letter-spacing:.5em}to{opacity:1;letter-spacing:.22em}}
  @keyframes k-sub-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  @keyframes k-btn-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
  @keyframes k-corner-in{from{opacity:0}to{opacity:.5}}

  /* ── Eyebrow ── */
  .k-eyebrow{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.4em;
    text-transform:uppercase;color:rgba(200,168,75,.6);
    display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:20px}
  .k-eyebrow::before,.k-eyebrow::after{content:'';width:36px;height:1px;
    background:rgba(200,168,75,.22)}

  /* ── Dividers ── */
  .k-divider{display:flex;align-items:center;gap:16px;padding:0 48px;background:#000;height:44px}
  .k-divider::before,.k-divider::after{content:'';flex:1;max-width:260px;height:1px;
    background:linear-gradient(90deg,transparent,rgba(200,168,75,.18),transparent)}
  .k-divider-txt{font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.4em;
    color:rgba(200,168,75,.28);text-transform:uppercase}

  /* ═══════════════════════════════════════════════
     §  LAYERED SCROLL PANELS
     ═══════════════════════════════════════════════ */
  .k-panel{
    position:relative;
    min-height:100vh;
    will-change:opacity,transform;
    transition:opacity .8s ease, transform .8s ease;
  }
  /* panel exits: fade + shrink */
  .k-panel.exiting{
    opacity:.25;
    transform:scale(.96);
  }
  /* panel enters: slide up from below */
  .k-panel.entering{
    opacity:0;
    transform:translateY(40px);
  }
  .k-panel.visible{
    opacity:1;
    transform:translateY(0) scale(1);
  }
`;
document.head.appendChild(G);
// ─── NAV LOGO HEIGHT OVERRIDE ───
(function(){
  var logoFix = document.createElement('style');
  logoFix.textContent = '.nav-logo{height:auto!important;display:flex!important;align-items:center!important;overflow:visible!important;} .nav-logo img,.nav-logo-img{height:88px!important;min-height:88px!important;width:auto!important;max-height:none!important;}';
  document.head.appendChild(logoFix);
})();


// ─────────────────────────────────────────────────
// § 2  NAV
// ─────────────────────────────────────────────────
var NAV = document.createElement('style');
NAV.textContent = `
  nav{
    position:fixed!important;top:0;left:0;right:0;
    height:100px!important;
    background:rgba(6,6,8,.97)!important;
    backdrop-filter:blur(16px)!important;
    border-bottom:1px solid rgba(200,168,75,.1)!important;
    display:flex!important;align-items:center!important;
    justify-content:space-between!important;
    padding:0 40px!important;z-index:1000!important;
  }
  nav img,.nav-logo-img{
    height:44px!important;width:auto!important;object-fit:contain!important;
    filter:drop-shadow(0 0 12px rgba(200,168,75,.2))!important;
  }
  .k-nav-center{
    position:absolute;left:50%;transform:translateX(-50%);
    display:flex;align-items:center;gap:32px;
  }
  .k-nav-center>a{
    font-family:'Bebas Neue',sans-serif!important;font-size:13px!important;
    letter-spacing:.12em!important;color:rgba(240,237,232,.6)!important;
    text-decoration:none!important;text-transform:uppercase!important;
    transition:color .2s!important;white-space:nowrap!important;
  }
  .k-nav-center>a:hover{color:#e8d080!important}
  .k-nav-dd{position:relative}
  .k-nav-dd-label{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.12em;
    color:rgba(240,237,232,.6);cursor:pointer;text-transform:uppercase;user-select:none;transition:color .2s}
  .k-nav-dd:hover .k-nav-dd-label,.k-nav-dd.open .k-nav-dd-label{color:#e8d080}
  .k-nav-dd-menu{display:none;position:absolute;top:calc(100% + 18px);left:50%;transform:translateX(-50%);
    background:#0a0a0d;border:1px solid #1e1e26;border-top:1px solid rgba(200,168,75,.3);
    min-width:190px;padding:6px 0;z-index:1100;}
  .k-nav-dd.open .k-nav-dd-menu{display:block!important}
  .k-nav-dd-menu a{display:block!important;padding:11px 20px!important;
    font-family:'Space Mono',monospace!important;font-size:8px!important;
    letter-spacing:.18em!important;text-transform:uppercase!important;
    color:#555560!important;text-decoration:none!important;
    border-bottom:1px solid #1a1a22!important;transition:color .15s,background .15s!important;}
  .k-nav-dd-menu a:last-child{border-bottom:none!important}
  .k-nav-dd-menu a:hover{color:#e8d080!important;background:#111116!important}
  @media(min-width:901px){body{padding-top:118px!important}#hamburgerBtn{display:none!important}#mobileMenu{display:none!important}}
  @media(max-width:900px){.k-nav-center{display:none!important}body{padding-top:118px!important}}
  #mobileMenu{display:none;position:fixed!important;top:100px;left:0;right:0;
    background:#060608!important;z-index:500!important;padding:8px 0!important;
    border-bottom:1px solid rgba(200,168,75,.12);max-height:calc(100vh - 66px);overflow-y:auto;}
  #mobileMenu a{display:flex!important;align-items:center!important;gap:14px!important;
    padding:15px 24px!important;font-family:'Bebas Neue',sans-serif!important;
    font-size:20px!important;letter-spacing:.1em!important;color:#f0ede8!important;
    text-decoration:none!important;border-bottom:1px solid #1a1a22!important;transition:color .2s,background .2s!important;}
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
    shopDd.querySelector('.k-nav-dd-label').addEventListener('click', function(e){
      e.stopPropagation(); shopDd.classList.toggle('open');
    });
    document.addEventListener('click', function(e){ if(!shopDd.contains(e.target)) shopDd.classList.remove('open'); });
  }
}

// ─────────────────────────────────────────────────
// § 3  LOGO
// ─────────────────────────────────────────────────
(function(){
  var sels=['.nav-logo img','.nav-logo','.logo img','.logo','nav a img','nav .brand img','nav .brand'];
  var el=null;
  for(var i=0;i<sels.length;i++){var e=document.querySelector(sels[i]);if(e){el=e;break;}}
  if(el){
    if(el.tagName==='IMG'){el.src='imgs/kryptaa-logo-gold.png';el.alt='KRYPTAA';el.style.cssText='height:88px;width:auto;object-fit:contain;filter:drop-shadow(0 0 12px rgba(200,168,75,.2));';}
    else{var img=document.createElement('img');img.src='imgs/kryptaa-logo-gold.png';img.alt='KRYPTAA';img.style.cssText='height:44px;width:auto;object-fit:contain;display:block;';el.innerHTML='';el.appendChild(img);}
  }
  var fi=document.querySelector('footer img[alt="KRYPTAA"]')||document.querySelector('footer img');
  if(fi){fi.src='imgs/kryptaa-logo-gold.png';fi.alt='KRYPTAA';fi.style.cssText='height:120px;width:auto;object-fit:contain;display:block;margin:0 auto;';}
})();

// ─────────────────────────────────────────────────
// § 4  HERO (unchanged — inject if needed)
// ─────────────────────────────────────────────────
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
  .hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,rgba(200,168,75,.4),transparent);animation:k-drift 2.5s ease-in-out infinite}
`;
document.head.appendChild(HS);

var cornerSVG='<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L4 34M4 4L34 4" stroke="rgba(200,168,75,0.55)" stroke-width="1"/><path d="M4 4L20 20" stroke="rgba(200,168,75,0.18)" stroke-width="0.5"/><circle cx="4" cy="4" r="2.5" fill="rgba(200,168,75,0.45)"/></svg>';
var heroHTML='<div id="kryptaa-hero-v2"><div class="hero-glow"></div><div class="hero-corner hero-corner--tl">'+cornerSVG+'</div><div class="hero-corner hero-corner--tr">'+cornerSVG+'</div><div class="hero-corner hero-corner--bl">'+cornerSVG+'</div><div class="hero-corner hero-corner--br">'+cornerSVG+'</div><div class="hero-hline hero-hline--top"></div><div class="hero-hline hero-hline--bot"></div><div class="hero-inner"><img class="hero-logo" src="imgs/kryptaa-logo-gold.png" alt="KRYPTAA"/><div class="hero-tagline">Defined By Power</div><div class="hero-subtitle">Gothic &amp; Streetwear Collection \u2014 Since \u201926</div><a class="hero-cta" href="#k-categories">Shop The Drop</a></div><div class="hero-scroll"><span>Scroll</span><div class="hero-scroll-line"></div></div></div>';
var heroSels=['.hero-section','#hero','.hero','[class*="hero"]','section.banner','.banner-section','#banner','main > section:first-child'];
var oldHero=null;for(var i=0;i<heroSels.length;i++){var e=document.querySelector(heroSels[i]);if(e&&e.offsetHeight>40){oldHero=e;break;}}
if(oldHero){oldHero.outerHTML=heroHTML;}
else{var ne=document.querySelector('nav')||document.querySelector('header');if(ne&&ne.parentNode){var t=document.createElement('div');t.innerHTML=heroHTML;ne.parentNode.insertBefore(t.firstElementChild,ne.nextSibling);}else document.body.insertAdjacentHTML('afterbegin',heroHTML);}

// ─────────────────────────────────────────────────
// § 5  VIDEO SECTION (hero video — unchanged feel)
// ─────────────────────────────────────────────────
var VS = document.createElement('style');
VS.textContent = `
  #k-video-section{
    position:relative;width:100%;height:100vh;min-height:480px;
    overflow:hidden;display:flex;align-items:center;justify-content:center;
    background:#000;margin:0!important;
  }
  #k-video-section video.bg-vid{
    position:absolute;inset:0;width:100%;height:100%;
    object-fit:cover;opacity:.7;z-index:1;
  }
  .v-overlay{
    position:absolute;inset:0;
    background:linear-gradient(to bottom,rgba(0,0,0,.55) 0%,rgba(0,0,0,.2) 45%,rgba(0,0,0,.65) 100%);
    z-index:2;
  }
  .v-scan-line{
    position:absolute;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(200,168,75,.18),transparent);
    animation:k-scan 8s linear infinite;z-index:3;pointer-events:none;
  }
  .v-content{position:relative;z-index:4;text-align:center;padding:0 24px;}
  .v-eyebrow{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.45em;color:rgba(200,168,75,.6);text-transform:uppercase;margin-bottom:20px}
  .v-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(64px,13vw,140px);letter-spacing:.04em;
    color:rgba(255,255,255,.95);line-height:.9;
    animation:k-flicker 10s ease infinite;
    text-shadow:0 0 80px rgba(200,168,75,.2);
  }
  .v-divider-line{width:40px;height:1px;background:rgba(200,168,75,.4);margin:22px auto}
  .v-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.35em;color:rgba(200,168,75,.5);text-transform:uppercase}
`;
document.head.appendChild(VS);
var videoHTML = '<section id="k-video-section" class="k-panel">' +
  '<video class="bg-vid" autoplay muted loop playsinline preload="metadata" src="' + BG_VIDEO + '"></video>' +
  '<div class="v-overlay"></div><div class="v-scan-line"></div>' +
  '<div class="v-content">' +
    '<div class="v-eyebrow">\u2014 Drop 001 \u2014</div>' +
    '<div class="v-title">ENTER<br>THE SYSTEM</div>' +
    '<div class="v-divider-line"></div>' +
    '<div class="v-sub">Kryptaa \u2014 SS26</div>' +
  '</div>' +
  '</section>';

// ─────────────────────────────────────────────────
// § 6  CATEGORIES — video bg cards, 5 categories
// ─────────────────────────────────────────────────
var CP = document.createElement('style');
CP.textContent = `
  #k-categories{
    background:#000;padding:80px 32px;
    min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  }
  #k-categories .cat-hdr{text-align:center;margin-bottom:48px}
  #k-categories .cat-hdr h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5.5vw,58px);letter-spacing:.1em;color:#fff;margin:0 0 8px}
  #k-categories .cat-hdr p{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.28em;color:#555560;text-transform:uppercase}

  /* Grid: 2 big + 3 bottom */
  .k-cat-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    grid-template-rows:460px 300px;
    gap:10px;max-width:1300px;margin:0 auto;
  }
  /* Row 1: MEN full-height left, WOMEN full-height right */
  .k-cc:nth-child(1){grid-column:1;grid-row:1}
  .k-cc:nth-child(2){grid-column:2;grid-row:1}
  /* Row 2: T-SHIRTS | TRACK PANTS | (ANIME as sub of men) — 3 equal cols */
  .k-cat-grid-bottom{
    grid-column:1/3;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:10px;
  }

  @media(max-width:768px){
    .k-cat-grid{grid-template-columns:1fr;grid-template-rows:auto}
    .k-cc:nth-child(1),.k-cc:nth-child(2){grid-column:1;grid-row:auto;height:280px}
    .k-cat-grid-bottom{grid-template-columns:1fr 1fr}
  }
  @media(max-width:480px){
    .k-cat-grid-bottom{grid-template-columns:1fr}
  }

  /* Card base */
  .k-cc{
    position:relative;overflow:hidden;cursor:pointer;
    text-decoration:none;display:block;
    background:#0a0a0d;
    transform:scale(1);
    transition:transform .55s cubic-bezier(.16,1,.3,1),box-shadow .55s;
  }
  .k-cc:hover{transform:scale(1.025);box-shadow:0 20px 60px rgba(0,0,0,.7)}
  /* Video background */
  .k-cc video.cc-vid{
    position:absolute;inset:0;width:100%;height:100%;
    object-fit:cover;z-index:0;
    transition:filter .5s ease;
    filter:brightness(.45) saturate(.7);
  }
  .k-cc:hover video.cc-vid{filter:brightness(.6) saturate(.85)}
  /* Fallback image bg */
  .k-cc .cc-bg{
    position:absolute;inset:0;background-size:cover;background-position:center;
    transition:transform .7s cubic-bezier(.16,1,.3,1),filter .4s;
    filter:brightness(.38) saturate(.65);z-index:0;
  }
  .k-cc:hover .cc-bg{transform:scale(1.06);filter:brightness(.52) saturate(.82)}
  /* Dark gradient overlay */
  .k-cc .cc-ov{
    position:absolute;inset:0;
    background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.35) 50%,rgba(0,0,0,.1) 100%);
    z-index:1;
  }
  /* Gold bottom line */
  .k-cc .cc-line{
    position:absolute;bottom:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,rgba(200,168,75,.8),transparent);
    transform:scaleX(0);transform-origin:center;
    transition:transform .45s cubic-bezier(.16,1,.3,1);z-index:3;
  }
  .k-cc:hover .cc-line{transform:scaleX(1)}
  /* Card content centered */
  .k-cc .cc-body{
    position:absolute;inset:0;z-index:2;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:24px;text-align:center;
  }
  .cc-body .cc-lbl{
    font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.35em;
    color:rgba(200,168,75,.7);text-transform:uppercase;margin-bottom:10px;
  }
  .cc-body h3{
    font-family:'Bebas Neue',sans-serif!important;
    font-size:clamp(36px,5vw,72px)!important;
    letter-spacing:.06em!important;color:#fff!important;
    margin:0 0 20px!important;line-height:.95!important;
    transition:color .3s,transform .3s!important;
  }
  .k-cc:hover .cc-body h3{color:#e8d080!important;transform:translateY(-4px)!important}
  .cc-cta{
    display:inline-block;
    font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:.2em;
    color:#000;background:#c8ff00;
    padding:11px 36px;text-decoration:none;text-transform:uppercase;
    clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
    opacity:0;transform:translateY(8px);
    transition:opacity .35s .05s,transform .35s .05s,background .2s;
  }
  .k-cc:hover .cc-cta{opacity:1;transform:translateY(0)}
  .cc-cta:hover{background:#fff!important}
  /* Small cards in bottom row */
  .k-cat-grid-bottom .k-cc .cc-body h3{font-size:clamp(26px,3.5vw,46px)!important}
`;
document.head.appendChild(CP);

// Build categories HTML — video bg on each card
function makeCatCard(href, bgImg, label, title, tint) {
  // tint is a CSS rgba overlay color for mood differentiation
  return '<a class="k-cc" href="' + href + '">' +
    '<video class="cc-vid" autoplay muted loop playsinline preload="none" src="' + BG_VIDEO + '"></video>' +
    '<div class="cc-bg" style="background-image:url(\'' + bgImg + '\')"></div>' +
    '<div class="cc-ov" style="background:linear-gradient(to top,rgba(0,0,0,.9) 0%,' + tint + ' 50%,rgba(0,0,0,.08) 100%)"></div>' +
    '<div class="cc-line"></div>' +
    '<div class="cc-body">' +
      '<div class="cc-lbl">' + label + '</div>' +
      '<h3>' + title + '</h3>' +
      '<a class="cc-cta" href="' + href + '">Shop Now</a>' +
    '</div>' +
    '</a>';
}

var catHTML = '<section id="k-categories" class="k-panel">' +
  '<div class="cat-hdr"><div class="k-eyebrow">The Collection</div><h2>SHOP THE DROP</h2><p>Select your entry point</p></div>' +
  '<div class="k-cat-grid">' +
    makeCatCard('men.html','imgs/jeans-gold-dragon.jpg','Collection','Men','rgba(40,25,5,.5)') +
    makeCatCard('women.html','imgs/w-vintage-dragon.jpg','Collection','Women','rgba(40,10,30,.5)') +
    '<div class="k-cat-grid-bottom">' +
      makeCatCard('t-shirts.html','imgs/img-glorious.png','Category','T-Shirts','rgba(10,15,30,.5)') +
      makeCatCard('track-pants.html','imgs/jeans-dual-dragon.jpg','Drop 002','Track Pants','rgba(5,20,10,.5)') +
      makeCatCard('men.html','imgs/anime-gojo.jpg','Category','Anime','rgba(20,5,30,.5)') +
      makeCatCard('women-tops.html','imgs/img-angel.png','Collection','Women Tops','rgba(30,5,20,.5)') +
    '</div>' +
  '</div>' +
  '</section>';

// ─────────────────────────────────────────────────
// § 7  FEATURED PIECES — 4 curated cards
// ─────────────────────────────────────────────────
var FP = document.createElement('style');
FP.textContent = `
  #k-featured{
    background:#060608;padding:80px 32px;
    min-height:100vh;display:flex;flex-direction:column;justify-content:center;
  }
  #k-featured .fp-hdr{text-align:center;margin-bottom:48px}
  #k-featured .fp-hdr h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5.5vw,58px);letter-spacing:.1em;color:#fff;margin:0 0 8px}
  #k-featured .fp-hdr p{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.28em;color:#555560;text-transform:uppercase}
  .k-fp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;max-width:1280px;margin:0 auto 48px;}
  @media(max-width:900px){.k-fp-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:480px){.k-fp-grid{gap:10px}}

  /* Featured card */
  .k-fp-card{
    display:block;text-decoration:none;background:#0a0a0d;
    border:1px solid #1e1e26;overflow:hidden;
    transition:transform .35s ease,box-shadow .35s ease,border-color .35s;
    position:relative;
  }
  .k-fp-card:hover{
    transform:translateY(-6px);
    box-shadow:0 20px 52px rgba(0,0,0,.65),0 0 24px rgba(200,168,75,.08);
    border-color:rgba(200,168,75,.24);
  }
  .k-fp-img{position:relative;overflow:hidden;padding-top:130%}
  .k-fp-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .6s ease}
  .k-fp-card:hover .k-fp-img img{transform:scale(1.08)}
  .fp-badge{position:absolute;top:10px;left:10px;background:#c8ff00;color:#000;font-family:'Space Mono',monospace;font-size:7px;letter-spacing:.18em;padding:4px 9px;text-transform:uppercase;z-index:2}
  /* Quick view overlay */
  .fp-qv-overlay{
    position:absolute;inset:0;
    background:rgba(0,0,0,.5);
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity .3s;z-index:3;
  }
  .k-fp-card:hover .fp-qv-overlay{opacity:1}
  .fp-qv-btn{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.2em;
    color:#e8d080;background:rgba(6,6,8,.88);border:1px solid rgba(200,168,75,.35);
    padding:10px 20px;text-transform:uppercase;cursor:pointer;
    transition:background .2s,color .2s;
  }
  .fp-qv-btn:hover{background:rgba(200,255,0,.12);color:#c8ff00}
  .k-fp-info{padding:16px 16px 18px}
  .k-fp-name{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:.08em;color:#f0ede8;margin-bottom:4px;transition:color .2s}
  .k-fp-card:hover .k-fp-name{color:#e8d080}
  .k-fp-price{font-family:'Space Mono',monospace;font-size:12px;color:#e8d080;margin-bottom:12px}
  .k-fp-cta{
    display:block;width:100%;text-align:center;
    background:transparent;border:1px solid rgba(200,255,0,.35);
    color:#c8ff00;font-family:'Bebas Neue',sans-serif;
    font-size:12px;letter-spacing:.2em;padding:10px;
    text-transform:uppercase;text-decoration:none;
    transition:background .2s,color .2s;cursor:pointer;
  }
  .k-fp-cta:hover{background:#c8ff00;color:#000}
  /* View all */
  .fp-view-all{
    display:block;width:fit-content;margin:0 auto;
    font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:.2em;
    color:rgba(240,237,232,.5);text-decoration:none;text-transform:uppercase;
    border:1px solid rgba(240,237,232,.15);padding:12px 44px;
    transition:color .2s,border-color .2s;
  }
  .fp-view-all:hover{color:#e8d080;border-color:rgba(200,168,75,.4)}
`;
document.head.appendChild(FP);

var FEATURED = [
  {id:102,name:'Dual Dragon Denim',price:98,img:'imgs/jeans-dual-dragon.jpg',badge:'SIGNATURE'},
  {id:101,name:'Gold Dragon Denim',price:75,img:'imgs/jeans-gold-dragon.jpg',badge:'DROP 001'},
  {id:201,name:'Vintage Dragon',price:70,img:'imgs/w-vintage-dragon.jpg',badge:'FEATURED'},
  {id:304,name:'Glorious Tee',price:35,img:'imgs/img-glorious.png',badge:'NEW'},
];

var featuredHTML = '<section id="k-featured" class="k-panel">' +
  '<div class="fp-hdr"><div class="k-eyebrow">Selected Pieces</div><h2>DROP 001</h2><p>Curated from the collection</p></div>' +
  '<div class="k-fp-grid">' +
  FEATURED.map(function(p){
    return '<div class="k-fp-card">' +
      '<a href="product.html?id='+p.id+'" style="display:block;text-decoration:none;color:inherit">' +
        '<div class="k-fp-img">' +
          '<div class="fp-badge">'+p.badge+'</div>' +
          '<img src="'+p.img+'" alt="'+p.name+'" loading="lazy">' +
          '<div class="fp-qv-overlay"><button class="fp-qv-btn" onclick="event.preventDefault();event.stopPropagation();openQV('+p.id+')">Quick View</button></div>' +
        '</div>' +
        '<div class="k-fp-info">' +
          '<div class="k-fp-name">'+p.name+'</div>' +
          '<div class="k-fp-price">$'+p.price+'</div>' +
          '<div class="k-fp-cta">View Product</div>' +
        '</div>' +
      '</a>' +
    '</div>';
  }).join('') +
  '</div>' +
  '<a class="fp-view-all" href="men.html">View Full Collection</a>' +
  '</section>';

// ─────────────────────────────────────────────────
// § 8  BRAND MANIFESTO
// ─────────────────────────────────────────────────
var BM = document.createElement('style');
BM.textContent = `
  #k-brand-story{
    background:#000;padding:0;
    min-height:100vh;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;position:relative;overflow:hidden;
  }
  #k-brand-story::before{content:'';position:absolute;inset:0;
    background:radial-gradient(ellipse at center,rgba(200,168,75,.04),transparent 65%);pointer-events:none}
  #k-brand-story .bs-inner{padding:80px 48px;max-width:800px;}
  #k-brand-story .bs-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(44px,9vw,96px);letter-spacing:.07em;color:#fff;margin-bottom:36px;line-height:.9}
  #k-brand-story .bs-body{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,24px);font-weight:300;line-height:1.85;color:rgba(240,237,232,.5);letter-spacing:.04em;margin-bottom:40px}
  #k-brand-story .bs-body strong{color:#e8d080;font-weight:400}
  .bs-divider{width:1px;height:60px;background:linear-gradient(to bottom,transparent,rgba(200,168,75,.4),transparent);margin:0 auto 36px}
  #k-brand-story .bs-cta{display:inline-block;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:.2em;color:#000;background:#c8ff00;padding:14px 52px;text-decoration:none;text-transform:uppercase;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);transition:background .2s,transform .15s}
  #k-brand-story .bs-cta:hover{background:#fff;transform:scale(1.04)}
`;
document.head.appendChild(BM);

var brandHTML = '<section id="k-brand-story" class="k-panel">' +
  '<div class="bs-inner">' +
    '<div class="k-eyebrow">Identity</div>' +
    '<h2 class="bs-title">THE WORLD<br>OF KRYPTAA</h2>' +
    '<div class="bs-divider"></div>' +
    '<p class="bs-body">Kryptaa is not fashion.<br>It is <strong>energy</strong>. It is <strong>presence</strong>.<br>Built for those who move different.<br><br><strong>Dark. Precise. Unapologetic.</strong></p>' +
    '<a class="bs-cta" href="men.html">Explore the Collection</a>' +
  '</div>' +
  '</section>';

// ─────────────────────────────────────────────────
// § 9  QUICK VIEW MODAL
// ─────────────────────────────────────────────────
var QV = document.createElement('style');
QV.textContent = `
  @keyframes qv-up{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
  .qv-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);
    z-index:5000;backdrop-filter:blur(10px);align-items:center;justify-content:center;padding:20px;}
  .qv-overlay.open{display:flex}
  .qv-modal{background:#060608;border:1px solid #1e1e26;max-width:880px;width:100%;
    max-height:90vh;overflow-y:auto;position:relative;animation:qv-up .35s cubic-bezier(.16,1,.3,1) forwards;}
  .qv-header{display:flex;justify-content:flex-end;padding:14px 14px 0}
  .qv-close{background:rgba(6,6,8,.9);border:1px solid #1e1e26;color:#555560;
    width:36px;height:36px;font-size:20px;cursor:pointer;display:flex;
    align-items:center;justify-content:center;transition:color .2s;}
  .qv-close:hover{color:#f0ede8}
  .qv-layout{display:grid;grid-template-columns:1fr 1fr}
  @media(max-width:640px){.qv-layout{grid-template-columns:1fr}}
  .qv-img{overflow:hidden;min-height:400px;position:relative;}
  .qv-img img{width:100%;height:100%;object-fit:cover;object-position:top;display:block;transition:transform .5s}
  .qv-img:hover img{transform:scale(1.04)}
  @media(max-width:640px){.qv-img{min-height:260px}}
  .qv-info{padding:36px 32px;display:flex;flex-direction:column;border-left:1px solid #1e1e26}
  @media(max-width:640px){.qv-info{padding:24px 20px;border-left:none;border-top:1px solid #1e1e26}}
  .qv-cat{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.3em;color:rgba(200,168,75,.6);text-transform:uppercase;margin-bottom:10px}
  .qv-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,44px);letter-spacing:.06em;color:#fff;margin-bottom:10px;line-height:.95}
  .qv-price{font-family:'Space Mono',monospace;font-size:18px;color:#e8d080;margin-bottom:16px}
  .qv-desc{font-family:'Barlow Condensed',sans-serif;font-size:15px;color:rgba(240,237,232,.45);line-height:1.7;margin-bottom:24px;flex:1}
  .qv-size-lbl{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.2em;color:#555560;text-transform:uppercase;margin-bottom:10px}
  .qv-sizes{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:20px}
  .qv-sz{background:none;border:1px solid #252530;color:#555560;font-family:'Space Mono',monospace;font-size:9px;padding:8px 12px;cursor:pointer;transition:border-color .15s,color .15s,background .15s}
  .qv-sz:hover{border-color:#555560;color:#f0ede8}
  .qv-sz.selected{border-color:#c8a84b;color:#e8d080;background:rgba(200,168,75,.07)}
  .qv-atc{width:100%;background:#c8ff00;color:#000;font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:.2em;padding:15px;cursor:pointer;text-transform:uppercase;border:none;transition:background .2s;margin-bottom:10px;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
  .qv-atc:hover{background:#fff}
  .qv-full{display:block;text-align:center;font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.22em;color:rgba(240,237,232,.35);text-decoration:none;text-transform:uppercase;padding:10px;border:1px solid rgba(240,237,232,.1);transition:color .2s,border-color .2s}
  .qv-full:hover{color:#e8d080;border-color:rgba(200,168,75,.3)}
`;
document.head.appendChild(QV);

// QV product data
var QV_PRODUCTS = {
  101:{name:'Gold Dragon Denim',price:75,img:'imgs/jeans-gold-dragon.jpg',cat:"Men's",desc:'Premium heavyweight denim with hand-painted gold dragon artwork.',sizes:['28','30','32','34','36']},
  102:{name:'Dual Dragon Denim',price:98,img:'imgs/jeans-dual-dragon.jpg',cat:"Men's",desc:'Signature dual dragon on heavyweight Japanese black denim.',sizes:['28','30','32','34','36']},
  103:{name:'Flame Cut Denim',price:77,img:'imgs/jeans-flame.jpg',cat:"Men's",desc:'Fire-detailed custom denim cut for maximum presence.',sizes:['28','30','32','34','36']},
  104:{name:'Floral Gothic',price:70,img:'imgs/jeans-flower-full.jpg',cat:"Men's",desc:'Dark floral gothic pattern on premium Japanese denim.',sizes:['28','30','32','34','36']},
  105:{name:'Red Dragon Denim',price:62,img:'imgs/jeans-red-dragon.jpg',cat:"Men's",desc:'Bold crimson dragon artwork on jet black denim.',sizes:['28','30','32','34','36']},
  106:{name:'Skull Denim',price:68,img:'imgs/jeans-skull.jpg',cat:"Men's",desc:'Gothic skull motif engineered for dominance.',sizes:['28','30','32','34','36']},
  107:{name:'Grey Cargo Denim',price:65,img:'imgs/jeans-grey-cargo.jpg',cat:"Men's",desc:'Technical cargo denim with gothic hardware.',sizes:['28','30','32','34','36']},
  108:{name:'Gojo Denim',price:69,img:'imgs/anime-gojo.jpg',cat:"Men's",desc:'Gojo Satoru premium anime denim.',sizes:['28','30','32','34','36']},
  109:{name:'JJK Vol.1',price:59,img:'imgs/anime-jjk1.jpg',cat:"Men's",desc:'Jujutsu Kaisen premium denim. Volume 1.',sizes:['28','30','32','34','36']},
  110:{name:'JJK Vol.2',price:60,img:'imgs/anime-jjk2.jpg',cat:"Men's",desc:'Jujutsu Kaisen premium denim. Volume 2.',sizes:['28','30','32','34','36']},
  111:{name:'Baki Denim',price:70,img:'imgs/anime-baki.jpg',cat:"Men's",desc:'Baki the Grappler custom denim.',sizes:['28','30','32','34','36']},
  112:{name:'Death Note Denim',price:67,img:'imgs/anime-deathnote.jpg',cat:"Men's",desc:'Death Note gothic denim.',sizes:['28','30','32','34','36']},
  113:{name:'One Piece Denim',price:77,img:'imgs/anime-one-piece.jpg',cat:"Men's",desc:'One Piece limited edition denim.',sizes:['28','30','32','34','36']},
  114:{name:'Horror Anime Denim',price:64,img:'imgs/anime-horror.jpg',cat:"Men's",desc:'Horror anime collab on premium denim.',sizes:['28','30','32','34','36']},
  115:{name:'Gojo Vol.2',price:70,img:'imgs/anime-gojo2.jpg',cat:"Men's",desc:'Gojo Satoru Vol.2.',sizes:['28','30','32','34','36']},
  116:{name:'Black Red Denim',price:65,img:'imgs/anime-blackred.jpg',cat:"Men's",desc:'Bold black and red anime artwork.',sizes:['28','30','32','34','36']},
  201:{name:'Vintage Dragon',price:70,img:'imgs/w-vintage-dragon.jpg',cat:"Women's",desc:'Vintage-wash denim with dragon art.',sizes:['26','28','30','32','34']},
  202:{name:'White Dragon',price:77,img:'imgs/w-white-dragon.jpg',cat:"Women's",desc:'Premium white denim with gothic dragon embroidery.',sizes:['26','28','30','32','34']},
  203:{name:'Blue Split Denim',price:65,img:'imgs/w-blue-split.jpg',cat:"Women's",desc:'Split-hem blue denim with architectural detail.',sizes:['26','28','30','32','34']},
  204:{name:'Butterfly Gothic',price:69,img:'imgs/w-butterfly.jpg',cat:"Women's",desc:'Dark butterfly art on premium denim.',sizes:['26','28','30','32','34']},
  205:{name:'Cargo Denim',price:70,img:'imgs/w-cargo.jpg',cat:"Women's",desc:'Gothic cargo cut with premium hardware.',sizes:['26','28','30','32','34']},
  206:{name:'Distressed Denim',price:62,img:'imgs/w-distressed.jpg',cat:"Women's",desc:'Heavy distressed denim.',sizes:['26','28','30','32','34']},
  207:{name:'Grey Baggy Denim',price:65,img:'imgs/w-grey-baggy.jpg',cat:"Women's",desc:'Oversized grey denim with Kryptaa branding.',sizes:['26','28','30','32','34']},
  208:{name:'Pink Skull Denim',price:68,img:'imgs/w-pink-skull.jpg',cat:"Women's",desc:'Skull art on washed denim.',sizes:['26','28','30','32','34']},
  209:{name:'Side Rip Denim',price:67,img:'imgs/w-side-rip.jpg',cat:"Women's",desc:'Architectural side rip with gothic lace.',sizes:['26','28','30','32','34']},
  301:{name:'Angel Tee',price:35,img:'imgs/img-angel.png',cat:"T-Shirts",desc:'300 GSM heavyweight cotton. Dark divinity.',sizes:['XS','S','M','L','XL','XXL']},
  302:{name:'Broken Tee',price:35,img:'imgs/img-broken.png',cat:"T-Shirts",desc:'Distressed print on premium cotton.',sizes:['XS','S','M','L','XL','XXL']},
  303:{name:'Crime Tee',price:35,img:'imgs/img-crime.png',cat:"T-Shirts",desc:'Dark crime-inspired statement tee.',sizes:['XS','S','M','L','XL','XXL']},
  304:{name:'Glorious Tee',price:35,img:'imgs/img-glorious.png',cat:"T-Shirts",desc:'The Glorious signature heavyweight tee.',sizes:['XS','S','M','L','XL','XXL']},
  305:{name:'Money Tee',price:35,img:'imgs/img-money.png',cat:"T-Shirts",desc:'Dark opulence for the streets.',sizes:['XS','S','M','L','XL','XXL']},
};

// Inject QV modal HTML
document.body.insertAdjacentHTML('beforeend',
  '<div class="qv-overlay" id="kQvOverlay">' +
    '<div class="qv-modal">' +
      '<div class="qv-header"><button class="qv-close" id="kQvClose">×</button></div>' +
      '<div class="qv-layout">' +
        '<div class="qv-img"><img id="kQvImg" src="" alt=""></div>' +
        '<div class="qv-info">' +
          '<div class="qv-cat" id="kQvCat">Collection</div>' +
          '<h2 class="qv-name" id="kQvName">Product</h2>' +
          '<div class="qv-price" id="kQvPrice">$00</div>' +
          '<p class="qv-desc" id="kQvDesc"></p>' +
          '<div class="qv-size-lbl">Select Size</div>' +
          '<div class="qv-sizes" id="kQvSizes"></div>' +
          '<button class="qv-atc" id="kQvAtc">Add to Bag</button>' +
          '<a class="qv-full" id="kQvFull" href="#">View Full Product →</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>'
);

var _qvProduct = null, _qvSize = null;
window.openQV = function(pid) {
  var p = QV_PRODUCTS[pid]; if(!p) return;
  _qvProduct = p; _qvSize = null;
  document.getElementById('kQvImg').src = p.img;
  document.getElementById('kQvImg').alt = p.name;
  document.getElementById('kQvCat').textContent = p.cat;
  document.getElementById('kQvName').textContent = p.name;
  document.getElementById('kQvPrice').textContent = '$' + p.price;
  document.getElementById('kQvDesc').textContent = p.desc;
  document.getElementById('kQvFull').href = 'product.html?id=' + pid;
  document.getElementById('kQvSizes').innerHTML = p.sizes.map(function(s){
    return '<button class="qv-sz" onclick="selectQvSize(\''+s+'\',this)">'+s+'</button>';
  }).join('');
  document.getElementById('kQvOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.selectQvSize = function(size, btn) {
  _qvSize = size;
  document.querySelectorAll('.qv-sz').forEach(function(b){b.classList.remove('selected')});
  btn.classList.add('selected');
};
function closeQV() {
  document.getElementById('kQvOverlay').classList.remove('open');
  document.body.style.overflow = '';
  _qvProduct = null; _qvSize = null;
}
document.getElementById('kQvClose').addEventListener('click', closeQV);
document.getElementById('kQvOverlay').addEventListener('click', function(e){ if(e.target===this) closeQV(); });
document.getElementById('kQvAtc').addEventListener('click', function() {
  if (!_qvProduct) return;
  if (!_qvSize) { showKToast('Select a size first'); return; }
  var key = _qvProduct.name + '-' + _qvSize;
  var cart = []; try { cart = JSON.parse(localStorage.getItem('kryptaa_cart')||'[]'); } catch(e) {}
  var ex = cart.find(function(i){return i.key===key});
  if (ex) ex.qty++;
  else cart.push({key:key,id:Date.now(),name:_qvProduct.name,price:_qvProduct.price,img:_qvProduct.img,size:_qvSize,qty:1});
  localStorage.setItem('kryptaa_cart', JSON.stringify(cart));
  closeQV();
  showKToast('Added to bag ✓');
});
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeQV(); });

// ─────────────────────────────────────────────────
// § 10  TOAST
// ─────────────────────────────────────────────────
var toastEl = document.getElementById('kToast');
if (!toastEl) {
  toastEl = document.createElement('div');
  toastEl.id = 'kToast';
  toastEl.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(80px);background:#0a0a0d;border:1px solid rgba(200,168,75,.28);color:#e8d080;font-family:"Space Mono",monospace;font-size:8px;letter-spacing:.2em;padding:12px 24px;text-transform:uppercase;transition:transform .4s cubic-bezier(.16,1,.3,1);z-index:9000;white-space:nowrap;';
  document.body.appendChild(toastEl);
}
var toastCSS = document.createElement('style');
toastCSS.textContent = '#kToast.show{transform:translateX(-50%) translateY(0)!important}';
document.head.appendChild(toastCSS);
window.showKToast = function(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(function(){ toastEl.classList.remove('show'); }, 2400);
};

// ─────────────────────────────────────────────────
// § 11  SIZE GUIDE
// ─────────────────────────────────────────────────
var sgCSS = document.createElement('style');
sgCSS.textContent = `
  #k-size-guide{background:#060608;padding:80px 48px;text-align:center}
  #k-size-guide h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,5vw,52px);letter-spacing:.1em;color:#fff;margin-bottom:8px}
  #k-size-guide .sg-sub{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.25em;color:#555560;text-transform:uppercase;margin-bottom:40px}
  .sg-table{width:100%;max-width:680px;margin:0 auto;border-collapse:collapse}
  .sg-table th{font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:.1em;color:#e8d080;padding:12px 16px;border-bottom:1px solid #1e1e26;text-align:center}
  .sg-table td{font-family:'Space Mono',monospace;font-size:9px;color:#555560;padding:10px 16px;border-bottom:1px solid #111116;text-align:center}
  .sg-table tr:hover td{color:#f0ede8;background:#0a0a0d}
`;
document.head.appendChild(sgCSS);

var sgHTML = '<section id="k-size-guide">' +
  '<div class="k-eyebrow">Sizing</div>' +
  '<h2>SIZE GUIDE</h2><p class="sg-sub">Measure twice. Order once.</p>' +
  '<table class="sg-table"><thead><tr><th>SIZE</th><th>WAIST</th><th>HIP</th><th>INSEAM</th></tr></thead><tbody>' +
  [['28','28"','36"','30"'],['30','30"','38"','30"'],['32','32"','40"','31"'],['34','34"','42"','31"'],['36','36"','44"','32"']].map(function(r){
    return '<tr>'+r.map(function(c){return '<td>'+c+'</td>';}).join('')+'</tr>';
  }).join('') +
  '</tbody></table></section>';

// ─────────────────────────────────────────────────
// § 12  INJECT ALL SECTIONS
// ─────────────────────────────────────────────────
var heroEl = document.getElementById('kryptaa-hero-v2');
if (heroEl) {
  heroEl.insertAdjacentHTML('afterend',
    videoHTML +
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Collection \u2736</span></div>' +
    catHTML +
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Selected \u2736</span></div>' +
    featuredHTML +
    '<div class="k-divider"><span class="k-divider-txt">\u2736 Identity \u2736</span></div>' +
    brandHTML
  );
}

// Size guide before footer
var footer = document.querySelector('footer');
if (footer) { footer.insertAdjacentHTML('beforebegin', sgHTML); }

// ─────────────────────────────────────────────────
// § 13  LAYERED SCROLL OBSERVER
// ─────────────────────────────────────────────────
setTimeout(function() {
  var panels = document.querySelectorAll('.k-panel');
  panels.forEach(function(panel) {
    panel.classList.add('entering');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var el = entry.target;
        if (entry.isIntersecting) {
          // Entering viewport: slide up in
          el.classList.remove('entering','exiting');
          el.classList.add('visible');
        } else {
          // Leaving viewport
          var rect = entry.boundingClientRect;
          if (rect.top > 0) {
            // Panel is below — not yet seen
            el.classList.remove('visible','exiting');
            el.classList.add('entering');
          } else {
            // Panel is above — has been passed
            el.classList.remove('visible','entering');
            el.classList.add('exiting');
          }
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    panels.forEach(function(p) { observer.observe(p); });
  } else {
    // Fallback: just show all
    panels.forEach(function(p) { p.classList.add('visible'); });
  }
}, 200);

// ─────────────────────────────────────────────────
// § 14  LAZY LOAD CATEGORY VIDEOS
// ─────────────────────────────────────────────────
setTimeout(function() {
  var catVids = document.querySelectorAll('#k-categories video.cc-vid');
  if ('IntersectionObserver' in window) {
    var vidObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var v = entry.target;
          if (!v.src || v.src === window.location.href) {
            v.src = BG_VIDEO;
          }
          v.play().catch(function(){});
          vidObs.unobserve(v);
        }
      });
    }, { threshold: 0.1 });
    catVids.forEach(function(v) { vidObs.observe(v); });
  } else {
    catVids.forEach(function(v) { v.play && v.play().catch(function(){}); });
  }
}, 300);

// ─────────────────────────────────────────────────
// § 15  HIDE OLD SECTIONS
// ─────────────────────────────────────────────────
setTimeout(function() {
  ['.how-section','.story-section','.archive-section','.newsletter','#newsletter',
   'section.section','.reviews-section','.policy-strip'].forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) { el.style.display='none'; });
  });
}, 60);

// ─────────────────────────────────────────────────
// § 16  MOBILE MENU
// ─────────────────────────────────────────────────
var mm = document.getElementById('mobileMenu');
var ham = document.getElementById('hamburgerBtn');
if (mm && ham) {
  var strip = document.querySelector('.nav-cat-strip'); if(strip) strip.remove();
  mm.innerHTML =
    '<a href="index.html">\uD83C\uDFE0 HOME</a>' +
    '<a href="men.html">\uD83D\uDC56 MEN</a>' +
    '<a href="women.html">\uD83D\uDC57 WOMEN</a>' +
    '<a href="t-shirts.html">\uD83D\uDC55 T-SHIRTS</a>' +
    '<a href="track-pants.html">\u26A1 TRACK PANTS</a>' +
    '<a href="#k-size-guide">\uD83D\uDCCF SIZE GUIDE</a>';
  ham.onclick = null;
  ham.addEventListener('click', function(e){ e.stopPropagation(); mm.style.display = mm.style.display==='block'?'none':'block'; });
  document.addEventListener('click', function(e){ if(!ham.contains(e.target)&&!mm.contains(e.target)) mm.style.display='none'; });
  mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.style.display='none'; }); });
}

// ─────────────────────────────────────────────────
// § 17  CART PERSISTENCE
// ─────────────────────────────────────────────────
var _sync=window.syncCart;
window.syncCart=function(){if(_sync)_sync.apply(this,arguments);if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));};
var _add=window.addCart;
window.addCart=function(){var r=_add?_add.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var _addById=window.addCartById;
window.addCartById=function(){var r=_addById?_addById.apply(this,arguments):undefined;if(window.cart)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));return r;};
var saved=[];try{saved=JSON.parse(localStorage.getItem('kryptaa_cart')||'[]');}catch(e){}
if(saved.length>0){var att=0,ri=setInterval(function(){if(++att>30){clearInterval(ri);return;}if(window.cart!==undefined&&typeof window.syncCart==='function'){if(!window.cart||window.cart.length===0){window.cart=saved;window.syncCart();}clearInterval(ri);}},100);}
window.addEventListener('beforeunload',function(){if(window.cart&&window.cart.length>0)localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart));});

// ─────────────────────────────────────────────────
// § 18  EXISTING FIXES
// ─────────────────────────────────────────────────
var s=document.querySelector('#womensSlider');
if(s)Array.from(s.querySelectorAll('.card')).forEach(function(c){var n=c.querySelector('h3,h4,[class*=name]');if(n&&n.textContent.toLowerCase().includes('track pant'))c.remove();});
var chkBtn=document.querySelector('.cart-checkout');
if(chkBtn)chkBtn.addEventListener('click',function(){localStorage.setItem('kryptaa_cart',JSON.stringify(window.cart||[]));window.location.href='checkout.html';});
var pm={10:98,11:118,12:77,13:60,14:75,15:70,16:65,17:62,18:68,19:59,20:64,21:70,22:65,23:67,24:69,25:70,32:77,33:69,34:70};
[window.MENS||[],window.WOMENS||[]].forEach(function(arr){arr.forEach(function(p){if(pm[p.id]!==undefined)p.price=pm[p.id];});});

}); // end DOMContentLoaded
