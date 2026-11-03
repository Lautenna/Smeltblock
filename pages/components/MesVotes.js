import { expect } from '@playwright/test';

// États du composant Vote:GatewaySite (data-vote--gateway-site-current-state-value)
const ETAT = 'data-vote--gateway-site-current-state-value'
const STATE_AVAILABLE = '1'
const STATE_TOO_SOON = '5'

export class MesVotes {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.premierSite = page.locator('[data-controller~="vote--gateway-site"]').first()
        this.secondSite = page.locator('[data-controller~="vote--gateway-site"]').nth(1)
        this.troisièmeSite = page.locator('[data-controller~="vote--gateway-site"]').nth(2)
    }

    async simulerSession(scenario) {
        return await this.page.request.post('/vote/_e2e/session', {
            data: { scenario },
        })
    }

    // Clique sur un site et attend que le serveur ait répondu (l'état du composant change).
    // - Après un reload, les composants Live re-postent resetForSessionChange : un clic pendant ces requêtes
    //   est écrasé (surtout sous WebKit), on attend donc que le réseau se calme.
    // - Le serveur limite la cadence et répond parfois « Pas encore disponible » (état 5, effacé ~2 s plus tard
    //   par resetFeedback) à l'ouverture comme à la vérification. On rejoue alors le parcours depuis le début
    //   jusqu'à l'étape voulue.
    async cliquerSurLeSite(numeroSite = 1) {
        const site = this.page.locator('[data-controller~="vote--gateway-site"]').nth(numeroSite - 1)

        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { })
        const etapeVisee = await site.getAttribute(ETAT)

        for (let tentative = 0; tentative < 5; tentative++) {
            if (etapeVisee !== STATE_AVAILABLE && await site.getAttribute(ETAT) === STATE_AVAILABLE) {
                // le site est revenu à « VOTER » après un refus : on refait l'ouverture
                await site.click()
                await expect(site).not.toHaveAttribute(ETAT, STATE_AVAILABLE)
                if (await site.getAttribute(ETAT) === STATE_TOO_SOON) {
                    await expect(site).toHaveAttribute(ETAT, STATE_AVAILABLE, { timeout: 10_000 })
                    continue
                }
            }

            const avant = await site.getAttribute(ETAT)
            await site.click()
            await expect(site).not.toHaveAttribute(ETAT, avant)
            if (await site.getAttribute(ETAT) !== STATE_TOO_SOON) return

            await expect(site).toHaveAttribute(ETAT, STATE_AVAILABLE, { timeout: 10_000 })
        }
    }

}
