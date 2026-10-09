export class ReseauSocial {
    constructor(page) {
        this.page = page;
        this.footer = page.locator("footer")
        this.bouttonFacebook = this.footer.locator('a[href="https://www.facebook.com/SmeltBlock/"]')
        this.bouttonInstagram = this.footer.locator('a[href="https://www.instagram.com/smeltblock/"]')
        this.bouttonTiktok = this.footer.locator('a[href="https://www.tiktok.com/@smeltblockfr"]')
        this.bouttonDiscord = this.footer.locator('a[href="https://discord.com/invite/smeltblock"]')
        this.bouttonSiteDeveloppeur = this.footer.locator('a[href="https://maximemougel.dev"]')

    }

    async redirectionFacebook() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonFacebook.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
    // A commenté si problème de connexion
    async redirectionInstagram() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonInstagram.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async redirectionTiktok() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonTiktok.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }
    async redirectionDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonDiscord.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }


    async redirectionSiteDeveloppeur() {
        await this.bouttonSiteDeveloppeur.click()
    }
}