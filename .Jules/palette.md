## 2025-05-15 - [Enhanced Cart UX and Navigation Accessibility]
**Learning:** For single-page applications or sites with heavy dynamic DOM mounting (like Kryptaa's motion.js), interactive triggers must have their ARIA attributes (expanded, label, controls) synchronized programmatically. Static HTML triggers often lack the initial state that screen readers expect.
**Action:** Always implement a synchronization function for UI toggles (Menu, Cart) that updates `aria-expanded` and `aria-label` based on the current visibility state.

**Learning:** Empty states represent a "dead end" in UX. Injected CTAs (like "Shop The Drop") provide a clear path forward, but require CSS layout adjustments (e.g., increased flex gap) to ensure proper visual hierarchy.
**Action:** When adding CTAs to empty states, favor CSS-based spacing (gap) over inline JS margins to maintain styling consistency.
