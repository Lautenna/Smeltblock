import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';
import { selectLast, deleteLast } from '../helpers/db.js';

let boutiquePage;
test.beforeEach(async ({ page }) => {
    boutiquePage = new BoutiquePage(page);
    await page.goto('/boutique');
    await (new CookiesPopup(page)).refuserCookiesEtAttendreFermeture()

})

test('TC_CADE_001 Cadeau de Smeltcoins pour un ami', async ({ page }) => {
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide sur la page boutique et ajouter un ami', async () => {
        await boutiquePage.ongletBoutique.allerSurOnglet('smeltcoins')
        await boutiquePage.authentification.seConnecterBoutique('Youtyxx', 'Yvanor')
        await expect(page.getByText('Yvanor')).toBeVisible();
    })

    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
        await expect(page.getByTestId('cart-line-6')).toBeVisible();
        await expect(page.getByText('Total 9,99 €')).toBeVisible();
        await boutiquePage.panier.ouvrirValidationPanier()

    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await expect(boutiquePage.panier.recapitulatifPanier.totalPanier).toContainText('1000 Smeltcoins')
        await expect(boutiquePage.panier.recapitulatifPanier.totalPanier).toContainText('Total 9,99 €')
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTestingFonctionnel()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 20_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiquesmeltcoins1000 Yvanor')
    })

})

test("TC_CADE_002 Cadeau d'un grade pour un ami", async ({ page }) => {
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide sur la page boutique et ajouter un ami', async () => {
        await boutiquePage.ongletBoutique.allerSurOnglet('grades')
        await boutiquePage.authentification.seConnecterBoutique('Youtyxx', 'Yvanor')
        await expect(page.getByText('Yvanor')).toBeVisible();
    })

    await test.step('Étant donné un visiteur peut voir son grade déja possédé', async () => {
        await expect(page.getByTestId('grade-owned-1')).toBeVisible()
        await expect(page.getByTestId('grade-owned-2')).toBeVisible()
        await expect(page.getByTestId('grade-owned-3')).toBeVisible()
    })

    await test.step('Étant donné un visiteur veut prendre le grade Elite pour son ami', async () => {
        await boutiquePage.grades.ajouterGrade('autresGrades')
        await boutiquePage.grades.ajouterGrade('eliteOffert')
        await boutiquePage.panier.ouvrirPanier()
        await expect(page.getByTestId('cart-line-4')).toBeVisible()
        await expect(page.getByText('Total 44,99 €')).toBeVisible()
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
        await boutiquePage.paiementStripe.attendreChargementStripe()
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('ÉLITE')).toBeVisible()
        await expect(page.getByText('Total due€44.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTestingFonctionnel()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 20_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiqueelite Yvanor')
    })

})
