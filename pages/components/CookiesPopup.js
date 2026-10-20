export class CookiesPopup {

    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.popup = page.getByRole('dialog', { name: 'Autoriser les cookies supplé' })
        // this.boutonRefuser = this.popup.getByRole('button', { name: 'Continuer sans Analytics' })
        this.boutonRefuser = this.popup.getByRole('button', { name: 'Tout refuser' })
        this.boutonAccepter = this.popup.getByRole('button', { name: ' Tout accepter' })
        this.boutonCookies = page.getByRole('link', { name: 'Gérer les cookies' })
        this.boutonConfidentialite = page.getByRole('link', { name: 'Confidentialité' })
    }
    async accepterCookies() {
        await this.boutonAccepter.click()
    }

    async refuserCookies() {
        await this.boutonRefuser.click()
    }

    async gererCookies() {
        await this.boutonConfidentialite.click()
        await this.boutonCookies.click()
    }
    async recupererCookies() {
        return (await this.page.context().cookies())[0]
    }
}
