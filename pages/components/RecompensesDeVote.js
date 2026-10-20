
import { expect } from '@playwright/test'

export class RecompensesDeVote {
    constructor(page) {
        this.page = page;
    }

    palier(numero) {
        return this.page.getByTestId(`palier-${numero}`)
    }

    pastille(numero) {
        return this.palier(numero).locator('.size-xl')
    }

    async assertDebloque(numero) {
        await expect(this.pastille(numero)).toHaveClass(/bg-brand-accent/)
    }

    async assertVerrouille(numero) {
        await expect(this.pastille(numero)).toHaveClass(/bg-surface-tint2/)
    }
    async assertEnCours(numero) {
    await expect(this.pastille(numero)).toHaveClass(/bg-brand-primary/)
}
}
