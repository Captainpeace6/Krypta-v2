#!/usr/bin/env python3
"""Responsive image variants: for every product/photo image under imgs/{pants,tees,tops,anime,.}
wider than 600px, write <name>-480.webp and <name>-800.webp next to it (skipped if up to date).
Runtime: products.js kUpgradeImages() adds srcset pointing at these. Run from build-seo.js."""
import os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.abspath(__file__))
DIRS = ['imgs/pants', 'imgs/tees', 'imgs/tops', 'imgs/anime', 'imgs']
SKIP = ('sizechart', 'logo', 'sigil', 'wordmark', 'emblem', 'icon', 'favicon', 'poster', 'og-', 'email')
made = skipped = 0
for d in DIRS:
    absd = os.path.join(ROOT, d)
    if not os.path.isdir(absd): continue
    for f in sorted(os.listdir(absd)):
        low = f.lower()
        if not low.endswith(('.webp', '.jpg', '.jpeg', '.png')) or low.endswith(('-480.webp', '-800.webp')) or any(s in low for s in SKIP): continue
        src = os.path.join(absd, f); base = os.path.splitext(src)[0]
        try: im = Image.open(src)
        except Exception: continue
        w, h = im.size
        if w <= 300: skipped += 1; continue
        # Both variants always exist (smaller sources are re-saved at their own size) so srcset never 404s
        for W in (480, 800):
            out = f'{base}-{W}.webp'
            if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src): skipped += 1; continue
            tw = min(W, w)
            im2 = im.convert('RGB').resize((tw, round(h * tw / w)), Image.LANCZOS)
            im2.save(out, 'WEBP', quality=84, method=6); made += 1
print(f'✓ images: {made} variants written, {skipped} up to date')
