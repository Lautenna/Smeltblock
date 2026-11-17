import { expect } from "@playwright/test";

export class PaiementStripe {
    /** @param {import("@playwright/test").Page} page */
    constructor(page) {
        this.page = page;
        this.stripeFormulaire = page.frameLocator('iframe[title="Secure embedded form frame"]')
        this.codeLink = this.stripeFormulaire.getByTestId('code-controlling-input')
        this.boutonPaiement = this.stripeFormulaire.getByTestId('payment-form-submit-button')

        this.boutonSansLink = this.stripeFormulaire.getByRole('button', { name: 'Pay without Link' })
        this.boutonCarte = this.stripeFormulaire.locator('css=[data-value="card"]')
        this.boutonPayer = this.stripeFormulaire.getByTestId('payment-form-submit-button')

        this.champsDePaiement = {
            carte: this.stripeFormulaire.getByRole('textbox', { name: 'Card number' }),
            expiration: this.stripeFormulaire.getByRole('textbox', { name: 'Expiration' }),
            code: this.stripeFormulaire.locator('#payment-cvcInput'),
            nomTitulaire: this.stripeFormulaire.locator('#billingAddress-nameInput'),
            adresse: this.stripeFormulaire.locator('#billingAddress-addressLine1Input'),
            adresseManuelle: this.stripeFormulaire.getByText('Enter address manually'),
            codePostal: this.stripeFormulaire.locator('#billingAddress-postalCodeInput'),
            ville: this.stripeFormulaire.locator('#billingAddress-localityInput'),
        }
    }

    async attendreChargementStripe() {
        // Chargement colonne gauche
        await expect(this.page.getByTestId('order-summary-column')).toBeVisible()
        // Chargement colonne droite (dans iframe)
        await expect(this.stripeFormulaire.locator('div').first()).toBeVisible()
    }

    async remplirCodeTestingFonctionnel() {
        await expect(this.codeLink).toBeEnabled()
        await this.codeLink.fill('000000')
    }

    async validerPaiement() {
        await expect(this.codeLink).toBeHidden()
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
        await this.page.keyboard.press('Tab')
        await this.champsDePaiement.codePostal.fill("75001")
        await this.champsDePaiement.ville.fill("Paris")
        await this.page.waitForTimeout(1000);
        await this.page.keyboard.press('Enter')
    }

    async paiementManuel() {
        await expect(this.boutonPayer).toBeEnabled();
        await this.boutonPayer.click();

    }
}