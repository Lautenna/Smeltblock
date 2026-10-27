
export class MesVotes {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.premierSite = page.locator('[data-controller~="vote--gateway-site"]').first()
        this.secondSite = page.locator('[data-controller~="vote--gateway-site"]').nth(1)
        this.troisièmeSite = page.locator('[data-controller~="vote--gateway-site"]').nth()
    }

    async simulerSession(scenario) {
        return await this.page.request.post('/vote/_e2e/session', {
            data: { scenario },
        })
    }

    async cliquerSurLeSite(numeroSite = 1) {
        numeroSite -= 1
        this.page.locator('[data-controller~="vote--gateway-site"]').nth(numeroSite).click()
    }


}

