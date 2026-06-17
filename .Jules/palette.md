## 2025-05-15 - Synchronizing Drawer ARIA States
**Learning:** In cinematic, script-driven static websites where UI drawers (menu, cart) are controlled by body classes, accessibility states like `aria-expanded` and `aria-label` must be synchronized programmatically within the central event delegation logic. Relying on static HTML for these attributes leads to "dead" accessibility states.
**Action:** Implement a central synchronization function (e.g., `syncUIStates`) called during all drawer toggle events to ensure `aria-expanded` and labels (Open/Close) stay consistent with the visual state.

## 2025-05-15 - Empty State Continuity
**Learning:** Empty states in modal drawers (like a shopping cart) can become "dead-ends" if they only provide information ("Your bag is empty"). Adding a prominent CTA (e.g., "Shop Now") that automatically closes the drawer upon navigation maintains user momentum and reduces bounce rates.
**Action:** Always include a primary CTA in empty states that uses existing event triggers (like `data-cart-close`) to ensure the UI resets correctly when the user navigates.

## 2025-05-15 - Accessible Dynamic Content in Static Sites
**Learning:** When injecting dynamic content (like cart items or quantity controls) into a static page, use `aria-live="polite"` on value containers and explicit `aria-label` on icon-only controls to ensure the dynamic nature of the UI is perceivable by assistive technologies.
**Action:** Wrap volatile values (quantities, totals) in live regions and add descriptive labels to +/- buttons during the template rendering phase.
