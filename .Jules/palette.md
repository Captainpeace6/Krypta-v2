## 2025-05-14 - Interactive Panel Accessibility & Flow

**Learning:** Interactive panels (drawers/menus) must dynamically synchronize ARIA attributes (expanded, label, controls) on triggers in real-time. Empty states must avoid 'dead-ends' by providing actionable CTAs (e.g., 'Shop Now') that automatically close the current panel upon navigation.

**Action:** Implement real-time ARIA state synchronization for all toggles in `motion.js` and ensure the empty cart state contains a functional CTA that triggers the panel closure.

## 2025-05-14 - Centralized Accessibility for Dynamic Static Sites

**Learning:** In cinematic, script-driven static websites where core UI components are injected via a central JS file (e.g., 'motion.js'), accessibility features like 'Skip to content' and ARIA state synchronization must be implemented within that same central logic to ensure consistent behavior across all entry points.

**Action:** Inject the 'Skip to content' link and set target IDs dynamically within the `mountChrome` and `initMotion` functions in `motion.js`.
