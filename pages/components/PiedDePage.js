export class PiedDePage {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

        this.footer = page.locator("footer")
        this.boutonFacebook = this.footer.locator('a[href="https://www.facebook.com/SmeltBlock/"]')
        this.boutonInstagram = this.footer.locator('a[href="https://www.instagram.com/smeltblock/"]')
        this.boutonTiktok = this.footer.locator('a[href="https://www.tiktok.com/@smeltblockfr"]')
        this.boutonDiscord = this.footer.locator('a[href="/discord"]')
        this.boutonSiteDeveloppeur = this.footer.locator('a[href="https://maximemougel.dev"]')
        this.mentionsLegales = this.footer.getByRole('link', { name: 'Mentions légales' })
        this.cgu = this.footer.getByRole('link', { name: 'CGU' })
        this.cgv = this.footer.getByRole('link', { name: 'CGV' })
        this.confidentialite = this.footer.getByRole('link', { name: 'Confidentialité', exact: true })
    }

    async ouvrirFacebook() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonFacebook.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async ouvrirInstagram() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonInstagram.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async ouvrirTiktok() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonTiktok.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async ouvrirDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.boutonDiscord.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async ouvrirSiteDeveloppeur() {
        await this.boutonSiteDeveloppeur.click()
    }

    async ouvrirMentionsLegales() {
        await this.mentionsLegales.click()
    }

    async ouvrirCGU() {
        await this.cgu.click()
    }

    async ouvrirCGV() {
        await this.cgv.click()
    }

    async ouvrirConfidentialite() {
        await this.confidentialite.click()
    }
}
