## 2025-05-14 - [Testing GSAP and Cinematic Interfaces]
**Learning:** Interfaces that use heavy GSAP animations or "Enter" overlays can block automated tests and accessibility crawlers. Identifying and explicitly handling these entry points (e.g., `#k-enter-btn`) in verification scripts is essential for reliable CI/CD in luxury/cinematic web apps.
**Action:** Always check for initialization overlays in the codebase and document the 'bypass' selector for future testing.

## 2025-05-14 - [Actionable Empty States]
**Learning:** An empty shopping cart without a way forward is a UX "dead end." Adding a contextual CTA (e.g., "Shop The Drop") transforms a negative state into a navigation opportunity, maintaining user momentum.
**Action:** Ensure all empty UI states (carts, search results, favorites) include a primary action button guiding the user back to the core experience.
