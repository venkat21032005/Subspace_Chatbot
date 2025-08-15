from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000")

    # Wait for the chat page to load completely.
    expect(page.get_by_label("New Chat")).to_be_visible(timeout=10000)

    # Click on the first chat to see the messages
    page.get_by_text("Introduction to AI").click()

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
