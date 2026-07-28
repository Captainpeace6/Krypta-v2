## 2025-05-15 - Interactive Panel Accessibility & Empty State Actionability

**Learning:** Interactive panels like drawers and mobile menus require dynamic synchronization of `aria-expanded` attributes on *all* triggers (header, sticky bars, etc.) to ensure a consistent experience for screen reader users. Additionally, "dead-end" empty states (like an empty cart) significantly benefit from actionable CTAs that automatically handle panel closure upon navigation.

**Action:** Always implement a central state management or a DOM-wide selector update for `aria-expanded` when panels are toggled. For empty states, provide a clear path forward (e.g., "Shop Now" button) and ensure it includes the necessary attributes (like `data-cart-close`) to clean up the UI state during transition.
