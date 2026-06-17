## 2025-05-15 - [Accessible Mobile Menu Toggle]
**Learning:** For interactive UI components like mobile menu toggles, visual state changes (e.g., hamburger to close icon) must be mirrored by ARIA attributes (`aria-expanded` and dynamic `aria-label`) to ensure the state is correctly announced to screen reader users. Using the return value of `classList.toggle()` is a concise way to keep these attributes in sync.
**Action:** Always verify that interactive elements with multiple states have corresponding ARIA attributes that update dynamically.
