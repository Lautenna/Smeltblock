# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

Tests E2E Playwright (JavaScript) du site Minecraft Smeltblock (pages vote, boutique, wiki, etc.). Pas de code applicatif : uniquement des tests, des Page Objects et un accès direct à la base MariaDB du site pour préparer les données. Le code, les noms de tests et les commentaires sont en français.

## Commandes

- Tout lancer : `npx playwright test`
- Un fichier : `npx playwright test tests/utils/vote.spec.js`
- Un test par nom : `npx playwright test -g "TC_VOTE_003"` (le `beforeAll` du fichier s'exécute quand même)
- Un seul navigateur : `--project=chromium`
- Rapport HTML : `npx playwright show-report`
- Repérer des locators à la main : `npm run codegen -- /vote` (ouvre Chromium avec l'auth HTTP et l'Inspector, voir [scripts/codegen.js](scripts/codegen.js))

Pas de lint ni de build. La CI ([.github/workflows](.github/workflows)) lance `npx playwright test` sur push/PR vers main.

## Configuration

- Le site testé est une préproduction derrière une auth HTTP basic : `baseURL` et `httpCredentials` sont écrits en dur dans [playwright.config.js](playwright.config.js). Le script codegen les duplique, à garder synchronisés.
- Pour élaborer ou vérifier un test, consulter le site en ligne : https://azure-pelican-926599.hostingersite.com (pages, textes, comportements réels, locators). Le contenu public se lit avec `WebFetch` ; pour voir le DOM rendu ou les `data-testid`, utiliser le navigateur Playwright MCP.
- Les helpers DB lisent `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` depuis `.env` (modèle : `.env.example`, ignoré par git). Sans `.env`, les tests de vote échouent dans leur `beforeAll`.
- Le config tourne sur 3 projets (chromium, firefox, webkit) avec `fullyParallel: true`.

## Architecture

- `tests/utils/*.spec.js` : un fichier par zone du site. Les `test.step` portent des phrases « Étant donné ... ». Les tests sont nommés `TC_<ZONE>_<NNN>_<description>`.
- `pages/` : Page Objects. Une page (`VotePage`, `RedirectionPage`) compose des **composants** de `pages/components/` (`MesVotes`, `TopVoteurs`, `RecompensesDeVote`, `Authentification`, ...). Le test crée la page dans `beforeEach` puis passe par `page.composant.methode()`. Un nouveau morceau d'UI = un composant, branché dans la page qui l'utilise.
- `tests/helpers/db.js` : pool MariaDB partagé (`query`, `insertMany`, `deleteWhere`, `closeDb`). Fichier CommonJS-compatible, pas d'import nommé depuis `node -e` en ESM.
- `tests/data_test/vote.data.js` : jeux de données de vote (`jddVote()`, UUID des joueurs, `TEST_UUIDS`).

## Données de test de vote (piège principal)

- `vote.spec.js` insère des lignes dans `vote__vote` en `beforeAll` et les supprime par `player_uuid` (`TEST_UUIDS`) en `afterAll`. Les assertions de TC_VOTE_001 dépendent des nombres de votes de `jddVote()` : si tu changes un compteur, mets à jour le classement attendu.
- La contrainte `uniq_vote_dedup` refuse deux votes du même joueur à la même seconde. `randomRegisteredAt()` décale chaque vote d'une seconde (donc des dates jusqu'à ~1 min dans le futur). Une ligne ajoutée à la main doit avoir une date distincte de ces créneaux.
- La base est partagée et réelle : des lancements parallèles ou interrompus laissent des lignes qui provoquent des erreurs `Duplicate entry ... uniq_vote_dedup`. Pour ces fichiers, préférer un `deleteWhere` avant l'`insertMany` du `beforeAll` et limiter l'exécution à un navigateur (`--project=chromium`).
- La connexion utilise un vrai pseudo Minecraft (`connexionValide()` connecte WarnD). Un pseudo inventé n'est pas accepté.
- `/vote/_e2e/session` (POST `{ scenario }`, méthode `MesVotes.simulerSession`) force l'état d'une session de vote (`confirmed`, `not_found`, `unavailable`).

## Locators

Préférer `getByTestId` (ex. `classement-1`, `palier-N`) aux classes Tailwind, qui changent avec le style. Pour les paliers de récompense, l'état se lit sur les classes : `bg-brand-accent` (débloqué, jaune), `bg-surface-tint2` (verrouillé, bleu).
