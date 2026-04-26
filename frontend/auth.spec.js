import { test } from '@playwright/test';

test('signup and login', async ({ page }) => {
  const email = `test.${Date.now()}@example.com`;
  const pwd = 'Password123!';
  
  // 1. Go to the homepage
  await page.goto('/');
  
  // 2. NEW: Click the "S'INSCRIRE" button in the navigation to reveal the form
  // We use .first() just in case there are multiple elements with this text
  await page.getByText("S'INSCRIRE").first().click();

  // 3. Now fill out the form
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pwd);
  await page.fill('input[name="first_name"]', 'Test');
  await page.selectOption('select[name="gender"]', 'F');
  await page.fill('input[name="age"]', '25');
  await page.fill('input[name="country"]', 'Tunisia');
  
  // 4. Submit the signup form
  await page.click('button:has-text("CONFIRMER L\'ADHÉSION")');
  
  // Wait a moment for the backend to process the signup
  await page.waitForTimeout(2000);
  
  // 5. If it auto-redirects to login, or if you need to click 'LOGIN' first, you might need another click here!
  // Assuming the form is ready:
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pwd);
  await page.click('button:has-text("S\'IDENTIFIER")');
  
  // 6. Verify successful login
  await page.waitForURL(/\/(profile|admin)/);
});