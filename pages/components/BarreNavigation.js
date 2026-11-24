import { expect } from '@playwright/test'

export class BarreNavigation {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

        this.barre = page.locator('nav[aria-label="Navigation principale"]')
        this.boutonDiscord = this.barre.locator('a[href="/discord"]')
    }

    async ouvrirLien(libelle) {
        const lien = this.barre.getByRole('link', { name: libelle, exact: true })
        await this.page.waitForLoadState('load')
        const urlAttendue = new URL(await lien.getAttribute('href'), this.page.url()).href
        await lien.click()
        await expect(this.page).toHaveURL(urlAttendue, { timeout: 10_000 })
    }

    async ouvrirDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonDiscord.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
}
