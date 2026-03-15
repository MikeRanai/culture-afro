# Regles Universelles - Developpement Web Moderne

> Guide de reference extrait de +50 sessions de developpement en production.
> Applicable a tout projet web (Next.js, React, Vue, etc.)

---

## Table des matieres

1. [Securite](#1-securite)
2. [Responsivite & Mobile](#2-responsivite--mobile)
3. [UX / UI](#3-ux--ui)
4. [Accessibilite (a11y)](#4-accessibilite-a11y)
5. [Performance](#5-performance)
6. [CSS & Styling](#6-css--styling)
7. [Formulaires & Inputs](#7-formulaires--inputs)
8. [Navigation](#8-navigation)
9. [Gestion des Erreurs](#9-gestion-des-erreurs)
10. [Integrite des Donnees](#10-integrite-des-donnees)
11. [Architecture & Scalabilite](#11-architecture--scalabilite)
12. [SEO & Meta](#12-seo--meta)
13. [Tests & Qualite](#13-tests--qualite)
14. [Deploiement & DevOps](#14-deploiement--devops)
15. [Checklist Pre-Production](#15-checklist-pre-production)

---

## 1. Securite

### 1.1 Authentification

- **Hashage des mots de passe** : Argon2id avec PEPPER externe (variable d'environnement, jamais en base)
  - En serverless (Vercel, AWS Lambda) : `memoryCost: 2^14` (16 MB), `timeCost: 3`, `parallelism: 1`
  - Sur serveur dedie : `memoryCost: 2^16` (64 MB), `parallelism: 4`
  - **Piege vecu** : 64 MB de memoire cause des OOM (Out of Memory) sur les conteneurs serverless limites a 128 MB
- **Protection brute-force** : compteur `loginAttempts` + verrouillage temporaire (`lockUntil`)
  - Regle recommandee : 5 echecs = 15 min de blocage
- **CAPTCHA** : Cloudflare Turnstile ou hCaptcha. Bypass automatique en `NODE_ENV === 'development'`
- **Secret JWT/Session** : minimum 32 caracteres, genere avec `openssl rand -base64 32`

### 1.2 En-tetes HTTP de Securite (OBLIGATOIRES)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
```

### 1.3 Validation des Entrees

- **Zod (ou equivalent) sur TOUTES les entrees** cote client ET serveur
- Ne jamais faire confiance aux donnees du client
- Patterns recommandes :
  - Texte : `.trim()`, `.min(1)`, `.max(longueur_raisonnable)`
  - Montants : `.positive()`, `.max(999_999_999)`
  - Dates : regex ou parseur strict
  - IDs : `.uuid()` ou format attendu

### 1.4 Upload de Fichiers

- **Whitelist MIME** : `['image/jpeg', 'image/png', 'image/webp', 'application/pdf']`
- **Prevention path traversal** : sanitiser le nom de fichier (supprimer `../`, `/`, `\`, caracteres speciaux)
- **Taille max** : definir une limite explicite (ex: 5 MB)
- **Chemin de stockage** : inclure un identifiant unique (timestamp, UUID)

### 1.5 Rate Limiting

- Implementer sur toutes les routes POST/PUT/DELETE
- Recommandation : 100 req/min par IP
- Stack : Redis distribue (Upstash) avec fallback in-memory

### 1.6 Protection des Donnees (RGPD)

- Fichiers sensibles (medical, bancaire) dans un bucket PRIVE
- Ne JAMAIS logger de donnees sensibles dans les logs d'audit
- Liste de champs sensibles a masquer : `['password', 'rib', 'iban', 'medicalInfo', 'token']`
- Soft delete INSUFFISANT pour le droit a l'oubli : prevoir une procedure de suppression reelle
- Prevoir un export de donnees (JSON/CSV) pour le droit a la portabilite

### 1.7 Minimisation des Donnees API (OWASP)

- **Ne JAMAIS retourner l'objet complet de la base au client** : toujours utiliser un `select` explicite
- Les requetes `findMany` doivent etre PLUS restrictives que `findUnique`
- Exclure les champs lourds (JSON, blobs) et les relations inutiles

### 1.8 Variables d'Environnement

- `.env` doit etre encode en UTF-8 (UTF-16 cause des erreurs silencieuses)
- `.env.local` a priorite sur `.env` : attention aux valeurs obsoletes
- Ne JAMAIS commiter `.env.local` ou tout fichier contenant des secrets
- Verifier la coherence des secrets entre local et production

### 1.9 Cookies & Sessions

- Limiter la taille du JWT : ne pas stocker d'images base64 ou de gros objets
- Cookies sur domaine wildcard uniquement en production
- **Piege vecu** : un `user.image` en base64 dans le JWT cause "Request Header Too Large" (431)

---

## 2. Responsivite & Mobile

### 2.1 Regles Fondamentales

- **Mobile-first** : commencer par `flex-col` puis `sm:flex-row`, `md:flex-row`, etc.
- **Tous les inputs en `w-full`** sur mobile
- **ZERO scroll horizontal** : jamais, nulle part, sous aucun pretexte
- Modaux : `overflow-y-auto overflow-x-hidden` sur le corps, `max-h-[85vh]` ou `max-h-[95vh]`

### 2.2 Prevention du Zoom iOS (CRITIQUE)

> C'est le bug mobile #1 le plus frequent et le plus insidieux.

- **TOUS les `<input>`, `<select>`, `<textarea>` doivent avoir `text-base` (16px minimum)**
- `text-sm` (14px) declenche un auto-zoom sur iOS Safari au focus
- Ce zoom cree un scroll horizontal permanent meme apres defocus
- **Solution** : audit systematique de tous les composants de formulaire
- Aussi ajouter `min-h-[44px]` sur tous les inputs

```css
/* INTERDIT */
input { font-size: 14px; } /* 0.875rem / text-sm */

/* OBLIGATOIRE */
input { font-size: 16px; } /* 1rem / text-base */
```

### 2.3 Touch Targets (Apple HIG)

- **Minimum 44x44px** pour TOUS les elements interactifs (boutons, liens, icones cliquables)
- Pattern Tailwind : `min-h-[44px] min-w-[44px] p-3`
- Inputs : `min-h-[44px]` ou `py-2.5` minimum

### 2.4 Clavier Mobile Optimise

| Type de champ | Attributs HTML |
|---------------|----------------|
| Montant | `type="number" inputMode="decimal" step="0.01" min="0"` |
| Telephone | `type="tel" inputMode="tel"` |
| Email | `type="email" inputMode="email"` |
| Recherche | `type="search" inputMode="search"` |
| URL | `type="url" inputMode="url"` |

### 2.5 Carrousels & Cards Swipables

- **Largeur minimale card : 320px** (`flex-[0_0_320px]`)
- Padding interne : `p-5` minimum
- Taille des icones : 24px+ pour la lisibilite
- Valeurs principales : `text-2xl` minimum (idealement `text-3xl`)
- Gap entre items : `gap-4` (16px)

### 2.6 Date/Time Pickers sur Mobile

- **NE PAS utiliser `showPicker()`** : non fiable sur iOS/Android
- **Solution prouvee** : input natif transparent (`opacity-0`) superpose sur toute la zone du bouton (`absolute inset-0`)
- Le tap mobile touche directement l'input natif et ouvre le picker systeme
- **Parsing de dates** : utiliser `parseISO()` (date-fns) et NON `new Date("YYYY-MM-DD")` qui parse en UTC et cause des erreurs de jour (off-by-one)

### 2.7 Modaux sur Mobile

```
Modal wrapper     → overflow-hidden (empeche le scroll horizontal page)
Modal body        → overflow-y-auto overflow-x-hidden max-h-[85vh]
Zone de preview   → overflow-y-auto min-h-0
Boutons d'action  → sticky ou dans le header (jamais caches par le scroll)
```

### 2.8 Compteurs & Stats

- Les rangees de compteurs (Total A / Total B / Solde) doivent passer en `flex-col` sur mobile
- Ne jamais forcer une rangee horizontale de 3+ elements sur petit ecran

### 2.9 Direction des Dropdowns

- Les dropdowns proches du bas de page doivent s'ouvrir vers le haut (`bottom-full`)
- Ajouter `max-h-[200px] overflow-y-auto` pour les longues listes

### 2.10 Navigation Mobile

- Menu burger pour les sections secondaires (admin, parametres)
- Cacher les colonnes secondaires des tableaux sur mobile
- Prevoir un bouton "voir details" (icone oeil) ouvrant un modal
- FAB (Floating Action Button) pour les actions principales

---

## 3. UX / UI

### 3.1 Aide Contextuelle (OBLIGATOIRE pour chaque fonctionnalite)

Chaque nouvelle fonctionnalite DOIT inclure :
1. **Tooltips** sur les termes techniques ou non-evidents
2. **Etat vide (Empty State)** si la page peut etre vide : icone + message descriptif + CTA
3. **Onboarding checklist** si c'est une action cle pour le nouvel utilisateur
4. **Tour guide** si c'est une fonctionnalite majeure du dashboard

### 3.2 Etats Vides

- Utiliser un composant reutilisable `EmptyState` (pas des divs ad-hoc)
- Inclure : icone contextuelle, message descriptif, CTA adapte (creation vs reset de filtre)
- Chaque page listant des donnees doit gerer l'etat vide

### 3.3 Onboarding & Premier Usage

- **Wizard de configuration** : modal non-fermable pour les etapes critiques de setup
- **Checklist de progression** : widget dashboard montrant l'avancement
- **Tour guide** : spotlight + tooltips pour le premier acces
- **Modal d'aide** : FAQ accordion accessible via un bouton "?"

### 3.4 Persistance des Preferences (localStorage)

- Sauvegarder les preferences UX : tour complete, checklist masquee, derniere selection utilisee
- Nommer les cles avec un prefixe unique au projet : `monprojet_tour_completed`

### 3.5 Mot de passe

- Icone oeil pour afficher/masquer le mot de passe sur TOUS les champs password
- Indicateur de force du mot de passe sur les formulaires de creation

### 3.6 Suggestions & Predictions

- Indicateur visuel clair quand une valeur est suggeree vs saisie manuellement
- Couleur differente (vert) + icone check pour la suggestion selectionnee
- Bouton "Masquer les suggestions" pour les utilisateurs avances
- Message de confirmation si l'utilisateur override une suggestion

### 3.7 Strategie CTA (Funnel)

- Header + Hero : CTA vers la page de tarifs/offre (l'utilisateur doit d'abord comprendre)
- Bas de page : CTA vers l'inscription (l'utilisateur est informe apres le scroll)
- Page d'inscription peut rediriger vers les tarifs si necessaire

---

## 4. Accessibilite (a11y)

### 4.1 Contrastes (WCAG AA minimum)

- Texte orange sur fond blanc : utiliser `orange-700` (ratio 4.9:1), PAS `orange-600` (3.7:1)
- Texte gris sur fond colore : minimum `gray-600`, jamais `gray-500`
- Liens : couleur suffisamment contrastee + soulignement au hover
- **Regle** : ratio minimum 4.5:1 pour le texte normal, 3:1 pour le texte large (18px+)

### 4.2 ARIA & Labels

- Tous les boutons icone-only doivent avoir `aria-label`
- Tous les inputs doivent avoir un `<label>` lie par `htmlFor`/`id`
- Inputs sans label visible : `aria-label` obligatoire

### 4.3 Mouvement Reduit

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4.4 Navigation au Clavier

- Tous les elements interactifs doivent etre focusables (`tabIndex`, `role="button"`)
- Ordre de tabulation logique (pas de `tabIndex` > 0)
- Indicateur de focus visible (jamais `outline: none` sans remplacement)
- Palette de commandes (`Ctrl/Cmd + K`) pour navigation rapide

### 4.5 Lecteurs d'Ecran

- Structure semantique : `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`
- Titres hierarchiques : h1 > h2 > h3 (pas de saut de niveau)
- Images decoratives : `alt=""` ou `aria-hidden="true"`
- Images informatives : `alt` descriptif

---

## 5. Performance

### 5.1 Eliminer les Dependances Lourdes du Critical Path

- **framer-motion (~40KB)** : remplacer par des animations CSS sur les pages critiques (landing, etc.)
  - Keyframes CSS pour : float, shimmer, fade, cursor-blink
  - `grid-rows` CSS transition pour les accordeons
  - SVG gradients animes en CSS pur
- **Gain mesure** : FCP -300ms, LCP -200ms, TBT -250ms, bundle -40KB

### 5.2 Imports Dynamiques avec Placeholders CLS-Safe

- Sections lourdes de landing page : `next/dynamic` avec placeholder de hauteur fixe
- Hauteur du placeholder doit correspondre au contenu reel pour eviter le CLS
- Exemple : `<div className="h-[600px]" />` comme loading placeholder

### 5.3 Pagination Cote Serveur

- Toutes les tables avec potentiellement >50 lignes : pagination server-side
- Pattern : `skip: (page - 1) * pageSize, take: pageSize`

### 5.4 Compression d'Images (Client-Side)

```typescript
import imageCompression from 'browser-image-compression'
const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1280, useWebWorker: true }
const compressed = await imageCompression(file, options)
```

### 5.5 Optimisation des Polices

- Utiliser le loader du framework (`next/font/google`, etc.)
- Limiter strictement les graisses : maximum 3-4 (ex: 400, 500, 600, 700)
- Preferer `font-display: swap`

### 5.6 Prevention du Hydration Mismatch

- Ne JAMAIS utiliser `Math.random()` dans les composants SSR
- Utiliser `useId()` (React 18+) pour generer des IDs uniques cote serveur et client

### 5.7 Analytics & Tracking

- GTM : `lazyOnload` (pas `afterInteractive`)
- Eviter les scripts GA4 en double (gerer via GTM uniquement)
- Supprimer les animations decoratives inutiles (`animate-pulse` sur les glows)

### 5.8 Attributs `sizes` sur les Images

- TOUJOURS ajouter `sizes` sur les composants `<Image>` (Next.js) pour eviter le chargement de tailles inutiles
- Exemple : `sizes="(max-width: 768px) 100vw, 50vw"`

---

## 6. CSS & Styling

### 6.1 Pattern Overflow pour Modaux

```css
/* Wrapper du modal */
.modal-wrapper { overflow: hidden; }

/* Corps du modal */
.modal-body {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 85vh;
}

/* Zone de preview interne */
.preview-zone {
  overflow-y: auto;
  min-height: 0;
}
```

### 6.2 Tailles de Police (Regles Strictes)

| Element | Taille minimum | Tailwind |
|---------|---------------|----------|
| Inputs, selects, textareas | 16px | `text-base` |
| Valeurs principales (cards) | 24px+ | `text-2xl` ou `text-3xl` |
| Icones interactives | 24px+ | `w-6 h-6` |
| Texte de corps | 14px-16px | `text-sm` ou `text-base` |
| Labels de formulaire | 14px | `text-sm` |

### 6.3 Animations CSS (Remplacement de Libraries)

Preferer les animations CSS natives pour les effets simples :
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
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

### 6.4 Gestion des Logos SVG

- Convertir les elements `<text>` SVG en `<path>` pour eviter la substitution de polices cross-browser
- Prevoir 3 variantes : inline (icone + texte), icone seule, logo complet
- Utilisation contextuelle : inline pour headers, icone pour sidebar/mobile

### 6.5 Scrollbar Subtile

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

---

## 7. Formulaires & Inputs

### 7.1 Coherence Visuelle Creation/Edition

- Memes classes CSS, padding, tailles de police, couleurs entre les modaux de creation et d'edition
- Structure : corps scrollable + footer fixe avec boutons d'action

### 7.2 Autocompletion d'Adresse

- Declencher a un seuil pertinent (ex: 5 chiffres pour un code postal francais)
- Auto-remplir si resultat unique
- Dropdown si plusieurs resultats
- **Toujours prevoir un fallback manuel** si l'API est indisponible

### 7.3 Hierarchie de Categories / Arborescences

- Inclure TOUTES les sous-categories du type correct
- Calculer l'indentation dynamiquement selon la profondeur reelle
- Trier par code naturel (hierarchique)

### 7.4 Mode Edition

- Indicateur visuel clair du mode actif (edition vs lecture)
- Texte du bouton change, banniere d'information apparait
- Validation met a jour l'entree existante (pas de creation en double)

### 7.5 Pattern de Validation (Zod)

```typescript
const schema = z.object({
  description: z.string().min(1, "Requis").max(500).transform(s => s.trim()),
  amount: z.number().positive("Doit etre positif").max(999_999_999),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format invalide"),
  categoryId: z.string().uuid().optional(),
  email: z.string().email("Email invalide"),
})
```

---

## 8. Navigation

### 8.1 Exclusions du Middleware d'Auth

Ces routes doivent TOUJOURS etre accessibles sans authentification :
- `manifest.webmanifest` (Google Search Console en depend)
- `robots.txt`, `sitemap.xml`
- Assets statiques (`_next/static`, `_next/image`)
- `favicon.ico`
- Routes API publiques (webhooks)

### 8.2 Navigation Mobile

- Menu burger pour les sections secondaires (admin, parametres)
- FAB (Floating Action Button) centre pour l'action principale
- Bouton d'aide "?" accessible dans la barre superieure ET la navigation mobile

### 8.3 Palette de Commandes

- Raccourci clavier `Ctrl/Cmd + K` pour recherche/navigation rapide
- Indispensable pour les power users

### 8.4 Funnel de Conversion (CTA)

- **Haut de page** : CTA vers decouverte/tarifs
- **Bas de page** : CTA vers inscription (l'utilisateur a scroll = il est informe)
- Coherence des redirections dans le funnel

---

## 9. Gestion des Erreurs

### 9.1 Pattern Server Action

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

### 9.2 Logging Non-Bloquant

- Les logs d'audit ne doivent JAMAIS bloquer l'action utilisateur
- Wrapper `logActivity()` dans un try/catch : si ca echoue, log console et continue

### 9.3 Fallback de Services Externes

- Redis : fallback vers SQL si erreur 429 (quota depasse)
- APIs tierces : fallback gracieux avec message utilisateur
- **Toujours prevoir un mode degrade**

### 9.4 Monitoring des Erreurs

- Sentry (ou equivalent) avec :
  - Configs client, serveur et edge
  - Page `global-error.tsx` avec rapport Sentry
  - Filtrage des erreurs non-pertinentes (reseau, extensions navigateur)
  - Sampling a 10% en production (pour rester en free tier)

### 9.5 Chargement de Ressources Externes

- Logo dans les PDFs : gerer les deux cas (URL HTTP vs data URL)
- **Echec silencieux** : retourner `null` si le fetch echoue, ne pas casser le flux

---

## 10. Integrite des Donnees

### 10.1 Precision Financiere (CRITIQUE)

- **NE JAMAIS utiliser l'arithmetique native JS pour l'argent**
  - `0.1 + 0.2 = 0.30000000000000004` en JavaScript
- Utiliser une libraire de precision : `decimal.js`, `dinero.js`, `big.js`
- Arrondi : `ROUND_HALF_UP`

```typescript
// INTERDIT
const total = items.reduce((sum, item) => sum + item.price, 0)

// OBLIGATOIRE
import Decimal from 'decimal.js'
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP })
const total = items.reduce((sum, item) => new Decimal(sum).plus(item.price), new Decimal(0))
```

### 10.2 Conversion des Types Decimal de l'ORM

- Les types `Decimal` de Prisma (ou autre ORM) doivent etre convertis avec `.toNumber()` avant usage
- Ne pas supposer qu'un `Decimal` se comporte comme un `number`

### 10.3 Limites d'Import

Definir des limites explicites pour tout import de donnees :

| Parametre | Valeur recommandee |
|-----------|--------------------|
| Lignes par import | 500 max |
| Longueur description | 500 caracteres |
| Montant maximum | 999 999 999 |
| Nom de fichier | 100 caracteres |
| Taille de fichier | 5 MB |

### 10.4 Detection de Doublons

- Sur les imports CSV/Excel : comparer avec les N derniers mois de donnees existantes
- Signaler les doublons potentiels a l'utilisateur plutot que de les rejeter silencieusement

### 10.5 Workflow Base de Donnees

1. **Avant modification du schema** : backup local de la DB
2. **Migration** : `npx prisma migrate dev --name <nom_descriptif>`
3. **STOP immediat** si "Data Loss Warning" : proposer un script manuel
4. **Post-migration** : verifier avec un outil visuel (Prisma Studio, pgAdmin)
5. Tester les routes impactees

### 10.6 Scripts de Seed

- **NE JAMAIS utiliser `findFirst()` puis `update()`** dans les scripts de seed : ca ecrase les donnees de production
- Pattern safe : creer de nouvelles entites de test ou utiliser des IDs/slugs explicites

---

## 11. Architecture & Scalabilite

### 11.1 Isolation Multi-Tenant

- Chaque requete en base DOIT inclure l'identifiant du tenant (`associationId`, `orgId`, `tenantId`)
- Ne JAMAIS faire confiance a l'identifiant du tenant venant du client : le recuperer depuis la session server-side

### 11.2 Organisation du Code

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
│   └── services/      → Logique metier
└── services/          → Services specifiques (PDF, audit, IA)
```

### 11.3 Regle Anti "God Component"

- **Ne jamais depasser 300 lignes par composant**
- Si un composant grossit : le decomposer en sous-composants et hooks
- **Piege vecu** : un composant de 883 lignes a du etre decompose en 9 modules

### 11.4 Server Actions vs API Routes

| Cas d'usage | Choix |
|-------------|-------|
| CRUD mutations | Server Actions |
| Queries complexes (pagination, filtres) | Server Actions |
| Webhooks externes (Stripe, etc.) | API Routes |
| Upload de fichiers | API Routes |
| Endpoints publics | API Routes |

### 11.5 Conventions de Nommage

| Element | Convention | Exemple |
|---------|-----------|---------|
| Composants | PascalCase.tsx | `UserCard.tsx` |
| Actions | camelCase.ts | `createUser.ts` |
| Services | camelCase.ts | `userService.ts` |
| Constantes | SCREAMING_SNAKE | `MAX_FILE_SIZE` |
| Types/Interfaces | PascalCase | `UserProfile` |

### 11.6 Systeme de Quotas

Prevoir des limites par plan/tier des le depart :

| Ressource | Free | Premium | Enterprise |
|-----------|------|---------|------------|
| Entites principales | Limite | Eleve | Illimite |
| Stockage | 50 MB | 2 GB | 10 GB+ |
| Requetes API/jour | 100 | 1000 | Illimite |
| Utilisateurs | 5 | 50 | Illimite |

### 11.7 Periode d'Essai

- Essai sans carte bancaire (30 jours recommande)
- Gere dans le code (`trial_period_days`), PAS dans le dashboard Stripe
- JWT contient `plan` et `trialEndsAt` pour verification en Edge middleware
- Essai expire : bloquer tout sauf la page d'expiration, les parametres et la page d'abonnement

---

## 12. SEO & Meta

### 12.1 Favicon & Icones

- **PNG raster 192x192** obligatoire a la racine publique
- SVG pour `icon.svg` (App Router Next.js)
- `.ico` + `apple-icon.png` dans le dossier app
- SVG : recadrer le `viewBox` au contenu reel (eliminer les marges vides)
- **Ne JAMAIS se fier au .ico ou .svg seul** pour l'indexation Google

### 12.2 Web Manifest

- Fichier `manifest.webmanifest` requis
- Doit referencer l'icone 192x192 PNG
- DOIT etre exclu du middleware d'auth

### 12.3 Schema.org (Donnees Structurees)

- JSON-LD `Organization` avec `logo` pointant vers un PNG raster (pas SVG)
- JSON-LD `HowTo` pour les guides/tutoriels (rich snippets Google)
- Ancres pour deep linking (`#section-name`)

### 12.4 Open Graph

- Format d'image : PNG (meilleur support que JPG pour les previews)
- References coherentes dans : `layout.tsx`, pages marketing, layout auth
- Taille recommandee : 1200x630px

---

## 13. Tests & Qualite

### 13.1 Checklist Pre-PR

```bash
npx tsc --noEmit      # Verification des types
npm run lint           # Linting
npm run build          # Build production
npm test               # Tests unitaires/integration
```

### 13.2 Tests Specifiques a Ecrire

- **Precision financiere** : 100 operations de 0.10 doivent donner exactement 10.00
- **Flux d'inscription/essai** : creation compte → onboarding → dashboard → expiration → blocage
- **Limites d'import** : tester chaque limite (taille, nombre, longueur)
- **RBAC** : chaque role ne peut faire que ce qui est autorise
- **Multi-tenant** : un tenant ne peut JAMAIS voir les donnees d'un autre

### 13.3 Tests de Securite

- Injection SQL / NoSQL
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Path traversal sur les uploads
- Rate limiting effectif

---

## 14. Deploiement & DevOps

### 14.1 Configuration Vercel (ou equivalent)

```json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["cdg1"]
}
```

### 14.2 Budget & FinOps

- Definir un budget mensuel cap (ex: 80 EUR)
- Alerter a 80% du budget
- Mode survie automatique si depassement
- Purger regulierement les tables de logs (TTL 90 jours recommande)
- Monitorer la consommation Redis (commands/jour)
- Monitorer la taille des tables DB volumineuses (audit, feedback, analytics)

### 14.3 Monitoring en Production

| Outil | Usage |
|-------|-------|
| Vercel Analytics | Performance web |
| Vercel Logs | Erreurs runtime |
| Sentry | Error tracking JS (10% sampling) |
| Dashboard DB (Neon) | Metriques base de donnees |
| Dashboard Redis (Upstash) | Commandes, quota, boucles de requetes |

### 14.4 Checklist Stripe/Paiement

- [ ] Cle publishable live configuree
- [ ] IDs de prix live configures
- [ ] Cle secrete live configuree
- [ ] Endpoint webhook cree avec secret
- [ ] Events webhook : `checkout.session.completed`, `subscription.updated`, `subscription.deleted`, `invoice.payment_failed`, `subscription.trial_will_end`
- [ ] Portail client : logo, couleurs, textes, descripteur de releve

### 14.5 Workflow de Migration DB

1. Backup local
2. Migration avec nom descriptif
3. **STOP sur Data Loss Warning** → script manuel
4. Verification visuelle post-migration
5. Verifier que la structure ne genere pas de requetes Redis excessives
6. Verifier les secrets en production post-migration
7. Tester les flux impactes

---

## 15. Checklist Pre-Production

### Securite
- [ ] Headers HTTP de securite configures
- [ ] CSP avec domaines autorises
- [ ] Rate limiting actif
- [ ] Validation Zod sur tous les endpoints
- [ ] Upload securise (MIME whitelist, sanitisation, taille max)
- [ ] Pas de donnees sensibles dans les logs
- [ ] Secrets differents entre dev et prod
- [ ] HTTPS force (HSTS)

### Mobile & Responsivite
- [ ] Aucun scroll horizontal (tester sur iPhone SE, Galaxy S8)
- [ ] Tous les inputs en 16px minimum (pas de zoom iOS)
- [ ] Touch targets 44x44px minimum
- [ ] `inputMode` correct sur tous les champs
- [ ] Modaux scrollables avec overflow correct
- [ ] Navigation mobile (burger menu ou tab bar)
- [ ] Date pickers natifs fonctionnels sur iOS et Android

### UX
- [ ] Etats vides sur toutes les pages de listing
- [ ] Tooltips sur les termes techniques
- [ ] Onboarding pour les nouveaux utilisateurs
- [ ] Feedback visuel sur toutes les actions (loading, succes, erreur)

### Accessibilite
- [ ] Contrastes WCAG AA (ratio 4.5:1 minimum)
- [ ] `aria-label` sur tous les boutons icone-only
- [ ] Labels lies aux inputs (`htmlFor`/`id`)
- [ ] `prefers-reduced-motion` respecte
- [ ] Navigation au clavier fonctionnelle
- [ ] Structure semantique HTML

### Performance
- [ ] Pas de librairie lourde dans le critical path
- [ ] Images optimisees avec `sizes`
- [ ] Polices limitees (3-4 graisses max)
- [ ] Pagination server-side pour les grandes listes
- [ ] Imports dynamiques avec placeholders CLS-safe

### SEO
- [ ] Favicon PNG 192x192
- [ ] manifest.webmanifest exclu du middleware auth
- [ ] Open Graph images (1200x630px PNG)
- [ ] Schema.org JSON-LD
- [ ] Meta titles et descriptions uniques par page

### Deploiement
- [ ] Variables d'environnement configurees en prod
- [ ] Monitoring actif (Sentry, analytics)
- [ ] Budget et alertes configures
- [ ] Webhooks de paiement testes
- [ ] Backup DB automatise

---

> **Ce document est un living document.** Le mettre a jour a chaque nouvelle lecon apprise en production.
