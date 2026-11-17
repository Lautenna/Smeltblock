export class Grades {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.boutons = {
            elite: page.getByTestId('grade-add-4'),
            eliteOffert: page.getByRole('button', { name: 'OFFRIR ÉLITE' }),
            mvpPlus: page.getByTestId('grade-add-3'),
            autresGrades: page.getByRole('switch', { name: 'Grades spéciaux' })

        }
        this.carteMvpPlus = page.getByText('MVP+ Le plus populaire ! 20,')
    }


    async ajouterGrade(grade) {
        await this.boutons[grade].click()

    }
}

