import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';
import { selectLast, deleteLast } from '../helpers/db.js';

let boutiquePage;
test.beforeEach(async ({ page }) => {
    boutiquePage = new BoutiquePage(page);
    await page.goto('/boutique');
    await (new CookiesPopup(page)).refuserCookies()
    await boutiquePage.authentification.seConnecterBoutique('Youtyxx','Yvanor')
})

test('TC_CADE_001 Cadeau de Smeltcoins pour un ami', async ({ page }) => {
    await test.step("Navigation sur l'onglet Smelcoins de la boutique", async () => {
        await page.getByRole('tab', { name: 'Smeltcoins Monnaie du serveur' }).click();
        await expect(page).toHaveURL('/boutique/smeltcoins')
    })

    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide sur la page boutique et ajouter un ami', async () => {
        await expect(page.getByText('Yvanor')).toBeVisible();
    })

    await test.step('Étant donné un visiteur peut ajouter des Smeltcoins à son panier', async () => {
        await boutiquePage.panier.ajouterPacks(10000)
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible();
        await expect(page.getByText('Total 9,99 €')).toBeVisible();
        await boutiquePage.panier.validerPaiementPage()

    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await expect(page.getByText('1x 1000 Smeltcoins 9,99 €')).toBeVisible()
        await expect(page.getByText('Total 9,99 €')).toBeVisible()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('1000 Smeltcoins')).toBeVisible()
        await expect(page.getByText('Total due€9.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTesting()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 10_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiquesmeltcoins1000 Yvanor')
    })

})

test("TC_CADE_002 Cadeau d'un grade pour un ami", async ({ page }) => {
    let boutiquePage = new BoutiquePage(page);
    await deleteLast('plugin__commands');
    await page.goto('/boutique');
    await (new CookiesPopup(page)).refuserCookies()

    await test.step("Navigation sur l'onglet grades de la boutique", async () => {
        await page.getByRole('tab', { name: 'Grades Avantages à vie' }).click()
        await expect(page).toHaveURL('/boutique/grades')
    })

    await test.step('Étant donné un visiteur peut se connecter avec un pseudo Minecraft valide sur la page boutique et ajouter un ami', async () => {
        await expect(page.getByText('Yvanor')).toBeVisible();
    })

    await test.step('Étant donné un visiteur peut voir son grade déja possédé', async () => {
        await expect(page.getByText('⌞MVP+⌝')).toBeVisible()
        await expect(page.getByRole('tabpanel', { name: 'Grades Avantages à vie' })).toContainText('DÉJÀ MVP+')
    })

    await test.step('Étant donné un visiteur veut prendre le grade Elite pour son ami', async () => {
        await boutiquePage.grades.cliquerSurAutresGrades()
        await boutiquePage.grades.cliquerSurboutonEliteOffert()
        await expect(page.getByText('1x ÉLITE 49,99 €')).toBeVisible()
        await expect(page.getByText('Total 49,99 €')).toBeVisible()
        await boutiquePage.panier.validerPaiementPage()
    })

    await test.step('Étant donné un visiteur peut valider son panier email', async () => {
        await expect(page.getByText('1x ÉLITE 49,99 €')).toBeVisible()
        await expect(page.getByText('Total 49,99 €')).toBeVisible()
        await boutiquePage.panier.validerPanier()
        await expect(page).toHaveURL(/checkout.stripe.com/)
    })

    await test.step('Étant donné un visiteur peut payer via stripe', async () => {
        await expect(page.getByText('ÉLITE')).toBeVisible()
        await expect(page.getByText('Total due€49.99')).toBeVisible()

        await boutiquePage.paiementStripe.remplirCodeTesting()
        await boutiquePage.paiementStripe.validerPaiement()

        await expect(page).toHaveURL(/merci/, { timeout: 10_000 })
        await expect(page.getByRole('heading')).toContainText('Merci pour ta commande !')
    })

    await test.step('Le paiement est passé', async () => {
        const paimentPanier = await selectLast('plugin__commands', 'id')
        console.log(paimentPanier)
        await expect(paimentPanier.command).toEqual('3achatboutiqueelite Yvanor')
    })

})
