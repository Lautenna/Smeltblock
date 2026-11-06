import { test, expect } from '@playwright/test';
import { AuthentificationVote } from '../pages/components/AuthentificationVote.js'
import { CookiesPopup } from '../pages/components/CookiesPopup.js';
// import{ reponseJoueurInexistant } from '../data_test/auth.data.js'

test('TC_CONN_001 Connexion réussie avec un pseudo valide', async ({ page }) => {
    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide', async () => {
        await page.goto('/vote');
        await (new CookiesPopup(page)).refuserCookies()
        await authentification.connexionValideWarnd()
        await expect(page.locator('#infos')).toContainText('WarnD');

    })
});

test('TC_CONN_002 Un pseudo inconnu refuse la connexion', async ({ page }) => {
    let authentification = new AuthentificationVote(page);
    await test.step('Étant donné un visiteur ne peut pas se connecter avec un pseudo Minecraft invalide', async () => {
        await page.goto('/vote');
        await (new CookiesPopup(page)).refuserCookies()
        await authentification.connexionInvalide()
        await expect(page.getByRole('alert')).toContainText("Ce joueur n'existe pas.", { timeout: 10_000 });

    })
});

// Si les tests continue à être flasky
// test('TC_CONN_002 Un pseudo inconnu refuse la connexion', async ({ page }) => {
//     let authentification = new Authentification(page);
//     await test.step('Étant donné un visiteur ne peut pas se connecter avec un pseudo Minecraft invalide', async () => {
//         // On simule la réponse du serveur pour éviter le rate limit ("Trop de tentatives")
//         await page.route('**/_components/Vote:Gateway/login', async route => {
//             await route.fulfill({
//                 status: 200,
//                 contentType: 'application/vnd.live-component+html',
//                 body: reponseJoueurInexistant,
//             });
//         });
//         await page.goto('/vote');
//         await (new CookiesPopup(page)).refuserCookies()
//         await authentification.connexionInvalide()
//         await expect(page.getByRole('alert')).toContainText("Ce joueur n'existe pas.");

//     })
// });




test('TC_CONN_003 Un pseudo non rempli affiche une erreur', async ({ page }) => {
    let authentification = new AuthentificationVote(page);
    await test.step("Étant donné un visiteur ne peut pas se connecter si le champs n'est pas rempli", async () => {
        await page.goto('/vote');
        await (new CookiesPopup(page)).refuserCookies()
        await authentification.connexionVide()
        await expect(page.getByRole('alert')).toContainText("Ce pseudo Minecraft est invalide.");

    })
});

