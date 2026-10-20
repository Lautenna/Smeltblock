export class Ip {
    constructor(page) {
        this.page = page;

        this.boutonIp = page.getByRole('banner').getByRole('button', { name: 'Copier l’adresse du serveur' })
        

    }

     async copierIp() {
        await this.boutonIp.click()
    }
}