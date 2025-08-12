from playwright.sync_api import sync_playwright, Page, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:4200")

    # Expect the page to have the title "BoutiqueApp"
    expect(page).to_have_title("BoutiqueApp")

    # Wait for the login form to be visible
    page.wait_for_selector('mat-card')

    # Take a screenshot of the login page
    page.screenshot(path="jules-scratch/verification/login-page.png")

    # Fill in the email and password
    try:
        page.locator('input[formcontrolname="email"]').fill("dueña@gmail.com")
        page.locator('input[formcontrolname="password"]').fill("123456")

        # Click the login button
        page.get_by_role("button", name="Login").click()
    except Exception as e:
        print(page.content())
        raise e

    # Expect the url to be /sales
    expect(page).to_have_url("http://localhost:4200/sales")

    # Take a screenshot of the sales page
    page.screenshot(path="jules-scratch/verification/sales-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
