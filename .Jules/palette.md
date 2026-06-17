# Palette Journal - KRYPTAA

## 2025-05-14 - ARIA State Synchronization
**Learning:** In a dynamic, script-heavy UI like KRYPTAA, visual states (classes on `body`) often diverge from accessibility states. Triggers for drawers and menus must explicitly manage `aria-expanded` and `aria-controls` to be accessible.
**Action:** Centralize ARIA state synchronization in the main UI controller (`motion.js`) to ensure consistency across all interactive panels.
