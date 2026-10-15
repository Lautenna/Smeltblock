import { test, expect, CSS } from '@playwright/test'
import { NavigationViaLaBarre } from '../data_test/navigation.data';
import { url } from 'node:inspector';

test('has title', async ({ page }) => {
    await page.goto('')
    await expect(page.getByText('LE SKYBLOCK')).toBeVisible();
})

for (const { cas, nav, url, titre, } of NavigationViaLaBarre) {
    test(`TC_CONN_001_Toutes_les_pages_du_site_fonctionnent ${cas}`, async ({ page }) => {
        await page.goto('');
        await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
            await page.getByRole('link', { name: nav, exact: 'true' }).click();

            await expect(page).toHaveURL(url)
            await expect(page.locator('h1')).toContainText(titre);
        })
    })
}