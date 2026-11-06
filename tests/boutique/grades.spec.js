import { test, expect } from '@playwright/test';
import { BoutiquePage } from '../../pages/BoutiquePage.js';
import { CookiesPopup } from '../../pages/components/CookiesPopup.js';


let boutiquePage;

test.beforeEach(async ({ page }) => {
    boutiquePage = new BoutiquePage(page);
    await boutiquePage.ongletBoutique.allerSurOnglet('grades')
    await (new CookiesPopup(page)).refuserCookies()
    await boutiquePage.authentification.seConnecterBoutique()
})

test('TC_GRAD_001 Prix dégressif si le joueur possède déjà un grade', async ({ page }) => {
    await test.step('Étant donné un visiteur peut voir son grade déja possédé', async () => {
        await expect(page.getByText('⌞MVP⌝')).toBeVisible()
        await expect(page.getByRole('tabpanel', { name: 'Grades Avantages à vie' })).toContainText('DÉJÀ MVP')
    })

    await test.step('Étant donné un visiteur veut prendre le grade MVP+ avec un tarif dégressif', async () => {
        await expect(boutiquePage.grades.carteMvpPlus).toBeVisible()
        await expect(boutiquePage.grades.carteMvpPlus).toContainText('49,99 € 20,00 €')
        await boutiquePage.grades.ajouterGrade('mvpPlus')
        await expect(page.getByText('1x MVP+ 20,00 €')).toBeVisible()

    })
})

test('TC_GRAD_002 Élite ajoutent automatiquement MVP+ au panier', async ({ page }) => {
    await test.step('Étant donné un visiteur peut voir son grade déja possédé', async () => {
        await expect(page.getByText('⌞MVP⌝')).toBeVisible()
        await expect(page.getByRole('tabpanel', { name: 'Grades Avantages à vie' })).toContainText('DÉJÀ MVP')
    })

    await test.step('Étant donné un visiteur veut prendre le grade Elite, doit avoir MVP+', async () => {
        await boutiquePage.grades.ajouterGrade('autresGrades')
        await boutiquePage.grades.ajouterGrade('elite')
        await expect(page.getByText('1x MVP+ 20,00 €')).toBeVisible()
        await expect(page.getByText('1x ÉLITE 49,99 €')).toBeVisible()
        await expect(page.getByText('Total 69,99 €')).toBeVisible()
    })
})