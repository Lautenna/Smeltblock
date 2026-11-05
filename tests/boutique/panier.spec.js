
import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';
import { selectLast, deleteLast } from '../helpers/db.js';

let boutiquePage;
test.beforeEach(async ({ page }) => {
    boutiquePage = new BoutiquePage(page);
    await deleteLast('plugin__commands');
    await boutiquePage.ongletBoutique.allerSurOnglet('smeltcoins')
    await (new CookiesPopup(page)).refuserCookies()
    await boutiquePage.authentification.seConnecterBoutique()
})

test('TC_PANI_001 Mise à jour du panier', async ({ page }) => {
    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible();
        await boutiquePage.panier.ajouterPacks(3500)
        await expect(page.getByText('1x 3500 Smeltcoins 29,99 €')).toBeVisible();
        await expect(page.getByText('Total 39,98 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut ajouter le même article à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(3500)
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible();
        await expect(page.getByText('2x 3500 Smeltcoins 59,98 €')).toBeVisible();
        await expect(page.getByText('Total 69,97 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut supprimer des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.retraitPanier(2)
        await expect(page.getByText('1x 3500 Smeltcoins 29,99 €')).toBeHidden()
        await boutiquePage.panier.validerPaiementPage()
    })

    await test.step('Étant donné un visiteur peut pas valider son panier sans email', async () => {
        await boutiquePage.panier.validerPanier('')
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await expect(boutiquePage.panier.popupPanier.Smeltcoins1000Panier).toBeVisible()
        await expect(boutiquePage.panier.popupPanier.totalPanier).toBeVisible()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTesting()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 10_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiquesmeltcoins1000 Youtyxx')
    })


})
