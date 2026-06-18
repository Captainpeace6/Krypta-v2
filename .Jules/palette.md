## 2025-05-15 - [Interactive Panel ARIA Synchronization]
**Learning:** In highly animated, JS-driven static sites, standard ARIA attributes (expanded, controls, labels) must be explicitly managed in the toggle logic to ensure screen readers accurately reflect the UI state. Empty states (like an empty cart) should always provide a clear, actionable path back to the main user flow to avoid "dead-ends."
**Action:** Implement dynamic attribute updates (`setAttribute`) within all UI toggle functions (e.g., `openCart`, `closeCart`, `menuToggle`) and ensure empty state templates include a CTA button with a closure trigger.

## 2025-05-15 - [Accessible Skip-to-Content in Dynamic Chrome]
**Learning:** When page "chrome" (nav, footer, overlays) is injected dynamically via JavaScript, the "Skip to Content" link and the corresponding target ID (`main-content`) must also be managed by the same script to guarantee consistency across different pages.
**Action:** Inject the skip-link at the `afterbegin` of the body and dynamically assign the target ID to the `<main>` element during page initialization.
