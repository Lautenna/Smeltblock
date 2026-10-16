export class ReseauSocial {
    constructor(page) {
        this.page = page;

        this.footer = page.locator("footer")
        this.barreNavigation = page.locator('nav[aria-label="Navigation principale"]')
        this.bouttonFacebook = this.footer.locator('a[href="https://www.facebook.com/SmeltBlock/"]')
        this.bouttonInstagram = this.footer.locator('a[href="https://www.instagram.com/smeltblock/"]')
        this.bouttonTiktok = this.footer.locator('a[href="https://www.tiktok.com/@smeltblockfr"]')
        this.bouttonDiscordFooter = this.footer.locator('a[href="/discord"]')
        this.bouttonDiscordNav = this.barreNavigation.locator('a[href="/discord"]')
        this.bouttonDiscordAccueil = this.page.getByRole('link', { name: ' REJOINS LE DISCORD !' })
        this.bouttonSiteDeveloppeur = this.footer.locator('a[href="https://maximemougel.dev"]')
        this.boutonWikiAccueil = this.page.getByRole('link', { name: 'CONSULTE LE WIKI !' })

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
// async redirectionDiscord() {
//         const pagePromise = this.page.context().waitForEvent('page');
//         redirectionDiscordFooter()
//         const newPage = await pagePromise;
//         await newPage.waitForLoadState();
//         return newPage;
//     }

//  async redirectionDiscordFooter() {
//         await this.bouttonDiscordFooter.click()
//     }

//     async redirectionDiscordNav() {
//         await this.bouttonDiscordNav.click()
//     }

//     async redirectionDiscordAccueil() {
//         await this.bouttonDiscordAccueil.click()
//     }


    async redirectionDiscord() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonDiscordFooter.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async redirectionDiscordNav() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonDiscordNav.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async redirectionDiscordAccueil() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonDiscordAccueil.click()
        const newPage = await pagePromise;
        await newPage.waitForLoadState();
        return newPage;
    }

    async redirectionPageWiki() {
        await this.boutonWikiAccueil.click()
    }

    async redirectionSiteDeveloppeur() {
        await this.bouttonSiteDeveloppeur.click()
    }
}