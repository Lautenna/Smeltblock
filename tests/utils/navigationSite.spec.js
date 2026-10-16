import { test, expect, CSS } from '@playwright/test'
import { NavigationViaLaBarre } from '../data_test/navigation.data';
import { Ip } from '../../pages/components/Ip';
import { RedirectionPage } from "../../pages/RedirectionPage";
import { url } from 'node:inspector';
import { WikiPage } from '../../pages/WikiPage';
import { ActusPage } from '../../pages/ActusPage.js';
test.use({ permissions: ['clipboard-write', 'clipboard-read'] })
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';

test.beforeEach(async ({ page }) => {
    await page.goto('');
    await (new CookiesPopup(page)).refuserCookies()

})


test('has title', async ({ page }) => {
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

test('TC_NAVI_002_Navigation_sur_la_page_wiki', async ({ page }) => {
    await page.goto('/wiki');
    const mywiki = new WikiPage(page)

    await test.step('Étant donné un visiteur peut naviger sur le réglement', async () => {
        await mywiki.boutonReglement()
        await expect(page.getByRole('article')).toContainText('📘 Règlement')
    })

    await test.step('Étant donné un visiteur peut naviger sur les quêtes', async () => {
        await mywiki.boutonQuetes()
        await expect(page.getByRole('article')).toContainText('❔ Les quêtes');
    })

    await test.step('Étant donné un visiteur peut naviger sur le support', async () => {
        await mywiki.boutonSupport()
        await expect(page.getByRole('article')).toContainText('🚩 Le support')
    })

})


test('TC_NAVI_003_Navigation_sur_la_page_actus', async ({ page }) => {
    await page.goto('/actus');
    const myActusPage = new ActusPage(page);

    await test.step("Étant donné un visiteur accéder au wiki, via le bouton visible dans la page d'accueil", async () => {
        await myActusPage.boutonMiseAJour()
        await expect(page).toHaveURL('/actus?categorie=mise_a_jour')
    })

    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await myActusPage.boutonClassement()
        await expect(page).toHaveURL("/actus?categorie=classement")
    })
    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await myActusPage.boutonsEvenement()
        await expect(page).toHaveURL("/actus?categorie=evenement")
    })
    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await myActusPage.boutonTutoriel()
        await expect(page).toHaveURL("/actus?categorie=tutoriel")
    })
    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await myActusPage.boutonTous()
        await expect(page).toHaveURL("/actus")

    })

})



test('TC_NAVI_004_IP_page_accueil', async ({ page }) => {

    await test.step("Étant donné un visiteur peut copier l'IP", async () => {
        const myIp = new Ip(page)
        await myIp.CopierIp()
        const texteCopie = await page.evaluate(() => navigator.clipboard.readText())
        await expect(texteCopie).toBe('play.smeltblock.com')

    })

})

test('TC_NAVI_005_Redirection_wiki_et_Discord', async ({ page }) => {
    const myRedirectionPage = new RedirectionPage(page);

    await test.step("Étant donné un visiteur accéder au wiki, via le bouton visible dans la page d'accueil", async () => {
        const bouttonWikiAccueil = await myRedirectionPage.ReseauSocial.redirectionPageWiki()
        await expect(page).toHaveURL("https://azure-pelican-926599.hostingersite.com/wiki")
    })

    await test.step("Étant donné un visiteur accéder a discord, via le bouton visible dans la page d'accueil", async () => {
        await page.goto('');
        const bouttonDiscordPage = await myRedirectionPage.ReseauSocial.redirectionDiscordAccueil()
        await expect(bouttonDiscordPage).toHaveURL("https://discord.com/invite/smeltblock")
    })

})