// Réponse du composant Live Vote:Gateway pour un pseudo inconnu.
// Le HTML doit garder le conteneur racine (#voteGateway) : Live Component remplace le composant en entier.
export const reponseJoueurInexistant = `
<div data-controller="vote--gateway live" class="group busy:frozen flex-col w-full min-w-0 max-w-screen-sm gap-md w-full px-md" id="voteGateway" data-live-name-value="Vote:Gateway" data-live-url-value="/_components/Vote:Gateway" data-live-listeners-value="[{&quot;action&quot;:&quot;fetchVoteData&quot;,&quot;event&quot;:&quot;hasVoted&quot;}]" data-live-props-value="{&quot;isLogged&quot;:false,&quot;inputUsername&quot;:&quot;Lechatsauvage&quot;,&quot;nbWeeklyVotes&quot;:0,&quot;weeklyRank&quot;:0,&quot;ipv4&quot;:&quot;&quot;,&quot;ipv6&quot;:&quot;&quot;,&quot;@attributes&quot;:{&quot;id&quot;:&quot;voteGateway&quot;,&quot;class&quot;:&quot;w-full px-md&quot;}}">
    <div class="bg-danger/10 border border-danger text-danger rounded-default px-sm py-xs text-sm font-bold" role="alert" aria-live="assertive">
        Ce joueur n&#039;existe pas.
    </div>
    <form class="flex-col sm:flex-row items-stretch gap-xs w-full mx-auto" data-action="submit->vote--gateway#login">
        <input class="h-12 border px-xs border-2 border-faint bg-surface-tint1 rounded-default tracking-tighter w-full min-w-0" data-model="norender|inputUsername" id="inputUsername" aria-label="Pseudo Minecraft Java" autocomplete="username" type="text" placeholder="Ton pseudo ici…" data-action="keydown.enter->vote--gateway#login">
        <button class="button button-primary w-full" type="submit">CONNEXION</button>
    </form>
</div>`;
