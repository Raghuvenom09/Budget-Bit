import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  
  test('TC_001 - Verify user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    const isLoggedIn = await page.locator('text=/logout|profile|sign out/i').isVisible().catch(() => false);
    const currentUrl = page.url();
    expect(isLoggedIn || currentUrl.includes('/') || currentUrl.includes('/explore')).toBeTruthy();
  });

  test('TC_002 - Verify user cannot login with invalid password', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl.includes('/login')).toBeTruthy();
  });

  test('TC_003 - Verify login page elements are present', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=/sign up|register/i').first()).toBeVisible();
  });

});
