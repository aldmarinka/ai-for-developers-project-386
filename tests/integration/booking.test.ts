import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('complete booking flow from event list to confirmation', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Calendar Booking');

    const eventCards = page.locator('.card');
    await expect(eventCards).toHaveCount(3);

    const firstEvent = eventCards.first();
    await expect(firstEvent).toContainText('Consultation');

    await firstEvent.locator('a.btn-primary').click();

    await expect(page.locator('h2').first()).toContainText('Consultation');
    await expect(page.locator('h3')).toContainText('Available Slots');

    const slots = page.locator('.slot');
    await expect(slots.first()).toBeVisible();

    await slots.first().click();

    const continueButton = page.locator('button.btn-primary', { hasText: 'Continue' });
    await expect(continueButton).toBeVisible();
    await continueButton.click();

    await expect(page.url()).toContain('/book');
    await expect(page.locator('h2')).toContainText('Complete Your Booking');

    await page.fill('input[type="text"]', 'John Doe');
    await page.fill('input[type="email"]', 'john@example.com');

    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    await expect(page.locator('h2')).toContainText('Booking Confirmed!', { timeout: 10000 });
  });

  test('shows error for invalid booking params', async ({ page }) => {
    await page.goto('/book');

    await expect(page.locator('.error-message')).toContainText('Invalid booking parameters');
  });

  test('navigation between pages works correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Admin Events');
    await expect(page.url()).toContain('/admin/event-types');

    await page.click('text=Admin Bookings');
    await expect(page.url()).toContain('/admin/bookings');

    await page.click('text=Events');
    await expect(page.url()).toBe('http://localhost:3000/');
  });
});