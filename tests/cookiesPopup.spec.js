import { test, expect } from '@playwright/test'
import { CookiesPopup } from '../pages/components/CookiesPopup.js';


test.describe('CookiesPopup', () => {
    let cookiesVisible;

    test.beforeEach(async ({ page }) => {
        await page.goto('')
        cookiesVisible = new CookiesPopup(page)
    });

    test("TC_COOK_001 La pop-up de cookies s'affiche à la première visite", async ({ page }) => {
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_002 La pop-up de cookies est masquée après rechargement', async ({ page }) => {
        await cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await page.reload();
        await expect(cookiesVisible.popup).not.toBeVisible()
    })

    test('TC_COOK_003 La pop-up de cookies se réaffiche via « Gérer les cookies »', async ({ page }) => {
        await cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await cookiesVisible.gererCookies()
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_004 Le refus des cookies enregistre « denied »', async ({ page }) => {
        await cookiesVisible.refuserCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesRecupere = await cookiesVisible.recupererCookies()
        await expect(cookiesRecupere.value).toEqual('denied')
    })
    test("TC_COOK_005 L'acceptation des cookies enregistre « granted »", async ({ page }) => {
        await cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesRecupere = await cookiesVisible.recupererCookies()
        await expect(cookiesRecupere.value).toEqual('granted')
    })
    test('TC_COOK_006 Le stockage des cookies est vide avant tout choix', async ({ page }) => {
        const cookiesRecupere = await cookiesVisible.recupererCookies()
        await expect(cookiesRecupere).toBeUndefined()
    })
})
