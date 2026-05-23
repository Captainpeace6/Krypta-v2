## 2025-05-15 - [Accessibility Enhancements for Interactive Elements]
**Learning:** Icon-only buttons and dynamic navigation states are common accessibility gaps in luxury-themed static sites. Providing explicit 'aria-label', 'aria-expanded', and 'aria-current' attributes significantly improves the screen reader experience without compromising the minimalist aesthetic.
**Action:** Always check for 'aria-label' on quantity adjusters and toggles. Ensure 'aria-current="page"' is dynamically updated in navigation scripts. Use '.sr-only' for necessary screen-reader-only context.
