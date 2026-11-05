import { expect } from '@playwright/test';

export class AuthentificationBoutique {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.champPseudo = page.getByRole('textbox', { name: 'Ton pseudo Minecraft' })
        this.boutonSeConnecterPage = page.locator('[data-live-action-param="openIdentityModal"]')
        this.boutonDeconnexion = page.getByRole('button', { name: ' ' })
        this.boutonSeConnecterPopup = page.locator('#boutique-identity').getByRole('button', { name: 'Se connecter' })
        this.offrirCadeauAmi = page.getByLabel('', { exact: true })
        this.champPseudoAmi = page.getByRole('textbox', { name: 'Offrir à quelqu\'un ?' })
    }

    async seConnecterBoutique(pseudo = 'Youtyxx', pseudoAmi = '') {
        await this.boutonSeConnecterPage.click()
        await this.champPseudo.fill(pseudo)
        if (pseudoAmi !== '') {
            await this.offrirCadeauAmi.dispatchEvent("click")
            await this.champPseudoAmi.fill(pseudoAmi)
        }
        await this.boutonSeConnecterPopup.click()
        await expect(this.boutonSeConnecterPage).toBeHidden()

    }

    async remplirPseudo() {
        await this.click()
        await this.champPseudo.fill("Youtyxx")
    }

    async remplirPseudoAmi() {

    }

    async connexion() {
        await this.boutonSeConnecterPopup.click()
    }

    async deconnexion() {
        await this.boutonDeconnexion.click();
    }

}

