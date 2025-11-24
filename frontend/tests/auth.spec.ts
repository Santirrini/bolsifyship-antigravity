import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test('should register a new user successfully', async ({ page }) => {
    // Generate a random email to avoid conflicts
    const randomId = Math.random().toString(36).substring(7);
    const email = `testuser_${randomId}@example.com`;
    const password = 'Password123!';
    const name = `Test User ${randomId}`;

    await page.goto('/register');

    // Fill in the registration form
    await page.fill('input#full-name', name);
    await page.fill('input#email-address', email);
    await page.fill('input#password', password);

    // Submit the form
    await page.click('button:has-text("Sign up")');

    // Expect to be redirected or see a success message
    // We expect to be redirected to login or home after successful registration
    // Adjusting expectation to wait for URL change or specific element
    await page.waitForURL(/.*\/login|.*\/$/);
  });

  test('should login with an existing user', async ({ page }) => {
    const randomId = Math.random().toString(36).substring(7);
    const email = `loginuser_${randomId}@example.com`;
    const password = 'Password123!';
    const name = `Login User ${randomId}`;

    // Register first to ensure user exists
    console.log('Registering user...');
    await page.goto('/register');
    await page.fill('input#full-name', name);
    await page.fill('input#email-address', email);
    await page.fill('input#password', password);
    await page.click('button:has-text("Sign up")');
    await page.waitForURL(/.*\/login|.*\/$/);
    console.log('Registration complete, URL:', page.url());

    // Clear cookies and local storage to simulate logout
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    console.log('Cookies and LocalStorage cleared');

    // Go to login page
    await page.goto('/login');
    console.log('Navigated to /login');

    await page.fill('input#email', email);
    await page.fill('input#password', password);
    await page.click('button:has-text("Sign in")');

    // Expect to be redirected to home
    await expect(page).toHaveURL('/');
  });
});
