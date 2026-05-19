## 2025-05-19 - Custom Cursor Focus Accessibility
**Learning:** The use of `cursor: none` on the `body` to implement a custom cursor also suppresses the browser's default focus rings. This makes keyboard navigation impossible as users cannot see which element is currently focused.
**Action:** Always implement explicit `*:focus-visible` CSS rules (e.g., using `var(--accent)`) when using custom cursors to maintain keyboard accessibility.
