## 2025-05-14 - [State Synchronization in Script-Driven UIs]
**Learning:** In highly cinematic or script-driven static websites where UI components (like menus or drawers) are managed via CSS classes (e.g., `.menu-open`), ARIA states (`aria-expanded`, `aria-label`) often become desynchronized. These must be explicitly managed within the central event delegation logic to remain accessible.
**Action:** Always include ARIA attribute updates (expanded, label, controls) within the same JavaScript functions that toggle visual states.

## 2025-05-14 - [Keyboard Visibility with Custom Cursors]
**Learning:** Websites that use `cursor: none` to implement custom luxury cursors inadvertently suppress default browser focus indicators. This makes keyboard navigation impossible for sighted users.
**Action:** Implement explicit `:focus-visible` CSS rules using high-contrast colors (e.g., `var(--accent)`) and a minimum 2px outline width with an offset to ensure clear focus tracking.
