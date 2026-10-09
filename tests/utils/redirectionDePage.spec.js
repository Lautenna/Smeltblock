import { test, expect, CSS } from '@playwright/test';
import { ReseauSocial } from "../../pages/components/RedirectionPage";

test('TC_REDI_001_Redirection_vers_les_reseaux_sociaux_au_clic_bas_de_page', async ({ page }) => {

    const myReseauSocial = new ReseauSocial(page);
    await test.step('Étant donné un visiteur peut cliquer sur le logo Facebook en bas de page', async () => {
        await page.goto('');
        const facebookPage = await myReseauSocial.redirectionFacebook()
        await expect(facebookPage).toHaveURL("https://www.facebook.com/SmeltBlock/")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo instagram en bas de page', async () => {
        await page.goto('');
        const instagramPage = await myReseauSocial.redirectionInstagram()
        await expect(instagramPage).toHaveURL("https://www.instagram.com/smeltblock/")

    })

    // a commenté 23,25,26 si problème connexion
    // await test.step('Étant donné un visiteur peut cliquer sur le logo instagram en bas de page', async () => {
    //     await page.goto('');
    //     // const instagramPage = await myReseauSocial.redirectionInstagram()
    //     await expect(myReseauSocial.bouttonInstagram).toBeVisible()
    //     // Pas possible, car lien connexion qui s'affiche.
    //     //await expect(instagramPage).toHaveURL("https://www.instagram.com/smeltblock/")


    await test.step('Étant donné un visiteur peut cliquer sur le logo tiktok en bas de page', async () => {
        await page.goto('');
        const tiktokPage = await myReseauSocial.redirectionTiktok()
        await expect(tiktokPage).toHaveURL("https://www.tiktok.com/@smeltblockfr")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo discord en bas de page', async () => {
        await page.goto('');
        const discordPage = await myReseauSocial.redirectionDiscord()
        await expect(discordPage).toHaveURL("https://discord.com/invite/smeltblock")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo site du developpeur en bas de page', async () => {
        await page.goto('');
        await myReseauSocial.redirectionSiteDeveloppeur()
        await expect(page).toHaveURL("https://maximemougel.dev/")

    })
})


test('TC_REDI_002_Redirection_discord_via_la_nav_barre', async ({ page }) => {
    const myReseauSocial = new ReseauSocial(page);
    await test.step('Étant donné un visiteur peut accéder à Discord via la barre de navigation', async () => {
        await page.goto('');
        const bouttonDiscordNav = await myReseauSocial.redirectionDiscordNav()
        await expect(bouttonDiscordNav).toHaveURL("https://discord.com/invite/smeltblock")

    })
})

