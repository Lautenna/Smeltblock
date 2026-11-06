import { expect } from '@playwright/test';


export class PanierSmeltcoins {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.Smeltcoins1000 = page.getByRole('button', { name: 'AJOUTER AU PANIER' }).first()
        this.Smeltcoins3500 = page.getByRole('button', { name: 'AJOUTER AU PANIER' }).nth(2)


        this.recapitulatifPanier = {
            boutonsDeRetrait: page.getByRole('button', { name: 'Retirer' }),
            boutonValidationPanierPage: page.getByRole('button', { name: 'Valider le panier' }),
        }

        this.popupPanier = {
            popup: page.locator('#checkout-panier-card'),
            Smeltcoins1000Panier: page.locator('#checkout-panier-card').getByText('1x 1000 Smeltcoins 9,99 €'),
            totalPanier: page.locator('#checkout-panier-card').getByText('Total 9,99 €'),
            champEmailFacturation: page.getByRole('textbox', { name: 'Adresse email de facturation' }),
            checkbocConditionUtilisation: page.getByRole('checkbox', { name: 'J\'accepte les conditions d\'' }),
            checkboxDroitretractation: page.getByRole('checkbox', { name: 'Je demande expressément l\'exé' }),
            boutonPaiementPopup: page.getByRole('button', { name: 'Passer au paiement' })
        }
    }


    async ajouterPacks(nbSmeltcoins) {
        if (nbSmeltcoins === 1000) {
            await this.Smeltcoins1000.click()
        } else if (nbSmeltcoins === 3500) {
            await this.Smeltcoins3500.click()
        }
    }

    async retraitPanier(position) {
        await this.recapitulatifPanier.boutonsDeRetrait.nth(position - 1).click()
    }

    async validerPanier(email = 'override@maximemougel.dev') {
        await this.popupPanier.champEmailFacturation.fill(email)

        await this.popupPanier.checkbocConditionUtilisation.dispatchEvent('click')
        await this.popupPanier.checkboxDroitretractation.dispatchEvent('click')

        await this.popupPanier.boutonPaiementPopup.click()
    }

    async ouvrirValidationPanier() {
        await this.recapitulatifPanier.boutonValidationPanierPage.click()
        await expect(this.popupPanier.boutonPaiementPopup).toBeVisible()
    }


}
