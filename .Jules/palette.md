## 2025-05-14 - ARIA Synchronization on Interactive Triggers
**Learning:** In script-driven UIs, screen readers can lose track of state changes (e.g., drawer open/close) if ARIA attributes aren't manually updated in the event handlers. Additionally, icon-only buttons with dynamic content (like a bag count) must balance `aria-label` with internal text to ensure both identity and state are announced correctly.
**Action:** Always include ARIA attribute updates (`aria-expanded`, `aria-label`) directly within the JS functions that manage visual toggles.

## 2025-05-14 - Actionable Empty States
**Learning:** An empty shopping cart or menu can be a "dead-end" for users. Providing a contextual Call-To-Action (CTA) like "Shop The Drop" transforms a negative state into a discovery opportunity.
**Action:** When rendering empty states, always inject a relevant primary action button that guides the user back to the main value proposition.
