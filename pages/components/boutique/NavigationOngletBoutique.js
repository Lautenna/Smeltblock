import { expect } from '@playwright/test';
import { url } from 'node:inspector';


export class NavigationOngletBoutique {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.tabSmeltcoins = page.getByRole('tab', { name: 'Smeltcoins' })
        this.tabGrades = page.getByRole('tab', { name: 'Grades' })
        this.tabDons = page.getByRole('tab', { name: 'Dons' })
    }


    async allerSurOnglet(onglet) {
        await this.page.goto('/boutique');
        if (onglet === 'grades') {
            await this.tabGrades.click()
            await expect(this.page).toHaveURL('/boutique/grades')
        } else if (onglet === 'smeltcoins') {
            await this.tabSmeltcoins.click()
            await expect(this.page).toHaveURL('/boutique/smeltcoins')
        } else if (onglet === 'dons') {
            await this.tabDons.click()
            await expect(this.page).toHaveURL('/boutique/dons')
        }

    }
}