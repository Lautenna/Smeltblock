import { MesVotes } from "./components/MesVotes";
import { TopVoteurs } from "./components/TopVoteurs";
import { RecompensesDeVote } from "./components/RecompensesDeVote";

export class VotePage {
    constructor(page) {
        this.page = page;

        this.mesVotes = new MesVotes(page)
        this.topVoteurs = new TopVoteurs(page)
        this.recompensesDeVote = new RecompensesDeVote(page)

    }
}