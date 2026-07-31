## 2025-05-15 - ARIA State Synchronization in Script-Driven UIs
**Learning:** In cinematic, script-driven static websites where core UI components are injected via a central JS file (e.g., 'motion.js'), accessibility features like ARIA state synchronization must be implemented within that same central logic to ensure consistent behavior across all entry points.
**Action:** Always ensure that triggers for menus and drawers explicitly manage 'aria-expanded' and 'aria-controls' in JavaScript, as visual states (like body classes) often diverge from accessibility states.
