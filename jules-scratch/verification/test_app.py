import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Sign up
    page.goto("http://localhost:45617/signup")
    email = f"testuser_{int(time.time())}@example.com"
    page.get_by_label("Email").fill(email)
    page.locator("#password").fill("password123")
    page.locator("#confirmPassword").fill("password123")
    page.get_by_role("button", name="Sign Up").click()
    expect(page.get_by_text("Account created successfully!")).to_be_visible(timeout=10000)
    page.wait_for_timeout(5000)

    # Try to go to chat page directly
    page.goto("http://localhost:45617/chat")
    page.wait_for_timeout(2000)

    # If not on chat page, try to log in
    if "chat" not in page.url:
        page.goto("http://localhost:45617/login")
        page.get_by_label("Email").fill(email)
        page.get_by_label("Password").fill("password123")
        page.get_by_role("button", name="Sign In").click()
        expect(page).to_have_url("http://localhost:45617/chat", timeout=10000)

    # Start a new chat
    page.get_by_label("New Chat").click()
    expect(page.get_by_text("New Conversation")).to_be_visible(timeout=10000)

    # Send a message
    page.get_by_placeholder("Type your message...").fill("Hello")
    page.get_by_label("Send message").click()

    # Wait for the bot's reply
    expect(page.locator(".message.bot")).to_have_count(1, timeout=20000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/chat_screenshot.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
