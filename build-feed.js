#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────
   KRYPTAA — Google Merchant Center product feed
   Reads products.js (single source of truth) and writes
   feed/google-merchant.xml (RSS 2.0 + g: namespace) → free listings in
   the Google Shopping tab. Also usable as a Meta/Pinterest catalog feed.

   Run:  node build-feed.js   (build-seo.js calls this too)
   Excludes: anime pieces (contact-to-order, no fixed checkout) and
   archived items. Availability mirrors the product's `availability`.
   ───────────────────────────────────────────────────────────── */
const fs = require('fs');
const path = require('path');

global.window = {};
global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
global.document = { addEventListener() {}, readyState: 'complete', body: { dataset: {} } };
require(path.join(__dirname, 'products.js'));

const PRODUCTS = global.window.PRODUCTS || [];
const SITE = 'https://www.kryptaa.com';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => /^https?:/i.test(p) ? p : SITE + '/' + String(p).replace(/^\/+/, '');

function availability(p) {
  const a = String(p.availability || '').toLowerCase();
  if (/archive|sold out|unavailable/.test(a)) return 'out_of_stock';
  if (/pre-?order|production/.test(a)) return 'preorder';
  return 'in_stock';
}

function googleCategory(p) {
  // Google product taxonomy IDs
  switch (p.category) {
    case 'tees': return 'Apparel & Accessories > Clothing > Shirts & Tops';
    case 'men': case 'women': case 'anime': return 'Apparel & Accessories > Clothing > Pants';
    case 'women_st': return 'Apparel & Accessories > Clothing > Pants';
    case 'women_wear': return 'Apparel & Accessories > Clothing > Shirts & Tops';
    default: return 'Apparel & Accessories > Clothing';
  }
}
function gender(p) {
  if (p.category === 'men') return 'male';
  if (p.category === 'women' || p.category === 'women_wear') return 'female';
  return 'unisex';
}

function color(p) {
  const text = `${p.name} ${p.desc || ''}`.toLowerCase();
  const order = ['charcoal grey', 'charcoal', 'black', 'silver', 'gold yellow', 'yellow', 'red', 'green', 'blue', 'indigo', 'sand', 'ice', 'pink', 'grey', 'white', 'rainbow'];
  const hit = order.find((c) => text.includes(c));
  const map = { 'charcoal grey': 'Charcoal', charcoal: 'Charcoal', 'gold yellow': 'Yellow', ice: 'Light Blue', sand: 'Beige', rainbow: 'Multicolor', indigo: 'Indigo', grey: 'Grey' };
  const c = hit ? (map[hit] || hit.charAt(0).toUpperCase() + hit.slice(1)) : 'Black';
  return c;
}

const items = [];
for (const p of PRODUCTS) {
  if (p.category === 'anime' && !p.buyable) continue; // contact-to-order pieces have no fixed checkout
  if (availability(p) === 'out_of_stock') continue;  // Google rejects long-term OOS items
  const link = `${SITE}/products/${p.slug}.html`;
  const images = (p.gallery || []).map((g) => abs(g.src)).filter((u, i, a) => a.indexOf(u) === i);
  const main = abs(p.img);
  const extra = images.filter((u) => u !== main && !/sizechart/i.test(u)).slice(0, 10);
  const sizes = (p.sizes || []).filter((s) => !(p.soldOutSizes || []).includes(s));

  // One item per size so Google can show size availability; parent grouped via item_group_id
  for (const size of sizes.length ? sizes : ['One Size']) {
    items.push(`
  <item>
    <g:id>${esc(p.id)}-${esc(size)}</g:id>
    <g:item_group_id>${esc(p.id)}</g:item_group_id>
    <g:title>${esc(p.name)} — ${esc(size)}</g:title>
    <g:description>${esc(p.desc || p.story || p.name)}</g:description>
    <g:link>${esc(link)}?utm_source=google&amp;utm_medium=shopping&amp;utm_campaign=free_listings</g:link>
    <g:image_link>${esc(main)}</g:image_link>
${extra.map((u) => `    <g:additional_image_link>${esc(u)}</g:additional_image_link>`).join('\n')}
    <g:availability>${availability(p)}</g:availability>
    <g:price>${Number(p.price).toFixed(2)} USD</g:price>
    <g:brand>KRYPTAA</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>${esc(googleCategory(p))}</g:google_product_category>
    <g:product_type>${esc(p.collection || p.category)}</g:product_type>
    <g:gender>${gender(p)}</g:gender>
    <g:age_group>adult</g:age_group>
    <g:size>${esc(size)}</g:size>
    <g:color>${esc(color(p))}</g:color>
    <g:material>${esc(p.materials || p.material || 'Cotton')}</g:material>
    <g:identifier_exists>no</g:identifier_exists>
    <g:shipping><g:country>US</g:country><g:service>Standard</g:service><g:price>9.99 USD</g:price></g:shipping>
  </item>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>KRYPTAA — Gothic &amp; Street Wear</title>
  <link>${SITE}/</link>
  <description>KRYPTAA luxury gothic streetwear: heavyweight tees, baggy wide-leg denim, rave wear. Statement without noise.</description>
${items.join('\n')}
</channel>
</rss>
`;

fs.mkdirSync(path.join(__dirname, 'feed'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'feed', 'google-merchant.xml'), xml);
console.log(`✓ feed/google-merchant.xml: ${items.length} variants across ${new Set(items.map((i) => i.match(/item_group_id>(\d+)/)[1])).size} products`);
