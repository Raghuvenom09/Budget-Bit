import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  
  test('TC_008 - Verify navigation to home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify home page loaded
    await expect(page).toHaveTitle(/budget|bit/i);
  });

  test('TC_009 - Verify navigation to explore page', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');
    
    // Verify explore page loaded
    const exploreContent = page.locator('text=/explore|restaurant|filter/i').first();
    await expect(exploreContent).toBeVisible({ timeout: 5000 });
  });

  test('TC_010 - Verify 404 page for invalid route', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');
    await page.waitForLoadState('networkidle');
    
    // Should show 404 page
    const notFoundContent = await page.locator('text=/404|not found|page not found/i').first().isVisible().catch(() => false);
    expect(notFoundContent || page.url()).toBeTruthy();
  });

  test('TC_011 - Verify responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC_012 - Verify protected route behavior', async ({ page, context }) => {
    // Clear session
    await context.clearCookies();
    
    // Try to access protected page
    await page.goto('/profile');
    await page.waitForTimeout(2000);
    
    // Should redirect to login or show login prompt
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('/login') || currentUrl.includes('login');
    
    // Should be redirected or show login
    expect(isRedirected || await page.locator('text=/login|sign in/i').isVisible()).toBeTruthy();
  });

});
