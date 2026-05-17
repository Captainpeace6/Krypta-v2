from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Ensure directories exist
        if not os.path.exists('screenshots'):
            os.makedirs('screenshots')

        # 1. Home Page (Luxury v3)
        print("Taking Home Page screenshot...")
        page.goto('file://' + os.getcwd() + '/index.html')
        page.wait_for_timeout(2000)
        page.screenshot(path='screenshots/home_v3.png', full_page=True)

        # 2. Shop Page - Grid 2
        print("Taking Shop Page Grid 2 screenshot...")
        page.goto('file://' + os.getcwd() + '/men.html')
        page.wait_for_timeout(2000)
        # Assuming default is Grid 4 or 2, let's explicitly click Grid 2 if possible
        # Based on my previous edits, buttons have text "Grid 02" and "Grid 04"
        grid2_btn = page.get_by_role("button", name="Grid 02")
        if grid2_btn.is_visible():
            grid2_btn.click()
            page.wait_for_timeout(1000)
        page.screenshot(path='screenshots/shop_grid2.png', full_page=True)

        # 3. Shop Page - Grid 4
        print("Taking Shop Page Grid 4 screenshot...")
        grid4_btn = page.get_by_role("button", name="Grid 04")
        if grid4_btn.is_visible():
            grid4_btn.click()
            page.wait_for_timeout(1000)
        page.screenshot(path='screenshots/shop_grid4.png', full_page=True)

        # 4. Product Detail Page
        print("Taking Product Detail Page screenshot...")
        # We can navigate via clicking a product or go directly
        first_product = page.locator('.luxury-card').first
        if first_product.is_visible():
            # The card itself might be a link or have a link
            first_product.click()
            page.wait_for_timeout(2000)
            page.screenshot(path='screenshots/product_detail_v3.png', full_page=True)
        else:
            # Fallback direct navigation
            page.goto('file://' + os.getcwd() + '/product-detail.html?id=1')
            page.wait_for_timeout(2000)
            page.screenshot(path='screenshots/product_detail_v3.png', full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
