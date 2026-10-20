import { test, expect, CSS } from '@playwright/test';
import { Authentification } from '../../pages/components/Authentification'
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';

test('TC_CONN_001_connexion_id_valide', async ({ page }) => {
    let authentification = new Authentification(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await page.goto('/vote');
        await (new CookiesPopup(page)).refuserCookies()
        await authentification.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');

    })
});

test('TC_CONN_002_un_id_inconnu_refuse_la_connexion', async ({ page }) => {
    let authentification = new Authentification(page);
    await test.step('Étant donné un visiteur ne peut pas se connecter avec un pseudo Minecraft invalide', async () => {
        await page.goto('/vote');
        await (new CookiesPopup(page)).refuserCookies()
        await authentification.connexionInvalide()
        await expect(page.getByRole('alert')).toContainText("Ce joueur n'existe pas.");

    })
});


test('TC_CONN_003_un_id_non_rempli_affiche_une_erreur', async ({ page }) => {
    let authentification = new Authentification(page);
    await test.step("Étant donné un visiteur ne peut pas se connecter si le champs n'est pas rempli", async () => {
        await page.goto('/vote');
        await authentification.connexionVide()
        await expect(page.getByRole('alert')).toContainText("Ce pseudo Minecraft est invalide.");

    })
});

