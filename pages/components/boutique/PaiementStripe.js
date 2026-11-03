import { expect } from "@playwright/test";

export class PaiementStripe {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.code1 = page.getByTestId('sms-code-input-0')
        this.code2 = page.getByTestId('sms-code-input-1')
        this.code3 = page.getByTestId('sms-code-input-2')
        this.code4 = page.getByTestId('sms-code-input-3')
        this.code5 = page.getByTestId('sms-code-input-4')
        this.code6 = page.getByTestId('sms-code-input-5')
        this.boutonPaiement = page.getByTestId('hosted-payment-submit-button')


    }

    async remplirCodeTesting() {
        await this.code1.fill("0")
        await this.code2.fill("0")
        await this.code3.fill("0")
        await this.code4.fill("0")
        await this.code5.fill("0")
        await this.code6.fill("0")
    }

    async validerPaiement() {
        await expect(this.code1).toBeHidden()
        await expect(this.boutonPaiement).toBeVisible()
        await this.page.waitForTimeout(500);
        await this.boutonPaiement.dispatchEvent("click");
    }
}