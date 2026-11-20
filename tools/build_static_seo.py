#!/usr/bin/env python3
"""Put real, crawlable content back into the product pages.

Since the Nov 10 storefront launch, products/*.html are filled in by site.js after load,
so the saved HTML had no product name, price or description and no structured data.
This script writes, for every products/<slug>.html:
  1. Product + BreadcrumbList JSON-LD in <head> (between <!-- seo:static --> markers)
  2. a plain fallback inside <div id="pdp"> (name as <h1>, price, description, main photo).
     site.js replaces #pdp's contents on load, so shoppers see the normal page.

Safe to run again: it replaces its own marked blocks. Run from the repo root:
    python3 tools/build_static_seo.py
"""
import html, json, re, glob, os

BASE = "https://www.kryptaa.com/"
CATS = {  # category -> (breadcrumb name, landing page)
    "men": ("Men's Denim", "men.html"),
    "anime": ("Anime Denim", "anime.html"),
    "tees": ("T-Shirts", "t-shirts.html"),
    "women": ("Women's Denim", "women.html"),
    "women_st": ("Women's Track Pants", "track-pants.html"),
    "women_wear": ("Women's Wear", "women-wear.html"),
}
RETURNS = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 7,
    "returnMethod": "https://schema.org/ReturnByMail",
}

src = open("catalog.js", encoding="utf-8").read()
K, _ = json.JSONDecoder().raw_decode(src[src.index("{"):])
slugs = dict((v, int(k)) for k, v in re.findall(r'(\d+):"([^"]+)"', open("slugs.js", encoding="utf-8").read()))
P = {p["id"]: p for p in K["products"]}
ST = K.get("stock", {})


def avail(p):
    if re.search(r"pre-order|production", p.get("availability", "") or "", re.I):
        return "https://schema.org/PreOrder"
    s = ST.get(str(p["id"]))
    if s is not None and not any(q > 0 for q in s.values()):
        return "https://schema.org/OutOfStock"
    return "https://schema.org/InStock"


def gallery(p):
    out = [p["img"]]
    for g in p.get("gallery") or []:
        u = g if isinstance(g, str) else g.get("src")
        if u and u not in out and not re.search(r"\.(mp4|webm|mov)$", u):
            out.append(u)
    return [BASE + u for u in out[:6] if os.path.exists(u)]


def esc(s):
    return html.escape(str(s), quote=True)


done, skipped = [], []
for path in sorted(glob.glob("products/*.html")):
    slug = os.path.basename(path)[:-5]
    pid = slugs.get(slug)
    p = P.get(pid)
    if not p:
        skipped.append(path)
        continue
    url = BASE + path
    desc = re.sub(r"\s+", " ", p.get("desc") or p["name"]).strip()
    cat_name, cat_page = CATS.get(p.get("category"), ("Shop", "men-all.html"))
    product = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": p["name"],
        "description": desc,
        "image": gallery(p),
        "brand": {"@type": "Brand", "name": "KRYPTAA"},
        "sku": f"KRYPTAA-{p['id']}",
        "category": cat_name,
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": "USD",
            "price": f"{float(p['price']):.2f}",
            "availability": avail(p),
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {"@type": "Organization", "name": "KRYPTAA"},
            "hasMerchantReturnPolicy": RETURNS,
        },
    }
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": cat_name, "item": BASE + cat_page},
            {"@type": "ListItem", "position": 3, "name": p["name"], "item": url},
        ],
    }
    ld = ("<!-- seo:static -->\n"
          + '<script type="application/ld+json">' + json.dumps(product, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>\n"
          + '<script type="application/ld+json">' + json.dumps(crumbs, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + "</script>\n"
          + "<!-- /seo:static -->")
    fallback = (f'<div id="pdp"><div class="pdp-static" style="max-width:760px">'
                f'<nav class="crumbs mono"><a href="../index.html">Home</a> / <a href="../{cat_page}">{esc(cat_name)}</a></nav>'
                f'<h1>{esc(p["name"])}</h1><p class="price">${float(p["price"]):.2f}</p><p>{esc(desc)}</p>'
                f'<img src="../{esc(p["img"])}" alt="{esc(p["name"])}" width="600" style="max-width:100%;height:auto"></div></div>')

    s = open(path, encoding="utf-8").read()
    s = re.sub(r"<!-- seo:static -->.*?<!-- /seo:static -->\n?", "", s, flags=re.S)
    assert s.count("</head>") == 1, path
    s = s.replace("</head>", ld + "\n</head>", 1)
    s, n = re.subn(r'<div id="pdp">.*?</div></div>(?=</section>)|<div id="pdp"></div>', fallback, s, count=1, flags=re.S)
    assert n == 1, path
    open(path, "w", encoding="utf-8").write(s)
    done.append(path)

print(f"product pages updated: {len(done)}; skipped (no product): {skipped}")
