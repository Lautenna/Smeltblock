import { AuthentificationBoutique } from "./components/boutique/AuthentificationBoutique";
import { PanierSmeltcoins } from "./components/boutique/PanierSmeltcoins";
import { PaiementStripe } from "./components/boutique/PaiementStripe";
import { Grades } from "./components/boutique/Grades";


export class BoutiquePage {
    constructor(page) {
        this.page = page;

        this.authentification = new AuthentificationBoutique(page)
        this.panier = new PanierSmeltcoins(page)
        this.paiementStripe = new PaiementStripe(page)
        this.grades = new Grades(page)

    }
}