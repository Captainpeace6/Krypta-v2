import os
import time
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Get absolute path for index.html
    path = os.path.abspath("index.html")
    url = f"file://{path}"

    # Bypass cinematic intro
    page.add_init_script("sessionStorage.setItem('k_entered', '1')")

    # 1. Verify Empty Cart UX & Accessibility
    page.goto(url)
    page.wait_for_selector("body.is-loaded")
    page.wait_for_timeout(1000)

    cart_trigger = page.locator(".cart-trigger[data-cart-open]")
    # Before opening
    print(f"Initial Cart aria-expanded: {cart_trigger.get_attribute('aria-expanded')}")

    cart_trigger.click()
    page.wait_for_timeout(1000)
    print(f"Open Cart aria-expanded: {cart_trigger.get_attribute('aria-expanded')}")

    # Verify CTA
    cta = page.locator(".cart-empty .k-btn-gold")
    print(f"Empty Cart CTA visible: {cta.is_visible()}")
    page.screenshot(path="/home/jules/verification/screenshots/empty_cart.png")

    # Click CTA to close
    cta.click()
    page.wait_for_timeout(1000)
    print(f"Body has cart-open after CTA: {'cart-open' in page.evaluate('document.body.className')}")

    # 2. Mobile Menu Accessibility
    page.set_viewport_size({"width": 375, "height": 667})
    page.wait_for_timeout(1000)

    menu_btn = page.locator("[data-menu-toggle]")
    print(f"Initial Menu aria-expanded: {menu_btn.get_attribute('aria-expanded')}")

    menu_btn.click()
    page.wait_for_timeout(1000)
    print(f"Open Menu aria-expanded: {menu_btn.get_attribute('aria-expanded')}")
    print(f"Open Menu aria-label: {menu_btn.get_attribute('aria-label')}")
    page.screenshot(path="/home/jules/verification/screenshots/mobile_menu.png")

    # Close Menu
    menu_btn.click()
    page.wait_for_timeout(1000)

    # 3. Cart Quantity Accessibility
    # Instead of clicking through UI which is prone to interception in this cinematic site,
    # use JS to add to cart directly and then verify UI
    page.evaluate("""() => {
        window.addToCart(10, '28');
    }""")
    page.wait_for_timeout(1000)

    qty_up = page.locator(".qty-btn[aria-label='Increase quantity']")
    qty_val = page.locator(".qty-val[aria-live='polite']")

    print(f"Qty Up button aria-label: {qty_up.get_attribute('aria-label')}")
    print(f"Qty val aria-live: {qty_val.get_attribute('aria-live')}")

    page.screenshot(path="/home/jules/verification/screenshots/cart_quantity.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
