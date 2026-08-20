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
        <a class="product-card-link" href="product-detail?id=${product.id}" aria-label="View ${product.name}">
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
  const cards = products.map(staticProductCard).join('\n');
  let html = original;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${seo.title}</title>`);
  html = upsertHead(html,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${seo.desc}">`,
    /<title>[\s\S]*?<\/title>/);
  html = upsertHead(html,
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}">`,
    /<link rel="icon"[^>]*>/);
  if (!/SEO:noscript/.test(html)) {
    html = html.replace(/<\/head>/, `<noscript><style>/*SEO:noscript*/.reveal{opacity:1!important;transform:none!important}.product-card{opacity:1!important}</style></noscript>\n</head>`);
  }

  html = html.replace(/<h1 id="shopTitle">[\s\S]*?<\/h1>/, `<h1 id="shopTitle">${config.title || ''}</h1>`);
  html = html.replace(/<div class="eyebrow reveal" id="shopLabel">[\s\S]*?<\/div>/, `<div class="eyebrow reveal" id="shopLabel">${config.label || 'KRYPTAA'}</div>`);
  html = html.replace(/<p class="shop-hero-copy reveal" id="shopDescription">[\s\S]*?<\/p>/, `<p class="shop-hero-copy reveal" id="shopDescription">${config.description || ''}</p>`);
  html = html.replace(/<div class="shop-count" id="shopCount">[\s\S]*?<\/div>/, `<div class="shop-count" id="shopCount">${products.length} pieces</div>`);
  html = html.replace(/(<section class="products-grid[^"]*" id="productsGrid">)[\s\S]*?(<\/section>)/,
    `$1\n<!--SEO:products-->${cards}\n      <!--/SEO:products-->\n      $2`);

  if (html !== original) { fs.writeFileSync(path.join(__dirname, file), html); processed++; console.log(`✓ ${file.padEnd(32)} ${category.padEnd(11)} ${products.length} products`); }
}

console.log(`\nDone: ${processed} collection page(s) pre-rendered.`);
if (skipped.length) console.log('Skipped: ' + skipped.join(', '));
