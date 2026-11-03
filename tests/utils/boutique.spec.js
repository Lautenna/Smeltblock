import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';



test('TC_PAIE_006_Mise_à_jour_du_panier et paiement', async ({ page }) => {
    let boutiquePage = new BoutiquePage(page);
    await page.goto('/boutique');
    await (new CookiesPopup(page)).refuserCookies()

    await test.step("Navigation sur l'onglet Smelcoins de la boutique", async () => {
        await page.getByRole('tab', { name: 'Smeltcoins Monnaie du serveur' }).click();
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide sur la page boutique', async () => {
        await boutiquePage.authentification.connexionValideYoutyxx()
        await expect(page.getByText('Youtyxx')).toBeVisible();
    })

    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajout1000Smeltcoins()
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible();
        await boutiquePage.panier.ajout3500Smeltcoins()
        await expect(page.getByText('1x 3500 Smeltcoins 29,99 €')).toBeVisible();
        await expect(page.getByText('Total 39,98 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut ajouter le même article à son panier', async () => {
        await boutiquePage.panier.ajout3500Smeltcoins()
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible();
        await expect(page.getByText('2x 3500 Smeltcoins 59,98 €')).toBeVisible();
        await expect(page.getByText('Total 69,97 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut supprimer des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.retrait3500Smeltcoins()
        await expect(page.getByText('1x 3500 Smeltcoins 29,99 €')).toBeHidden()
    })

    await test.step('Étant donné un visiteur peut pas valider son panier sans email', async () => {
        await boutiquePage.panier.validerPaiementPage()
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible()
        await expect(page.getByText('Total 9,99 €')).toBeVisible()
        await boutiquePage.panier.remplirEmailFacturation()
        await boutiquePage.panier.validerCheckbox()
        await boutiquePage.panier.validerPaiementPopup()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTesting()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/)
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

})



