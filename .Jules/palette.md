## 2025-06-19 - Actionable Empty States and ARIA Synchronization

**Learning:** In highly cinematic, script-driven UIs like KRYPTAA, visual states (classes on body) often diverge from accessibility states. Triggers for menus and drawers must explicitly manage `aria-expanded` and `aria-label` in JavaScript to remain accessible. Furthermore, "dead-end" UI (like an empty cart without a CTA) breaks the shopping flow; adding a 'Shop The Drop' button in the empty state significantly improves user retention.

**Action:** Always synchronize `aria-expanded`, `aria-controls`, and dynamic labels (e.g., Open/Close menu) when toggling UI panels via JavaScript. Ensure every empty state provides a clear, styled CTA to the primary user path.
