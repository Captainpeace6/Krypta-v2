import asyncio
import os
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Set viewport to mobile size
        context = await browser.new_context(viewport={'width': 390, 'height': 844})
        page = await context.new_page()

        # Bypass cinematic intro
        await page.add_init_script("sessionStorage.setItem('k_entered', '1')")

        path = os.path.abspath("index.html")
        await page.goto(f"file://{path}")

        # Wait for content to load
        await page.wait_for_selector("body.is-loaded", timeout=10000)

        print("--- Testing Menu Toggle (Mobile) ---")
        menu_toggle = await page.query_selector("[data-menu-toggle]")
        if menu_toggle:
            print(f"Initial aria-expanded: {await menu_toggle.get_attribute('aria-expanded')}")
            print(f"Initial aria-label: {await menu_toggle.get_attribute('aria-label')}")

            await menu_toggle.click()
            await page.wait_for_timeout(500)
            print(f"Opened aria-expanded: {await menu_toggle.get_attribute('aria-expanded')}")
            print(f"Opened aria-label: {await menu_toggle.get_attribute('aria-label')}")

            await menu_toggle.click()
            await page.wait_for_timeout(500)
            print(f"Closed aria-expanded: {await menu_toggle.get_attribute('aria-expanded')}")
        else:
            print("Menu toggle not found!")

        print("\n--- Testing Cart Trigger & Empty State ---")
        # Ensure we're clicking the one in the nav
        cart_trigger = await page.query_selector(".cart-trigger[data-cart-open]")
        if cart_trigger:
            print(f"Initial aria-expanded: {await cart_trigger.get_attribute('aria-expanded')}")

            # Close menu if open
            await page.evaluate("document.body.classList.remove('menu-open')")

            await cart_trigger.click()
            await page.wait_for_selector(".cart-drawer.open")
            print(f"Opened aria-expanded: {await cart_trigger.get_attribute('aria-expanded')}")

            cta = await page.query_selector(".cart-empty .k-btn-gold")
            if cta:
                print(f"Found CTA: {await cta.inner_text()}")
                print(f"CTA href: {await cta.get_attribute('href')}")
                print(f"CTA data-cart-close: {await cta.get_attribute('data-cart-close') is not None}")

            await page.screenshot(path="verification/cart_empty_cta_mobile.png")
        else:
            print("Cart trigger not found!")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
