
import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';
import { selectLast, deleteLast } from '../helpers/db.js';

let boutiquePage;
test.beforeEach(async ({ page }) => {
    boutiquePage = new BoutiquePage(page);
    await deleteLast('plugin__commands');
    await boutiquePage.ongletBoutique.allerSurOnglet('smeltcoins')
    await (new CookiesPopup(page)).refuserCookiesEtAttendreFermeture()
    await boutiquePage.authentification.seConnecterBoutique()
})

test('TC_PANI_001 Mise à jour du panier', async ({ page }) => {
    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(1000)
        await expect(page.getByTestId('cart-line-6')).toBeVisible();
        await boutiquePage.panier.fermerPanier()
        await boutiquePage.panier.ajouterPacks(3500)
        await expect(page.getByTestId('cart-line-8')).toBeVisible();
        await expect(page.getByText('Total 35,98 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut ajouter le même article à son panier', async () => {
        await boutiquePage.panier.fermerPanier()
        await boutiquePage.panier.ajouterPacks(3500)
        await expect(page.getByTestId('cart-line-6')).toBeVisible();
        await expect(page.getByTestId('cart-line-8')).toBeVisible();
        await expect(page.getByText('Total 62,97 €')).toBeVisible();

    })

    await test.step('Étant donné un visiteur peut supprimer des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.retraitPanier('3500 smeltcoins')
        await expect(page.getByTestId('cart-line-8')).toBeHidden()
    })

    await test.step('Étant donné un visiteur veut prendre le grade MVP+ dans son panier', async () => {
        await boutiquePage.ongletBoutique.allerSurOnglet('grades')
        await boutiquePage.grades.ajouterGrade('mvpPlus')
        await boutiquePage.panier.ouvrirPanier()
        await expect(page.getByTestId('cart-line-3')).toBeVisible()
    })

    await test.step('Étant donné un visiteur veut prendre le grade Elite dans son panier puis le supprimer', async () => {
        await boutiquePage.panier.fermerPanier()
        await boutiquePage.grades.ajouterGrade('autresGrades')
        await boutiquePage.grades.ajouterGrade('elite')
        await boutiquePage.panier.ouvrirPanier()
        await boutiquePage.panier.retraitPanier('grade elite')
        await expect(page.getByTestId('cart-line-4')).toBeHidden()
        await expect(page.getByTestId('cart-line-3')).toContainText('20,00 €')
    })

    await test.step('Étant donné un visiteur veut voir le total de son panier', async () => {
        await expect(page.getByText('Total 26,99 €')).toBeVisible()
        await boutiquePage.panier.ouvrirValidationPanier()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })
})
