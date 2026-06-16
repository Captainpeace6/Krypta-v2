## 2025-05-15 - Synchronizing ARIA States in Dynamic UIs
**Learning:** In a cinematic, script-heavy static site where UI components are injected or toggled via JS (like `motion.js`), accessibility attributes like `aria-expanded` and `aria-label` often fall out of sync if they are only set in the initial HTML. Centralizing these updates into a `syncUIStates()` function that is called whenever the `body` class state changes ensures consistent screen reader feedback across all triggers (nav, cart, etc.).
**Action:** Always implement a central UI state synchronizer when using body-level classes to manage panel visibility (drawers, menus).

## 2025-05-15 - Eliminating Empty Cart Dead-Ends
**Learning:** An empty cart is a UX "dead-end". Providing a clear, branded "Shop The Drop" CTA within the empty state improves flow and conversion by giving the user an immediate next step.
**Action:** Ensure all empty states (cart, search, favorites) include a primary action button that redirects users back to the main discovery path.
