import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test('should add product to cart and complete checkout', async ({ page }) => {
        test.setTimeout(60000);
        console.log('Navigating to product page...');
        // 1. Navigate to a product page
        await page.goto('/product/1');

        // 2. Add to Cart
        // Wait for the "Add to Cart" button to be visible
        const addToCartBtn = page.locator('button:has-text("Add to Cart")');
        await addToCartBtn.waitFor();
        await addToCartBtn.click();
        console.log('Added to cart');

        // Wait a bit for the action to process (since "Added" is transient)
        await page.waitForTimeout(1000);

        // 3. Navigate to Checkout
        // We can go directly to /checkout
        await page.goto('/checkout');
        console.log('Navigated to checkout');

        // 4. Shipping Step
        // Wait for the form to appear
        await expect(page.locator('text=Shipping Address')).toBeVisible();

        // Click "Continue to Payment"
        const continueBtn = page.locator('button:has-text("Continue to Payment")');
        await expect(continueBtn).toBeEnabled();
        await continueBtn.click({ force: true });
        console.log('Clicked Continue to Payment');

        // 5. Payment Step
        // Wait for payment form
        await expect(page.locator('text=Secure Payment')).toBeVisible();
        console.log('Payment form visible');

        // Select Card (default)
        // Fill in mock card details
        await page.fill('input[placeholder="Card Number"]', '4242424242424242');
        await page.fill('input[placeholder="MM / YY"]', '12/25');
        await page.fill('input[placeholder="CVC"]', '123');
        await page.fill('input[placeholder="Card Holder Name"]', 'Test User');
        console.log('Filled payment details');

        await page.click('button:has-text("Review Order")');
        console.log('Clicked Review Order');

        // 6. Review Step
        // Wait for review step heading
        await expect(page.locator('h2:has-text("Review Order")')).toBeVisible();
        console.log('Review Order visible');

        // Click "Pay" button. It might show "Pay $..."
        await page.click('button:has-text("Pay")');
        console.log('Clicked Pay');

        // 7. Success
        // Expect success message or redirection
        // The code redirects to /profile after success
        await expect(page).toHaveURL(/\/profile/);
        await expect(page.getByText('Order placed successfully!')).toBeVisible();
        console.log('Order success');
    });
});
