from playwright.sync_api import sync_playwright, expect
import os

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Load the local index.html
        file_path = "file://" + os.path.abspath("index.html")
        page.goto(file_path)

        # Close email popup if it's there
        try:
            page.locator(".popup-close").click(timeout=5000)
        except:
            pass

        # Add an item to the cart
        # Hover over first card to reveal overlay
        page.locator(".card").first.hover()
        page.locator(".qb-sz").first.click()
        page.locator(".btn-po").first.click()

        # Wait for cart panel to have content
        page.wait_for_selector(".cart-row")

        # Check quantity buttons aria-labels
        decrease_btn = page.locator(".qty-b").first
        increase_btn = page.locator(".qty-b").last
        print(f"Decrease qty aria-label: {decrease_btn.get_attribute('aria-label')}")
        print(f"Increase qty aria-label: {increase_btn.get_attribute('aria-label')}")

        # Check cart thumbnail alt
        cart_thumb = page.locator(".cart-thumb img")
        print(f"Cart thumb alt: {cart_thumb.get_attribute('alt')}")

        page.screenshot(path="/app/verification/cart_ux.png")

        browser.close()

if __name__ == "__main__":
    run_verification()
