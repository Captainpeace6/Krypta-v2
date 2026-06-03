## 2025-05-14 - Dynamic ARIA Synchronization for Interactive Panels
**Learning:** In a static HTML/JS environment with custom drawer/menu implementations (like those using GSAP), accessibility states like `aria-expanded` and `aria-label` are not automatically managed by the browser. Failing to sync these manually leaves screen reader users unaware of the component's state.
**Action:** Always implement a state-synchronization function that updates `aria-expanded` and toggles descriptive `aria-label` text (e.g., "Open bag" to "Close bag") whenever the panel's visibility state changes.
