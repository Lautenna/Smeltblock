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



    async redirectionSiteDeveloppeur() {
        await this.bouttonSiteDeveloppeur.click()
    }
}

export class InformationsGenerales {
constructor(page){
    this.page = page;
    this.mentionsLegales = this.page.getByRole('link', { name: 'Mentions légales' })
    this.cgu = this.page.getByRole('link', { name: 'CGU' })
    this.cgv = this.page.getByRole('link', { name: 'CGV' })
    this.confidentialite = this.page.getByRole('link', { name: 'Confidentialité', exact: true })
}
async redirectionMentionsLegales() {
        await this.mentionsLegales.click()

}

async redirectionCGU() {
        await this.cgu.click()
}

async redirectionCGV() {
        await this.cgv.click()
}

async redirectionConfidentialite() {
        await this.confidentialite.click()
}

}

