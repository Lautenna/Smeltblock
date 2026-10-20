export class ActusPage {
    constructor(page) {
        this.page = page;

        this.ongletMiseAJour = page.locator('label', { hasText: 'Mise à jour' }) 
        this.ongletClassement = page.locator('label', { hasText: 'Classement' })
        this.ongletEvenement = page.locator('label', { hasText: 'Évènement' })
        this.ongletTutoriel = page.locator('label', { hasText: 'Tutoriel' })
        this.ongletTous = page.locator('label', { hasText: 'Tous' })
    }

    async ouvrirOngletMiseAJour() {
        await this.ongletMiseAJour.check()
    }
    async ouvrirOngletClassement() {
        await this.ongletClassement.check()
    }
    async ouvrirOngletEvenement() {
        await this.ongletEvenement.check()
    }
    async ouvrirOngletTutoriel() {
        await this.ongletTutoriel.check()
    }
    async ouvrirOngletTous() {
        await this.ongletTous.check()
    }
}