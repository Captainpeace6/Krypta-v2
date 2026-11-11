/* KRYPTAA — premium category landing: hero product cycle + 3D tilt, isometric stack, close-look callouts, showcase parallax */
(function(){
const LD=window.LD||[];if(!LD.length)return;
const K=window.K||{};const ST=K.stock||{};const LOW=5;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=v=>"$"+(v%1?v.toFixed(2):v);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function stockLine(id,av){if(av&&/pre-order|production/i.test(av))return '<span class="low">'+av+'</span>';
  const s=ST[id];if(!s)return '<span class="ok">In stock</span>';
  const e=Object.entries(s);const left=e.filter(([,q])=>q>0);
  if(!left.length)return '<span class="low">Sold out</span>';
  if(e.length===1&&e[0][0]==="Universal"){const q=e[0][1];return q<=LOW?'<span class="low">Only '+q+' left</span>':'<span class="ok">In stock · one size</span>'}
  const low=left.filter(([,q])=>q<=LOW);
  return low.length?'<span class="low">'+low.map(([z,q])=>"Only "+q+" left in "+z).join(" · ")+'</span>':'<span class="ok">In stock · '+left.map(([z])=>z).join(" ")+'</span>'}

/* wishlist buttons reflect saved state */
try{const w=JSON.parse(localStorage.getItem("kry_wish")||"[]");$$(".ld-save").forEach(b=>b.setAttribute("aria-pressed",w.includes(+b.dataset.heart)))}catch(e){}
$$("[data-stock]").forEach(el=>el.innerHTML=stockLine(+el.dataset.stock,el.dataset.avail));

/* ── HERO ── */
const prods=$$(".ld-prod"),selB=$$("#ldSel button"),beam=$(".ld-beam"),bar=$("#ldBar");
let cur=0,timer=null,t0=0;const DUR=5200;
function show(k,user){if(k===cur&&!user)return;const prev=prods[cur];cur=k;
  prods.forEach((p,i)=>{p.classList.toggle("on",i===k);p.classList.toggle("off",p===prev&&i!==k)});
  setTimeout(()=>prev&&prev.classList.remove("off"),900);
  if(beam&&!reduce){beam.classList.remove("go");void beam.offsetWidth;beam.classList.add("go")}
  selB.forEach((b,i)=>b.toggleAttribute("aria-current",i===k));
  const p=LD[k];$("#ldIdx").textContent=String(k+1).padStart(2,"0");$("#ldName").textContent=p.n;
  $("#ldMeta").innerHTML="<b>"+money(p.p)+"</b> · "+p.tags.slice(0,2).join(" / ")+"<br>"+stockLine(p.id,p.av);
  $("#ldShop").href="product.html#p"+p.id;$("#ldShop").textContent=p.av?"Pre-order this piece →":"Shop this piece →";t0=performance.now()}
function tick(now){if(!document.hidden&&!reduce){const f=(now-t0)/DUR;if(bar)bar.style.width=Math.min(100,f*100)+"%";if(f>=1)show((cur+1)%prods.length)}requestAnimationFrame(tick)}
show(0,true);requestAnimationFrame(tick);
selB.forEach((b,i)=>b.addEventListener("click",()=>show(i,true)));
const hero=$("#ldHero"),tilt=$("#ldTilt");
if(fine&&!reduce&&hero&&tilt){hero.addEventListener("pointermove",e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  tilt.style.transform=`rotateY(${x*22}deg) rotateX(${-y*10}deg)`});hero.addEventListener("pointerleave",()=>tilt.style.transform="")}

/* ── scroll-driven sections ── */
const stack=$("#ldStack"),iso=$("#ldIso"),anat=$("#ldAnat"),panels=$$(".ld-panel");
const dots=$$(".ld-an-fig .dot"),calls=$$(".call"),svg=$(".ld-lines"),fig=$(".ld-an-fig"),anK=$("#ldAnK");
const prog=el=>{const r=el.getBoundingClientRect(),h=el.offsetHeight-innerHeight;return h>0?clamp(-r.top/h,0,1):0};
let lastK=-1;
function lines(k){if(!svg||!fig)return;const c=calls[k];if(!c||innerWidth<=980){svg.innerHTML="";return}
  const fr=fig.getBoundingClientRect(),cr=c.getBoundingClientRect(),d=dots[k],dr=d.getBoundingClientRect();
  const x1=dr.left-fr.left,y1=dr.top-fr.top,left=c.classList.contains("r");
  const x2=(left?cr.right:cr.left)-fr.left,y2=cr.top+Math.min(cr.height/2,60)-fr.top,mx=x1+(x2-x1)*.55;
  svg.innerHTML=`<path d="M${x1},${y1} L${mx},${y1} L${mx},${y2} L${x2},${y2}"/>`}
function placeCalls(){if(!fig)return;const sr=fig.parentElement.getBoundingClientRect(),stk=anat.querySelector(".ld-sticky").getBoundingClientRect();
  calls.forEach((c,i)=>{if(innerWidth<=980){c.style.top="";return}const dr=dots[i].getBoundingClientRect();
    const top=clamp(dr.top-stk.top-60,90,stk.height-c.offsetHeight-20);c.style.top=top+"px"})}
function onScroll(){
  if(stack&&iso){const p=prog(stack);const sp=reduce?1:clamp(p/.75,0,1);const e=1-Math.pow(1-sp,3);stack.style.setProperty("--sp",e.toFixed(3))}
  if(anat){const p=prog(anat),n=calls.length;const k=clamp(Math.floor(p*n*1.0001),0,n-1);
    if(k!==lastK){lastK=k;dots.forEach((d,i)=>{d.classList.toggle("on",i<=k);d.classList.toggle("cur",i===k)});calls.forEach((c,i)=>c.classList.toggle("on",i===k));if(anK)anK.textContent=String(k+1).padStart(2,"0");placeCalls()}
    lines(k)}
  panels.forEach(pn=>{const r=pn.getBoundingClientRect();const v=clamp(r.top/innerHeight,-1,1);pn.style.setProperty("--pv",v.toFixed(3))});
}
let ticking=false;addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;onScroll()})}},{passive:true});
addEventListener("resize",()=>{placeCalls();onScroll()});
addEventListener("load",()=>{placeCalls();onScroll()});
onScroll();setTimeout(()=>{placeCalls();onScroll()},300);
})();
