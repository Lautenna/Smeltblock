export class CookiesPopup {

    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.popup = page.getByRole('dialog', { name: 'Vos choix de confidentialité' })
        this.bouttonRefuser = this.popup.getByRole('button', { name: 'Continuer sans Analytics' })
        this.bouttonAccepter = this.popup.getByRole('button', { name: 'Accepter Analytics' })
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
    async recupererCookiesLocalStorage() {
        return this.page.evaluate(() => localStorage.getItem('smeltblock.cookie-consent'));
    }
}
