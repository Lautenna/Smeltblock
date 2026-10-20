export class BarreNavigation {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

        this.barre = page.locator('nav[aria-label="Navigation principale"]')
        this.boutonDiscord = this.barre.locator('a[href="/discord"]')
    }

    async ouvrirLien(libelle) {
        await this.barre.getByRole('link', { name: libelle, exact: true }).click()
    }

    async ouvrirDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonDiscord.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
}
