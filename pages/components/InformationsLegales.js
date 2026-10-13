export class InformationsLegales {
constructor(page){
    this.page = page;
    this.mentionsLegales = this.page.getByRole('link', { name: 'Mentions légales' })
    this.cgu = this.page.getByRole('link', { name: 'CGU' })
    this.cgv = this.page.getByRole('link', { name: 'CGV' })
    this.confidentialite = this.page.getByRole('link', { name: 'Confidentialité', exact: true })
}
async redirectionMentionsLegales() {
        await this.mentionsLegales.click()

}

async redirectionCGU() {
        await this.cgu.click()
}

async redirectionCGV() {
        await this.cgv.click()
}

async redirectionConfidentialite() {
        await this.confidentialite.click()
}

}
