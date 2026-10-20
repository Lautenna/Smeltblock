export class ActusPage {
    constructor(page) {
        this.page = page;

        this.ongletMiseAJour = page.locator('label', { hasText: 'Mise à jour' }) 
        this.ongletClassement = page.locator('label', { hasText: 'Classement' })
        this.ongletEvenement = page.locator('label', { hasText: 'Évènement' })
        this.ongletTutoriel = page.locator('label', { hasText: 'Tutoriel' })
        this.ongletTous = page.locator('label', { hasText: 'Tous' })
    }

    async boutonMiseAJour() {
        await this.ongletMiseAJour.check()
    }
    async boutonClassement() {
        await this.ongletClassement.check()
    }
    async boutonsEvenement() {
        await this.ongletEvenement.check()
    }
    async boutonTutoriel() {
        await this.ongletTutoriel.check()
    }
    async boutonTous() {
        await this.ongletTous.check()
    }
}