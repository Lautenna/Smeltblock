import { expect } from "@playwright/test";

export class PaiementStripe {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.codeLink = {
            code1: page.getByTestId('sms-code-input-0'),
            code2: page.getByTestId('sms-code-input-1'),
            code3: page.getByTestId('sms-code-input-2'),
            code4: page.getByTestId('sms-code-input-3'),
            code5: page.getByTestId('sms-code-input-4'),
            code6: page.getByTestId('sms-code-input-5'),
        }
        this.boutonPaiement = page.getByTestId('hosted-payment-submit-button')

        this.boutonSansLink = page.getByRole('button', { name: 'Pay without Link' })
        this.boutonCarte = page.getByTestId('card-accordion-item-button')
        this.boutonPayer = page.getByTestId('hosted-payment-submit-button')

        this.champsDePaiement = {
            carte: page.getByRole('textbox', { name: 'Card number' }),
            expiration: page.getByRole('textbox', { name: 'Expiration' }),
            code: page.getByRole('textbox', { name: 'Credit or debit card CVC/CVV' }),
            nomTitulaire: page.getByRole('textbox', { name: 'Cardholder name' }),
            adresse: page.getByRole('combobox', { name: 'Address' })
        }


    }

    async remplirCodeTestingFonctionnel() {
        await this.codeLink.code1.fill("0")
        await this.codeLink.code2.fill("0")
        await this.codeLink.code3.fill("0")
        await this.codeLink.code4.fill("0")
        await this.codeLink.code5.fill("0")
        await this.codeLink.code6.fill("0")
    }

    async validerPaiement() {
        await expect(this.codeLink.code1).toBeHidden()
        await expect(this.boutonPaiement).toBeVisible()
        await this.page.waitForTimeout(500);
        await this.boutonPaiement.dispatchEvent("click");
    }

    async paiementSansLink() {
        await this.boutonSansLink.click();
        await this.page.waitForTimeout(500);
        await this.boutonCarte.dispatchEvent('click');
    }

    async remplirInformationPaiement() {
        await this.champsDePaiement.carte.fill("4000 0000 0000 0002")
        await this.champsDePaiement.expiration.fill("12/30")
        await this.champsDePaiement.code.fill("400")
        await this.champsDePaiement.nomTitulaire.fill("Potier")
        await this.champsDePaiement.adresse.fill("70 rue du Potier")
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter')
    }

    async paiementManuel() {
        await this.page.waitForTimeout(1000);
        await this.boutonPayer.click();

    }
}