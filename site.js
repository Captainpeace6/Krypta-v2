/* KRYPTAA preview — shared engine for every page.
   Bag, wishlist, recently viewed, drawers, menus, size guide, and each page's own view.
   Nothing here sends data anywhere: the bag and hearts live in this browser only. */
(function(){
"use strict";
const K=window.K||{products:[],cfg:{}};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=v=>"$"+Number(v).toFixed(2);
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const byId=id=>K.products.find(p=>p.id===Number(id));
/* Google has had /products/<slug>.html indexed since launch, so those stay the real
   URLs and every internal link points at them. The depth prefix keeps it working both
   at the domain root and under a GitHub Pages project path, where a leading / would
   escape the project folder. product.html#p<id> still works as a fallback. */
const DEPTH=/\/(products|journal)\//.test(location.pathname)?"../":"";
/* Image paths in the data are root-relative ("imgs/..."). A page served from
   /products/ or /journal/ must reach up a level, or every photo 404s. */
const asset=u=>{const v=String(u==null?"":u);
  return /^(https?:|data:|\/\/|\/)/.test(v)?v:DEPTH+v};
const purl=id=>{const s=(window.K_SLUGS||{})[id];
  return s?DEPTH+"products/"+s+".html":DEPTH+"product.html#p"+id};
const jurl=slug=>DEPTH+"journal/"+slug+".html";

/* ── storage (per browser; falls back to memory) ── */
const mem={};
const store={get(k,d){try{const v=localStorage.getItem("kry_"+k);return v?JSON.parse(v):d}catch(e){return k in mem?mem[k]:d}},
  set(k,v){mem[k]=v;try{localStorage.setItem("kry_"+k,JSON.stringify(v))}catch(e){}}};

/* ── stock (snapshot from the store) ── */
const LOW=5;
const stockOf=(p,size)=>{const s=(K.stock||{})[p.id];if(!s)return null;if(size in s)return s[size];if("Universal" in s&&p.sizes.length<=1)return s.Universal;return null};
const lowSizes=p=>p.sizes.map(z=>[z,stockOf(p,z)]).filter(([,q])=>q!=null&&q>0&&q<=LOW);
const soldOut=(p,z)=>(p.soldOutSizes||[]).includes(z)||stockOf(p,z)===0;
const isPre=p=>/pre-order|production/i.test(p.availability||"");
const canBuy=p=>!p.archived&&(p.category!=="anime"||p.buyable);
function badge(p){
  if(p.archived)return '<span class="badge dim">Coming soon</span>';
  if(p.category==="anime"&&!p.buyable)return '<span class="badge">Contact to order</span>';
  if(isPre(p))return `<span class="badge red">${/production/i.test(p.availability)?"In production":"Pre-order"}</span>`;
  const lw=lowSizes(p);if(lw.length)return `<span class="badge red">Low · ${lw.map(x=>x[0]).join(" ")}</span>`;
  if(p.category==="bundle")return '<span class="badge">$100+ value</span>';
  return "";
}

/* ── toast ── */
let tt;function toast(t){let el=$(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.append(el)}
  el.textContent=t;el.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("on"),2400)}

/* ── BAG ── */
const FREE=60;
let bag=store.get("bag",[]).filter(l=>byId(l.id));
const saveBag=()=>{store.set("bag",bag);paintCounts();renderBag();document.dispatchEvent(new Event("bag:change"))};
const bagCount=()=>bag.reduce((a,l)=>a+l.qty,0);
const bagTotal=()=>bag.reduce((a,l)=>a+byId(l.id).price*l.qty,0);
function addToBag(id,size,qty=1){const p=byId(id);if(!p||!canBuy(p))return;
  const key=id+"|"+size;const l=bag.find(x=>x.key===key);if(l)l.qty+=qty;else bag.push({key,id:p.id,size,qty});
  saveBag();const b=$(".bag-btn");if(b){b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")}
  if(window.KAPI)KAPI.track("add_to_cart",{value:p.price*qty,ids:[String(p.id)],
    items:[{item_id:String(p.id),item_name:p.name,price:p.price,quantity:qty,item_variant:size}]});
  openDrawer("bagDrawer");}
const BAG3D=s=>`<span class="bag3d" style="--s:${s||1}" aria-hidden="true"><span class="rot"><span class="f fr"></span><span class="f bk"></span><span class="f sd l"></span><span class="f sd r"></span><span class="h h1"></span><span class="h h2"></span></span><span class="shadow"></span></span>`;
function renderBag(){
  const body=$("#bagBody"),foot=$("#bagFoot"),bar=$("#shipBar");if(!body)return;
  const tot=bagTotal();
  if(!bag.length){
    bar.innerHTML=`<div class="t">Free US shipping on orders over <strong>${money(FREE)}</strong></div>`;
    body.innerHTML=`<div class="empty"><div class="stage">${BAG3D(3)}</div><b>Your bag is empty</b><p>The drop won't wait. Fill it with something loud.</p>
      <div class="acts"><a class="btn" href="men-all.html">Shop Drop 001</a><a class="btn ghost" href="anime.html">Anime pre-orders</a></div></div>`;
    foot.hidden=true;return}
  const rem=Math.max(0,FREE-tot),pct=Math.min(100,tot/FREE*100);
  bar.innerHTML=rem>0?`<div class="t">Add <strong>${money(rem)}</strong> more for free shipping</div><div class="track"><i style="--p:${pct}%"></i></div>`
    :`<div class="t ok">✓ Free shipping unlocked</div><div class="track"><i style="--p:100%;background:var(--ok)"></i></div>`;
  body.innerHTML=bag.map(l=>{const p=byId(l.id);return `<div class="line"><a href="${purl(p.id)}"><img src="${esc(asset(p.img))}" alt="${esc(p.name)}"></a><div>
    <a class="nm" href="${purl(p.id)}">${esc(p.name)}</a><div class="meta">Size ${esc(l.size)} · ${money(p.price)}${isPre(p)?" · Pre-order":""}</div>
    <div class="row"><span class="qty"><button type="button" data-q="${esc(l.key)}" data-d="-1" aria-label="One less">−</button><span>${l.qty}</span><button type="button" data-q="${esc(l.key)}" data-d="1" aria-label="One more">+</button></span>
    <span class="pr">${money(p.price*l.qty)}</span></div><button class="rm" type="button" data-rm="${esc(l.key)}">Remove</button></div></div>`}).join("");
  foot.hidden=false;$("#bagTotal").textContent=money(tot);
}
document.addEventListener("click",e=>{
  const q=e.target.closest("[data-q]");if(q){const l=bag.find(x=>x.key===q.dataset.q);if(l){l.qty+=Number(q.dataset.d);if(l.qty<1)bag=bag.filter(x=>x!==l);saveBag()}return}
  const r=e.target.closest("[data-rm]");if(r){bag=bag.filter(x=>x.key!==r.dataset.rm);saveBag();toast("Removed from bag");return}
});

/* ── WISHLIST ── */
let wish=store.get("wish",[]).filter(id=>byId(id));
const HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.7 3.5 4.4 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
const heartBtn=(id,extra="")=>`<button class="heart ${extra}" type="button" data-heart="${id}" aria-pressed="${wish.includes(id)}" aria-label="Save to wishlist">${HEART}</button>`;
document.addEventListener("click",e=>{const h=e.target.closest("[data-heart]");if(!h)return;e.preventDefault();
  const id=Number(h.dataset.heart);const on=wish.includes(id);wish=on?wish.filter(x=>x!==id):[...wish,id];store.set("wish",wish);
  $$(`[data-heart="${id}"]`).forEach(b=>b.setAttribute("aria-pressed",!on));paintCounts();toast(on?"Removed from wishlist":"Saved to wishlist");
  document.dispatchEvent(new Event("wish:change"))});

function paintCounts(){$$("[data-count=bag]").forEach(c=>{c.textContent=bagCount();c.dataset.n=bagCount()});
  $$("[data-count=wish]").forEach(c=>{c.textContent=wish.length;c.dataset.n=wish.length})}

/* ── DRAWERS / MENUS ── */
const scrim=$("#scrim");let lastFocus=null;
function openDrawer(id){const d=document.getElementById(id);if(!d)return;closeAll();lastFocus=document.activeElement;d.classList.add("on");d.setAttribute("aria-hidden","false");scrim.classList.add("on");document.documentElement.style.overflow="hidden";setTimeout(()=>{const f=d.querySelector(".x");f&&f.focus()},60)}
function closeAll(){$$(".drawer.on,.modal.on").forEach(d=>{d.classList.remove("on");d.setAttribute("aria-hidden","true")});scrim&&scrim.classList.remove("on");document.documentElement.style.overflow="";if(lastFocus&&lastFocus.focus)lastFocus.focus()}
document.addEventListener("click",e=>{
  if(e.target.closest("[data-open]")){e.preventDefault();openDrawer(e.target.closest("[data-open]").dataset.open);return}
  if(e.target.closest("[data-close]")||e.target===scrim||e.target.classList.contains("modal")){closeAll();return}
  const dd=e.target.closest(".k-nav button.dd");if(dd){const li=dd.parentElement;const o=li.classList.toggle("open");dd.setAttribute("aria-expanded",o);$$(".k-nav li.open").forEach(x=>{if(x!==li){x.classList.remove("open");x.querySelector("button").setAttribute("aria-expanded","false")}});return}
  if(!e.target.closest(".k-nav"))$$(".k-nav li.open").forEach(x=>{x.classList.remove("open");x.querySelector("button").setAttribute("aria-expanded","false")});
});
addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
/* size guide tabs */
document.addEventListener("click",e=>{const t=e.target.closest("[data-sg]");if(!t)return;const box=t.closest(".sg");
  $$("[data-sg]",box).forEach(b=>b.setAttribute("aria-selected",b===t));$$(".sg-panel",box).forEach(p=>p.classList.toggle("active",p.id===t.dataset.sg))});
function openSizeGuide(cat){openDrawer("sgModal");const m=$("#sgModal");m.classList.add("on");
  /* The surprise bag covers jeans AND a tee, so it gets its own chart rather
     than borrowing the denim one. */
  const id=cat==="bundle"?"sgBag":/tee/.test(cat)?"sgTees":cat==="women_st"?"sgTrack":"sgDenim";const b=$(`#sgModal [data-sg="${id}"]`);b&&b.click()}

/* ── CARDS ── */
function card(p){const alt=(p.gallery||[]).map(g=>g.src||g).find(s=>s&&s!==p.img);
  return `<article class="card">${badge(p)}${heartBtn(p.id)}<div class="ph-wrap"><a class="ph" href="${purl(p.id)}" aria-label="${esc(p.name)}"><img src="${esc(asset(p.img))}" alt="${esc(p.name)}" loading="lazy">${alt?`<img class="alt" src="${esc(asset(alt))}" alt="" loading="lazy">`:""}</a>
  <button class="qlook mono" type="button" data-qlook="${p.id}">Quick look</button></div>
  <div class="row"><a class="nm" href="${purl(p.id)}">${esc(p.name)}</a><span class="pr">${money(p.price)}</span></div><div class="sub">${esc(p.collection||"")}</div></article>`}

/* ── RECENTLY VIEWED ── */
const recent=()=>store.get("recent",[]).filter(id=>byId(id));
function pushRecent(id){store.set("recent",[id,...recent().filter(x=>x!==id)].slice(0,10))}
function paintRecent(skip){const box=$("#recentBox");if(!box)return;const ids=recent().filter(x=>x!==skip);
  if(!ids.length){box.closest("section").hidden=true;return}box.closest("section").hidden=false;box.innerHTML=ids.map(id=>card(byId(id))).join("")}

/* ═══════════ PAGES ═══════════ */
const page=document.body.dataset.page;

/* COLLECTION */
const CATS={men_all:["men","tees"],women_all:["women","tees","women_wear","women_st"],all_jeans:["men","women","anime"],men:["men"],women:["women"],tees:["tees"],anime:["anime"],women_wear:["women_wear"],track:["women_st"]};
if(page==="collection"){
  const key=document.body.dataset.cat,cfg=(K.cfg.CATEGORY_CONFIGS||{})[key]||{};
  let list=K.products.filter(p=>(CATS[key]||[]).includes(p.category));
  if(key==="all_jeans")list=list.filter(p=>!p.archived);
  const order=cfg.featuredIds||[];
  const featuredSort=(a,b)=>{const ia=order.indexOf(a.id),ib=order.indexOf(b.id);return (ia<0?99:ia)-(ib<0?99:ib)||(a.archived-b.archived)||a.id-b.id};
  const grid=$("#grid"),cnt=$("#count"),sel=$("#sort");
  function draw(){const v=sel.value;const l=[...list].sort(v==="lo"?(a,b)=>a.price-b.price:v==="hi"?(a,b)=>b.price-a.price:v==="new"?(a,b)=>b.id-a.id:featuredSort);
    grid.innerHTML=l.map(card).join("");cnt.textContent=l.length+(l.length===1?" piece":" pieces")}
  sel.addEventListener("change",draw);draw();
}

/* PRODUCT */
if(page==="product"){
  const root=$("#pdp");let p,size=null,gi=0;
  function render(){
    /* On a /products/<slug>.html page the id is baked into the body, so the page has
       real content at the indexed URL instead of depending on a hash. */
    const m=/^#p(\d+)$/.exec(location.hash);
    p=(m&&byId(m[1]))||(document.body.dataset.pid&&byId(document.body.dataset.pid));size=null;gi=0;
    if(!p){root.innerHTML=`<div class="doc" style="text-align:center"><h2>Piece not found</h2><p>This link doesn't point to a piece in the drop.</p><a class="btn" href="men-all.html">Shop the drop</a></div>`;return}
    if(!document.body.dataset.pid)document.title=p.name+" — KRYPTAA";pushRecent(p.id);
    if(window.KAPI)KAPI.track("view_item",{value:p.price,ids:[String(p.id)],
      items:[{item_id:String(p.id),item_name:p.name,price:p.price,item_category:p.category}]});
    const gal=(p.gallery&&p.gallery.length?p.gallery:[{src:p.img,label:"Front"}]).map(g=>typeof g==="string"?{src:g,label:""}:g);
    const revs=(K.reviews||[]).filter(r=>r.pid===p.id);
    const cfgKey={men:"men",women:"women",tees:"tees",anime:"anime",women_wear:"women_wear",women_st:"track",bundle:"men_all"}[p.category];
    const cc=(K.cfg.CATEGORY_CONFIGS||{})[cfgKey]||{};
    const buy=canBuy(p);const pre=isPre(p);
    const btnTxt=p.archived?"Coming soon":!buy?"Contact to order":pre?"Pre-order — add to bag":"Add to bag";
    const acc=[["The story",p.story||p.desc],["Fit",p.fit],["Materials",p.materials],["Construction",p.technical],["Artwork",p.artisticConcept],["Finish",p.finish],["Shipping",p.shipping],["The KRYPTAA uniform",p.brandConnection]].filter(x=>x[1]);
    root.innerHTML=`<div class="crumbs mono"><a href="index.html">Home</a>/<a href="${cc.href||"men-all.html"}">${esc(cc.title||"Shop")}</a>/<span>${esc(p.name)}</span></div>
    <div class="pdp" style="padding-top:0">
      <div class="gal"><div class="main"><img id="gMain" src="${esc(asset(gal[0].src))}" alt="${esc(p.name)}"><span class="lab mono" id="gLab">${esc(gal[0].label||"")}</span><button class="gnav prev" type="button" aria-label="Previous image"><img src="${DEPTH}img/trident.webp" alt="" aria-hidden="true"></button><button class="gnav next" type="button" aria-label="Next image"><img src="${DEPTH}img/trident.webp" alt="" aria-hidden="true"></button></div>
        ${gal.length>1?`<div class="thumbs" role="group" aria-label="Photos">${gal.map((g,i)=>`<button type="button" data-g="${i}" aria-pressed="${i===0}" aria-label="${esc(g.label||"Photo "+(i+1))}"><img src="${esc(asset(g.src))}" alt="" loading="lazy"></button>`).join("")}</div>`:""}</div>
      <div class="info-col">
        <div class="eyebrow">${esc(p.collection||"")}</div>
        <h1>${esc(p.name)}</h1>
        ${revs.length?`<a href="#reviewsBlk" class="stars" style="text-decoration:none">★★★★★ <span class="mono" style="color:var(--ash)">${revs.length} review${revs.length>1?"s":""}</span></a>`:""}
        <div class="price">${money(p.price)}</div>
        <div class="avail mono ${p.archived||!buy?"off":pre?"pre":""}"><i></i>${esc(p.archived?(p.restockDate||"Coming soon"):p.availability)}</div>
        <p style="color:#c9bfae;margin:0">${esc(p.desc||"")}</p>
        ${buy?`<div><div class="row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><span class="mono">Size</span><button class="link" type="button" id="sgBtn">Size guide</button></div>
          <div class="sizes" id="sizes">${p.sizes.map(z=>{const so=soldOut(p,z),q=stockOf(p,z);return `<button type="button" data-z="${esc(z)}" aria-pressed="false" ${so?"disabled aria-label=\""+esc(z)+" sold out\"":""}>${esc(z)}${!so&&q!=null&&q<=LOW?'<span class="lo">'+q+' left</span>':""}</button>`}).join("")}</div>
          <div class="lowmsg mono" id="lowmsg" aria-live="polite"></div></div>`:""}
        <div class="buy"><button class="btn" type="button" id="addBtn" ${p.archived?"disabled":""}>${btnTxt}</button>${heartBtn(p.id)}</div>
        <div class="trust"><div><b>Free shipping</b><span class="mono">Over $60</span></div><div><b>Ships in</b><span class="mono">3–7 days</span></div><div><b>Secure</b><span class="mono">Stripe checkout</span></div></div>
        <div class="acc">${acc.map((a,i)=>`<details${i===0?" open":""}><summary>${a[0]}</summary><div class="ac">${esc(a[1])}</div></details>`).join("")}</div>
      </div></div>`;
    $$("[data-g]",root).forEach(b=>b.onclick=()=>{gi=+b.dataset.g;$("#gMain").src=gal[gi].src;$("#gLab").textContent=gal[gi].label||"";$$("[data-g]",root).forEach(x=>x.setAttribute("aria-pressed",x===b))});
    $$("#sizes [data-z]").forEach(b=>b.onclick=()=>{size=b.dataset.z;$$("#sizes [data-z]").forEach(x=>x.setAttribute("aria-pressed",x===b));const q=stockOf(p,size);$("#lowmsg").textContent=q!=null&&q<=LOW?`Only ${q} left in ${size}`:""});
    const sg=$("#sgBtn");sg&&(sg.onclick=()=>openSizeGuide(p.category));
    $("#addBtn").onclick=()=>{if(p.archived)return;if(!buy){location.href="contact.html";return}
      if(!size&&p.sizes.length>1){$("#lowmsg").textContent="Pick a size first";$("#lowmsg").style.color="#e0535a";$("#sizes").animate&&!reduce&&$("#sizes").animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],{duration:300});return}
      addToBag(p.id,size||p.sizes[0]||"One size")};
    /* reviews + related */
    const rb=$("#reviewsBlk");if(rb){rb.hidden=!revs.length;$("#prodReviews").innerHTML=revs.map(rvCard).join("")}
    const rel=K.products.filter(x=>x.category===p.category&&x.id!==p.id&&!x.archived).slice(0,8);
    $("#related").innerHTML=(rel.length?rel:K.products.filter(x=>x.id!==p.id&&!x.archived).slice(0,8)).map(card).join("");
    /* Arrows for the gallery: the thumbnail strip alone gave no way to page
       through on a phone. */
    (function(){
      const main=$("#gMain"),lab=$("#gLab");if(!main)return;
      const go=d=>{gi=(gi+d+gal.length)%gal.length;
        main.src=asset(gal[gi].src);if(lab)lab.textContent=gal[gi].label||"";
        $$(".gal .thumbs button").forEach((b,i)=>b.setAttribute("aria-pressed",String(i===gi)))};
      const pv=$(".gal .gnav.prev"),nx=$(".gal .gnav.next");
      pv&&(pv.onclick=()=>go(-1));nx&&(nx.onclick=()=>go(1));
      if(gal.length<2){pv&&(pv.hidden=true);nx&&(nx.hidden=true)}
    })();
    paintRecent(p.id);scrollTo(0,0);
  }
  addEventListener("hashchange",render);render();
}

/* REVIEWS */
function rvCard(r){const p=byId(r.pid);return `<article class="rv"><div class="ph"><img src="${esc(asset(r.img))}" alt="${esc(r.author)} wearing the ${esc(p?p.name:"")}" loading="lazy" style="object-position:${esc(r.pos||"50% 20%")}"></div><div class="bd">
  <div class="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>${esc(r.body)}</blockquote>
  <div class="who"><b>${esc(r.author)}</b>${r.tag==="ver"?'<span class="ver mono">✓ Verified buyer</span>':r.tag==="crew"?'<span class="crew mono">Crew fit check</span>':""}
  <span class="on mono">On <a href="${purl(r.pid)}">${esc(p?p.name:"")}</a> · Size ${esc(r.size)}</span></div></div></article>`}
if(page==="reviews"){$("#allReviews").innerHTML=(K.reviews||[]).map(rvCard).join("")}

/* WISHLIST */
if(page==="wishlist"){const draw=()=>{const g=$("#grid"),em=$("#wEmpty");$("#wCount").textContent=wish.length+" saved";
  g.innerHTML=wish.map(id=>card(byId(id))).join("");em.hidden=!!wish.length;g.hidden=!wish.length};draw();document.addEventListener("wish:change",draw)}

/* CHECKOUT — live Stripe.
   The percentages here only draw the estimate. The Worker re-reads the coupon and
   re-prices every line from its own catalog, so what Stripe charges never depends
   on anything this browser says. */
if(page==="checkout"){
  let applied=null,pct=0;
  const lineItems=()=>bag.map(l=>{const p=byId(l.id);return{item_id:String(l.id),item_name:p.name,price:p.price,quantity:l.qty,item_variant:l.size}});
  const draw=()=>{const box=$("#coLines"),has=bag.length;$("#coEmpty").hidden=has;$("#coFull").hidden=!has;if(!has)return;
    box.innerHTML=bag.map(l=>{const p=byId(l.id);return `<div class="line"><img src="${esc(asset(p.img))}" alt=""><div><a class="nm" href="${purl(p.id)}">${esc(p.name)}</a><div class="meta">Size ${esc(l.size)} · Qty ${l.qty}</div><div class="row"><span class="pr">${money(p.price*l.qty)}</span><button class="rm" type="button" data-rm="${esc(l.key)}">Remove</button></div></div></div>`}).join("");
    const sub=bagTotal(),disc=applied?Math.round(sub*pct*100)/100:0;
    $("#coSub").textContent=money(sub);$("#coDiscRow").hidden=!applied;$("#coDiscLbl").textContent=applied?`Discount (${Math.round(pct*100)}% off · ${applied})`:"";$("#coDisc").textContent="−"+money(disc);
    $("#coShip").textContent=sub-disc>=FREE?"Free":"Calculated at checkout";$("#coTotal").textContent=money(sub-disc);$("#payBtn").textContent="🔒 Pay now — "+money(sub-disc)};
  draw();document.addEventListener("bag:change",draw);
  if(bag.length&&window.KAPI)KAPI.track("begin_checkout",{value:bagTotal(),items:lineItems(),ids:bag.map(l=>String(l.id)),count:bagCount()});

  /* Coupon — the Worker is the authority. A referral code is also checked against
     the shopper's own email there, so nobody can spend their own code. */
  const ap=c=>{c=String(c||"").trim().toUpperCase();const m=$("#coupMsg");m.classList.remove("err");
    if(!c){m.classList.add("err");m.textContent="Enter a code first.";return}
    if(!window.KAPI){m.classList.add("err");m.textContent="Can't check codes right now.";return}
    m.textContent="Checking…";
    KAPI.coupon(c,$("#coEmail")?$("#coEmail").value.trim():"").then(d=>{
      if(d&&d.ok){applied=d.code;pct=(Number(d.percentOff)||0)/100;m.classList.remove("err");m.textContent=d.code+" applied — "+Math.round(pct*100)+"% off";draw()}
      else{applied=null;pct=0;m.classList.add("err");
        m.textContent=d&&d.reason==="self"?"That's your own referral code — share it instead.":"That code isn't valid.";draw()}
    }).catch(()=>{m.classList.add("err");m.textContent="Couldn't check that code. Try again."})};
  $("#coupForm").addEventListener("submit",e=>{e.preventDefault();ap($("#coupCode").value)});
  $("#promoBanner").addEventListener("click",()=>{$("#coupCode").value="KRYPTAA12";ap("KRYPTAA12")});

  $("#payForm").addEventListener("submit",e=>{e.preventDefault();
    const m=$("#payMsg"),btn=$("#payBtn"),v=$("#coEmail").value.trim();m.classList.remove("err");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.classList.add("err");m.textContent="Enter a full email, like name@gmail.com.";return}
    if(!bag.length){m.classList.add("err");m.textContent="Your bag is empty.";return}
    if(!window.KAPI){m.classList.add("err");m.textContent="Checkout isn't available right now. Email hello@kryptaa.com and we'll send a payment link.";return}
    const label=btn.textContent;btn.disabled=true;btn.textContent="Opening secure payment…";m.textContent="";
    const restore=()=>{btn.disabled=false;btn.textContent=label};
    KAPI.checkout(bag.map(l=>({id:l.id,size:l.size,qty:l.qty})),v,applied)
      .then(d=>{if(d&&d.url){location.replace(d.url);return}
        m.classList.add("err");m.textContent="Payment error: "+((d&&d.error)||"could not start checkout");restore()})
      .catch(err=>{const off=err&&(err.code===502||err.code===503||err.message==="offline");
        m.classList.add("err");
        m.textContent=off
          ?"Checkout is briefly offline. DM @kryptaa__ on Instagram or email hello@kryptaa.com with what you'd like and we'll send a secure payment link within the hour — your bag is saved."
          :"Network error. Please try again.";
        KAPI.ga("checkout_unavailable",{reason:off?"backend_503":"network"});restore()})});
}

/* JOURNAL */
if(page==="journal"){$("#posts").innerHTML=(K.journal||[]).map(j=>`<article class="card"><a class="ph" href="${jurl(j.slug)}" style="aspect-ratio:16/11"><img src="${esc(asset(j.hero))}" alt="${esc(j.heroAlt||"")}" loading="lazy"></a>
  <div class="sub">${new Date(j.date+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} · ${j.readMins} min</div><a class="nm" href="${jurl(j.slug)}" style="font-family:var(--f-display);font-size:24px;font-weight:800;text-transform:uppercase;line-height:1.05">${esc(j.title)}</a><p style="color:var(--ash);margin:0">${esc(j.desc)}</p></article>`).join("")}
if(page==="post"){const show=()=>{const s=location.hash.slice(1)||document.body.dataset.slug||"",
    j=(K.journal||[]).find(x=>x.slug===s)||(K.journal||[])[0];if(!j)return;
  if(!document.body.dataset.slug)document.title=j.title+" — KRYPTAA Journal";$("#postHead").innerHTML=`<div class="crumbs mono"><a href="index.html">Home</a>/<a href="journal.html">Journal</a></div><h1 style="font-size:clamp(40px,6vw,84px)">${esc(j.title)}</h1><p>${esc(j.desc)}</p><div class="mono" style="color:var(--ash);margin-top:14px">${new Date(j.date+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} · ${j.readMins} min read</div>`;
  $("#postImg").innerHTML=`<img src="${esc(asset(j.hero))}" alt="${esc(j.heroAlt||"")}" style="width:100%;max-height:70vh;object-fit:cover">`;
  $("#postBody").innerHTML=j.body;const others=(K.journal||[]).filter(x=>x!==j).slice(0,3);
  $("#more").innerHTML=others.map(o=>`<article class="card"><a class="ph" href="${jurl(o.slug)}" style="aspect-ratio:16/11"><img src="${esc(asset(o.hero))}" alt="" loading="lazy"></a><a class="nm" href="${jurl(o.slug)}">${esc(o.title)}</a></article>`).join("");scrollTo(0,0)};
  addEventListener("hashchange",show);show()}

/* TRACK ORDER — live, email + one-time code.
   The Worker answers step 1 identically whether or not the address has orders, so
   this page can never be used to find out who has bought. Orders are only returned
   after the code is verified. */
if(page==="track"){let step=1;
  const out=document.createElement("div");out.className="rowcards";out.style.cssText="margin-top:26px;grid-auto-flow:row;grid-auto-columns:auto";
  $("#trackForm").after(out);
  const render=orders=>{
    if(!orders||!orders.length){out.innerHTML='<p class="mono" style="color:var(--ash)">No paid orders found for that address.</p>';return}
    out.innerHTML=orders.map(o=>`<article class="card" style="padding:16px">
      <div class="eyebrow">Order #${esc(o.orderNum)}</div>
      <div class="mono" style="color:var(--ash);font-size:11px;margin:4px 0 10px">${esc(new Date((Number(o.created)||0)*1000).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}))}</div>
      ${(o.items||[]).map(i=>`<div style="display:flex;justify-content:space-between;gap:12px;padding:4px 0;color:#c9bfae"><span>${esc(i.name)} × ${esc(i.qty)}</span><span>$${esc(i.total)}</span></div>`).join("")}
      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--rule);margin-top:8px;padding-top:8px"><b>Total</b><b>$${esc(o.total)}</b></div>
      <div class="mono" style="color:var(--ash);font-size:11px;margin-top:8px">Ships to ${esc(o.shippingAddress)}</div>
      <div class="mono" style="color:var(--ash);font-size:11px;margin-top:6px">Your tracking number is emailed to you the moment the parcel is scanned.</div>
    </article>`).join("")};
  $("#trackForm").addEventListener("submit",e=>{e.preventDefault();
    const m=$("#trMsg"),btn=$("#trBtn");m.classList.remove("err");
    const v=$("#trEmail").value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.classList.add("err");m.textContent="Enter the email you used at checkout.";return}
    if(!window.KAPI){m.classList.add("err");m.textContent="Order lookup isn't available right now.";return}
    const code=step===2?$("#trCode").value.trim():"";
    if(step===2&&!/^\d{6}$/.test(code)){m.classList.add("err");m.textContent="Enter the 6-digit code from your email.";return}
    const label=btn.textContent;btn.disabled=true;btn.textContent="Working…";m.textContent="";
    KAPI.order(v,code).then(d=>{
      btn.disabled=false;
      if(d&&d.error){m.classList.add("err");m.textContent=d.error;btn.textContent=label;return}
      if(d&&d.sent){step=2;$("#codeRow").hidden=false;btn.textContent="View orders →";m.textContent=d.message||"Check your email for a 6-digit code. It expires in 10 minutes.";return}
      btn.textContent=label;render(d&&d.orders)})
      .catch(err=>{btn.disabled=false;btn.textContent=label;m.classList.add("err");
        m.textContent=err&&err.code===429?"Too many tries. Wait 10 minutes and try again.":"Couldn't reach the order system. Try again."})})}

/* CONTACT copy email */
$$("[data-copy]").forEach(b=>b.addEventListener("click",async()=>{const t=b.dataset.copy;try{await navigator.clipboard.writeText(t);toast("Copied "+t)}catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling||b);const s=getSelection();s.removeAllRanges();s.addRange(r);toast("Select and copy the email")}}));

/* Join the club — POSTs to the Worker, which stores the address and pings the shop.
   The reply is identical for a new and an existing address, so the form cannot be
   used to find out who is on the list. */
$$("form[data-club]").forEach(f=>f.addEventListener("submit",e=>{e.preventDefault();
  const i=f.querySelector("input"),btn=f.querySelector("button"),m=f.parentElement.querySelector(".msg");
  m.classList.remove("err");
  const v=i.value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){m.classList.add("err");m.textContent="Enter a full email, like name@gmail.com.";return}
  if(!window.KAPI){m.classList.add("err");m.textContent="Can't sign you up right now. Try again shortly.";return}
  const label=btn?btn.textContent:"";if(btn){btn.disabled=true;btn.textContent="Joining…"}
  m.textContent="";
  fetch(KAPI.url+"club-signup",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email:v,source:f.dataset.club||document.body.dataset.page||"site"})})
    .then(r=>r.json().then(d=>({s:r.status,d})))
    .then(({s,d})=>{
      if(btn){btn.disabled=false;btn.textContent=label}
      if(s===200&&d&&d.ok){m.textContent="You're in. Drop 001 news lands in your inbox first.";i.value="";
        KAPI.ga("sign_up",{method:"club"});KAPI.fb("Lead",{content_name:"club"})}
      else{m.classList.add("err");m.textContent=(d&&d.error)||"Couldn't sign you up. Try again."}})
    .catch(()=>{if(btn){btn.disabled=false;btn.textContent=label}
      m.classList.add("err");m.textContent="Network error. Try again."})}));

/* add-to-bag buttons outside the product page (surprise bag etc.) */
document.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;e.preventDefault();location.href=purl(b.dataset.add)});

/* boot */
paintCounts();renderBag();paintRecent();
/* ── QUICK LOOK ──────────────────────────────────────────────────────────
   A collection page used to show one cropped photo per piece, so the only way
   to judge anything was to open the product page. This opens the gallery, the
   sizes and add-to-bag in place. */
(function(){
  const host=document.createElement("div");
  host.className="modal"; host.id="qlModal"; host.setAttribute("aria-hidden","true");
  host.setAttribute("role","dialog"); host.setAttribute("aria-label","Quick look");
  host.innerHTML='<div class="box ql"><button class="x" type="button" data-close aria-label="Close quick look">\u2715</button><div class="ql-in"></div></div>';
  document.body.appendChild(host);
  let qp=null,qsize=null,qi=0;

  function draw(){
    if(!qp)return;
    const gal=(qp.gallery&&qp.gallery.length?qp.gallery:[{src:qp.img,label:""}]);
    const q=stockOf(qp,qsize);
    host.querySelector(".ql-in").innerHTML=`
      <div class="ql-gal">
        <div class="ql-main"><img src="${esc(asset((gal[qi]||gal[0]).src))}" alt="${esc(qp.name)}">${gal.length>1?`<button class="gnav prev" type="button" data-step="-1" aria-label="Previous image"><img src="${DEPTH}img/trident.webp" alt="" aria-hidden="true"></button><button class="gnav next" type="button" data-step="1" aria-label="Next image"><img src="${DEPTH}img/trident.webp" alt="" aria-hidden="true"></button>`:""}</div>
        <div class="ql-thumbs">${gal.slice(0,8).map((g,i)=>`<button type="button" data-g="${i}" aria-current="${i===qi}"><img src="${esc(asset(g.src))}" alt="${esc(g.label||"")}" loading="lazy"></button>`).join("")}</div>
      </div>
      <div class="ql-info">
        <div class="eyebrow">${esc(qp.collection||"Drop 001")}</div>
        <h3>${esc(qp.name)}</h3>
        <div class="ql-price">${money(qp.price)}</div>
        <p>${esc((qp.desc||"").slice(0,180))}</p>
        <div class="sizes ql-sizes">${qp.sizes.map(z=>{const so=soldOut(qp,z),left=stockOf(qp,z);
          return `<button type="button" data-z="${esc(z)}" aria-pressed="${z===qsize}" ${so?"disabled":""}>${esc(z)}${!so&&left!=null&&left<=LOW?`<span class="lo">${left} left</span>`:""}</button>`}).join("")}</div>
        <div class="msg mono ql-msg">${qsize&&q!=null&&q<=LOW?q+" left in "+esc(qsize):""}</div>
        <button class="btn ql-add" type="button">Add to bag</button>
        <a class="btn ghost" href="${purl(qp.id)}">Full details \u2192</a>
      </div>`;
  }

  function open(id){
    qp=byId(id); if(!qp)return;
    qsize=qp.sizes.length===1?qp.sizes[0]:null; qi=0; draw();
    openDrawer("qlModal"); host.classList.add("on");
    if(window.KAPI)KAPI.track("view_item",{value:qp.price,ids:[String(qp.id)],
      items:[{item_id:String(qp.id),item_name:qp.name,price:qp.price}]});
  }

  document.addEventListener("click",e=>{
    const t=e.target.closest("[data-qlook]");
    if(t){e.preventDefault();open(Number(t.dataset.qlook));return}
    if(!host.classList.contains("on"))return;
    const st=e.target.closest("#qlModal [data-step]");
    if(st){const gl=(qp.gallery&&qp.gallery.length?qp.gallery:[{src:qp.img}]);
      qi=(qi+Number(st.dataset.step)+gl.length)%gl.length;draw();return}
    const g=e.target.closest("#qlModal [data-g]"); if(g){qi=Number(g.dataset.g);draw();return}
    const z=e.target.closest("#qlModal .ql-sizes button"); if(z&&!z.disabled){qsize=z.dataset.z;draw();return}
    if(e.target.closest("#qlModal .ql-add")){
      if(!qsize&&qp.sizes.length>1){const m=host.querySelector(".ql-msg");m.textContent="Pick a size first";m.classList.add("err");return}
      addToBag(qp.id,qsize||qp.sizes[0]||"One size"); host.classList.remove("on");
    }
  });
  host.addEventListener("click",e=>{if(e.target===host)host.classList.remove("on")});
})();

window.KRY={addToBag,card,byId,money,openDrawer,toast,rvCard};
})();
