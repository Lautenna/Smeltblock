import { test, expect, CSS } from '@playwright/test';
import { jddVote, TEST_UUIDS } from '../data_test/vote.data';
import { insertMany, deleteWhere, closeDb } from '../helpers/db.js';
import { VotePage } from '../../pages/VotePage.js';
import { AuthentificationVote } from '../../pages/components/Authentification'


//  Mes récompenses de vote : 
//=> D'un compte sur lequel je peux ajouter le nombre e vote souhaité de manier fictive afin de voir l'avnacé de la ImageBitmapRenderingContext


// Mes votes
// S'arrurer que les lien renvois bien à la bonne redirection de la page de vote. 

let myVotePage;


test.beforeAll(async () => {
    await insertMany('vote__vote', jddVote())
});

test.beforeEach(async ({ page }) => {
    myVotePage = new VotePage(page);
})

test('TC_VOTE_001_Voir_top_vote', async ({ page }) => {
    await test.step('Étant donné un visiteur peut voir le top voteurs de cette semaine', async () => {
        await page.goto('/vote');
        let id = ["classement-1", "classement-2", "classement-3", "classement-4", "classement-5"]
        let pseudo = ["WarnD", "Cana_sucre", "Lautenna", "Yvanor", "LeSupaPoney"]
        let votes = ["33", "16", "9", "3", "2"]

        for (let p = 0; p < id.length; p++) {
            expect(await myVotePage.topVoteurs.recupereInfoLigne(id[p])).toEqual([pseudo[p], votes[p]])
        }
    })
});




test.afterAll(async () => {
    await deleteWhere('vote__vote', 'player_uuid', TEST_UUIDS);
    await closeDb();
});



test('TC_VOTE_004_Mes_votes', async ({ page }) => {

    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Mincraft valide', async () => {
        await page.goto('/vote');
        await myAuthentificationVote.connexionValide()
        await expect(page.locator('#infos')).toContainText('Lautenna');

    })

    await test.step('Étant donné un visiteur à son vote validé', async () => {
        const response = await myVotePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()

    })

    await test.step('Étant donné un visiteur a voté, mais pas encore validé ou trouvé', async () => {
        const response = await myVotePage.mesVotes.simulerSession('not_found')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote non trouvé')).toBeVisible()
    })


    await test.step('Étant donné un visiteur à voté, mais une erreur est survenue', async () => {
        const response = await myVotePage.mesVotes.simulerSession('unavailable')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Problème de vérification')).toBeVisible()
    })

})