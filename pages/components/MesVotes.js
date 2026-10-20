
export class MesVotes {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.premierSite = page.locator('[data-controller~="vote--gateway-site"]').first()
    }

    async simulerSession(scenario) {
        return await this.page.request.post('/vote/_e2e/session', {
            data: { scenario },
        })
    }

    async cliquerSurLeSite() {
        await this.premierSite.click()
    }

}

