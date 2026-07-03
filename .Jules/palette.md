# Palette's Journal - KRYPTAA UX & Accessibility

## 2025-05-15 - Synchronizing ARIA States for Script-Injected Drawers
**Learning:** In a cinematic, script-driven static site where core UI (like the cart and mobile menu) is injected via JavaScript, visual state changes (like adding a 'cart-open' class to the body) often diverge from accessibility states. Screen readers do not automatically track these visual transitions.
**Action:** Always synchronize `aria-expanded` and `aria-controls` on the triggers in real-time within the same event delegation logic that toggles the visual classes.

## 2025-05-15 - Actionable Empty States
**Learning:** Empty cart states are often "dead ends" in the conversion funnel. Providing a clear, branded CTA (e.g., 'Shop The Drop') that automatically closes the drawer upon navigation significantly improves flow.
**Action:** Inject a primary CTA button in the empty cart state that points to the main shop page (`men.html`) and includes a `data-cart-close` attribute to ensure the drawer dismisses during the transition.

## 2025-05-15 - Accessible Feedback for Dynamic Values
**Learning:** Quantity adjusters and counters that update via JavaScript are invisible to screen readers unless explicitly marked for monitoring.
**Action:** Use `aria-live="polite"` on the value containers (`.qty-val`, `.qty-stepper-val`) so updates are announced to the user without interrupting their current task. Pair this with explicit `aria-label` attributes on the icon-only `+` and `-` buttons.
