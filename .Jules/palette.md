## 2025-05-15 - Interactive Panel ARIA Sync
**Learning:** In script-driven UI architectures where components like navbars and cart drawers are dynamically mounted or toggled via central event listeners, ARIA states (especially `aria-expanded` and `aria-label`) must be explicitly synchronized within the toggle logic to ensure accessibility.
**Action:** Always include ARIA attribute updates (setAttribute) alongside class toggles in central event delegation functions to maintain parity between visual state and accessibility tree.
