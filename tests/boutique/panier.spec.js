
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
    })

    await test.step('Étant donné un visiteur veut prendre le grade MVP+ dans son panier', async () => {
        await boutiquePage.ongletBoutique.allerSurOnglet('grades')
        await boutiquePage.grades.ajouterGrade('mvpPlus')
        await expect(page.getByText('1x MVP+ 20,00 €')).toBeVisible()
    })

    await test.step('Étant donné un visiteur veut voir le total de son panier', async () => {
        await expect(page.getByText('Total 29,99 €')).toBeVisible()
        await boutiquePage.panier.ouvrirValidationPanier()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })
})
