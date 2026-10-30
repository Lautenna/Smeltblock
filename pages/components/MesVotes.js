
import { expect } from '@playwright/test'

export class MesVotes {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        // Inclure les sites indisponibles pour conserver leur position dans la liste.
        this.sites = page.locator('.item-vote, .item-vote-neutral')
        this.premierSite = this.sites.first()
        this.secondSite = this.sites.nth(1)
        this.troisièmeSite = this.sites.nth(2)
    }

    async simulerSession(scenario) {
        return await this.page.request.post('/vote/_e2e/session', {
            data: { scenario },
        })
    }

    async attendreFinChargement() {
        await expect(this.premierSite).toBeVisible()
        await expect(this.page.locator(
            '#voteGateway[busy], .item-vote[busy], .item-vote-neutral[busy]'
        )).toHaveCount(0)
    }

    async ouvrirSite(numeroSite = 1) {
        const site = this.sites.nth(numeroSite - 1)
        await this.attendreFinChargement()
        // Le bouton ne reçoit pas les clics : son bloc HTML est la zone cliquable.
        await site.filter({
            has: this.page.getByRole('button', { name: 'VOTER', exact: true }),
        }).click()
        await expect(site.getByRole('button', { name: 'VÉRIFIER', exact: true })).toBeVisible()
    }

    async verifierVote(numeroSite = 1) {
        const site = this.sites.nth(numeroSite - 1)
        await this.attendreFinChargement()
        await site.filter({
            has: this.page.getByRole('button', { name: 'VÉRIFIER', exact: true }),
        }).click()
        await this.attendreFinChargement()
        await expect(site.getByRole('button', { name: 'VÉRIFIER', exact: true })).toBeHidden()
    }

}

