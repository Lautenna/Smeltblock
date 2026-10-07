import { test, expect, CSS } from '@playwright/test'
import { url } from 'node:inspector';

 test('has title', async ({ page }) => {
    await page.goto('')
        await expect(page.getByText('LE SKYBLOCK')).toBeVisible();
    })