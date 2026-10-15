import { test, expect, CSS } from '@playwright/test';
import { jddVote, TEST_UUIDS } from '../data_test/vote.data';
import { insertMany, deleteWhere, closeDb } from '../helpers/db.js';
import { VotePage } from '../../pages/VotePage.js';
import { AuthentificationVote } from '../../pages/components/Authentification'
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';

let myVotePage;


test.beforeAll(async () => {
    await insertMany('vote__vote', jddVote())
});

test.beforeEach(async ({ page }) => {
    await page.goto('/vote');
    myVotePage = new VotePage(page);
    await (new CookiesPopup(page)).refuserCookies()
})

test('TC_VOTE_001_Voir_top_vote', async ({ page }) => {
    await test.step('Étant donné un visiteur peut voir le top voteurs de cette semaine', async () => {
        let id = ["classement-1", "classement-2", "classement-3", "classement-4", "classement-5"]
        let pseudo = ["WarnD", "Cana_sucre", "Lautenna", "Yvanor", "LeSupaPoney"]
        let votes = ["29", "16", "9", "3", "2"]

        for (let p = 0; p < id.length; p++) {
            expect(await myVotePage.topVoteurs.recupereInfoLigne(id[p])).toEqual([pseudo[p], votes[p]])
        }
    })
});


test.afterAll(async () => {
    await deleteWhere('vote__vote', 'player_uuid', TEST_UUIDS);
    await closeDb();
});



test('TC_VOTE_003_Avancé_récompense_de_vote', async ({ page }) => {

    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await page.goto('/vote');
        await myVotePage.recompensesDeVote.estVerrouille(2)
        await myAuthentificationVote.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');
    })

    await test.step("Étant donné un visiteur peut voir qu'il a un pallier de bon, et proche d'un autre", async () => {
        await myVotePage.recompensesDeVote.estDebloque(1)
        await myVotePage.recompensesDeVote.estEnCours(2)
        await myVotePage.recompensesDeVote.estVerrouille(3)
    })

    await test.step("Étant donné un visiteur peut voir que le palier suivant se débloque", async () => {
        const response = await myVotePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()

        await myVotePage.recompensesDeVote.estDebloque(1)
        await myVotePage.recompensesDeVote.estDebloque(2)
        await myVotePage.recompensesDeVote.estEnCours(3)
    })

});


test('TC_VOTE_004_Mes_votes', async ({ page }) => {

    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await myAuthentificationVote.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');

    })

    await test.step('Étant donné un visiteur à son vote validé', async () => {
        const response = await myVotePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
        await expect(page.locator('#infos')).toContainText('30 votes cette semaine !');


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

test('TC_VOTE_002_Bloquage_vote_même_IP', async ({ page }) => {
    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await myAuthentificationVote.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');
    })
    await test.step('Étant donné un visiteur vote avec une IP', async () => {
        const response = await myVotePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await myVotePage.mesVotes.cliquerSurLeSite()
        await expect(myVotePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
        await expect(page.locator('#infos')).toContainText('30 votes cette semaine !');
    })

    await test.step('Étant donné un autre visiteur vote avec une IP qui a déja voté', async () => {
        await myAuthentificationVote.deconnexion()
        await myAuthentificationVote.connexionValideYvanor()
        await expect(page.locator('#infos')).toContainText('Yvanor');
        await expect(myVotePage.mesVotes.premierSite.getByText('Vote déjà fait avec cette ip ')).toBeVisible()

    })
})


    test.afterAll(async () => {
        await deleteWhere('vote__vote', 'player_uuid', TEST_UUIDS);
        await closeDb();
    });