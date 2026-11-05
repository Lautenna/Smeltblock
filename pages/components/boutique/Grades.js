export class Grades {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.boutons = {
            elite: page.getByRole('button', { name: 'DEVENIR ÉLITE' }),
            eliteOffert: page.getByRole('button', { name: 'OFFRIR ÉLITE' }),
            mvpPlus: page.getByRole('button', { name: 'DEVENIR MVP+' }),
            autresGrades: page.getByRole('button', { name: 'ÉLITES & ULTIME  ' })

        }
        this.carteMvpPlus = page.locator('[data-live-name-value="Boutique:ProduitCard"]:visible').filter({ hasText: 'Le grade le plus populaire' })
    }


    async ajouterGrade(grade) {
        await this.boutons[grade].click()

    }
}