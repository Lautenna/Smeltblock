import { test, expect } from '@playwright/test'
import { NavigationViaLaBarre } from './data_test/navigation.data.js';
import { Ip } from '../pages/components/Ip.js';
import { RedirectionPage } from "../pages/RedirectionPage.js";
import { WikiPage } from '../pages/WikiPage.js';
import { ActusPage } from '../pages/ActusPage.js';
import { CookiesPopup } from '../pages/components/CookiesPopup.js';
import { BarreNavigation } from '../pages/components/BarreNavigation.js';

test.beforeEach(async ({ page }) => {
    await page.goto('');
    await (new CookiesPopup(page)).refuserCookies()

})


for (const { cas, libelleLien, url, titre, } of NavigationViaLaBarre) {
    test(`TC_NAVI_001 Toutes les pages du site sont accessibles - ${cas}`, async ({ page }) => {
        const barreNavigation = new BarreNavigation(page)
        await test.step(`Étant donné un visiteur peut aller sur la page ${cas} via la barre de navigation`, async () => {
            await barreNavigation.ouvrirLien(libelleLien)

            await expect(page).toHaveURL(url)
            await expect(page.locator('h1')).toContainText(titre);
        })
    })
}

test('TC_NAVI_002 Navigation sur la page Wiki', async ({ page }) => {
    await page.goto('/wiki');
    const wikiPage = new WikiPage(page)

    await test.step('Étant donné un visiteur peut naviguer sur le règlement', async () => {
        await wikiPage.ouvrirOngletReglement()
        await expect(page.getByRole('article')).toContainText('📘 Règlement')
    })

    await test.step('Étant donné un visiteur peut naviguer sur les quêtes', async () => {
        await wikiPage.ouvrirOngletQuetes()
        await expect(page.getByRole('article')).toContainText('❔ Les quêtes');
    })

    await test.step('Étant donné un visiteur peut naviguer sur le support', async () => {
        await wikiPage.ouvrirOngletSupport()
        await expect(page.getByRole('article')).toContainText('🚩 Le support')
    })

})



test('TC_NAVI_003 Navigation sur la page Actus', async ({ page }) => {
    await page.goto('/actus');
    const actusPage = new ActusPage(page);

    await test.step("Étant donné un visiteur accéder au wiki, via le bouton visible dans la page d'accueil", async () => {
        await actusPage.ouvrirOngletMiseAJour()
        await expect(page).toHaveURL('/actus?categorie=mise_a_jour')
    })

    await test.step("Étant donné un visiteur accéder au classement, via le bouton visible dans la page d'accueil", async () => {
        await actusPage.ouvrirOngletClassement()
        await expect(page).toHaveURL("/actus?categorie=classement")
    })
    await test.step("Étant donné un visiteur accéder au événement, via le bouton visible dans la page d'accueil", async () => {
        await actusPage.ouvrirOngletEvenement()
        await expect(page).toHaveURL("/actus?categorie=evenement")
    })
    await test.step("Étant donné un visiteur accéder au tutoriel, via le bouton visible dans la page d'accueil", async () => {
        await actusPage.ouvrirOngletTutoriel()
        await expect(page).toHaveURL("/actus?categorie=tutoriel")
    })
    await test.step("Étant donné un visiteur accéder a l'accueil, via le bouton visible dans la page d'accueil", async () => {
        await actusPage.ouvrirOngletTous()
        await expect(page).toHaveURL("/actus")

    })

})



test("TC_NAVI_004 Copie de l'IP du serveur depuis la page d'accueil", async ({ page }) => {

    await test.step("Étant donné un visiteur peut copier l'IP", async () => {
        const ip = new Ip(page)
        await page.evaluate(() => {
            const original = navigator.clipboard.writeText.bind(navigator.clipboard)
            navigator.clipboard.writeText = async (texte) => {
                window.__copie = texte
                return original(texte)
            }
        })

        await ip.copierIp()
        await expect.poll(() => page.evaluate(() => window.__copie)).toBe('play.smeltblock.com')
    })

})

test('TC_NAVI_005 Redirection vers le Wiki et le Discord', async ({ page }) => {
    const redirectionPage = new RedirectionPage(page);

    await test.step("Étant donné un visiteur accéder au wiki, via le bouton visible dans la page d'accueil", async () => {
        await redirectionPage.liensAccueil.ouvrirPageWiki()
        await expect(page).toHaveURL("https://azure-pelican-926599.hostingersite.com/wiki")
    })

    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await page.goto('');
        const discordPage = await redirectionPage.liensAccueil.ouvrirDiscord()
        await expect(discordPage).toHaveURL("https://discord.com/invite/smeltblock")
    })

})