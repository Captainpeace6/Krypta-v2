## 2025-05-14 - Interactive Panel Accessibility & Empty States
**Learning:** Interactive panels like drawers and menus should dynamically synchronize their trigger's ARIA attributes (e.g., aria-expanded, aria-label) in real-time to ensure screen reader users are aware of state changes. Additionally, empty states (like an empty cart) should provide a clear call-to-action (CTA) to prevent user "dead-ends."
**Action:** Always implement a synchronization loop or state update logic for triggers when toggling panels, and ensure every empty state has at least one helpful navigation link.
