export class WikiPage {
    constructor(page) {
        this.page = page;

        this.ongletReglement = page.getByRole('link', { name: '📘 Règlement' })
        this.ongletQuetes = page.getByRole('link', { name: '❔ Les quêtes' })
        this.ongletSupport = page.getByRole('link', { name: '🚩 Le support' })
    }

    async ouvrirOngletReglement() {
        await this.ongletReglement.click()
    }

    async ouvrirOngletQuetes() {
        await this.ongletQuetes.click()
    }

    async ouvrirOngletSupport() {
        await this.ongletSupport.click()
    }

}