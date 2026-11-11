# KRYPTAA 2

Second-generation KRYPTAA storefront — 25 pages, live Stripe checkout through the
`kryptaa-api` Cloudflare Worker.

## How it fits together

- `catalog.js` — product copy, galleries and a **snapshot** of stock. Display only.
- `api.js` — the backend bridge. Pulls live stock and approved reviews from the Worker,
  exposes `window.KAPI`, then loads the rest of the scripts so they run once with live data.
  If the Worker is slow or down it boots anyway on the snapshot after 2.5s.
- `site.js` — the shared engine: bag, wishlist, drawers, and each page's view.
- `landing.js` / `journal.js` — category-landing and journal views.

## Prices

The Worker's own `src/catalog.js` is what Stripe actually charges. The prices in
`catalog.js` here are for display. **Change one and you must change the other**, or
customers are quoted one number and charged another.

## Analytics

GA4 `G-242EQ24FP3` and Meta Pixel `2070231503594050` load in every page's `<head>`,
before `api.js`, so no early event is missed.

## CORS

The Worker only answers browsers on an allow-listed origin. Any new domain this site is
served from must be added to `ALLOWED_ORIGINS` in the Worker's `src/util.js`, or every
checkout, stock read and coupon check fails.

## Local preview

    python3 -m http.server 4173

Live stock and checkout need `http://localhost:4173` in the Worker's `ALLOWED_ORIGINS`.
