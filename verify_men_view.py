from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": 1440, "height": 900})

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

        page.goto('file://' + '/app/men.html')
        page.wait_for_timeout(2000)

        # Manually trigger render if needed, or check variables
        res = page.evaluate("typeof getProductsByCategory === 'function' ? getProductsByCategory('men').length : 'NF'")
        print(f"Products from JS: {res}")

        # Check if products exist
        count = page.locator('.luxury-card').count()
        print(f"Luxury cards found: {count}")

        browser.close()

if __name__ == "__main__":
    run()
