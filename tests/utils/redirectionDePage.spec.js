import { test, expect } from '@playwright/test';
import { RedirectionPage } from "../../pages/RedirectionPage";

test('TC_REDI_001_Redirection_vers_les_reseaux_sociaux_au_clic_bas_de_page', async ({ page }) => {

    const redirectionPage = new RedirectionPage(page);
    await test.step('Étant donné un visiteur peut cliquer sur le logo Facebook en bas de page', async () => {
        await page.goto('');
        const facebookPage = await redirectionPage.piedDePage.ouvrirFacebook()
        await expect(facebookPage).toHaveURL("https://www.facebook.com/SmeltBlock/")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo instagram en bas de page', async () => {
        await page.goto('');
        const instagramPage = await redirectionPage.piedDePage.ouvrirInstagram()
        await expect(instagramPage).toHaveURL(/instagram\.com/)
    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo tiktok en bas de page', async () => {
        await page.goto('');
        const tiktokPage = await redirectionPage.piedDePage.ouvrirTiktok()
        await expect(tiktokPage).toHaveURL("https://www.tiktok.com/@smeltblockfr")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo discord en bas de page', async () => {
        await page.goto('');
        const discordPage = await redirectionPage.piedDePage.ouvrirDiscord()
        await expect(discordPage).toHaveURL("https://discord.com/invite/smeltblock")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo site du developpeur en bas de page', async () => {
        await page.goto('');
        await redirectionPage.piedDePage.ouvrirSiteDeveloppeur()
        await expect(page).toHaveURL("https://maximemougel.dev/")

    })
})


test('TC_REDI_002_Redirection_discord_via_la_nav_barre', async ({ page }) => {
    const redirectionPage = new RedirectionPage(page);
    await test.step('Étant donné un visiteur peut accéder à Discord via la barre de navigation', async () => {
        await page.goto('');
        const boutonDiscordNav = await redirectionPage.barreNavigation.ouvrirDiscord()
        await expect(boutonDiscordNav).toHaveURL("https://discord.com/invite/smeltblock")

    })
})


test('TC_REDI_003_Redirection_mention_legal', async ({ page }) => {
    const redirectionPage = new RedirectionPage(page);
    await test.step('Étant donné un visiteur peut accéder aux mentions legales', async () => {
        await page.goto('');
        await redirectionPage.piedDePage.ouvrirMentionsLegales()
        await expect(page).toHaveURL("/mentions-legales")
    })

    await test.step("Étant donné un visiteur peut accéder aux conditions générales d'utilisation", async () => {
        await page.goto('');
        await redirectionPage.piedDePage.ouvrirCGU()
        await expect(page).toHaveURL("/cgu")
    })

    await test.step('Étant donné un visiteur peut accéder aux conditions générales de vente', async () => {
        await page.goto('');
        await redirectionPage.piedDePage.ouvrirCGV()
        await expect(page).toHaveURL("/cgv")
    })

    await test.step('Étant donné un visiteur peut accéder à la politique de confidentialité', async () => {
        await page.goto('');
        await redirectionPage.piedDePage.ouvrirConfidentialite()
        await expect(page).toHaveURL("/politique-confidentialite")
    })

})


