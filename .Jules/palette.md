## 2024-05-23 - Interactive State Synchronization
**Learning:** In script-driven static UIs, accessibility states (like `aria-expanded` and `aria-label`) often diverge from visual states. Toggling classes for animations does not communicate state changes to screen readers; these must be explicitly managed within the same event delegation logic.
**Action:** Always synchronize ARIA attributes (`aria-expanded`, `aria-label`, `aria-controls`) in the primary event handler of any drawer, menu, or toggle component.

## 2024-05-23 - Empty State Conversion
**Learning:** An empty shopping cart without a clear "next step" acts as a user flow dead-end. Providing a themed CTA (e.g., "Shop The Drop") that automatically handles the UI cleanup (closing the drawer) reduces friction and encourages continued exploration.
**Action:** Audit empty states for actionable CTAs and ensure they include logic to close the current overlay or context upon navigation.
