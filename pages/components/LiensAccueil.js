export class LiensAccueil {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

        this.boutonDiscord = page.getByRole('link', { name: ' REJOINS LE DISCORD !' })
        this.boutonWiki = page.getByRole('link', { name: 'CONSULTE LE WIKI !' })
    }

    async ouvrirDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonDiscord.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async ouvrirPageWiki() {
        await this.boutonWiki.click()
    }
}
