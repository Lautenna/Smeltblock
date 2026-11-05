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


test('TC_PAIE_001 Réussite du paiement', async ({ page }) => {
    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await boutiquePage.panier.ouvrirValidationPanier()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTestingFonctionnel()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 12_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiquesmeltcoins1000 Youtyxx')
    })
})

test('TC_PAIE_002 Échec du paiement', async ({ page }) => {
    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await boutiquePage.panier.ouvrirValidationPanier()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur à un problème de paiement, alors celui-ci ne se fait pas', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()
        await boutiquePage.paiementStripe.paiementSansLink()
        await boutiquePage.paiementStripe.remplirInformationPaiement()
        await boutiquePage.paiementStripe.paiementManuel()
        await expect(page.getByRole('group', { name: 'Card information' })).toContainText('Your credit card was declined. Try paying with a debit card instead.');
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        await expect(paimentPanier.command).not.toEqual('3achatboutiquesmeltcoins1000 Youtyxx')
    })
})





test('TC_PAIE_005 Validation du panier bloquée si email ou case manquant', async ({ page }) => {
    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
        await boutiquePage.panier.ouvrirValidationPanier()
    })

    await test.step('Étant donné un visiteur peut pas valider son panier sans email', async () => {
        await boutiquePage.panier.validerPanier('')
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut pas valider son panier sans check cgu', async () => {
        await boutiquePage.panier.validerPanier('override@maximemougel.dev', false)
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut pas valider son panier sans check droit retractation', async () => {
        await boutiquePage.panier.validerPanier('override@maximemougel.dev', true, false)
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

})

