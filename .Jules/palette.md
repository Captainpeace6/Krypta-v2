## 2025-05-15 - Empty State Guidance & Interactive ARIA Sync

**Learning:** Empty states should not just be static messages; they are opportunities to guide the user back into the primary flow. Adding a "Shop The Drop" CTA in the empty cart drawer significantly improves the "return to shop" experience. Additionally, synchronizing ARIA attributes (`aria-expanded`, `aria-label`) dynamically with UI state transitions is crucial for maintaining an accurate accessibility tree in single-page-like interactive drawers. Using existing attribute-based closing triggers (like `data-cart-close`) on new elements simplifies implementation and ensures consistency.

**Action:** Always include a primary call-to-action in empty states. Use declarative attributes for interaction handlers where possible to reduce code duplication. Synchronize `aria-expanded` and `aria-label` whenever a panel's visibility state changes.
