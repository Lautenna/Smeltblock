export class PanierSmeltcoins {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.Smeltcoins1000 = page.getByRole('button', { name: 'AJOUTER AU PANIER' }).first()
        this.Smeltcoins3500 = page.getByRole('button', { name: 'AJOUTER AU PANIER' }).nth(2)
        this.retirer2emeElement = page.getByRole('button', { name: 'Retirer' }).nth(1)
        this.boutonValidationPanierPage = page.getByRole('button', { name: 'Valider le panier' })
        this.Smeltcoins1000Panier = page.locator('#checkout-panier-card').getByText('1x 1000 Smeltcoins 9,99 €')
        this.totalPanier = page.locator('#checkout-panier-card').getByText('Total 9,99 €')
        this.champEmailFacturation = page.getByRole('textbox', { name: 'Adresse email de facturation' })
        this.checkbocConditionUtilisation = page.getByRole('checkbox', { name: 'J\'accepte les conditions d\'' })
        this.checkboxDroitretractation = page.getByRole('checkbox', { name: 'Je demande expressément l\'exé' })
        this.boutonPaiementPopup = page.getByRole('button', { name: 'Passer au paiement' })

    }

    async ajout1000Smeltcoins() {
        await this.Smeltcoins1000.click()
    }

    async ajout3500Smeltcoins() {
        await this.Smeltcoins3500.click()
    }

    async retrait3500Smeltcoins() {
        await this.retirer2emeElement.click()
    }

    async remplirEmailFacturation() {
        await this.champEmailFacturation.fill('override@maximemougel.dev')
    }

    async validerCheckbox() {
        await this.checkbocConditionUtilisation.dispatchEvent("click");
        await this.checkboxDroitretractation.dispatchEvent("click");
    }

    async validerPaiementPage() {
        await this.boutonValidationPanierPage.click()
    }

    async validerPaiementPopup() {
        await this.boutonPaiementPopup.click()
    }

}
