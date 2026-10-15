
export class TopVoteurs {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

    }

    async recupereInfoLigne(id) {
        const ligne = this.page.getByTestId(id);
        const pseudo = await ligne.locator('.font-minecraft').textContent();
        const nbVotes = await ligne.locator('.text-sm').textContent(); 
        return [pseudo.trim(), nbVotes.replace(/\D/g, '')];


    }
}

