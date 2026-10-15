import { test, expect, CSS } from '@playwright/test';
import { jddVote, TEST_UUIDS } from '../data_test/vote.data';
import { insertMany, deleteWhere, closeDb } from '../helpers/db.js';
import { VotePage } from '../../pages/VotePage.js';

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


test('TC_VOTE_003_Avancé_récompense_de_vote', async ({ page }) => {
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


