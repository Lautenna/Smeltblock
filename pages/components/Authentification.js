export class AuthentificationVote {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champsPseudo = page.getByRole('textbox', { name: 'Pseudo Minecraft Java' })
        this.boutonConnexion = page.getByRole('button', { name: 'CONNEXION' })

    }

    async connexionValide() {
        await this.champsPseudo.fill("Lautenna")
        await this.boutonConnexion.click()

    }

    async connexionInvalide() {
        await this.champsPseudo.fill("Lechatsauvage")
        await this.boutonConnexion.click()

    }
    async connexionVide() {
        await this.champsPseudo.fill("")
        await this.boutonConnexion.click()

    }

}
