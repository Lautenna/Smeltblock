import { ReseauSocial } from "./components/ReseauxSociaux";
import { InformationsLegales } from "./components/InformationsLegales";


export class RedirectionPage {
    constructor(page) {
        this.page = page;

        this.ReseauSocial = new ReseauSocial(page)
        this.InformationsLegales = new InformationsLegales(page)

    }
}