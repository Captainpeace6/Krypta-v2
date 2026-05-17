from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto('file:///app/product-detail.html?id=1')
        page.wait_for_timeout(1000)

        title = page.locator('.p-title').text_content()
        print(f"Product title: {title}")

        specs = page.locator('.spec-row').count()
        print(f"Spec rows found: {specs}")

        # Check for technical specs text
        if "Construction" in page.content():
            print("Technical specs found")

        browser.close()

if __name__ == "__main__":
    run()
