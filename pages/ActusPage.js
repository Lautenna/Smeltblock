export class ActusPage {
    constructor(page) {
        this.page = page;

        this.ongletMiseAJour = page.getByRole('radio', { name: 'Mise à jour' })
        this.ongletClassement = page.getByRole('radio', { name: 'Classement' })
        this.ongletEvenement = page.getByRole('radio', { name: 'Évènement' })
        this.ongletTutoriel = page.getByRole('radio', { name: 'Tutoriel' })
        this.ongletTous = page.getByRole('radio', { name: 'Tous' })
    }

    async boutonMiseAJour() {
        await this.ongletMiseAJour.check({ force: true })
    }
    async boutonClassement() {
        await this.ongletClassement.check({ force: true })
    }
    async boutonsEvenement() {
        await this.ongletEvenement.check({ force: true })
    }
    async boutonTutoriel() {
        await this.ongletTutoriel.check({ force: true })
    }
    async boutonTous() {
        await this.ongletTous.check({ force: true })
    }
}