
export class TopVoteurs {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;

    }

    async recupererInfoLigne(testId) {
        const ligne = this.page.getByTestId(testId);
        const pseudo = await ligne.locator('.font-minecraft').textContent();
        const nbVotes = await ligne.locator('.text-sm').textContent(); 
        return { pseudo: pseudo.trim(), nbVotes: nbVotes.replace(/\D/g, '') };


    }
}

