export class AuthentificationBoutique {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champPseudo = page.getByRole('textbox', { name: 'Ton pseudo Minecraft' })
        this.boutonSeConnecterPage = page.getByRole('button', { name: 'Se connecter' })
        this.boutonDeconnexion = page.getByRole('button', { name: ' ' })
        this.boutonSeConnecterPopup = page.locator('#boutique-identity').getByRole('button', { name: 'Se connecter' })


    }

    async connexionValideYoutyxx() {
        await this.boutonSeConnecterPage.click()
        await this.champPseudo.fill("Youtyxx")
        await this.boutonSeConnecterPopup.click()

    }


    async deconnexion() {
        await this.boutonDeconnexion.click();

    }

}

