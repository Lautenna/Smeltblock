# Smeltblock – Tests end-to-end

[![Playwright Tests](https://github.com/Lautenna/Smeltblock/actions/workflows/playwright.yml/badge.svg)](https://github.com/Lautenna/Smeltblock/actions/workflows/playwright.yml)

Suite de tests automatisés **Playwright** pour le site du serveur Minecraft **Smeltblock**.
Elle vérifie les parcours clés d'un joueur : navigation, vote et récompenses, boutique (grades, panier, cadeaux, paiement Stripe), connexion par pseudo, cookies et liens vers les réseaux sociaux.

> ⚠️ Les tests s'exécutent contre une **préproduction déjà déployée**, protégée par une authentification HTTP basic : il n'y a ni serveur local, ni build.

## De Squash au code

Les cas de test sont écrits dans **Squash TM** (outil de gestion de cas de test), avec des exigences et des cas organisés dans les mêmes dossiers. Chaque test de ce dépôt correspond à un cas défini dans Squash.

| Dans Squash | Dans le code |
|-------------|--------------|
| Référence `TC_<ZONE>_<NNN>` + nom | Titre du `test()` : `TC_VOTE_001 Voir le top des voteurs de la semaine` |
| Prérequis (état de départ) | `beforeEach` |
| Pas (action + résultat attendu) | `test.step('Étant donné … / Quand … / Alors …')` |
| Jeu de données | Tableau dans `tests/data_test/` |

## Ce qui est testé

| Zone | Préfixe | Ce qui est vérifié |
|------|---------|--------------------|
| Navigation | `TC_NAVI` | Pages Wiki et Actus, copie de l'IP du serveur, redirections vers le Wiki et le Discord |
| Redirections | `TC_REDI` | Liens du pied de page et de la barre de navigation vers les réseaux sociaux, mentions légales |
| Connexion | `TC_CONN` | Connexion avec un pseudo valide, pseudo inconnu refusé, pseudo vide |
| Vote | `TC_VOTE` | Top des voteurs de la semaine, blocage du vote depuis une même IP, avancement et réception des récompenses (paliers et top vote) |
| Grades | `TC_GRAD` | Prix dégressif selon le grade déjà possédé, ajout automatique de MVP+ avec Élite |
| Panier | `TC_PANI` | Mise à jour du panier en Smeltcoins |
| Cadeaux | `TC_CADE` | Cadeau de Smeltcoins ou de grade pour un ami |
| Paiement | `TC_PAIE` | Paiement réussi ou en échec via le formulaire Stripe, validation bloquée si e-mail ou case manquant |
| Cookies | `TC_COOK` | Fermeture de la pop-up de cookies (composant partagé par les autres tests) |

## Stack

- [Playwright Test](https://playwright.dev) – exécution des tests sur **Chromium, Firefox et WebKit**
- JavaScript
- [mariadb](https://github.com/mariadb-corporation/mariadb-connector-nodejs) – accès direct à la base du site pour préparer et nettoyer les données de test
- [dotenv](https://github.com/motdotla/dotenv) – chargement des secrets en local
- GitHub Actions – intégration continue

## Architecture

```
.
├── pages/                     # Page Objects : une page compose des composants
│   ├── VotePage.js
│   ├── BoutiquePage.js
│   ├── WikiPage.js
│   ├── ActusPage.js
│   ├── RedirectionPage.js
│   └── components/            # Composants d'UI réutilisables
│       ├── MesVotes.js, TopVoteurs.js, RecompensesDeVote.js, ...
│       └── boutique/          # Grades, PanierSmeltcoins, PaiementStripe, ...
├── tests/
│   ├── navigationSite.spec.js        # TC_NAVI
│   ├── redirectionDePage.spec.js     # TC_REDI
│   ├── authentification.spec.js      # TC_CONN
│   ├── cookiesPopup.spec.js
│   ├── vote.spec.js                  # TC_VOTE
│   ├── boutique/                     # TC_GRAD, TC_PANI, TC_CADE, TC_PAIE
│   ├── data_test/                    # Jeux de données séparés des scénarios
│   └── helpers/db.js                 # Pool MariaDB partagé
├── scripts/codegen.js         # Codegen Playwright avec l'auth HTTP
├── playwright.config.js
└── .github/workflows/playwright.yml
```

### Choix de conception

- **Page Object Model par composants** : les locators vivent dans `pages/`. Une page (`VotePage`) assemble des composants (`MesVotes`, `TopVoteurs`), et le test appelle `page.composant.methode()`. Un nouveau morceau d'UI = un nouveau composant.
- **Données préparées en base** : les tests de vote insèrent leurs propres lignes dans `vote__vote` et les suppriment après, au lieu de dépendre de l'état du site.
- **Lisibilité Gherkin** : chaque test est découpé en `test.step('Étant donné … / Quand … / Alors …')`, en français, pour que le rapport se lise comme une spécification.
- **Locators stables** : `getByTestId` (`classement-1`, `palier-N`) plutôt que les classes Tailwind, qui changent avec le style.
- **Nommage** : `TC_<ZONE>_<NNN>_description` pour retrouver et filtrer un test facilement (`-g "TC_VOTE"`).

## Installation

Prérequis : [Node.js](https://nodejs.org) (LTS), un accès à la base MariaDB du site et les identifiants de la préproduction.

```bash
git clone https://github.com/Lautenna/Smeltblock.git
cd Smeltblock
npm ci
npx playwright install --with-deps
```

### Configuration

Crée un fichier `.env` à la racine (jamais versionné) à partir du modèle :

```bash
cp .env.example .env
```

```env
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_NAME=
```

Sans `.env`, les tests de vote échouent dès leur préparation. En CI, les mêmes valeurs sont lues depuis les secrets GitHub `DB_HOST`, `DB_USER`, `DB_PASSWORD` et `DB_NAME`.

L'URL de la préproduction (`baseURL`) et son authentification HTTP sont dans `playwright.config.js`. Le script `scripts/codegen.js` les reprend : à garder synchronisés.

## Lancer les tests

```bash
npx playwright test                                # tous les tests, tous les navigateurs
npx playwright test --project=chromium             # un seul navigateur
npx playwright test tests/vote.spec.js             # un seul fichier
npx playwright test -g "TC_VOTE_003"               # par titre / préfixe
npx playwright test --ui                           # mode interactif
npx playwright show-report                         # ouvrir le dernier rapport HTML
npm run codegen -- /vote                           # repérer des locators à la main
```

## Points d'attention

La base est **partagée et réelle**. Quelques règles pour éviter les faux échecs :

- Les tests s'exécutent **un à la fois** (`workers: 1`). Éviter de lancer deux exécutions en même temps sur la même base.
- La contrainte `uniq_vote_dedup` refuse deux votes du même joueur à la même seconde. Les dates de vote du jeu de données sont décalées d'une seconde chacune (jusqu'à ~1 min dans le futur). Une ligne ajoutée à la main doit avoir une date distincte.
- Une exécution interrompue peut laisser des lignes et provoquer `Duplicate entry ... uniq_vote_dedup`. Le nettoyage par `player_uuid` (`TEST_UUIDS`) avant chaque test les supprime.
- Si un compteur de `jddVote()` change, mettre à jour le classement attendu dans `TC_VOTE_001`.
- La connexion utilise un **vrai pseudo Minecraft** : un pseudo inventé n'est pas accepté.

## Intégration continue

Le workflow [`playwright.yml`](.github/workflows/playwright.yml) se déclenche à chaque `push` et `pull request` sur `main` / `master` :

1. lance une matrice **chromium, firefox, webkit**, un navigateur après l'autre (`max-parallel: 1`) pour ménager la base et la préprod ;
2. installe les dépendances et le navigateur du job ;
3. exécute la suite avec les secrets de base de données ;
4. publie le rapport HTML de chaque navigateur en artefact (conservé 30 jours).

Un échec sur un navigateur n'empêche pas de tester les suivants. Les échecs sont rejoués 2 fois, avec une trace Playwright à la première relance.

## Auteure

**Laura** – [@Lautenna](https://github.com/Lautenna)
