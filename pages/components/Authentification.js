export class Authentification {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champPseudo = page.getByRole('textbox', { name: 'Pseudo Minecraft Java' })
        this.boutonConnexion = page.getByRole('button', { name: 'CONNEXION' })
        this.boutonDeconnexion = page.getByRole('button', { name: 'DÉCONNEXION' })

    }

    async connexionValideWarnd() {
        await this.champPseudo.fill("WarnD")
        await this.boutonConnexion.click()

    }

    async connexionValideYvanor() {
        await this.champPseudo.fill("Yvanor")
        await this.boutonConnexion.click()

    }
    
     async connexionValideLautenna() {
        await this.champPseudo.fill("Lautenna")
        await this.boutonConnexion.click()

    }

    async connexionValideLesupaponey() {
        await this.champPseudo.fill("Lesupaponey")
        await this.boutonConnexion.click()

    }

    async connexionInvalide() {
        await this.champPseudo.fill("Lechatsauvage")
        await this.boutonConnexion.click()

    }
    async connexionVide() {
        await this.champPseudo.fill("")
        await this.boutonConnexion.click()

    }

    async deconnexion(){
          await this.boutonDeconnexion.click();

    }

}
