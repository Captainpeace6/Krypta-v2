# KRYPTAA — change log shared between Claude sessions

Two Claude sessions edit this website: **"Kryptaa snap scroll bugs"** (Claude Code) and the
**website redesign session** (Insta reels project). Both write to **Kryptaa-2** (main copy) and
**Krypta-v2** (the repo that serves kryptaa.com).

**Before you change anything:** `git pull` both repos and read the newest entry here.
**After you change anything:** add an entry at the top, with the commit ids and the files touched.
Only copy a file to Krypta-v2 if it still matches the Kryptaa-2 version you started from
(`cmp` it first), so neither session overwrites the other's fix.

Asset version in `?v=` query strings must go up by one with every live change.


## RULES FOR BACKEND WORK — read before touching anything below the site

Vishwak's instruction, 17 Nov 2026: **the UI is low stakes, the backend is not.** A design idea can be
redone in an afternoon; a broken Worker stops the shop taking money and a wrong key breaks email,
analytics and the dashboard at once. If backend work is risky and not urgent, leave it and say so
rather than pushing on.

1. **Never run a bare `npx wrangler deploy`** in `kryptaa-worker`. It produces a version with **zero
   secrets** and kills live checkout. Always: `wrangler versions upload` (or `versions secret put`) →
   `wrangler versions view <id>` to confirm **5** `Secret Name:` lines → test the version's own
   preview URL → only then `wrangler versions deploy`.
2. **`wrangler secret list` lies.** It prints the pending config, not what is deployed. Trust
   `wrangler versions view <id>`.
3. **Recovery is a rollback**, not a re-deploy: `wrangler rollback <previous-version-id> --yes`
   restores the old code *and* its secrets in seconds.
4. **A self-signed webhook test proves nothing.** Signing with the Worker's own secret only shows it
   agrees with itself. Use `~/check-webhook-secret.sh` (sign with the secret revealed in Stripe), or
   watch `pending_webhooks` drop to 0.
5. **Never put `GA4_SA_KEY` back in the Netlify environment.** 2.3KB against a 4KB Lambda cap breaks
   every function deploy. It lives in Blobs: store `kryptaa-config`, key `ga4-sa-key`.
6. **`ADMIN_KEY` must be identical on the Worker and Netlify.** They are separate stores; rotating one
   and not the other 401s half the dashboard and leaves the old key live on the other platform.
7. **Rotating a Stripe key means both places.** The Worker and Netlify's `STRIPE_SECRET_KEY` both use
   one. Netlify additionally needs **Promotion Codes: Write** and **Charges: Read**, or `daily-pulse`
   fails silently on `charges.list`.
8. **Create before you revoke.** New key in, verified working, *then* delete the old one. Never the
   other way round.
9. **Secrets never go in chat, a commit, or a command line.** Straight into the tool's own masked
   prompt. If one is exposed, it is burned — rotate it.
10. **Verify with evidence, not assumption.** Live checkout returning a real `checkout.stripe.com`
    URL, a 401 on every admin route, `pending_webhooks: 0`. Say plainly what was not checked.

---

## 2026-11-25 ET — redesign session — Google list = in-stock only; Google Customer Reviews opt-in on thank-you (LIVE)
- Why: Merchant Center store quality (US) rated Delivery time "Low" at 19.7 days (Fair needs <12.2). Vishwak: keep the anime pre-orders (30–45 day make time) on the website and Pinterest, but take them off Google Shopping.
- Krypta-v2 build-feed.js: pre-order items are no longer written to feed/google-merchant.xml (114 → 69 listings, 20 products, 0 preorder). feed/pinterest.xml + pinterest.tsv still carry all 114. Website untouched.
- Google may still find pre-order product pages by itself ("Found by Google", kryptaa.com source, every 24h). If anime jeans reappear under source "www.kryptaa.com", that is the auto-crawl, not the feed.
- site.js (checkout return): pending_purchase now also stores email, country and a pre-order flag. On the thank-you, loads apis.google.com/js/platform.js and renders Google Customer Reviews opt-in (merchant 5856559183, order_id = Stripe session id, ETA = today+7 days, or +45 if the order has a pre-order piece). Once per order.
- checkout.html CSP: script-src + https://apis.google.com https://www.gstatic.com; frame-src + https://www.google.com https://apis.google.com https://accounts.google.com.
- All 63 pages: api.js?v=24 → v=25. No Worker change.
- Merchant Center: Google customer reviews add-on added and program agreement signed (Vishwak OK'd, 25 Nov). Checked on live kryptaa.com/checkout.html: Google's "Share your opinion" box renders (test call, not answered). Store rating needs ~100 reviews in 12 months before it shows.
- Tested headless: thank-you still shows, opt-in script loads once, not again on reload, no CSP errors.


## 2026-11-25 13:40 ET — redesign session — Pinterest switched to a TSV product list (LIVE)
- Pinterest reads of feed/pinterest.xml (Nov 24 12:49, 7:53 PM; Nov 25 3 AM) all "Failed" with 0 successful / 0 failed and no issue listed. Checked: Pinterestbot gets 200 + full file + photos (from Mac); Pinterest's own "Test your data source" passes the XML items. Cause not shown by Pinterest.
- build-feed.js now also writes feed/pinterest.tsv (Pinterest's primary documented format): same 114 items/photos, columns per help.pinterest.com spec, shipping as US::Standard:<price> USD, extra photos quoted. Pinterest's checker: "No errors or warnings detected".
- Pinterest data source switched to https://www.kryptaa.com/feed/pinterest.tsv (format TSV) and a new read triggered.

## 2026-11-24 13:40 ET — redesign session — Pinterest list now meets Pinterest's own spec (LIVE)
- Checked feed/pinterest.xml against help.pinterest.com data-source-specification. Two more problems beyond utm_source: availability must be "in stock"/"preorder" (spaces), and the main image must be at least 1000x1500 px (26 of 29 main photos were smaller).
- build-feed.js now writes the Pinterest list with "in stock", and makes imgs/pinterest/<photo>-<hash>.jpg: the same main website photo, whole and uncropped, on a 1000x1500 blurred dark copy of itself. Old copies are deleted when a photo changes. Rerun `node build-feed.js` (needs sharp) after any product photo change.
- Validator run on all 114 items: 0 problems. Google list unchanged.

## 2026-11-24 12:50 ET — redesign session — Pinterest gets its own product list (LIVE)
- Krypta-v2 build-feed.js now also writes feed/pinterest.xml: the same 114 items and photos as feed/google-merchant.xml, but links tagged utm_source=pinterest&utm_medium=social&utm_campaign=catalog (Pinterest flagged utm_source=google on all 114).
- Pinterest catalog "Kryptaa Store" data source switched to https://www.kryptaa.com/feed/pinterest.xml. Google Merchant still uses google-merchant.xml (only change: pre-order date refreshed to today+45).
- Pinterest: @krypta2426 is a business account, merchant approved Nov 23, 10 old pins deleted; first read Nov 23 9:22 PM ET, products not yet published.

## 2026-11-23 10:45 ET — redesign session — sales are counted again in GA4 + Meta; thank-you message after payment (LIVE)
- Problem: since the Nov 10 rebuild, coming back from Stripe (checkout.html?success=true&session_id=…) fired no purchase event, and the shopper saw their full bag again with no thank-you.
- site.js (checkout page): right before the Stripe redirect, stash the exact total (after discount + shipping), shipping, coupon and items in localStorage `kry_pending_purchase`. On return: GA4 `purchase` (transaction_id = Stripe session id) + Meta `Purchase` with eventID = session id (same event_id the Worker's Meta CAPI uses, so Meta dedupes). Each session id is fired once (`kry_sent_orders`); the bag is emptied, a thank-you message shows, and the URL is cleaned.
- All 63 pages: api.js?v=23 → v=24 so browsers load the new site.js. No Worker change.
- Tested headless: purchase fires once, reload does not double count, bag empties.

## 2026-11-22 02:50 ET — redesign session — search-matched titles for in-stock products (LIVE)

- New `tools/seo_titles.json` (Kryptaa-2 and Krypta-v2): for 20 in-stock products and 5 shop pages (track-pants,
  women-wear, men, t-shirts, women), a `<title>` / meta description / og:title / og:description built from real Search
  Console queries (chrome outfit, yellow/green track pants, baggy ripped jeans, sequin bra top, crystal mesh hoodie,
  heavyweight graphic tee, gothic baggy jeans men, rave outfits). Every $ price checked against catalog.js; "free US
  shipping" only on items ≥ $60. Anime pages untouched.
- Krypta-v2 `build-feed.js`: Shopping `g:title` = first entry of seo_titles.json for that product (+ " — size").
  Feed rebuilt (114 items; only titles + pre-order date changed). build_static_seo.py rerun: pre-order date 2027-01-06.
- If a product's price changes, update its line in tools/seo_titles.json too.

---

## 2026-11-22 00:50 ET — redesign session — TEMP owner-only test coupon on the Worker (REMOVE after Vish's test)

- Vish wants to place a real ~$1 test payment. Instead of dropping Medusa to $1 for everyone, a temporary 97%-off code
  was added to `COUPONS` in `kryptaa-worker/src/catalog.js` (private repo; the code itself is not written here because
  this file is public). Worker fdbe031, version 579ad810 deployed on top of the other session's stock guard (4296465 /
  c874ae52). Tested on preview: Medusa M = $29 − $28.13 + $5 shipping = $5.87. health 200, admin 401.
- **Remove that COUPONS line and redeploy right after his test order** (and refund the order in Stripe).
- DONE 00:55: test order paid ($5.87, Medusa S, session cs_live_agjVo6…, webhook delivered: pending_webhooks 0). Code removed
  (Worker 2a3689a, version 1d344fbe deployed; /validate-coupon now answers invalid; health 200, admin 401). Vish refunds in Stripe.

---

## 2026-11-22 04:45 ET — Claude Code session — checkout can no longer oversell (Worker deployed)

`kryptaa-worker` `4296465`, live as version **`c874ae52`** (previous: `41dae87f` — roll back to that id if
anything surfaces). `src/checkout.js` only; `create-checkout` now refuses to sell more units than exist.

**The hole it closes:** the browser greys out sold-out sizes, but that is the only thing that ever stopped
an oversell. A stale tab, a second device or a direct POST to `/create-checkout` would happily take the
money, and a product with no stock row could be bought for ever. `create-checkout` resolved the price and
never looked at stock.

**How it is built, and why each choice:**
- **Mirrors `webhook.js` exactly** — same `stockKeysFor()`, same exact-size lookup (`row[size]`), no
  `Universal` fallback. The guard must only count units the webhook will actually deduct, or it would
  block carts that never decrement anything.
- **Sums quantities across cart lines**, so two lines of the same size cannot slip through one at a time.
  Per-line qty is already clamped to 20 upstream, so multi-line was the real oversell route.
- **Sits BEFORE the coupon block.** The coupon path creates a single-use Stripe coupon; rejecting after
  that would leave an orphaned coupon behind on every blocked attempt.
- **Fails OPEN.** The whole guard is in a `try`/`catch`; if KV cannot be read the sale proceeds and a line
  goes to the log. Losing a real order to an infrastructure hiccup is worse than overselling one unit.
- **Untracked products are never blocked** — a missing row or missing size is skipped, the same meaning
  "untracked" carries in `site.js` and `api.js`. The made-to-order anime denim (108–116) is unaffected.
- **It is NOT a reservation.** Two buyers can still pass the check in the same instant and both pay. This
  closes the large hole, not the race. A real reservation needs expiry handling and is a bigger change.
- Rejection returns **409** with `{ error, soldOut, id, size, available }`. `site.js:286` already renders
  `"Payment error: " + d.error`, so the message is written to read correctly after that prefix.

**Tested on the version preview before promoting — 10 checkout cases, all as designed:**
allowed → 82×1, 82×20 (exactly all stock), 81×21 (clamped to 20), anime 108×20, tee 4 XL×4 (exact), set
90×3 (exact); blocked → 82×20+82×20, 4 XL×4+XL×1, set 90×4, set top-only×4. Each block named the product
and the remaining count. Regressions checked: coupon checkout still works, `country:"GB"` still works,
health 200, admin 401, unsigned webhook 400, empty cart 400, unknown item 400.
Then re-verified on production after the deploy: real sale allowed, 40-unit oversell blocked, anime
pre-order allowed.

**Not independently exercised:** no product is currently at 0, so the `have === 0` "just sold out" wording
never fired. It is the same `qty > have` branch the other blocks prove, but that exact string is untested.

## 2026-11-22 04:20 ET — Claude Code session — 81 and 82 added to BASE_STOCK (Worker deployed)

`kryptaa-worker` `57c8b1c`, live as version **`41dae87f`** (previous: `06be9fa4` — roll back to that id if
anything surfaces). Seven added lines in `src/stock.js`, nothing removed:
`81: { Universal: 21 }`, `82: { Universal: 20 }`.

**Why:** the KV write on 22 Nov gave both products a count, but `BASE_STOCK` is what re-seeds KV if that
blob is ever lost. Without this they would have come back untracked — no ceiling — exactly the bug we had
just closed.

**Proved safe before deploying, not after.** Ran the real `loadStock()` merge logic (extracted from the
edited source) against the live stock blob and diffed every product: **no live count changes**. Also
simulated a wiped KV: 81 comes back as 21, 82 as 20, 22 products seeded. Worth reusing — the merge loop
starts applying to a product the moment it joins `BASE_STOCK`, deleting sizes absent from the schema and
filling in ones that are missing, so adding an entry whose sizes don't match what's stored WOULD rewrite
live data. Here both are `Universal` on each side, so it is a no-op.

**Deploy followed the rules exactly:**
1. Confirmed the repo was clean and `main` matched origin.
2. Confirmed the deployed version `06be9fa4` corresponded to HEAD `dc002f0`, so Cloudflare was not running
   anything missing from git (the 17 Nov trap).
3. `wrangler versions upload` → `41dae87f`. **Never a bare `wrangler deploy`.**
4. `wrangler versions view 41dae87f` → **5** `Secret Name:` lines, same names as the live version.
5. Tested the version's own preview URL: health 200, stock 81/82 correct, admin routes 401, unsigned
   webhook 400, and **two real `checkout.stripe.com` sessions created** (products 81 and 82).
6. `wrangler versions deploy 41dae87f@100%`, then re-verified production independently: health 200,
   81 `{Universal:21}`, 82 `{Universal:20}`, 22 products, admin 401, webhook 400, live checkout returns a
   real Stripe session.

**Still open:** `create-checkout` still never reads stock for any product (`src/checkout.js` resolves price
only), so a product at 0 in KV still completes a Stripe session. Stock remains display-only sitewide. Not
touched — it is a behaviour change to the money path and deserves its own pass.

## 2026-11-22 03:30 ET — Claude Code session — Clarity unblocked, chain bras now have stock counts

**Clarity was never collecting — the CSP blocked it.** The tag went onto 63 pages on 17 Nov, but
`clarity.ms` was never added to the `Content-Security-Policy` meta tag, so every browser refused the
script: `Loading the script 'https://www.clarity.ms/tag/y6kgv0czuk' violates the following Content
Security Policy directive: "script-src 'self' 'unsafe-inline' …"`. Dark since the 10 Nov rebuild.
- Added `https://www.clarity.ms https://*.clarity.ms` to `script-src` and `https://*.clarity.ms` to
  `connect-src`, on all 63 pages carrying a CSP. **Nothing else in the policy was widened** —
  `default-src`, `style-src`, `font-src`, `img-src`, `frame-src`, `object-src 'none'`, `base-uri` and
  `form-action` are untouched. Kryptaa-2 `b4c212b`, Krypta-v2 `a31537d`. The two repos were edited
  independently with the same replacement rather than copying files, so nothing else could be clobbered;
  verified 63 files changed, 63 insertions, 63 deletions, zero non-CSP lines.
- HTML only, so the stamp stays at **`v=23`**.
- **Verified working on the live site**, not just loading: `www.clarity.ms/tag/y6kgv0czuk` →
  `scripts.clarity.ms/0.8.80-beta/clarity.js` → 3 × `a.clarity.ms/collect` on one page view.
  (Watch out when checking this: the browser console keeps entries across navigations, so stale
  pre-fix CSP errors look current. Confirm with `performance.getEntriesByType('resource')`.)

**Products 81 and 82 now have stock counts.** Both are physical stock that had never been in `BASE_STOCK`
or KV, so `stockOf()` returned `null`, `soldOut()` was never true, and the site would have sold any
quantity of either. Counts confirmed by Vishwak:
- **81 Rhinestone Heart Chain Bra $15.99 → 21.** No sales anywhere yet; Depop already read 21, left alone.
- **82 Gold Chainmail Choker Bra $15.99 → 20.** One sold on Depop 21 Nov; Depop relisted at 20 yesterday.
- Written with `~/set-stock-82.sh` (read current blob → add the two keys → show diff → confirm → write →
  re-read). Its diff printed `keys changed: 81, 82`, products 20 → 22. Verified from a fresh `/get-stock`
  and on the live product page (`K.stockLive: true`, 81 `{Universal:21}`, 82 `{Universal:20}`).
- **Watch out:** `BASE_STOCK` in `src/stock.js` holds the original SEED values and does not move as items
  sell, so it is not a baseline for checking live stock. Example: `500` XS is legitimately 8 live while
  `BASE_STOCK` still says 9. Compare against `/get-stock`, never against `BASE_STOCK`.

**Still open, deliberately not done:**
- 81 and 82 exist only in the stored KV blob, not in `BASE_STOCK`, so they are not re-seeded if that blob
  is ever reset. Adding them to `kryptaa-worker/src/stock.js` needs a Worker deploy — `versions upload` →
  `versions view <id>` → confirm **5** `Secret Name:` lines → `versions deploy`.
- **`create-checkout` still never reads stock, for any product** (`src/checkout.js` looks up price only).
  A product at 0 in KV still completes a Stripe session. Stock is display-only sitewide.

Checked and found clean while auditing the Nov 20 price/shipping rework: all 30 prices match between
`catalog.js` and the Worker's `src/catalog.js`; no leftover `$39` or "ships next day" / "3–6 days" copy;
`info.html` international rates match the Worker rate for rate; the Google feed's 114 items all carry real
prices (the `0.00` entries are free-shipping rates inside `<g:shipping>`); live matches the repo byte for
byte on `v=23`.

## 2026-11-21 16:00 ET — Claude Code session — Depop relist, and the site has NO stock ceiling

**Depop: Gold Chainmail Choker Bra (catalog id 82) is live again.** It sold on 21 Nov to @h0neybunny3 and
went to Sold because its listing quantity was 1. Quantity 1 → **20** in the Depop listing editor
(`depop.com/products/ksyptaa-gold-chainmail-choker-with-a-18a9/`); price left at **$15.99**. Verified by
reopening the editor after saving (reads 20) and loading the public page (no Sold banner). The listing
kept its photos, description, Boosted status and 11.5K views — it was edited, not recreated.
Note the sale went through at $13.99, an accepted offer; the list price is back at $15.99.
**One order still needs shipping** — Selling Hub → Sold, USPS label not yet downloaded.

**Finding: stock on this site is decoration, not a limit.** Two separate gaps, both confirmed in code:

1. `site.js:32` `stockOf()` returns `null` for any product with no KV entry, and `site.js:34`
   `soldOut()` is `stockOf(p,z)===0`. `null === 0` is false, so a product absent from KV can **never**
   show as sold out. It sells for ever.
2. `src/checkout.js` `createCheckout()` never reads stock at all — it looks up the price and builds the
   Stripe session. Even a product sitting at 0 in KV would still check out.

Product 82 is in `catalog.js` and `src/catalog.js` at $15.99, in neither `BASE_STOCK` nor the KV blob.
So kryptaa.com has been offering it with no ceiling while Vish holds 20 units.

**Setting 82 to 20 in KV:** helper at `~/set-stock-82.sh`, admin-gated, run by Vish.
`POST /update-stock` **replaces the whole stock blob — it does not merge** (`src/stock.js:80-87`), so
sending `{"82":…}` alone would wipe every other count. The script reads `/get-stock`, adds 82 to that
object, prints the diff, asks, posts the full blob, then re-reads to confirm. Key stays in a shell
variable, never on disk.

**Durable follow-up, NOT done:** 82 lives only in the stored KV blob, not in `BASE_STOCK`, so it is not
re-seeded if that blob is ever reset. Adding `82: { Universal: 20 }` to `BASE_STOCK` in
`kryptaa-worker/src/stock.js` needs a Worker deploy — `versions upload` → `versions view <id>` → confirm
**5** `Secret Name:` lines → `versions deploy`. Left for a deliberate, separate pass.

**Correction to my 17 Nov note about Clarity.** I reported Clarity was not collecting. That check ran at
~20:15 ET; the redesign session added the tag to 63 pages at 21:00 ET the same evening, 45 minutes later.
Clarity IS live — `clarity.ms/tag/` is on the live homepage now. My later "1 of 65 pages" figure came from
a local `kryptaa-2` that was 25 commits behind; both repos have since been pulled and the two SYNC-LOGs
are byte-identical again. **Pull before reporting a repo's state.**

## 2026-11-21 00:10 ET — redesign session — Anime Heavy fonts LIVE (Vish approved)

- Fonts: headings `--f-display` = **Dela Gothic One**; menu/sub-headers/text `--f-body` = **Zen Kaku Gothic New**
  (500/700/900). Google Fonts link on all 63 pages now loads Dela Gothic One + Zen Kaku Gothic New + IBM Plex Mono
  (Big Shoulders Display and Archivo removed). Vars changed in site.css AND index.html's inline :root.
- site.css end, "Anime Heavy fonts" block: menu/bag 700 15.5px, eyebrows 700 14px, banner 700. Dela is ~2x wider than
  Big Shoulders, so headings shrink with `font-size-adjust:cap-height` (.5 h1–h3, .42 landing .ld-h/.ld-h2, .34 .ld-h
  on desktop; .47/.42 on phones) and `.ld-h .ln{white-space:nowrap}`. Checked 5 pages at 1440 and 390: no overflow.
- Homepage: `<span class="kana-bg">クリプタ</span>` (gold outline) behind `#railTitle`.
- Asset version `v=22` → `v=23`.

---

## 2026-11-20 23:55 ET — redesign session — leftover $39 tee prices fixed

- The Nov 20 price change missed inline page data: `"p": 39` / `p:39` for the 4 tees in t-shirts.html (4),
  men-all.html (3) and index.html (7: homepage rail price tags + Pick your weapon pop-up). Landing hero cards and the
  rail showed $39 although the bag and checkout charged $29. All now 29. HTML only, no asset bump needed.
- Font sample on branch `font-anime-heavy` in Kryptaa-2 (NOT live, not on main): Dela Gothic One headings + Zen Kaku
  Gothic New text + katakana behind the homepage title. Waiting for Vish's approval.

---

## 2026-11-20 19:20 ET — redesign session — ONE honest shipping promise: ships in 1–2 days, arrives in 3–7 (Express removed)

Vish: "Ships in 1–2 days, arrives in 3–7 business days. $5 tees-only, $9.99 everything else, free over $60 (US).
Other countries keep their region rates. Keep only this everywhere — no fake promises."
- **Express removed.** The $24.99 "Express" (pre-existing, was 3–5 days; briefly mislabelled 1–2 day *delivery* at
  18:55) is gone from checkout. Worker dc002f0, version 06be9fa4 deployed (preview tested: one option, Standard $9.99,
  3–7 business days; health 200, admin 401). US standard estimate 3–6 → 3–7.
- Website: every "ships next (business) day" / "3–6 days" → "ships in 1–2 days" / "3–7 business days" (catalog.js
  shipping text ×30, product info row, banner "Free US shipping $60+ · $5 tees · Ships in 1–2 days" ×63, info.html,
  faq.html + 9 shop FAQs). info.html Express row removed. JSON-LD handlingTime 1–2 (build_static_seo.py rerun).
- Krypta-v2 `build-feed.js`: g:min_handling_time 1, g:max_handling_time 2. Merchant Center policy handling 1–2.
- Asset version `v=21` → `v=22`.

---

## 2026-11-20 18:55 ET — redesign session — US Express = 1–2 business days

- Worker 4640b0a, version ea299a2f deployed (tested on preview first; health 200, admin 401): US Express $24.99 now
  "Express Shipping (1–2 business days)", estimate 1–2 (was 3–5). Still US only, not offered with pre-orders.
- info.html: Express row ($24.99, 1–2 days, US, in-stock only). FAQ + shop FAQs mention Express 1–2 days.
- Scheduled a check for Nov 21 (Merchant Center should show 114 products from PRODUCTS SOURCE 1).

---

## 2026-11-20 18:20 ET — redesign session — international shipping = Shipping page rates, free shipping US only

Vish: free over $60 is for the US only; abroad, use the Shipping page's rates.
- **Checkout server** (`kryptaa-worker` a426631, version 70bc6c54): `body.country` picks the rate — CA $12.99,
  GB/DE/FR/NL/AU/IN/SG $14.99, AE $18.99 (10–25 business days), never free, no express. Stripe's address form is locked
  to that one country (`allowed_countries: [country]`). No/unknown country = US (unchanged rules). Tested on the
  preview: US tee $34, GB tee $43.99, AE jeans $85.99, US jeans $67 free.
- `checkout.html`: "Shipping to" country picker under the email (remembered in localStorage `kry_country`).
  `site.js` checkout now shows the exact shipping and the total including it (same rules as the server; the $60
  check uses the subtotal before discount, like the server). `api.js` sends `country`.
- `info.html` table now lists only the 10 countries checkout accepts; free row = "US orders over $60".
  FAQ/shop FAQs: free shipping is US only; international listed by country. Banner: "Free US shipping $60+ · $5 tees ·
  Ships next day" (fits one line on a 360px phone). Product info row: "Free US shipping" / "$5 US shipping".
- **LIVE** 18:35: Worker version 70bc6c54 deployed (health 200, admin 401), Krypta-v2 c68daf0 (includes 582d815).
  Verified on kryptaa.com: tee $29 + "$5 US shipping", banner, country picker (CA tee shows $12.99 / $41.99), anime
  PreOrder, info.html US-only free row, feed 114 items with tees 29.00.
- **Merchant Center shipping policy** edited: order cut-off 5:00 PM ET, handling 1–1, transit 2–5 business days
  (Google shows 3–6), flat $9.99 + free over $60 kept. (Continue was disabled before because the time zone was empty.)
  Feed re-fetch triggered 16:35 EST but Merchant Center still showed 79 items (Pages cache); daily fetch picks up 114.

---

## 2026-11-20 17:40 ET — redesign session — tees $29, $5 tee shipping, next-day dispatch, all anime = pre-order

Vish's call: everything except anime denim is in stock and ships the next business day, delivered within a week;
all 9 anime jeans are pre-order only (incl. the 4 that were "Coming soon").
- **Checkout server** (`kryptaa-worker` cf29e32, version c3996473 → deployed): tees 1,3,4,5 $39 → $29. Shipping: free
  at $60+ (unchanged); under $60 a tees-only bag pays **$5**, anything else $9.99. Delivery estimate 7–14 → **3–6
  business days**. A bag with an anime piece shows "pre-order", 22–32 business days, no express. Tested on the
  version preview with 4 live checkout sessions (tee $34, track $51.99, tee+track $71 free, JJK $68.99 pre-order).
- `catalog.js`: tee prices 29; anime 108–116 `archived:false`, `buyable:true`, availability "Pre-order · ships in
  30–45 days", restockDate removed; every product's `shipping` text rewritten (in stock: ships next business day,
  3–6 days; tees $5; anime made to order, 30–45 days).
- `site.js` product page info row: "$5 shipping / Free over $60" on tees, "Ships next day · Arrives in 3–6 days" (or
  "Pre-order · Arrives in 30–45 days"), "7-day returns · Secure Stripe checkout".
- $39 → $29 in t-shirts, men-all, women-all, index (Pick your weapon data + "From $29"), journal.js, 1 article.
- Top banner on 63 pages: "Free shipping over $60 · $5 tee shipping · Ships next day".
- info.html, faq.html and the 9 shop-page FAQs: next-day dispatch, 3–6 day US delivery, $5 tees, anime 30–45 days.
  (International rows in info.html still list $12.99–$18.99 but checkout charges $9.99/free everywhere — not changed.)
- `tools/build_static_seo.py`: Product JSON-LD now has `shippingDetails` (rate as above, handling 0–1, transit 2–5).
  Rerun → 30 product pages.
- Krypta-v2 `build-feed.js`: per-item `g:shipping` price (free ≥$60 / tees $5 / $9.99) + transit 2–5 and handling 0–1
  days. Feed rebuilt: anime pieces now listed as preorder.
- Asset version `v=20` → `v=21`.

---

## 2026-11-20 16:55 ET — redesign session — Google feed photos get a fingerprint (old track-pant photo on Google)

- Google Shopping still showed the OLD red track pant photo (white top, phone selfie): the Nov 11 reshoot kept the
  filename `womens-st-red-01.webp`, and Google caches photos by URL, so it never re-fetched.
- Krypta-v2 `build-feed.js`: every image link in `feed/google-merchant.xml` now ends in `?v=<8-char md5 of the file>`.
  New URL whenever a photo changes → Google fetches it. Feed rebuilt; only the `?v=` parts changed (checked by diff).
  **Whenever a product photo is replaced, rerun `node build-feed.js` in Krypta-v2.**

---

## 2026-11-20 16:30 ET — redesign session — Merchant Center account settings

- **Customer service contact** set (Business info): https://www.kryptaa.com/contact.html, hello@kryptaa.com,
  preferred = Email. No phone, no live chat claimed.
- **Promotions add-on turned on** + promotion `KRYPTAA12` created: 12% off the whole order, all products, US,
  code KRYPTAA12, Nov 21 2026 – May 20 2027, no minimum, shown to all. Matches Stripe exactly (promo code
  `promo_1UHTacBxvrWSHcOekk32lH1w` → coupon `f3wcfP2p`, 12% forever, no minimum, no expiry). Google reviews it in
  24–72 h. **If KRYPTAA12 is ever changed or switched off in Stripe, end this promotion too** (Marketing → Promotions),
  or Google will advertise a code that fails at checkout. Renew it before May 20 2027.
- **Business name warning** = Merchant Center's own name "KRYPTAA" (all caps breaks Google's capitalization rule).
  Changed to **"Kryptaa"** in Merchant Center Business info on Vish's OK (16:58). Logo, website and JSON-LD `name`
  stay KRYPTAA (`alternateName` Kryptaa already set). Feed re-fetched manually at 15:59 EST so the name + new
  photo fingerprints get picked up today.
- **Google Customer Reviews: skipped.** Needs an opt-in script on an order confirmation page with the buyer's email
  and order id, which means a Worker change (backend rules). Store stars need ~100 reviews/year anyway.
- Store quality in Merchant Center is now **Good** (was Fair on Nov 13).

---

## 2026-11-20 16:05 ET — redesign session — feed builder fixed, old page builder locked

- **Krypta-v2 `build-feed.js` now reads `catalog.js` + `slugs.js`** (what the live site shows), not the old
  `products.js`. Archived pieces skipped; sizes with stock 0 in `K.stock` left out, same as `site.js`. Safe to run
  `node build-feed.js` again. Rebuilt `feed/google-merchant.xml`: same 79 listings, prices and stock. Photos now match
  the product pages: front-design covers on the 4 tees, Her & Him photo added, Need Some Money no longer shows a jeans
  photo, anime covers use .webp, yellow track pant cover = its first photo. Tee material/pattern kept.
- **Krypta-v2 `build-seo.js` is LOCKED** (exits with a warning unless `KRYPTAA_OLD_BUILD=1`). It reads the old
  `products.js` and rewrites all 30 product pages, the journal, the shop pages and `sitemap.xml` in the pre-Nov-10
  design, wiping the storefront and its Google tags. Product page tags now come from `tools/build_static_seo.py`
  in Kryptaa-2. (Tested by mistake on a local copy: it rewrote 80+ files. Reverted before any commit.)

---

## 2026-11-20 15:40 ET — Google feed: tee material + pattern

- Merchant Center suggested "Update descriptions for T-Shirts": 20 tee listings (Medusa, Angel of Death, Broken Skull, Need Some Money, all sizes) lacked a clean Material and a Pattern.
- `feed/google-merchant.xml`: tee items now send `<g:material>Cotton</g:material>` and `<g:pattern>Graphic print</g:pattern>` (was a long "300GSM · …" string, no pattern). Pre-order date updated to 2027-01-04 to match the product pages.
- Edited the feed file BY HAND. Do NOT just rerun `node build-feed.js` in Krypta-v2: it reads the old products.js and would bring back deleted Red Gothic "onbody" photos and the old Gothic Skull main image. build-feed.js itself was updated so a future rebuild also sends material/pattern for tees.

---

## 2026-11-20 14:30 ET — redesign session — crawlable product + journal pages restored (SEO)

**Why:** the Nov 10 storefront launch made `products/*.html` and `journal/*.html` empty shells filled by
`site.js` after load. The saved HTML lost the product name/price/description, every `<h1>`, and all the
Product / Breadcrumb / Article structured data the old pages had. Likely behind the Merchant Center
"Fair" store rating (Nov 13).
- New `tools/build_static_seo.py` (re-runnable, replaces its own `<!-- seo:static -->` blocks). For all 30
  `products/*.html`: Product JSON-LD (name, description, up to 6 photos, brand, sku `KRYPTAA-<id>`, USD
  price, InStock/PreOrder/OutOfStock from `catalog.js`, 7-day mail return policy) + BreadcrumbList, and a plain
  fallback inside `#pdp` (crumbs, `<h1>`, price, description, photo). `site.js` replaces `#pdp` on load, so
  shoppers see no change. **Re-run it whenever a product's name, price, photos or stock changes.**
  No review/rating markup on purpose (one of the reviews is the owner's; Google penalises self-reviews).
- `journal/*.html` (8): the article (`#postHead`, `#postImg`, `#postBody`) is now written into the HTML
  (captured from the live render) + Article and BreadcrumbList JSON-LD. If `build-journal.js` regenerates
  these pages, it must keep this.
- `site.js`: article crumbs used `index.html` / `journal.html` relative to `/journal/` (404s); now `${DEPTH}`.
- `journal.js` + 2 articles: links to `journal-post.html#slug` (404 from `/journal/`) → `/journal/<slug>.html`.
- Meta descriptions added to about, checkout, contact, faq, info, journal, privacy, reviews, size-guide,
  terms, track, wishlist. `journal-post.html` (old hash template, not in sitemap) → title "Journal Post",
  `noindex,follow`. 3 journal `<title>`s shortened to ≤65 characters.
- Checked: page looks identical with JS on (phone + desktop); with JS off, product pages show name + price and
  articles show full text; 76 JSON-LD blocks parse; no broken links.
- Asset version `v=19` → `v=20`.

## 2026-11-20 13:45 ET — redesign session — 12% club pop-up waits 25 s (Google interstitial fix)

- `site.js` club pop-up (`#clubPop`): removed the "scrolled past half the page" trigger (fired almost at
  once on short phone pages, so the pop-up covered the jeans right after opening — Google ranks pages lower
  for that on phones). Now it opens only when **25 s have passed AND the visitor has scrolled, tapped or
  typed**, with the tab visible. Crawlers that fast-forward timers never interact, so they never see it.
  Still once per visitor (`kry_club_pop`), never on checkout/track/admin.
- Tested phone + desktop: hidden at 3/10/20 s, shown at ~25 s after a scroll; no-interaction visit stays
  clear until the first scroll after 25 s.
- Asset version `v=18` → `v=19`.

## 2026-11-18 16:50 ET — redesign session — readable labels, one gold accent, Spin the drop fits

From the Frontend Design review (#4, #5, #7). Vish said skip #2, so the homepage keeps all its sections.
- `site.css` (end, "Design review (Nov 18)" block, `html body` prefix so it beats index.html's inline styles):
  - #4 small labels: menu, bag button, top banner, eyebrows and the small typewriter labels (`.mono`,
    `.ld-hud`, `.ld-tags span`, `.card .sub`, etc.) now use the body face (Archivo), normal case, no wide
    letter-spacing, 12.5–14px. Buttons keep their capitals.
  - #5 gold-word headings: `h2 em` / `.ld-h` second line no longer gold (`color:inherit!important`). Only the
    homepage opening h1 ("Pick it off the rail") keeps its gold outline.
- `lookbook.html`: removed the inline gold span on "Every drop is a statement."
- `index.html` #7 Spin the drop on desktop (≥761px): ribbon width `min(w*1.25,1500)` → `min(w*.8,1260)` and tilt
  -11° → -6°, so the whole ribbon stays on screen (was running off both sides). Phones unchanged.
  Also guarded the Spin and Aura scripts (`if(!helix)return;` / `if(!cv)return;`) in case a section is removed.
- Asset version `v=17` → `v=18`.

## 2026-11-18 15:30 ET — redesign session — design fixes from the Frontend Design review

- `landing.css` (9 shop pages): headings now use the same gothic display face as home + product pages
  (`--f-tech` → `var(--f-display)`, Big Shoulders Display 800), sizes raised to suit the narrower face.
  Before, shop pages used Space Mono for big headings, so the site looked like two brands.
- `site.js` + `site.css`: removed the "Complete the look" block (`#pairBlk`, `.pair*`) added on 11-11.
  It duplicated the existing "Complete the fit" section on product pages.
- `index.html`: surprise-bag runner (`#sbr`) on phones (≤760px) tucks half into the screen edge when it
  stops (`.sbr.rest.at-r/.at-l .go` translateX ±26px), so it no longer covers text; its ✕ hides while tucked.
- Asset version `v=16` → `v=17`.

## 2026-11-17 21:00 ET — redesign session — Microsoft Clarity on every page

- Clarity tag `y6kgv0czuk` (same snippet as `404.html`: loads 2.5 s after page load) added just before
  `</head>` on **63 pages**: every public page, `products/*.html` and `journal/*.html`.
  Skipped on purpose: `orders.html` (owner dashboard, holds order data). Before this, Clarity was only
  on `404.html` and 4 old pages on the live copy.
- HTML only, no CSS/JS asset changed, so the `?v=` stamp stays `v=16`.
- Also found 59 live pages (Krypta-v2) still loading `?v=15` assets after the v16 change; bumped them to `v=16`
  so live matches Kryptaa-2 byte for byte.

## 2026-11-17 20:00 ET — Claude Code session — key rotation closed out

- The leaked Mar 25 restricted key is **deleted** in Stripe. Verified afterwards that nothing broke:
  Worker checkout returns a live `checkout.stripe.com` session, coupons apply, track-order responds,
  webhook signatures enforced (400 on bad), all Worker and Netlify admin routes 401, site 200 on `v=16`.
- Netlify now runs the same restricted key created this morning, with Promotion Codes and Charges
  added. Confirmed with `get-orders` 200 and `pulse-now` 200 — the latter exercises `charges.list`.
- **Every credential that leaked on 11 Nov is now dead**: `rk_live_`, `whsec_`, `ADMIN_KEY`,
  `Mail_Secret`. Zero secrets in any of the four repos' working trees or git history.
- The Google service-account JSON in `~/Downloads` stays — Vishwak keeps it on local disk deliberately.
- Added the standing backend rules at the top of this file.

## 2026-11-17 19:30 ET — Claude Code session — Stripe key rotation finished, where secrets live

**Both Stripe credentials rotated.** The `rk_live_` and `whsec_` that leaked into a chat transcript on
11 Nov are replaced. The webhook secret was verified the honest way: signing an event with the secret
revealed on the Stripe destination page and posting it to production — `HTTP 200`.

**The leaked restricted key was in TWO places, not one.** The Worker had it, and so did Netlify's
`STRIPE_SECRET_KEY` (used by `get-orders`, `track-order`, `daily-pulse`, `lab-feed`, `recover-carts`,
`order-notify`). Netlify now uses the same new restricted key, stored as a Netlify *secret* value.

**Netlify's Stripe calls**, for scoping a key in future: `checkout.sessions.list`, `listLineItems`,
`create`, `coupons.create`, `promotionCodes.list/create`, `charges.list`. A key scoped only for the
Worker (Checkout Sessions + Coupons) will make `daily-pulse` fail silently on `charges.list`.

**Where every secret lives now** — none are in any repo (verified: 0 hits in all four working trees and
0 in all git history):
- Cloudflare Worker secrets (write-only): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `ADMIN_KEY`,
  `Mail_Secret`, `META_CAPI_TOKEN`. Set only with `wrangler versions secret put`, never a bare deploy.
- Netlify env (marked secret): `STRIPE_SECRET_KEY`, `ADMIN_KEY`, `Mail_Secret`, `GMAIL_APP_PASSWORD`,
  `NETLIFY_API_TOKEN` and friends. `ADMIN_KEY` must stay identical to the Worker's or the dashboard
  401s on half its tabs.
- Netlify Blobs: the Google service-account key, as blob `ga4-sa-key` in store `kryptaa-config`.
  **Never put it back in the environment** — 2.3KB breaks every deploy at the 4KB Lambda cap.

**Still to do:** delete the Mar 25 restricted key in the Stripe dashboard once the Netlify deploy is
verified. It is the leaked one and it was still being used by Netlify until today.

**Routine UI work needs none of this.** Edit, push, mirror, bump `?v=`. Keys only come up when one
leaks or a service is added.

## 2026-11-17 17:45 ET — Claude Code session — Stripe keys rotated

- **Restricted key replaced.** New Stripe restricted key (Checkout Sessions: Write, Coupons: Write only)
  set on the Worker; version `acd27d38` promoted and verified against Stripe's own records — a
  $33.75 session with a 12% coupon correctly applied, and a $51.99 session without. Wallets and BNPL
  intact (card, klarna, link, cashapp, amazon_pay, crypto). The `rk_live_` that leaked on 11 Nov can be
  deleted from the Stripe dashboard.
- **Webhook signing secret rolled** on destination `sophisticated-victory`
  (`we_1UGu1dBxvrWSHcOenvj6H7vL`, the Cloudflare endpoint). Worker version `6b5c8df9` promoted.
- **Why the webhook had a 91% error rate all week:** the Worker's `STRIPE_WEBHOOK_SECRET` did not match
  that endpoint — most likely the value came from `sophisticated-serenity`, the DISABLED Netlify
  endpoint. A self-signed test passed (Worker consistent with itself) while every real Stripe delivery
  returned 400. **Note for next time: a signed test proves the Worker is self-consistent, not that it
  matches Stripe. Only `pending_webhooks` dropping to 0 proves delivery.**
- **CONFIRMED FIXED.** Verified by signing a `ping.diagnostic` event with the secret revealed on the
  Stripe destination page and posting it to production: `HTTP 200 Ignored`. That is the real test —
  Stripe's own secret, accepted by the Worker. Production runs version `6b5c8df9`. The 93% error
  rate is history from before the fix and will fall away as new events arrive.
  Helper kept at `~/check-webhook-secret.sh` — reveal the secret on the destination page, paste at
  its hidden prompt, and it reports MATCH or MISMATCH without the value touching disk or a transcript.

## 2026-11-17 14:30 ET — Claude Code session — Analytics restored, admin key aligned, bigger dashboard logo

- **Analytics tab was dead** ("Missing GA4_PROPERTY_ID or GA4_SA_KEY env var"). `GA4_SA_KEY` had been
  deleted from Netlify on 10 Nov because the key is **2,356 bytes** and Netlify injects every site env
  var into every Lambda, where AWS caps the payload at 4KB — its presence failed EVERY function deploy.
- **Fix: the key now lives in Netlify Blobs, not the environment.** New
  `netlify/functions/sa-key-lib.js` (`loadServiceAccount()` — env first, then blob `ga4-sa-key` in store
  `kryptaa-config`) and `set-sa-key.js` (admin-gated; POST stores, GET reports presence only and never
  returns the key). `ga4-report`, `gsc-report` and `gsc-sitemap-submit` all use the loader.
  `GA4_PROPERTY_ID` stays in env — it is 9 bytes. Backend commit `668d0aa`.
  **Do not put GA4_SA_KEY back in the environment; it will break every deploy again.**
- The original key was still on disk at `~/Downloads/kryptaa-analytics-9301d916a496.json`
  (project `kryptaa-analytics`, `kryptaa-ga4-reader@...`), so no new key was generated.
- **Verified live:** GA4 30d = 369 sessions / 297 users / 832 views / 42% bounce / 1 purchase $36.61,
  funnel 128 view_item → 5 add_to_cart → 6 begin_checkout → 1 purchase. GSC 28d = 45 clicks /
  667 impressions / 6.7% CTR / position 9. The only converting channel is Organic Search.
- **Admin keys had diverged.** `ADMIN_KEY` was rotated on the Cloudflare Worker on 11 Nov but not on
  Netlify, so the dashboard's Analytics/SEO/Conversion tabs 401'd and the old leaked key still opened
  Netlify's `get-orders` (customer names and addresses). Netlify `ADMIN_KEY` now matches the Worker and
  is marked secret. Confirmed the old key returns 401 on both platforms.
- **Dashboard logo** `.od-header-logo` 46 → 72px desktop, 24 → 40px and 22 → 36px on the smaller
  breakpoints (`orders.html`, Krypta-v2 `28f23b1`).

## 2026-11-17 13:35 ET — Claude Code session — mirror v16 live, commit the Worker, Stripe webhook

- **Krypta-v2 was a commit behind.** Kryptaa-2 was at `v=16` but the repo serving kryptaa.com was still
  on `v=15`, so the new Red Gothic studio photos and the phone pop-up close button were NOT live
  (`modal-fx` absent, `mens-pant-2-model-1.webp` 404). Mirrored Kryptaa-2 `5ef9758` → Krypta-v2 `9b8d8a0`.
  Nothing in Kryptaa-2 changed.
- **Worker code committed** (`kryptaa-worker` `6b72ea1`). `src/club.js` was untracked and
  `src/index.js`, `src/util.js`, `wrangler.toml` had uncommitted edits — all live on Cloudflare since
  10 Nov but absent from git, so a clean redeploy would have dropped club-signup, the GitHub Pages CORS
  origin and the NOTIFY_EMAIL fix.
- **Stripe webhook failure resolved.** Stripe warned it would disable
  `kryptaa-api.kryptaa.workers.dev/stripe-webhook` on 20 Nov. Cause: during the 11 Nov secret rotation a
  Worker version was briefly deployed with no secrets, so `STRIPE_WEBHOOK_SECRET` was undefined and
  signature checks returned 400. Verified fixed by signing a dummy event with the current secret — the
  Worker returned `200 Ignored`.
  All 10 undelivered events are `checkout.session.expired` from the test address
  `kryptaa.test.order@gmail.com`. **No `checkout.session.completed` was missed, so no paid order went
  unfulfilled.** Stripe's classic webhooks have no resend operation in the API (dashboard only), so a
  fresh checkout session was created; its expiry event delivers successfully and clears the failure state.

## 2026-11-17 08:30 ET — redesign session — Red Gothic new model photos, phone close button for pop-ups

- Red Gothic Embroidery Denim (id 11): old `mens-pant-2-onbody-1|2|3.webp` (On Body / Worn / Fit) deleted and
  replaced by Vish's 3 new studio photos `imgs/pants/mens-pant-2-model-1|2|3.webp` (1 = standing full,
  2 = seated, 3 = close-up). Paths updated in catalog.js, index.html, men.html, men-all.html, jeans.html,
  journal.js, sitemap.xml, feed.xml, feed/google-merchant.xml.
- Phones (≤760px): every pop-up (Quick look, surprise bag, club pop-up, Pick your weapon) now shows a round ✕
  pinned to the screen's top-right corner (`.modal-fx`, added by `site.js`, shown while `html.modal-open`).
  The in-box ✕ is hidden on phones because it scrolled away. Fixes "Maybe later can't get back" on the
  surprise bag: the ✕ is always reachable. Surprise bag box: no backdrop blur on phones (iOS tap/scroll bug).
- Asset version `v=15` → `v=16`.

- **Fixed a broken image on the live homepage.** `index.html:548` (review tile) pointed at
  `img/rev-mens-pant-2-model-1.webp`, which the 17 Nov Red Gothic rename never created — only
  `img/rev-mens-pant-2-onbody-1.webp` existed, so the tile 404'd. Built the missing thumbnail from
  `imgs/pants/mens-pant-2-model-1.webp` at 800x1200 to match the other `rev-*` thumbnails.

## 2026-11-11 22:45 ET — redesign session — Gold Baroque Wide-Leg cover = back embroidery photo

- `catalog.js` product 31: `img`/`hero` `womens-pant-6-g5.webp` (plain black) → `womens-pant-6-g2.webp`
  (back, gold embroidery); that photo moved to the front of its gallery.
- Same swap in the homepage "Pick your weapon" data (`index.html`), the photo tiles on `women.html`,
  `women-all.html`, `jeans.html`, and the main image in `feed.xml` + `feed/google-merchant.xml`.
- Asset version `v=14` → `v=15`.

## 2026-11-11 22:00 ET — redesign session — bundle picks, club pop-up, louder free-shipping bar, Google/IG feed, SEO, lighter photos

- `site.js` product page: "Complete the look" block (`#pairBlk`, `.pair`) under the Add-to-bag area — 3 matching
  pieces from the other half of the outfit (tees ↔ jeans, track pants → tees, women's wear ↔ women's denim),
  each opens Quick look. Line: "Code KRYPTAA12 = 12% off the whole bag" (existing code, no new discount).
- `site.js`: club pop-up `#clubPop` (`.club-pop`), once per visitor (localStorage `kry_club_pop`), after 20 s or
  half the page, never on checkout/track/admin. Uses the same `form[data-club]` handler → Worker `club-signup`
  (source `popup`). After "You're in" it shows code KRYPTAA12 + Copy.
- `site.js` bag: free-shipping bar louder — truck icon, 8px glowing gold track, "A $39 tee gets you there →"
  link when a tee closes the gap; turns green when unlocked. CSS at the end of `site.css`.
- New `feed.xml` (Google Merchant RSS, g: namespace) — 26 live products, links to /products/<slug>.html.
  Works for Google Merchant Center and Meta Commerce Manager (Instagram Shopping). Pre-orders use
  availability_date = 2026-12-11. Rebuild it when products/prices change.
- SEO: real titles + meta description + Open Graph tags on men, men-all, women, women-all, women-wear,
  t-shirts, anime, jeans, track-pants, lookbook, product.html.
- 22 big .webp photos re-encoded (max 1500px, quality 80): 6.9 MB → 5.3 MB.
- Asset version `v=13` → `v=14`.

## 2026-11-11 21:15 ET — redesign session — Instagram on phones, Look closer photo boxes, Angel of Death front

- `index.html`: on touch screens, links to instagram.com lose `target="_blank"` (new-tab links to
  Instagram are often blocked on phones; same tab opens the Instagram app reliably).
- `landing.css` (desktop): Look closer photo box `.call .ph` now takes the photo's own shape (no empty
  bars); the 0N/04 counter moved to the top-right so it no longer sits under a card.
- `rail/3.webp` (Angel of Death) re-cut from the FRONT (from `imgs/tees/tee-2-g2.webp`, shirt only).
  Used by the homepage rail and the "layer by layer" stacks. Rail label changed to "Heavyweight · Front".
- Asset version `v=12` → `v=13`.

## 2026-11-11 21:00 ET — redesign session — faster Look closer + phone upgrades

- `landing.css` (all 9 category pages): Look closer section height `n+1` screens → `n*0.45+1`
  (4 close-ups ≈ 2.8 screens instead of 5). "Layer by layer" stack 300vh → 190vh.
- Phones/tablets (≤980px): stack + Look closer are no longer sticky scroll sections. The drop becomes a
  horizontal swipe row of cut-outs, the close-ups a swipe row of cards (`.ld-calls` flex + scroll-snap);
  `.ld-labels` and the figure with dots are hidden. "Swipe →" hint `.ld-swipe` added under both headings.
- `site.js` product page: swipe left/right on the big photo changes it; `#stickyBuy` bar (name, price ·
  size, Add to bag) slides up from the bottom on phones once `#addBtn` scrolls out of view. With no size
  picked it scrolls back to the sizes and shows "Pick a size first".
- `site.css` phones: size buttons ≥56×48px, hearts 44px.
- `index.html`: surprise-bag runner 54px → 44px on phones.
- Asset version `v=11` → `v=12`.

## 2026-11-11 20:45 ET — redesign session — T-Shirts page uses the Her & Him photos, bigger

- `t-shirts.html`: hero (`.ld-prod.ld-photo`) and the 4 one-per-screen panels (`img.ld-photo`) now show
  `imgs/tees/duo-1|3|4|5.webp` — the same merged her+him photos as `women-all.html`.
  Hero section has class `ld-hero-duo` (wider middle column, bigger stage); tilt box `.ld-duo` is 1.162 wide.
- `landing.css`: non-active hero photos are `visibility:hidden` so the photo always matches the name in the
  card (before, the previous tee could show under the new card mid-swap). Phone layout stacks full width.
- Asset version `v=10` → `v=11`.

## 2026-11-11 20:30 ET — redesign session — Pick your weapon on phones flips like desktop

- `index.html`, section 5 JS: on touch screens the line nearest the middle of the screen gets
  class `live`; its own big photo (`.mini`) flips through every piece on that shelf once a second,
  with a gold caption `.wp-cap` (name · price · n/total). Leaves the photo back on its cover when it
  goes off. Tap still opens the all-pieces pop-up (`#wpModal`). Desktop hover card unchanged.
- Added a small gold hint above the list on phones (`.wp-hint`).
- Asset version `v=9` → `v=10`.

## 2026-11-11 20:10 ET — redesign session — "Her & Him" tee photos, Women → T-Shirts

- **Women's "One tee. Worn by both." section** (`women-all.html`): each tee now shows ONE merged photo
  of her and him wearing it (`imgs/tees/duo-1|3|4|5.webp`, made by cutting both models out of their
  studio shots and placing them on one wall). Old two-photo layout removed. CSS: `.ld-pair-ph.one`
  in `landing.css`.
- Merged photo also added as the 2nd photo ("Him & Her") in each tee's gallery in `catalog.js`
  (ids 1, 3, 4, 5). Cover stays the front design.
- **T-Shirts link added to every Women menu**: header dropdown, footer column, mobile drawer
  (63 HTML files), and the chips row on `women-all`, `women`, `women-wear`. It points to
  `t-shirts.html` (tees are unisex).
- Asset version `v=8` → `v=9`.

## 2026-11-11 19:55 ET — redesign session — live as Krypta-v2 `d766e34` (Kryptaa-2 `8b880dc`)

- `t-shirts.html`: hero and one-per-screen panels show the man wearing each tee (`imgs/tees/tee-1-g2`,
  `tee-2-g2`, `tee-3`, `tee-4-g6`), class `ld-photo`. The bare-shirt cut-outs are still in `rail/1|3|4|5.webp`;
  to undo, point those `src`s back at `rail/N.webp` and drop `ld-photo`.
- `catalog.js`: removed the jeans mirror selfie from tee 5's gallery (it stays on jeans id 10),
  removed the glitch-stripes `tee-3-g6.webp` from tee 4's gallery.
- Asset version `v=7` → `v=8`.

## 2026-11-11 01:22 ET — redesign session — live as Krypta-v2 `73ad395` (Kryptaa-2 `8a373e1`, `b732270`)

Vish's 11-item list:
1. Photos use `object-fit:contain` everywhere (no cropping), dark `#0f0c09` behind.
2. Homepage drift row (under reviews) is driven by JS (`.drift-row.js`): auto drift + moves with scroll.
3. `html,body{touch-action:manipulation}` — no double-tap zoom.
4. Surprise bag: themed size chart `imgs/bundle/surprise-size-chart.webp`, "📏 Size chart" button
   (`.sb-cbtn`) in the pop-up, also in product 900's gallery.
5. Pick your weapon pop-up works on phone tap.
6. Brand video sound button: "🔇 Tap for sound" / "🔊 Sound on · tap to mute".
7. Look closer callouts bigger, uncropped; hover/tap a dot opens it (`landing.js` `showK`).
8. Track pants re-cut: `rail/500–503.webp` (yellow uses `womens-st-yellow-03`).
9. Category landings: `#ldThumbs` photo strip + `#ldQL` Quick look in hero; Quick look on every panel.
10. Tee covers = front design (`tee-2-front.webp`, `tee-3-front.webp` cleaned of smeared edges).
11. Gallery arrows = thin gold SVG chevrons (`.gnav svg`), replacing the trident image.
- Asset version `v=6` → `v=7`.
