export class Ip {
    constructor(page) {
        this.page = page;

        this.BoutonIp = page.getByRole('banner').getByRole('button', { name: 'Copier l’adresse du serveur' })
        

    }

     async CopierIp() {
        await this.BoutonIp.click()
    }
}