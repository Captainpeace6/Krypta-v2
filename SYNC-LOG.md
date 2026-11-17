# KRYPTAA — change log shared between Claude sessions

Two Claude sessions edit this website: **"Kryptaa snap scroll bugs"** (Claude Code) and the
**website redesign session** (Insta reels project). Both write to **Kryptaa-2** (main copy) and
**Krypta-v2** (the repo that serves kryptaa.com).

**Before you change anything:** `git pull` both repos and read the newest entry here.
**After you change anything:** add an entry at the top, with the commit ids and the files touched.
Only copy a file to Krypta-v2 if it still matches the Kryptaa-2 version you started from
(`cmp` it first), so neither session overwrites the other's fix.

Asset version in `?v=` query strings must go up by one with every live change.

---

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
