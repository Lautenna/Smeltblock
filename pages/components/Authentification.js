export class AuthentificationVote {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champsPseudo = page.getByRole('textbox', { name: 'Pseudo Minecraft Java' })
        this.boutonConnexion = page.getByRole('button', { name: 'CONNEXION' })
        this.boutonDeconnexion = page.getByRole('button', { name: 'DÉCONNEXION' })

    }

    async connexionValideWarnd() {
        await this.champsPseudo.fill("WarnD")
        await this.boutonConnexion.click()

    }

    async connexionValideYvanor() {
        await this.champsPseudo.fill("Yvanor")
        await this.boutonConnexion.click()

    }
    
     async connexionValideLautenna() {
        await this.champsPseudo.fill("Lautenna")
        await this.boutonConnexion.click()

    }

    async connexionValideLesupaponey() {
        await this.champsPseudo.fill("Lesupaponey")
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

    async deconnexion(){
          await this.boutonDeconnexion.click();

    }

}
