#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────
   KRYPTAA — Google Merchant Center product feed
   Reads catalog.js + slugs.js (what the live site shows) and writes
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
// catalog.js is what the live site (site.js) renders since the Nov 10 launch; slugs.js gives each
// product's /products/<slug>.html. products.js is the OLD list — do not read it here.
require(path.join(__dirname, 'catalog.js'));
require(path.join(__dirname, 'slugs.js'));
const K = global.window.K || { products: [], stock: {} };
const SLUGS = global.window.K_SLUGS || {};
const stockOf = (p, z) => { const s = (K.stock || {})[p.id]; if (!s) return null; if (z in s) return s[z]; if ('Universal' in s && p.sizes.length <= 1) return s.Universal; return null; };
const PRODUCTS = K.products
  .filter((p) => !p.archived)
  .map((p) => ({ ...p, slug: SLUGS[p.id], soldOutSizes: (p.sizes || []).filter((z) => stockOf(p, z) === 0) }))
  .filter((p) => { if (!p.slug) { console.warn(`! skipped id ${p.id} (${p.name}): no slug in slugs.js`); return false; } return true; });
const SITE = 'https://www.kryptaa.com';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => /^https?:/i.test(p) ? p : SITE + '/' + String(p).replace(/^\/+/, '');
// Image URLs carry a short content fingerprint (?v=…). Google caches photos by URL and does not re-fetch a
// replaced file that kept its name (the Nov 11 track-pant reshoot kept womens-st-red-01.webp, so Google kept
// showing the old photo). A new fingerprint whenever the file changes makes Google fetch the new photo.
const crypto = require('crypto');
const img = (p) => {
  const rel = String(p).replace(/^\/+/, '');
  try { return abs(rel) + '?v=' + crypto.createHash('md5').update(fs.readFileSync(path.join(__dirname, rel))).digest('hex').slice(0, 8); }
  catch (e) { console.warn(`! image not found: ${rel}`); return abs(rel); }
};

// Pre-orders: Google requires availability_date. Make time is 30+ days, so promise the
// honest upper end — 45 days from the build date, refreshed on every deploy.
const PREORDER_DATE = (() => { const d = new Date(Date.now() + 45 * 86400000); return d.toISOString().slice(0, 10) + 'T00:00:00-05:00'; })();

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

// Same rule as the checkout server (kryptaa-worker checkout.js): free at $60+, tees $5, else $9.99.
// In stock ships in 1–2 business days (handling 1–2) + 2–5 business days in transit = 3–7.
// Search-friendly Shopping titles for in-stock products (same file Kryptaa-2 uses for page titles).
let SEO = {};
try { SEO = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools', 'seo_titles.json'), 'utf8')).products || {}; } catch (e) { console.warn('! tools/seo_titles.json not found — using product names'); }
const shipPrice = (p) => (Number(p.price) >= 60 ? '0.00' : p.category === 'tees' ? '5.00' : '9.99');

const items = [];
for (const p of PRODUCTS) {
  if (p.category === 'anime' && !p.buyable) continue; // contact-to-order pieces have no fixed checkout
  if (p.category === 'bundle') continue;             // mystery bundle: contents vary, Merchant Center wants concrete items
  if (availability(p) === 'out_of_stock') continue;  // Google rejects long-term OOS items
  const link = `${SITE}/products/${p.slug}.html`;
  const images = (p.gallery || []).map((g) => img(g.src || g)).filter((u, i, a) => a.indexOf(u) === i);
  const main = img(p.img);
  const extra = images.filter((u) => u !== main && !/sizechart/i.test(u)).slice(0, 10);
  const sizes = (p.sizes || []).filter((s) => !(p.soldOutSizes || []).includes(s));

  // One item per size so Google can show size availability; parent grouped via item_group_id
  for (const size of sizes.length ? sizes : ['One Size']) {
    items.push(`
  <item>
    <g:id>${esc(p.id)}-${esc(size)}</g:id>
    <g:item_group_id>${esc(p.id)}</g:item_group_id>
    <g:title>${esc((SEO[p.id] || [p.name])[0])} — ${esc(size)}</g:title>
    <g:description>${esc(p.desc || p.story || p.name)}</g:description>
    <g:link>${esc(link)}?utm_source=google&amp;utm_medium=shopping&amp;utm_campaign=free_listings</g:link>
    <g:image_link>${esc(main)}</g:image_link>
${extra.map((u) => `    <g:additional_image_link>${esc(u)}</g:additional_image_link>`).join('\n')}
    <g:availability>${availability(p)}</g:availability>${availability(p) === 'preorder' ? `\n    <g:availability_date>${PREORDER_DATE}</g:availability_date>` : ''}
    <g:price>${Number(p.price).toFixed(2)} USD</g:price>
    <g:brand>KRYPTAA</g:brand>
    <g:condition>new</g:condition>
    <g:google_product_category>${esc(googleCategory(p))}</g:google_product_category>
    <g:product_type>${esc(p.collection || p.category)}</g:product_type>
    <g:gender>${gender(p)}</g:gender>
    <g:age_group>adult</g:age_group>
    <g:size>${esc(size)}</g:size>
    <g:color>${esc(color(p))}</g:color>
    <g:material>${esc(p.category === 'tees' && /cotton/i.test(p.materials || p.desc || '') ? 'Cotton' : (p.materials || p.material || 'Cotton'))}</g:material>${p.category === 'tees' ? '\n    <g:pattern>Graphic print</g:pattern>' : ''}
    <g:identifier_exists>no</g:identifier_exists>
    <g:shipping><g:country>US</g:country><g:service>Standard</g:service><g:price>${shipPrice(p)} USD</g:price><g:min_transit_time>2</g:min_transit_time><g:max_transit_time>5</g:max_transit_time></g:shipping>
    <g:min_handling_time>1</g:min_handling_time>
    <g:max_handling_time>2</g:max_handling_time>
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
// ── Pinterest copy of the same list ──────────────────────────────────────
// Pinterest's spec (help.pinterest.com data-source-specification) differs from Google's:
//  • availability must be "in stock" / "out of stock" / "preorder" (spaces, not in_stock)
//  • the main image must be at least 1000x1500 px → we make a 1000x1500 JPG of the SAME
//    website photo (whole photo, no crop, on a blurred dark copy of itself) in imgs/pinterest/.
//    File name carries a hash of the source photo, so a changed photo gets a new link
//    (Pinterest only re-fetches an image when its link changes).
//  • links are tagged utm_source=pinterest so visits count as Pinterest, not Google.
(async () => {
  const sharp = require('sharp');
  const outDir = path.join(__dirname, 'imgs', 'pinterest');
  fs.mkdirSync(outDir, { recursive: true });
  const keep = new Set();
  let px = xml.split('utm_source=google&amp;utm_medium=shopping&amp;utm_campaign=free_listings')
              .join('utm_source=pinterest&amp;utm_medium=social&amp;utm_campaign=catalog')
              .split('<g:availability>in_stock<').join('<g:availability>in stock<')
              .split('<g:availability>out_of_stock<').join('<g:availability>out of stock<');
  const mains = [...new Set([...px.matchAll(/<g:image_link>([^<]+)<\/g:image_link>/g)].map((m) => m[1]))];
  for (const url of mains) {
    const rel = url.replace(SITE + '/', '').split('?')[0];
    const src = path.join(__dirname, rel);
    const hash = crypto.createHash('md5').update(fs.readFileSync(src)).digest('hex').slice(0, 8);
    const name = path.basename(rel).replace(/\.[a-z]+$/i, '') + '-' + hash + '.jpg';
    keep.add(name);
    const out = path.join(outDir, name);
    if (!fs.existsSync(out)) {
      const bg = await sharp(src).resize(1000, 1500, { fit: 'cover' }).blur(40).modulate({ brightness: 0.35 }).toBuffer();
      const fg = await sharp(src).resize(1000, 1500, { fit: 'inside', withoutEnlargement: false }).toBuffer();
      await sharp(bg).composite([{ input: fg, gravity: 'center' }]).jpeg({ quality: 90 }).toFile(out);
    }
    px = px.split('<g:image_link>' + url + '</g:image_link>').join('<g:image_link>' + SITE + '/imgs/pinterest/' + name + '</g:image_link>');
  }
  for (const f of fs.readdirSync(outDir)) if (!keep.has(f)) fs.unlinkSync(path.join(outDir, f));
  fs.writeFileSync(path.join(__dirname, 'feed', 'pinterest.xml'), px);
  // Same list as TSV (Pinterest's primary documented format). Columns per help.pinterest.com
  // data-source-specification; shipping as country:region:service:price.
  const un = (v) => (v || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&').replace(/[\t\r\n]+/g, ' ').trim();
  const cols = ['id', 'item_group_id', 'title', 'description', 'link', 'image_link', 'additional_image_link', 'availability', 'price', 'brand', 'condition', 'google_product_category', 'product_type', 'gender', 'age_group', 'size', 'color', 'shipping'];
  const rows = [cols.join('\t')];
  for (const m of px.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const it = m[1];
    const one = (t) => un((it.match(new RegExp('<g:' + t + '>([\\s\\S]*?)</g:' + t + '>')) || [])[1]);
    const all = (t) => [...it.matchAll(new RegExp('<g:' + t + '>([\\s\\S]*?)</g:' + t + '>', 'g'))].map((x) => un(x[1]));
    const sh = it.match(/<g:shipping><g:country>([^<]*)<\/g:country><g:service>([^<]*)<\/g:service><g:price>([^<]*)<\/g:price>/);
    const r = { id: one('id'), item_group_id: one('item_group_id'), title: one('title'), description: one('description'), link: one('link'),
      image_link: one('image_link'), additional_image_link: ((a) => a.length ? '"' + a.join(',') + '"' : '')(all('additional_image_link').slice(0, 10)), availability: one('availability'),
      price: one('price'), brand: one('brand'), condition: one('condition'), google_product_category: one('google_product_category'),
      product_type: one('product_type'), gender: one('gender'), age_group: one('age_group'), size: one('size'), color: one('color'),
      shipping: sh ? `${sh[1]}::${sh[2]}:${sh[3]}` : '' };
    rows.push(cols.map((c) => r[c]).join('\t'));
  }
  fs.writeFileSync(path.join(__dirname, 'feed', 'pinterest.tsv'), rows.join('\n') + '\n');
  console.log(`✓ feed/pinterest.tsv: ${rows.length - 1} items`);
  console.log(`✓ feed/pinterest.xml: same items, ${mains.length} Pinterest-size main photos in imgs/pinterest/`);
})();
console.log(`✓ feed/google-merchant.xml: ${items.length} variants across ${new Set(items.map((i) => i.match(/item_group_id>(\d+)/)[1])).size} products`);
