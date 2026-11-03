import { test, expect } from '@playwright/test';
import { jddVote, TEST_UUIDS, UUID_WARND } from '../data_test/vote.data.js';
import { insertMany, deleteWhere, closeDb, selectLast, deleteLast } from '../helpers/db.js';
import { VotePage } from '../../pages/VotePage.js';
import { AuthentificationVote } from '../../pages/components/AuthentificationVote.js'
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';

let votePage;


test.beforeAll(async () => {
    await deleteWhere('vote__vote', 'player_uuid', TEST_UUIDS);
    await deleteWhere('vote__milestone_claim', 'player_uuid', TEST_UUIDS);
    await deleteWhere('vote__classement_hebdomadaire_recompense', 'player_uuid', TEST_UUIDS);

    await insertMany('vote__vote', jddVote())
});

test.beforeEach(async ({ page }) => {
    await page.goto('/vote');
    votePage = new VotePage(page);
    await (new CookiesPopup(page)).refuserCookies()
})

test('TC_VOTE_001_Voir_top_vote', async ({ }) => {
    await test.step('Étant donné un visiteur peut voir le top voteurs de cette semaine', async () => {
        const testIds = ["classement-1", "classement-2", "classement-3", "classement-4", "classement-5"]
        const pseudosAttendus = ["WarnD", "Cana_sucre", "Lautenna", "Yvanor", "LeSupaPoney"]
        const votesAttendus = ["29", "16", "9", "3", "2"]

        for (let i = 0; i < testIds.length; i++) {
            expect(await votePage.topVoteurs.recupererInfoLigne(testIds[i])).toEqual({ pseudo: pseudosAttendus[i], nbVotes: votesAttendus[i] })
        }
    })
});


test('TC_VOTE_002_Blocage_vote_même_IP', async ({ page }) => {
    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await authentification.connexionValideLautenna()
        await expect(page.locator('#infos')).toContainText('Lautenna');
    })
    await test.step('Étant donné un visiteur vote avec une IP', async () => {
        const response = await votePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await votePage.mesVotes.cliquerSurLeSite()
        await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await votePage.mesVotes.cliquerSurLeSite()
        await expect(votePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
        await expect(page.locator('#infos')).toContainText('10 votes cette semaine !');
    })

    await test.step('Étant donné un autre visiteur vote avec une IP qui a déja voté', async () => {
        await authentification.deconnexion()
        await authentification.connexionValideYvanor()
        await expect(page.locator('#infos')).toContainText('Yvanor');
        await expect(votePage.mesVotes.premierSite.getByText('Vote déjà fait avec cette ip ')).toBeVisible()

    })
    await deleteLast('vote__vote');

})


test('TC_VOTE_003_Avancé_et_réception_récompenses_de_vote', async ({ page }) => {

    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await votePage.recompensesDeVote.assertVerrouille(2)
        await authentification.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');
    })

    await test.step("Étant donné un visiteur peut voir qu'il a un palier de bon, et proche d'un autre", async () => {
        await votePage.recompensesDeVote.assertDebloque(1)
        await votePage.recompensesDeVote.assertEnCours(2)
        await votePage.recompensesDeVote.assertVerrouille(3)
    })

    await test.step("Étant donné un visiteur peut voir que le palier suivant se débloque", async () => {
        const response = await votePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await page.reload()

        await votePage.mesVotes.cliquerSurLeSite(2)
        await expect(votePage.mesVotes.secondSite.getByText('Vote validé ?')).toBeVisible()

        await votePage.mesVotes.cliquerSurLeSite(2)
        await expect(votePage.mesVotes.secondSite.getByText('Validé !')).toBeVisible()

        await votePage.recompensesDeVote.assertDebloque(1)
        await votePage.recompensesDeVote.assertDebloque(2)
        await votePage.recompensesDeVote.assertEnCours(3)
    })

    await test.step('Étant donné un visiteur reçoit bien ces récompenses de vote', async () => {
        const dernierPalierDeVote = await selectLast('vote__milestone_claim')
        await expect(dernierPalierDeVote.player_uuid).toEqual(UUID_WARND)
        await expect(dernierPalierDeVote.threshold_value).toEqual(30)

    })

    await deleteLast('vote__vote');

});

test('TC_VOTE_004_Reception_des_récompenses_de_vote_top_vote', async ({ request }) => {
    await test.step('Étant donné un visiteur reçoit bien ces récompenses de top vote', async () => {
        const response = await request.post('/vote/_e2e/weekly-rewards');
        expect(response.status()).toBe(200);
        const report = await response.json();

        expect(report.commands[0].command).toEqual('playerpoints:p give WarnD 2000')
        expect(report.commands[1].command).toEqual('playerpoints:p give Cana_sucre 1500')
        expect(report.commands[2].command).toEqual('playerpoints:p give Lautenna 1250')
        expect(report.commands[3].command).toEqual('playerpoints:p give Yvanor 1000')
        expect(report.commands[4].command).toEqual('playerpoints:p give LeSupaPoney 750')
    })

})

test.describe('Mes_votes', () => {

    test.beforeEach(async ({ page }) => {
        const authentification = new AuthentificationVote(page);
        await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
            await authentification.connexionValideLesupaponey()
            await expect(page.locator('#infos')).toContainText('Lesupaponey');
        })
    })

    test('TC_VOTE_005_Mes_votes_not_found', async ({ page }) => {

        await test.step('Étant donné un visiteur a voté, mais pas encore validé ou trouvé', async () => {
            const response = await votePage.mesVotes.simulerSession('not_found')
            expect(response.ok()).toBeTruthy()

            await page.reload()

            await votePage.mesVotes.cliquerSurLeSite(3)
            await expect(votePage.mesVotes.troisièmeSite.getByText('Vote validé ?')).toBeVisible()

            await votePage.mesVotes.cliquerSurLeSite(3)
            await expect(votePage.mesVotes.troisièmeSite.getByText('Vote non trouvé')).toBeVisible()
        })
    })

    test('TC_VOTE_006_Mes_votes_unavailable', async ({ page }) => {

        await test.step('Étant donné un visiteur a voté, mais une erreur est survenue', async () => {
            const response = await votePage.mesVotes.simulerSession('unavailable')
            expect(response.ok()).toBeTruthy()

            await page.reload()

            await votePage.mesVotes.cliquerSurLeSite()
            await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

            await votePage.mesVotes.cliquerSurLeSite()
            await expect(votePage.mesVotes.premierSite.getByText('Problème de vérification')).toBeVisible()
        })

    })
    test('TC_VOTE_007_Mes_votes_confirmed', async ({ page }) => {
        await test.step('Étant donné un visiteur a son vote validé', async () => {
            const response = await votePage.mesVotes.simulerSession('confirmed')
            expect(response.ok()).toBeTruthy()

            await page.reload()

            await votePage.mesVotes.cliquerSurLeSite()
            await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

            try {
                await votePage.mesVotes.cliquerSurLeSite()
                await expect(votePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
                await expect(page.locator('#infos')).toContainText('3 votes cette semaine !');
            } finally {
                await deleteLast('vote__vote');
            }
        })

    })

})

test.afterAll(async () => {
    await closeDb();
});