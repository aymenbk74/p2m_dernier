import { test } from '@playwright/test';

test('signup and login', async ({ page }) => {
  const email = `test.${Date.now()}@example.com`;
  const pwd = 'Password123!';
  
  await page.goto('http://localhost:3000');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pwd);
  await page.fill('input[name="first_name"]', 'Test');
  await page.selectOption('select[name="gender"]', 'F');
  await page.fill('input[name="age"]', '25');
  await page.click('button:has-text("S\'INSCRIRE")');
  await page.waitForTimeout(2000);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pwd);
  await page.click('button:has-text("S\'IDENTIFIER")');
  await page.waitForURL(/\/(profile|admin)/);
});
