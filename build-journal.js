#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────
   KRYPTAA Journal builder
   Reads journal-posts.js and writes journal.html (index) + journal/<slug>.html.
   Uses faq.html as the page shell (head, nav, footer) so tracking, fonts and
   nav stay identical; asset/nav paths are made root-absolute for the
   /journal/ subfolder. Called from build-seo.js.
   ───────────────────────────────────────────────────────────── */
const fs = require('fs');
const path = require('path');
const POSTS = require(path.join(__dirname, 'journal-posts.js'));

global.window = {}; global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
global.document = { addEventListener() {}, readyState: 'complete', body: { dataset: {} } };
require(path.join(__dirname, 'products.js'));
const PRODUCTS = global.window.PRODUCTS || [];
const productSlug = global.window.productSlug || ((p) => p.slug);

const SITE = 'https://www.kryptaa.com';
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/* Shell from faq.html; make relative paths root-absolute so /journal/x.html works */
const shell = fs.readFileSync(path.join(__dirname, 'faq.html'), 'utf8');
const headEnd = shell.indexOf('</head>');
let head = shell.slice(0, headEnd);
const footerStart = shell.indexOf('<footer class="site-footer">');
let footer = shell.slice(footerStart);
const absolutize = (h) => h.replace(/(href|src)="(?!https?:|\/\/|#|mailto:|tel:|\/)([^"]+)"/g, '$1="/$2"');
head = absolutize(head); footer = absolutize(footer);
head = head.replace(/<link rel="canonical"[^>]*>\n?/, '').replace(/<title>[\s\S]*?<\/title>/, '')
  .replace(/<meta name="description"[^>]*>\n?/, '').replace(/<meta property="og:[^"]*"[^>]*>\n?/g, '').replace(/<meta name="twitter:[^"]*"[^>]*>\n?/g, '');
// strip any FAQ-specific JSON-LD that lived in the shell head
head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '');

function meta({ title, desc, url, image, type }) {
  return `<base href="/">
<link rel="canonical" href="${url}">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="KRYPTAA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${image}">
`;
}

function relatedCards(ids) {
  return ids.map((id) => PRODUCTS.find((p) => String(p.id) === String(id))).filter(Boolean).map((p) => `
      <a class="jr-card" href="/products/${productSlug(p)}.html">
        <img src="/${String(p.img).replace(/^\/+/, '')}" alt="${esc(p.name)}" loading="lazy">
        <span class="jr-name">${esc(p.name)}</span>
        <span class="jr-price">$${Number(p.price).toFixed(2)}</span>
      </a>`).join('');
}

/* ── Articles ── */
fs.mkdirSync(path.join(__dirname, 'journal'), { recursive: true });
for (const post of POSTS) {
  const url = `${SITE}/journal/${post.slug}.html`;
  const image = `${SITE}/${post.hero.replace(/^\/+/, '')}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.desc,
    image, datePublished: post.date, dateModified: post.date, mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'KRYPTAA', url: SITE },
    publisher: { '@type': 'Organization', name: 'KRYPTAA', logo: { '@type': 'ImageObject', url: `${SITE}/imgs/kryptaa-sigil.webp` } },
  };
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE}/journal.html` },
    { '@type': 'ListItem', position: 3, name: post.title, item: url },
  ] };
  const html = `${head}${meta({ title: `${post.title} | KRYPTAA Journal`, desc: post.desc, url, image, type: 'article' })}
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body data-page="journal">
<main class="journal-page">
  <article class="journal-article">
    <div class="journal-crumbs"><a href="/">Home</a> · <a href="/journal.html">Journal</a></div>
    <div class="info-hero-eyebrow">KRYPTAA · Journal · ${fmtDate(post.date)} · ${post.readMins} min read</div>
    <h1>${esc(post.title)}</h1>
    <p class="journal-lede">${esc(post.desc)}</p>
    <figure class="journal-hero"><img src="/${post.hero.replace(/^\/+/, '')}" alt="${esc(post.heroAlt)}" fetchpriority="high"></figure>
    <div class="journal-body">${post.body}</div>
    <section class="journal-related">
      <div class="eyebrow">— Pieces in this story —</div>
      <div class="jr-grid">${relatedCards(post.related || [])}</div>
    </section>
    <div class="journal-more"><a class="k-btn-outline" href="/journal.html">More from the journal →</a></div>
  </article>
</main>
${footer}`;
  fs.writeFileSync(path.join(__dirname, 'journal', post.slug + '.html'), html);
}

/* ── Index ── */
const idxUrl = `${SITE}/journal.html`;
const cards = [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).map((p) => `
    <a class="journal-card" href="/journal/${p.slug}.html">
      <img src="/${p.hero.replace(/^\/+/, '')}" alt="${esc(p.heroAlt)}" loading="lazy">
      <div class="journal-card-body">
        <div class="journal-card-meta">${fmtDate(p.date)} · ${p.readMins} min</div>
        <h2>${esc(p.title)}</h2>
        <p>${esc(p.desc)}</p>
      </div>
    </a>`).join('');
const idxLd = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'KRYPTAA Journal', url: idxUrl,
  hasPart: POSTS.map((p) => ({ '@type': 'Article', headline: p.title, url: `${SITE}/journal/${p.slug}.html`, datePublished: p.date })) };
const index = `${head}${meta({ title: 'Journal — Gothic Streetwear, Styling & Fabric Guides | KRYPTAA', desc: 'How to style baggy jeans, what to wear to a rave, how sublimated anime denim is made, what 300GSM means — guides from the KRYPTAA studio.', url: idxUrl, image: `${SITE}/imgs/pants/mens-pant-2-onbody-1.webp`, type: 'website' })}
<script type="application/ld+json">${JSON.stringify(idxLd)}</script>
</head>
<body data-page="journal">
<main class="journal-page">
  <div class="info-hero">
    <div class="info-hero-eyebrow">KRYPTAA · Journal</div>
    <h1>Notes from<br>the underground</h1>
    <p class="info-hero-sub">Styling, fabric and care guides — written from the studio, not a content farm.</p>
  </div>
  <div class="journal-grid">${cards}
  </div>
</main>
${footer}`;
fs.writeFileSync(path.join(__dirname, 'journal.html'), index);
console.log(`✓ journal: index + ${POSTS.length} articles`);
