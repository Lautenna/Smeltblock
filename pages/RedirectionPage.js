import { PiedDePage } from "./components/PiedDePage";
import { BarreNavigation } from "./components/BarreNavigation";
import { LiensAccueil } from "./components/LiensAccueil";

export class RedirectionPage {
    constructor(page) {
        this.page = page;

        this.piedDePage = new PiedDePage(page)
        this.barreNavigation = new BarreNavigation(page)
        this.liensAccueil = new LiensAccueil(page)
    }
}
