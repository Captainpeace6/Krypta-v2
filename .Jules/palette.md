## 2025-05-15 - [Dynamic ARIA Synchronization]
**Learning:** In script-driven static UIs (orchestrated via a central JS like `motion.js`), accessibility states (aria-expanded, aria-label) do not update automatically and must be explicitly synchronized within the event handlers to avoid misleading screen reader users.
**Action:** Always include ARIA attribute updates (setAttribute) alongside visual class toggles in navigation and drawer logic.

## 2025-05-15 - [Actionable Empty States]
**Learning:** Empty drawers (like a shopping cart) act as "dead-ends" if they only contain a close button. Providing a "Shop Now" CTA that automatically closes the drawer upon navigation significantly reduces friction.
**Action:** Implement CTAs in empty states with `data-cart-close` or similar triggers to ensure the UI resets correctly when the user follows the call to action.

## 2025-05-15 - [Selector Specificity in KRYPTAA]
**Learning:** Standard data attributes like `[data-cart-open]` are reused across multiple navigational components (header vs mobile nav). Automated tests must use scoped or more specific selectors (e.g., `.cart-trigger[data-cart-open]`) to avoid "multiple elements" errors in Playwright.
**Action:** Use specific class + attribute combinations for primary interaction locators in verification scripts.
