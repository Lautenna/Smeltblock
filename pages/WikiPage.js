export class WikiPage {
    constructor(page) {
        this.page = page;

        this.ongletReglement = page.getByRole('link', { name: '📘 Règlement' })
        this.ongletQuetes = page.getByRole('link', { name: '❔ Les quêtes' })
        this.ongletSupport = page.getByRole('link', { name: '🚩 Le support' })
    }

    async boutonReglement() {
        await this.ongletReglement.click()
    }

    async boutonQuetes() {
        await this.ongletQuetes.click()
    }

    async boutonSupport() {
        await this.ongletSupport.click()
    }

}