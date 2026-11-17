import { expect } from '@playwright/test';


export class PanierSmeltcoins {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.Smeltcoins1000 = page.getByRole('article').filter({ hasText: '1 000 Smeltcoins 9,99 €' }).getByRole('button');
        this.Smeltcoins3500 = page.getByRole('article').filter({ hasText: '3 500 Smeltcoins 29,99' }).getByRole('button');



        this.recapitulatifPanier = {
            boutonOuverturePanier: page.getByTestId('cart-toggle'),
            fermerPanier: page.getByRole('button', { name: 'Fermer' }),
            Smeltcoins1000Panier: page.getByText('1000 Smeltcoins'),
            totalPanier: page.locator('#boutique-cart'),
            champEmailFacturation: page.getByRole('textbox', { name: 'E-mail de facturation' }),
            checkbocConditionUtilisation: page.getByRole('checkbox', { name: 'J\'accepte les conditions d\'' }),
            checkboxDroitretractation: page.getByRole('checkbox', { name: 'Je demande expressément l\'exé' }),
            boutonPaiementPopup: page.getByTestId('cart-checkout'),
        }
        this.elementASupprimer = {
            retrait3500: page.getByTestId('cart-remove-8'),
            retraitEliteGrades: page.getByTestId('cart-remove-4'),

        }
    }


    async ajouterPacks(nbSmeltcoins) {
        if (nbSmeltcoins === 1000) {
            await this.Smeltcoins1000.click()
            await this.ouvrirPanier()
        } else if (nbSmeltcoins === 3500) {
            await this.Smeltcoins3500.click()
            await this.ouvrirPanier()
        }
    }

    async ouvrirPanier() {
        await this.recapitulatifPanier.boutonOuverturePanier.click()
    }

    async fermerPanier() {

        await this.recapitulatifPanier.fermerPanier.click()
        await expect(this.recapitulatifPanier.fermerPanier).toBeHidden()
    }


    async retraitPanier(elementRetire) {
        if (elementRetire === '3500 smeltcoins') {
            await this.elementASupprimer.retrait3500.click()

        } else if (elementRetire === 'garde elite') {
            await this.elementASupprimer.retraitEliteGrades.click()
        }
    }

    async validerPanier(email = 'override@maximemougel.dev') {
        await this.recapitulatifPanier.champEmailFacturation.fill(email)

        await this.recapitulatifPanier.checkbocConditionUtilisation.dispatchEvent('click')
        await this.recapitulatifPanier.checkboxDroitretractation.dispatchEvent('click')

        await this.recapitulatifPanier.boutonPaiementPopup.click()
    }

    async ouvrirValidationPanier() {
        await this.recapitulatifPanier.boutonPaiementPopup.click()
        await expect(this.recapitulatifPanier.boutonPaiementPopup).toBeVisible()
    }


}
