## 2025-05-15 - [Accessibility & UX Foundations]
**Learning:** The Kryptaa v3 interface uses a cinematic, custom-rendered DOM that lacks standard ARIA attributes for interactive components like the mobile menu and shopping cart. Icon-only buttons (quantity adjusters, remove) and state-dependent toggles need explicit ARIA management to be accessible to screen readers.
**Action:** Always implement `aria-expanded`, `aria-controls`, and `aria-label` for dynamic panels. Ensure live regions (`aria-live`) are used for value updates like cart quantities.
