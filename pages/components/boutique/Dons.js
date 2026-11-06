export class Dons {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.choix2Euros = page.getByText('2 €')
        this.boutonAjoutPanier2Euros = page.getByRole('button', { name: 'Ajouter 2 € au panier' })
    }


    async ChoisirLeDon() {
        await this.choix2Euros.click()
    }

    async AjoutPanier() {
        await this.boutonAjoutPanier2Euros.click()
    }
}