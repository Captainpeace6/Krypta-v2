## 2025-05-30 - Dynamic Drawer Accessibility Pattern
**Learning:** In this cinematic UI where navigation and cart are dynamic drawers, triggers need manual synchronization of `aria-expanded` and `aria-label` to reflect state changes to screen reader users. Additionally, using `aria-controls` links triggers to their respective panel IDs.
**Action:** Always update ARIA attributes in the toggle functions (like `openCart`/`closeCart`) and use `aria-live="polite"` for dynamic content updates like cart quantity.
