import { test, expect, CSS } from '@playwright/test';
import { AuthentificationVote } from '../../pages/components/Authentification'

test('TC_CONN_001_connexion_id_valide', async ({ page }) => {
    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Mincraft valide', async () => {
        await page.goto('/vote');
        await myAuthentificationVote.connexionValide()
        await expect(page.locator('#infos')).toContainText('Lautenna');

    })
});

test('TC_CONN_002_un_id_inconnu_refuse_la_connexion', async ({ page }) => {
    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur ne peut pas se connecter avec un pseudo Mincraft invalide', async () => {
        await page.goto('/vote');
        await myAuthentificationVote.connexionInvalide()
        await expect(page.getByRole('alert')).toContainText("Ce joueur n'existe pas.");

    })
});


test('TC_CONN_003_un_id_non_rempli_affiche_une_erreur', async ({ page }) => {
    let myAuthentificationVote = new AuthentificationVote(page);
    await test.step("Étant donné un visiteur ne peut pas se connecter si le champs n'est pas rempli", async () => {
        await page.goto('/vote');
        await myAuthentificationVote.connexionVide()
        await expect(page.getByRole('alert')).toContainText("Ce pseudo Minecraft est invalide.");

    })
});

