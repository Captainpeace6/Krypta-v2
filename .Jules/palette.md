## 2025-05-15 - Dynamic ARIA Synchronization & Cinematic Bypasses

**Learning:** In cinematic, script-driven static websites where core UI components are injected or toggled via central JS, ARIA state synchronization (expanded, labels, controls) must be explicitly managed within the event handlers to ensure accessibility parity with the visual state. Additionally, complex "cinematic" entry overlays can block automated testing and must be bypassed via state-based session storage or DOM manipulation.

**Action:** When working with dynamic toggles (menus, drawers), always implement real-time ARIA attribute updates alongside class toggles. For verification of static sites with overlays, use 'page.add_init_script' to set session flags like 'k_entered' to '1' to skip blocking intro animations.
