import { expect } from '@playwright/test';

export class AuthentificationBoutique {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champPseudo = page.getByRole('textbox', { name: 'Ton pseudo Minecraft' })
        this.boutonSeConnecterPage = page.getByTestId('cart-toggle')
        this.boutonDeconnexion = page.getByRole('button', { name: 'Se déconnecter' })
        this.boutonContinuer = page.getByRole('button', { name: 'Continuer' })
        this.offrirCadeauAmi = page.getByRole('switch', { name: 'Offrir à quelqu\'un ? Ce' })
        this.champPseudoAmi = page.getByRole('textbox', { name: 'Pseudo du destinataire' })
        this.validerPseudoAmi = page.getByRole('button', { name: 'Valider' })
        this.fermerPanier = page.getByRole('button', { name: 'Fermer' })
    }

    async seConnecterBoutique(pseudo = 'Youtyxx', pseudoAmi = '') {
        await this.boutonSeConnecterPage.click()
        await expect(this.champPseudo).toBeEnabled()
        await this.champPseudo.fill(pseudo)
        await this.boutonContinuer.click()
        if (pseudoAmi !== '') {
            await this.offrirCadeauAmi.dispatchEvent("click")
            await expect(this.champPseudoAmi).toBeEnabled()
            await this.champPseudoAmi.fill(pseudoAmi)
            await this.validerPseudoAmi.click()
        }
        await this.fermerPanier.click()
        await expect(this.boutonSeConnecterPage).toContainText(pseudo)

    }


    async remplirPseudo() {
        await this.click()
        await this.champPseudo.fill("Youtyxx")
    }

    async remplirPseudoAmi() {

    }

    async connexion() {
        await this.boutonContinuer.click()
    }

    async deconnexion() {
        await this.boutonDeconnexion.click();
    }

}

