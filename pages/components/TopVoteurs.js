
import { expect } from '@playwright/test'

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

    async verifierClassement(classementAttendu) {
        let premierEssai = true
        // Le classement serveur est caché 5 s ; une modification directe en BDD ne l'invalide pas.
        await expect(async () => {
            if (!premierEssai) await this.page.reload()
            premierEssai = false
            const classement = await Promise.all(classementAttendu.map((_, index) =>
                this.recupererInfoLigne(`classement-${index + 1}`)
            ))
            expect(classement).toEqual(classementAttendu)
        }).toPass({ timeout: 10_000, intervals: [500, 1000] })
    }
}

