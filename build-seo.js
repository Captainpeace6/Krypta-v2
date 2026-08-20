/* ─────────────────────────────────────────────────────────────
   KRYPTAA — Static SEO pre-render (Phase 1: collection crawlability)

   Reads products.js (single source of truth) and injects real, crawlable
   product cards + correct H1 / <title> / meta description / canonical /
   noscript-visibility into each collection HTML file's INITIAL markup.

   The card markup mirrors motion.js `productCard()` byte-for-byte (plus
   `is-visible` so it shows without JS), so motion.js hydrates the existing
   HTML instead of rebuilding it. Users and crawlers get identical content —
   no cloaking. Idempotent: safe to re-run after catalog changes.

   Run:  node build-seo.js
   ───────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');

/* Load products.js in a minimal browser shim */
global.window = {};
global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
global.document = { addEventListener() {}, readyState: 'complete', body: { dataset: {} } };
require(path.join(__dirname, 'products.js'));

const W = global.window;
const getProductsByCategory = W.getProductsByCategory;
const getCategoryConfig = W.getCategoryConfig;
const formatPrice = W.formatPrice || ((n) => '$' + Number(n).toFixed(2));
const SEO_META = W.SEO_META || {};

const BASE = 'https://www.kryptaa.com/';
const MC_POST = 'https://gmail.us12.list-manage.com/subscribe/post?u=450fbc81f41740fcc252b9629&id=010b1e7bb0&f_id=00e455e0f0';
const MC_HONEYPOT = 'b_450fbc81f41740fcc252b9629_010b1e7bb0';
const NEW_IDS = new Set([108, 109, 111, 112, 113, 50, 51, 52, 60, 61, 62]);

/* Mirror of motion.js productCard() — keep in sync. Adds `is-visible`. */
function staticProductCard(product) {
  const isTee = product.category === 'tees' || product.category === 'tops';
  const isAnime = product.category === 'anime';
  const isArchive = /archive/i.test(product.availability || '');
  const isLowStock = /low.?quantity|low.?stock/i.test(product.availability || '');
  const isSoldOut = !isAnime && isArchive;
  const isNew = NEW_IDS.has(product.id);
  const sizes = product.sizes || [];
  const tags = product.tags || [];
  return `
      <article class="product-card reveal is-visible${isSoldOut ? ' is-sold-out' : ''}">
        <a class="product-card-link" href="${W.productUrl(product)}" aria-label="View ${product.name}">
          <div class="product-card-media">
            <img src="${product.img}" alt="${product.name}" loading="lazy">
            ${isNew ? `<div class="k-new-badge">New</div>` : ''}
            ${isSoldOut ? `<div class="sold-out-stamp">Archive</div>` : ''}
            <button class="k-wish-btn" type="button" data-wish="${product.id}" aria-label="Save to wishlist"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
            <button class="k-qv-btn" type="button" data-qv="${product.id}" aria-label="Quick view ${product.name}">Quick View</button>
          </div>
          <div class="product-card-content">
            <div class="product-card-kicker">${product.collection}</div>
            <h3>${product.name}</h3>
            <p class="product-card-desc">${product.desc}</p>
            <div class="product-card-tags">${tags.slice(0, 3).map((tag) => `<span>${tag}</span>`).join('')}</div>
            <div class="product-card-footer">
              ${isAnime ? `<span class="product-price preorder-badge">Contact to Order</span>` : `<span class="product-price">${formatPrice(product.price)}</span>`}
              ${isLowStock ? `<span class="low-stock-badge">Only a few left</span>` : isArchive ? `` : `<span class="tag-list">${product.availability}</span>`}
            </div>
          </div>
        </a>
        ${isArchive ? `
          <div class="notify-strip">
            <div class="notify-strip-label">Notify me when back</div>
            <form class="notify-strip-row" action="${MC_POST}" method="POST" data-notify-card>
              <input type="hidden" name="PRODUCT" value="${product.name}">
              <div style="position:absolute;left:-5000px" aria-hidden="true"><input type="text" name="${MC_HONEYPOT}" tabindex="-1" value=""></div>
              <input type="email" name="EMAIL" placeholder="your@email.com" required>
              <button type="submit">Notify</button>
            </form>
          </div>
        ` : `
        <div class="product-card-quick">
          ${product.category === 'women_wear' ? `
          <div class="quick-sizes"><span class="quick-universal">Universal — Fits XS–XL</span></div>
          <button class="quick-add-btn ready" type="button" data-product-id="${product.id}" data-selected-size="Universal">Add to Bag</button>
          ` : `
          <div class="quick-sizes">
            ${sizes.map((s) => { const so = (product.soldOutSizes || []).includes(s); return `<button class="quick-size-btn${so ? ' is-sold-out' : ''}" type="button" data-size="${s}" data-product="${product.id}"${so ? ' disabled' : ''}>${s}</button>`; }).join('')}
            ${(isTee || product.category === 'men' || product.category === 'women' || product.category === 'women_st') ? `<button class="quick-sg-btn" type="button" data-size-guide="${product.category}" title="Size Guide">?</button>` : ''}
          </div>
          <button class="quick-add-btn" type="button" data-product-id="${product.id}">Add to Bag</button>
          `}
        </div>
        `}
      </article>`;
}

/* Every shop file → its data-shop category */
function shopFiles() {
  return fs.readdirSync(__dirname)
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const html = fs.readFileSync(path.join(__dirname, f), 'utf8');
      const m = html.match(/data-shop="([^"]+)"/);
      const hasGrid = /id="productsGrid"/.test(html);
      return m && hasGrid ? { file: f, category: m[1], html } : null;
    })
    .filter(Boolean);
}

function upsertHead(html, tagRegex, tag, insertAfterRegex) {
  if (tagRegex.test(html)) return html.replace(tagRegex, tag);
  return html.replace(insertAfterRegex, (mm) => mm + '\n' + tag);
}

let processed = 0, skipped = [];

for (const { file, category, html: original } of shopFiles()) {
  const products = getProductsByCategory(category) || [];
  const config = getCategoryConfig(category) || {};
  const seo = SEO_META[category];

  if (!products.length || !seo) { skipped.push(`${file} (${category}: ${products.length} products${seo ? '' : ', no SEO_META'})`); continue; }

  const url = BASE + file;
  // Duplicate-collection consolidation: women-streetwear-trousers.html holds the
  // same products as track-pants.html, so it canonicalizes to the preferred URL.
  const CANONICAL_OVERRIDE = { women_st: 'track-pants.html' };
  const canonUrl = BASE + (CANONICAL_OVERRIDE[category] || file);
  const cards = products.map(staticProductCard).join('\n');
  let html = original;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${seo.title}</title>`);
  html = upsertHead(html,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${seo.desc}">`,
    /<title>[\s\S]*?<\/title>/);
  html = upsertHead(html,
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonUrl}">`,
    /<link rel="icon"[^>]*>/);
  if (!/SEO:noscript/.test(html)) {
    html = html.replace(/<\/head>/, `<noscript><style>/*SEO:noscript*/.reveal{opacity:1!important;transform:none!important}.product-card{opacity:1!important}</style></noscript>\n</head>`);
  }

  html = html.replace(/<h1 id="shopTitle">[\s\S]*?<\/h1>/, `<h1 id="shopTitle">${config.title || ''}</h1>`);
  html = html.replace(/<div class="eyebrow reveal" id="shopLabel">[\s\S]*?<\/div>/, `<div class="eyebrow reveal" id="shopLabel">${config.label || 'KRYPTAA'}</div>`);
  html = html.replace(/<p class="shop-hero-copy reveal" id="shopDescription">[\s\S]*?<\/p>/, `<p class="shop-hero-copy reveal" id="shopDescription">${config.description || ''}</p>`);
  html = html.replace(/<div class="shop-count" id="shopCount">[\s\S]*?<\/div>/, `<div class="shop-count" id="shopCount">${products.length} pieces</div>`);
  // Idempotency: strip any prior injected block(s), then replace the grid's full inner content.
  html = html.replace(/<!--SEO:products-->[\s\S]*?<!--\/SEO:products-->/g, '');
  html = html.replace(/(<section class="products-grid[^"]*" id="productsGrid">)[\s\S]*?(<\/section>)/,
    `$1\n<!--SEO:products-->${cards}\n      <!--/SEO:products-->\n      $2`);

  if (html !== original) { fs.writeFileSync(path.join(__dirname, file), html); processed++; console.log(`✓ ${file.padEnd(32)} ${category.padEnd(11)} ${products.length} products`); }
}

console.log(`\nDone: ${processed} collection page(s) pre-rendered.`);
if (skipped.length) console.log('Skipped: ' + skipped.join(', '));

/* ─── Product pages: /products/<slug>.html (Phase 2) ─── */
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const PRODUCTS = W.PRODUCTS || [];
const REVIEWS = W.REVIEWS || {};
const getProductById = W.getProductById;
const productUrl = W.productUrl, productSlug = W.productSlug, productSeoTitle = W.productSeoTitle;

// Reuse the site's canonical footer (single source) so product pages carry the
// same crawlable static collection links as the rest of the site.
let SITE_FOOTER = '';
try {
  const ref = fs.readFileSync(path.join(__dirname, 'men.html'), 'utf8');
  const m = ref.match(/<footer class="site-footer">[\s\S]*?<\/footer>/);
  if (m) SITE_FOOTER = m[0];
} catch (e) {}

function productPage(product) {
  const cleanRel = productUrl(product);            // products/<slug>.html
  const cleanAbs = BASE + cleanRel;
  // One primary breadcrumb path per product — shared with motion.js + JSON-LD
  // via products.js productBreadcrumb() so all three stay identical.
  const bc = W.productBreadcrumb(product.category);
  const catHref = bc.href;
  const catTitle = bc.label;
  const title = productSeoTitle(product);
  const descFull = product.desc || '';
  const metaDesc = descFull.length > 160 ? descFull.slice(0, 157).replace(/\s+\S*$/, '') + '…' : descFull;
  const imgAbs = BASE + product.img;
  const isAnime = product.category === 'anime';
  const av = product.availability || '';
  const availability = (isAnime || /pre.?order|production/i.test(av)) ? 'https://schema.org/PreOrder'
    : /sold.?out|archive/i.test(av) ? 'https://schema.org/OutOfStock'
    : 'https://schema.org/InStock';
  const priceDisplay = formatPrice(product.price); // matches the JS PDP (anime shows price + a Contact-to-Order button)
  const tags = (product.tags || []).slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('');
  const sizes = product.sizes || [];

  const ld = {
    '@context': 'https://schema.org/', '@type': 'Product',
    name: product.name, description: descFull, image: [imgAbs],
    brand: { '@type': 'Brand', name: 'KRYPTAA' },
    sku: 'KRYPTAA-' + product.id, itemCondition: 'https://schema.org/NewCondition',
    offers: { '@type': 'Offer', url: cleanAbs, priceCurrency: 'USD', price: product.price, availability, seller: { '@type': 'Organization', name: 'KRYPTAA' } },
  };
  const revs = REVIEWS[product.id] || [];
  if (revs.length) {
    const avg = revs.reduce((s, r) => s + (+r.rating || 0), 0) / revs.length;
    ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: avg.toFixed(1), reviewCount: revs.length, bestRating: 5 };
    ld.review = revs.slice(0, 5).map((r) => ({ '@type': 'Review', reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 }, author: { '@type': 'Person', name: r.author || 'Verified Buyer' }, reviewBody: r.body }));
  }
  const crumbLd = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
    { '@type': 'ListItem', position: 2, name: catTitle, item: BASE + catHref },
    { '@type': 'ListItem', position: 3, name: product.name, item: cleanAbs },
  ] };

  const buy = isAnime
    ? `<a class="k-btn-gold anime-contact-btn" href="https://www.instagram.com/kryptaa__/" target="_blank" rel="noopener" style="display:inline-block;text-align:center;padding:16px 28px;text-decoration:none;">Contact to Order</a>`
    : product.category === 'women_wear'
    ? `<div class="universal-size-badge">Universal Size — Fits XS–XL</div><div class="pdp-add-row"><button class="k-btn-gold" id="addToBagBtn" type="button">Add To Bag</button></div>`
    : `<div class="size-selector">${sizes.map((s) => `<button class="size-chip" type="button" data-size="${esc(s)}">${esc(s)}</button>`).join('')}</div><div class="pdp-add-row"><button class="k-btn-gold" id="addToBagBtn" type="button">Add To Bag</button></div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
   if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
   n.queue=[];t=b.createElement(e);t.async=!0;
   t.src=v;s=b.getElementsByTagName(e)[0];
   s.parentNode.insertBefore(t,s)}(window, document,'script',
                                   'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '2070231503594050');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2070231503594050&ev=PageView&noscript=1"/></noscript>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-242EQ24FP3"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-242EQ24FP3');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<base href="/">
<title>${esc(title)}</title>
<meta name="description" content="${esc(metaDesc)}">
<link rel="canonical" href="${cleanAbs}">
<meta property="og:site_name" content="KRYPTAA">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(metaDesc)}">
<meta property="og:image" content="${imgAbs}">
<meta property="og:url" content="${cleanAbs}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(metaDesc)}">
<meta name="twitter:image" content="${imgAbs}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Cinzel+Decorative:wght@700;900&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;600;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="global.css">
<link rel="icon" type="image/webp" href="imgs/kryptaa-sigil.webp">
<script type="application/ld+json" id="k-jsonld">${JSON.stringify(ld)}</script>
<script type="application/ld+json" id="k-breadcrumb">${JSON.stringify(crumbLd)}</script>
<script defer src="products.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script defer src="motion.js"></script>
<noscript><style>/*SEO:noscript*/.reveal{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body data-page="product" data-product-id="${product.id}">
<div class="k-grain"></div>
<main class="detail-page" id="productDetail">
  <div class="section-shell"><nav class="pdp-breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="${catHref}">${esc(catTitle)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(product.name)}</span></nav></div>
  <section class="detail-hero section-shell">
    <div class="detail-media pg-gallery reveal is-visible"><div class="pg-main-wrap"><img class="pg-main-img" id="pgMainImg" src="${product.img}" alt="${esc(product.name)} — KRYPTAA"></div></div>
    <div class="detail-copy reveal is-visible">
      <a class="eyebrow" href="${catHref}">${esc(product.collection)}</a>
      <h1 class="detail-title">${esc(product.name)}</h1>
      <div class="detail-price">${priceDisplay}</div>
      <p>${esc(descFull)}</p>
      <div class="detail-tags">${tags}</div>
      <div class="buy-panel">${buy}</div>
    </div>
  </section>
</main>
${SITE_FOOTER}
</body>
</html>
`;
}

const outDir = path.join(__dirname, 'products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
let prodCount = 0;
for (const product of PRODUCTS) {
  const slug = productSlug(product);
  fs.writeFileSync(path.join(outDir, slug + '.html'), productPage(product));
  prodCount++;
}
console.log(`\nProduct pages: ${prodCount} written to /products/`);

/* Rewrite hardcoded product links in lookbook.html to the clean URLs */
try {
  const lbPath = path.join(__dirname, 'lookbook.html');
  let lb = fs.readFileSync(lbPath, 'utf8');
  const before = lb;
  lb = lb.replace(/product-detail(?:\.html)?\?id=(\d+)/g, (m, id) => { const p = getProductById(id); return p ? productUrl(p) : m; });
  if (lb !== before) { fs.writeFileSync(lbPath, lb); console.log('✓ lookbook.html product links rewritten to clean URLs'); }
} catch (e) {}

/* ─── sitemap.xml (Phase 3): generated from the same product data ───
   Only canonical, indexable, HTTP-200 URLs on the preferred host (https + www).
   Excluded on purpose: checkout, cart/bag, orders, inventory (admin), wishlist,
   track (order-tracking utility), logo-sting (splash), 404, product-detail.html
   (legacy ?id= shell — clean /products/ pages are the canonical product URLs),
   and the duplicate collection women-streetwear-trousers (canonicalizes to
   track-pants). jeans.html is included as the All Denim landing (Phase 4). */
const SITEMAP_LASTMOD = new Date().toISOString().slice(0, 10);
// Intended-primary collection URLs (one per search intent; duplicates excluded)
const SITEMAP_COLLECTIONS = [
  ['men-all.html', '0.9'],   // All Men's (nav parent)
  ['women-all.html', '0.9'], // All Women's (nav parent)
  ['men.html', '0.8'],       // Men's Denim
  ['women.html', '0.8'],     // Women's Denim
  ['anime.html', '0.8'],     // Anime Denim
  ['t-shirts.html', '0.8'],  // T-Shirts
  ['women-wear.html', '0.7'],// Women Wear
  ['track-pants.html', '0.7'],// Track Pants (primary; women-streetwear-trousers canonicalizes here)
  ['jeans.html', '0.7']      // All Denim (cross-category denim landing)
];
// Informational / editorial pages with meaningful standalone content
const SITEMAP_INFO = [
  ['lookbook.html', '0.6'],
  ['reviews.html', '0.5'],
  ['info.html', '0.4']       // Shipping & Returns
];
function sitemapNode(loc, priority, changefreq) {
  return '  <url>\n' +
    '    <loc>' + BASE + loc + '</loc>\n' +
    '    <lastmod>' + SITEMAP_LASTMOD + '</lastmod>\n' +
    '    <changefreq>' + changefreq + '</changefreq>\n' +
    '    <priority>' + priority + '</priority>\n' +
    '  </url>\n';
}
let sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
sm += sitemapNode('', '1.0', 'weekly'); // homepage -> https://www.kryptaa.com/
SITEMAP_COLLECTIONS.forEach(([loc, pr]) => { sm += sitemapNode(loc, pr, 'weekly'); });
// All 27 clean product pages, deterministic order by slug
[...PRODUCTS].sort((a, b) => productSlug(a).localeCompare(productSlug(b)))
  .forEach((p) => { sm += sitemapNode(productUrl(p), '0.7', 'weekly'); });
SITEMAP_INFO.forEach(([loc, pr]) => { sm += sitemapNode(loc, pr, 'monthly'); });
sm += '</urlset>\n';
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sm);
const smCount = (sm.match(/<url>/g) || []).length;
console.log(`\n✓ sitemap.xml: ${smCount} URLs (1 home + ${SITEMAP_COLLECTIONS.length} collections + ${PRODUCTS.length} products + ${SITEMAP_INFO.length} info)`);
