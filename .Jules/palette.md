## 2026-05-28 - [Empty State CTA Pattern]
**Learning:** Empty states without clear navigation paths (like the "Your bag is empty" message) create UX dead-ends. In a luxury/streetwear context, maintaining the "flow" is critical.
**Action:** Always provide a primary action button (e.g., "Shop The Drop") in empty states that redirects users back to the core discovery loop (e.g., men.html). Use the `k-btn-gold` class for these CTAs to maintain visual hierarchy.

## 2026-05-28 - [Testing Cinematic Interfaces]
**Learning:** The cinematic entry system (`#k-preloader` and `#k-entry`) uses full-screen overlays that intercept all pointer events. Automated tests will fail to click underlying elements (like the cart trigger) if these aren't cleared.
**Action:** In Playwright/verification scripts, use `page.evaluate` to remove intro overlays and add the `is-loaded` class to the body to immediately expose the interactive UI.
