## 2025-05-14 - [Accessibility State Management for Interactive Panels]
**Learning:** Dynamic UI components injected via JavaScript (like side drawers and mobile menus) often lack critical ARIA attributes (aria-expanded, aria-controls) unless explicitly added during both template injection and state-change events. Without these, screen readers cannot communicate whether a panel is currently open or closed.
**Action:** Always include initial ARIA attributes in HTML templates for triggers and ensure toggle functions synchronize aria-expanded and aria-label states in real-time.
