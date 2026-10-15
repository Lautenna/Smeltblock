
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

    async estDebloque(numero) {
        await expect(this.pastille(numero)).toHaveClass(/bg-brand-accent/)
    }

    async estVerrouille(numero) {
        await expect(this.pastille(numero)).toHaveClass(/bg-surface-tint2/)
    }
    async estEnCours(numero) {
    await expect(this.pastille(numero)).toHaveClass(/bg-brand-primary/)
}
}
