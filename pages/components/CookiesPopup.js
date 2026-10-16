export class CookiesPopup {

    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.popup = page.getByRole('dialog', { name: 'Autoriser les cookies supplé' })
        // this.bouttonRefuser = this.popup.getByRole('button', { name: 'Continuer sans Analytics' })
        this.bouttonRefuser = this.popup.getByRole('button', { name: 'Tout refuser' })
        this.bouttonAccepter = this.popup.getByRole('button', { name: ' Tout accepter' })
        this.bouttonCookies = page.getByRole('link', { name: 'Gérer les cookies' })
        this.bouttonConfidentialité = page.getByRole('link', { name: 'Confidentialité' })
    }
    async accepterCookies() {
        await this.bouttonAccepter.click()
    }

    async refuserCookies() {
        await this.bouttonRefuser.click()
    }

    async gererCookies() {
        await this.bouttonConfidentialité.click()
        await this.bouttonCookies.click()
    }
    async recupererCookies() {
        return (await this.page.context().cookies())[0]
    }
}
