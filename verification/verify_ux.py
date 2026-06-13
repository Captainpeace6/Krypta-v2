import os
import asyncio
from playwright.async_api import async_playwright

async def verify_ux():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 720})
        page = await context.new_page()

        # Bypass cinematic entry
        await page.add_init_script("sessionStorage.setItem('k_entered', '1')")

        # Load the page
        file_path = f"file://{os.path.abspath('index.html')}"
        print(f"Loading {file_path}...")
        await page.goto(file_path)

        # Wait for content
        await page.wait_for_selector('.site-nav')

        print("--- Verifying Cart Accessibility ---")
        cart_trigger = page.locator('.cart-trigger[data-cart-open]')
        # Check initial ARIA state
        expanded = await cart_trigger.get_attribute('aria-expanded')
        controls = await cart_trigger.get_attribute('aria-controls')
        print(f"Cart trigger expanded: {expanded}, controls: {controls}")

        # Open cart
        await cart_trigger.click()
        await page.wait_for_selector('.cart-drawer.open')
        expanded_after = await cart_trigger.get_attribute('aria-expanded')
        print(f"Cart trigger expanded after click: {expanded_after}")

        # Verify Empty Cart CTA
        print("--- Verifying Empty Cart CTA ---")
        empty_cta = page.locator('.cart-empty a.k-btn-gold')
        cta_text = await empty_cta.inner_text()
        cta_attr = await empty_cta.get_attribute('data-cart-close')
        print(f"Empty cart CTA text: {cta_text}, has data-cart-close: {cta_attr is not None}")

        await page.screenshot(path='verification/empty_cart.png')

        # Close cart
        await page.locator('[data-cart-close]').first.click()
        await asyncio.sleep(0.5)

        print("--- Verifying Mobile Menu Accessibility ---")
        # Set mobile viewport
        await page.set_viewport_size({'width': 375, 'height': 667})
        await asyncio.sleep(0.5)

        menu_toggle = page.locator('.nav-toggle[data-menu-toggle]')
        expanded_m = await menu_toggle.get_attribute('aria-expanded')
        label_m = await menu_toggle.get_attribute('aria-label')
        controls_m = await menu_toggle.get_attribute('aria-controls')
        print(f"Menu toggle expanded: {expanded_m}, label: {label_m}, controls: {controls_m}")

        # Open menu
        await menu_toggle.click()
        await page.wait_for_selector('body.menu-open')
        expanded_m_open = await menu_toggle.get_attribute('aria-expanded')
        label_m_open = await menu_toggle.get_attribute('aria-label')
        print(f"Menu toggle expanded after click: {expanded_m_open}, label: {label_m_open}")

        await page.screenshot(path='verification/mobile_menu.png')

        await browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    asyncio.run(verify_ux())
