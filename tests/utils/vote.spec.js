import { test, expect } from '@playwright/test';
import { jddVote, TEST_UUIDS, UUID_WARND } from '../data_test/vote.data.js';
import { insertMany, deleteWhere, closeDb, selectLast, query } from '../helpers/db.js';
import { VotePage } from '../../pages/VotePage.js';
import { AuthentificationVote } from '../../pages/components/AuthentificationVote.js'
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';

let votePage;
let dernierIdAvantTest = null


test.beforeEach(async ({ page }) => {
    dernierIdAvantTest = null
    // Chaque scénario repart du même état, même après un vote ou une assertion en échec.
    await deleteWhere('vote__vote', 'player_uuid', TEST_UUIDS);
    await deleteWhere('vote__milestone_claim', 'player_uuid', TEST_UUIDS);
    await deleteWhere('vote__classement_hebdomadaire_recompense', 'player_uuid', TEST_UUIDS);

    await insertMany('vote__vote', jddVote())
    const [borne] = await query(
        'SELECT COALESCE(MAX(id), 0) AS id FROM vote__vote WHERE player_uuid IN (?)',
        [TEST_UUIDS]
    )
    dernierIdAvantTest = borne.id
    await page.goto('/vote');
    votePage = new VotePage(page);
    await (new CookiesPopup(page)).refuserCookies()
})

test('TC_VOTE_001_Voir_top_vote', async ({ }) => {
    await test.step('Étant donné un visiteur peut voir le top voteurs de cette semaine', async () => {
        await votePage.topVoteurs.verifierClassement([
            { pseudo: 'WarnD', nbVotes: '29' },
            { pseudo: 'Cana_sucre', nbVotes: '16' },
            { pseudo: 'Lautenna', nbVotes: '9' },
            { pseudo: 'Yvanor', nbVotes: '3' },
            { pseudo: 'LeSupaPoney', nbVotes: '2' },
        ])
    })
});


test('TC_VOTE_002_Blocage_vote_même_IP', async ({ page }) => {
    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await authentification.connexionValideLautenna()
        await expect(page.locator('#infos')).toContainText('Lautenna');
        await votePage.mesVotes.attendreFinChargement()
    })
    await test.step('Étant donné un visiteur vote avec une IP', async () => {
        const response = await votePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await votePage.mesVotes.ouvrirSite()
        await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

        await votePage.mesVotes.verifierVote()
        await expect(votePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
        await expect(page.locator('#infos')).toContainText('10 votes cette semaine !');
    })

    await test.step('Étant donné un autre visiteur vote avec une IP qui a déja voté', async () => {
        await authentification.deconnexion()
        await expect(authentification.boutonConnexion).toBeVisible()
        await votePage.mesVotes.attendreFinChargement()
        await authentification.connexionValideYvanor()
        await expect(page.locator('#infos')).toContainText('Yvanor');
        await votePage.mesVotes.attendreFinChargement()
        await expect(votePage.mesVotes.premierSite.getByText('Vote déjà fait avec cette ip ')).toBeVisible()

    })

})


test('TC_VOTE_003_Avancé_et_réception_récompenses_de_vote', async ({ page }) => {

    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await votePage.recompensesDeVote.assertVerrouille(2)
        await authentification.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');
        await votePage.mesVotes.attendreFinChargement()
    })

    await test.step("Étant donné un visiteur peut voir qu'il a un palier de bon, et proche d'un autre", async () => {
        await votePage.recompensesDeVote.assertDebloque(1)
        await votePage.recompensesDeVote.assertEnCours(2)
        await votePage.recompensesDeVote.assertVerrouille(3)
    })

    await test.step("Étant donné un visiteur peut voir que le palier suivant se débloque", async () => {
        const response = await votePage.mesVotes.simulerSession('confirmed')
        expect(response.ok()).toBeTruthy()

        await votePage.mesVotes.ouvrirSite(2)
        await expect(votePage.mesVotes.secondSite.getByText('Vote validé ?')).toBeVisible()

        await votePage.mesVotes.verifierVote(2)
        await expect(votePage.mesVotes.secondSite.getByText('Validé !')).toBeVisible()

        await votePage.recompensesDeVote.assertDebloque(1)
        await votePage.recompensesDeVote.assertDebloque(2)
        await votePage.recompensesDeVote.assertEnCours(3)
    })

    await test.step('Étant donné un visiteur reçoit bien ces récompenses de vote', async () => {
        const dernierPalierDeVote = await selectLast('vote__milestone_claim', 'id', { player_uuid: UUID_WARND })
        await expect(dernierPalierDeVote.player_uuid).toEqual(UUID_WARND)
        await expect(dernierPalierDeVote.threshold_value).toEqual(30)

    })


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
            await votePage.mesVotes.attendreFinChargement()
        })
    })

    test('TC_VOTE_005_Mes_votes_not_found', async ({ page }) => {

        await test.step('Étant donné un visiteur a voté, mais pas encore validé ou trouvé', async () => {
            const response = await votePage.mesVotes.simulerSession('not_found')
            expect(response.ok()).toBeTruthy()

            await votePage.mesVotes.ouvrirSite(3)
            await expect(votePage.mesVotes.troisièmeSite.getByText('Vote validé ?')).toBeVisible()

            await votePage.mesVotes.verifierVote(3)
            await expect(votePage.mesVotes.troisièmeSite.getByText('Vote non trouvé')).toBeVisible()
        })
    })

    test('TC_VOTE_006_Mes_votes_unavailable', async ({ page }) => {

        await test.step('Étant donné un visiteur a voté, mais une erreur est survenue', async () => {
            const response = await votePage.mesVotes.simulerSession('unavailable')
            expect(response.ok()).toBeTruthy()

            await votePage.mesVotes.ouvrirSite()
            await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

            await votePage.mesVotes.verifierVote()
            await expect(votePage.mesVotes.premierSite.getByText('Problème de vérification')).toBeVisible()
        })

    })
    test('TC_VOTE_007_Mes_votes_confirmed', async ({ page }) => {
        await test.step('Étant donné un visiteur a son vote validé', async () => {
            const response = await votePage.mesVotes.simulerSession('confirmed')
            expect(response.ok()).toBeTruthy()

            await votePage.mesVotes.ouvrirSite()
            await expect(votePage.mesVotes.premierSite.getByText('Vote validé ?')).toBeVisible()

            await votePage.mesVotes.verifierVote()
            await expect(votePage.mesVotes.premierSite.getByText('Validé !')).toBeVisible()
            await expect(page.locator('#infos')).toContainText('3 votes cette semaine !');
        })

    })

})

test.afterEach(async () => {
    if (dernierIdAvantTest === null) return
    // Ne supprimer que les nouvelles lignes des joueurs de test, jamais la dernière ligne globale.
    const votesCrees = await query(
        'SELECT id FROM vote__vote WHERE player_uuid IN (?) AND id > ?',
        [TEST_UUIDS, dernierIdAvantTest]
    )
    if (votesCrees.length) {
        await deleteWhere('vote__vote', 'id', votesCrees.map(vote => vote.id))
    }
})

test.afterAll(async () => {
    await closeDb();
});
