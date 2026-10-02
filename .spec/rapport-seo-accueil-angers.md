# Rapport de positionnement SEO — page d'accueil ABCD Ingénierie

## Objectif : devenir n°1 sur « bureau d'études structure Angers »

- **Site :** https://abcd-ing.fr/
- **Page cible :** `/` (accueil)
- **Requête cible :** `bureau d'études structure Angers`
- **Date de l'analyse :** 2 octobre 2026
- **Périmètre :** audit de la page d'accueil, analyse du SERP concurrentiel, plan d'action priorisé.

---

## 1. Verdict en une page

**C'est atteignable, mais pas uniquement en retravaillant la page d'accueil.**

Trois faits conditionnent le résultat :

1. **Le domaine a 3 semaines.** `abcd-ing.fr` a été enregistré le **9 septembre 2026**. Aucune autorité, aucun historique, et à ce jour **le site n'apparaît pas indexé dans Google** (`site:abcd-ing.fr` ne retourne rien). Tant que ce point n'est pas réglé, le reste est théorique.
2. **La requête est locale, pas seulement éditoriale.** Sur ce type de recherche, Google affiche un *local pack* (3 fiches Google Maps) au-dessus des résultats organiques. Sans fiche Google Business Profile, un site peut être n°1 organique et rester invisible pour la majorité des utilisateurs. La bataille se joue sur **deux tableaux : organique + local**.
3. **La page d'accueil ne cible aujourd'hui aucune des deux composantes de la requête.** Ni « structure » ni « Angers » n'apparaissent dans son `<title>` ou son `<h1>`. Ce n'est pas un détail cosmétique : c'est le premier signal que Google utilise pour décider du sujet d'une page.

**Estimation honnête :** avec une exécution complète et régulière — technique + on-page + Google Business Profile + avis + citations locales —, une position n°1 organique est réaliste **entre 6 et 12 mois**. Les premières progressions (indexation, top 30, top 10) doivent s'observer **dès les 4 à 8 premières semaines** après la mise en œuvre.

**Levier principal, par ordre d'impact :**

| # | Levier | Impact | Délai |
| --- | --- | --- | --- |
| 1 | Fiche Google Business Profile (création + optimisations) | Très élevé | 2–6 semaines |
| 2 | Réécriture on-page de l'accueil (title, H1, section Angers, contenu) | Élevé | 2–6 semaines |
| 3 | Indexation technique (robots.txt, sitemap, canonical, Search Console) | Élevé (bloquant) | 1–2 semaines |
| 4 | Avis Google (≥ 10, note ≥ 4,5, rythme régulier) | Élevé | 1–3 mois |
| 5 | Citations locales + NAP complet | Moyen-élevé | 1–3 mois |
| 6 | Page dédiée + cluster « Angers » | Moyen | 3–6 mois |
| 7 | Netlinking local et presse | Moyen | 3–9 mois |

---

## 2. Audit de la page d'accueil : état des lieux

### 2.1 Ce qui est déjà en place

- Structure HTML saine, `lang="fr"`, site rapide à servir (Netlify, HTTP/2, HSTS actif).
- Images en `.webp` — bon choix de format.
- Textes de remplacement présents sur les images.
- Accueil déjà porteur de plusieurs mentions d'`Angers` (6 occurrences) et de `bureau d'études` (3), `structure` (11).
- Une section « implantation » qui mentionne Angers comme implantation principale et détaille les départements (49, 53, 72, 44, 56, 85).
- Mesure d'audience Umami déjà installée et conforme (voir `.spec/note-tracking.md`).
- Page 404 et page de remerciement en `noindex` — correct.

### 2.2 Ce qui pénalise aujourd'hui

| Constat | Détail | Gravité |
| --- | --- | --- |
| **Non indexé** | `site:abcd-ing.fr` ne retourne aucun résultat dans Google. | 🔴 Bloquant |
| **`robots.txt` absent** | `https://abcd-ing.fr/robots.txt` renvoie la page 404 (qui porte `noindex`). Aucun `Sitemap:` déclaré. | 🔴 Élevé |
| **`sitemap.xml` absent** | Renvoie 404. Aucun plan de site soumis. | 🔴 Élevé |
| **`<title>` sans mot clé** | `Accueil — ABCD Ingénierie`. Zéro correspondance avec la cible. | 🔴 Élevé |
| **`<h1>` sans mot clé** | « La rigueur d'un bureau d'études, la proximité d'un partenaire de projet. » Ni « structure », ni « Angers ». | 🔴 Élevé |
| **Meta description sans local** | Correcte mais générique, sans « Angers » ni appel à l'action différenciant. | 🟠 Moyen |
| **Aucune donnée structurée** | Zéro JSON-LD sur les 18 pages (`application/ld+json` absent partout). | 🟠 Moyen-élevé |
| **NAP incomplet** | Aucune adresse postale complète, **aucun numéro de téléphone** sur tout le site. Le pied de page indique seulement « Angers, Vannes ». Pas de lien `tel:`. | 🔴 Élevé |
| **Aucune fiche/embed Google Maps** | Aucun signal géographique renforcé sur la page. | 🟠 Moyen |
| **Aucune page « Angers »** | Aucun lien interne ne contient le mot « angers » (`href`). | 🟠 Moyen |
| **`canonical` absent** | 17 pages sur 18 sans canonical. La seule présente (article de blog) pointe vers une URL redirigée en 302. | 🟠 Moyen |
| **Page trop mince** | ~1 097 mots. C'est peu pour une requête locale commerciale disputée. | 🟠 Moyen |
| **Les 4 offres ne sont pas présentées** | Le mot « diagnostic » n'apparaît que 2 fois, dont une dans la liste A/B/C/D. Les 4 prestations (conception, exécution, diagnostic avec et sans recommandations) ne sont pas exposées sur l'accueil, contrairement à ce que prévoit le brief. | 🟠 Moyen |
| **Tailwind Play CDN en production** | `cdn.tailwindcss.com` est un outil de prototypage, **explicitement non destiné à la production** : CSS généré côté client, risque de FOUC, dégradation des Core Web Vitals. | 🟠 Moyen |
| **Blog et réalisations masqués** | `/blog/*` et `/realisations/*` sont redirigés en 302 vers l'accueil. Cela supprime le principal moteur d'autorité thématique du site. | 🟠 Moyen |

---

## 3. Analyse du SERP : qui occupe le terrain

Sur la requête cible, les résultats organiques visibles sont les suivants.

| Site | Page qui se classe | Ancrage local | Forces | Faiblesses exploitables |
| --- | --- | --- | --- | --- |
| `anjoustructure.fr` | **Accueil** | Angers, collectif QUARCO | Vraies références locales (L'Échappée 49, Patinoire d'Angers, Crédit Mutuel Anjou), logos clients, plusieurs pages services | On-page peu travaillé : pas de title local, pas de page ville |
| `even-structures.fr` | **Accueil** | Angers (49007), bureau historique | 3 pôles clairs (diagnostic/conception/exécution), beaux ouvrages angevins, adhésion Fibois | Contenu peu optimisé, pas de FAQ, peu de signaux locaux explicites |
| `betap.fr` | `/bureau-detude-structure-angers/` | Angers | URL et title parfaitement ciblés | **Page très mince** (≈ 1 000 caractères), texte générique |
| `bibtp.fr` | `/bureau-etude-structure-charpente-angers/` | Angers | Title ciblé « charpente Angers » | ≈ 2 200 caractères, contenu commercial de réseau national |
| `b6concept.fr` | `/etude-structure-angers/` | Angers | Title + H1 ciblés | Page courte, peu de preuves locales |
| `bet-sodeba.fr` | `/bureau-detude-structure/maine-et-loire-49/angers/` | Angers (49) | Page longue, structure H2 claire | **Texte générique bourré de répétitions** (« bureau d'études structure Angers » répété à l'excès), zéro preuve locale, zéro projet angevin |
| `ingecap-concept.fr` | `/2-10.htm` | Angers | Ciblage local | URL peu propre, contenu daté |
| `secc-france.com` | `/.../angers-49000` | Angers | Format annuaire | Contenu pauvre |
| `bureau-etude-bois-chauvin.fr` | `/plan-charpente-angers/` | Angers/Tours | Spécialisation charpente bois | Basé à Tours, moins pertinent |

### Trois enseignements décisifs

**a) Le SERP récompense une page dédiée ville + service.** Huit résultats sur dix sont des pages « Angers » dédiées ; seuls les deux acteurs réellement implantés se classent avec leur accueil. C'est la preuve que **l'accueil peut se classer**, mais uniquement parce qu'Anjou Structure et Even Structures compensent par leur ancienneté, leur autorité locale et leurs références de projets angevins. ABCD n'a aujourd'hui ni l'ancienneté ni l'autorité : il doit donc **compenser par un ciblage on-page explicite que ses concurrents locaux négligent**.

**b) Le niveau de contenu en face est faible.** Les pages dédiées concurrentes sont courtes, templatées, ou dupliquées entre villes. Le principal concurrent local (Sodeba) pratique un bourrage de mots clés sans substance. **Un contenu réellement informatif, spécifique à Angers et démontrant l'expertise bois/métal n'a aucun mal à les dépasser sur la qualité.**

**c) Le point de différenciation d'ABCD est déjà là mais invisible.** Bois + renforcement métal + diagnostic de l'existant : c'est un positionnement rare et cohérent avec le bâti angevin (tuffeau, ardoise, planchers bois traditionnels, bâti ancien à réhabiliter). Il n'est aujourd'hui porté par aucun signal SEO.

---

## 4. Décision stratégique : accueil ou page dédiée ?

Vous demandez que **la page d'accueil** devienne n°1. C'est un choix défendable ici, et je le recommande, pour trois raisons :

- Le site est une vitrine de PME avec peu de pages : concentrer les signaux locaux sur l'accueil évite de diluer l'autorité sur un domaine de 3 semaines.
- L'accueil est déjà la page la plus liée en interne et la plus susceptible de recevoir des liens externes.
- L'implantation principale est bien Angers : le sujet de l'accueil *est* légitimement local.

**Mais avec deux garde-fous :**

1. **Ne pas écraser le positionnement national.** ABCD intervient « France entière selon votre projet ». Il ne faut donc pas transformer l'accueil en pure page locale. La solution : concentrer le ciblage dans le `title`, le `h1`, une section « Angers » dédiée et une FAQ, tout en conservant le discours national dans le corps.
2. **Créer malgré tout une page `/bureau-etudes-structure-angers.html`** en support, qui visera la longue traîne locale (« bureau d'études structure bois Angers », « diagnostic structure maison ancienne Angers », « expert charpente Angers »). Elle renforce l'accueil par lien interne et captera ce que l'accueil ne peut pas porter sans se disperser.

---

## 5. Architecture de mots clés

### Cible principale (une seule, portée par l'accueil)

`bureau d'études structure Angers`
Variantes à intégrer naturellement : *bureau d'étude structure Angers*, *BET structure Angers*, *bureau d'études structure bâtiment Angers*, *bureau d'études structure 49*.

### Cibles secondaires (accueil + page Angers)

- bureau d'études structure bois Angers
- bureau d'études structure métal Angers
- expertise structure Angers / ingénieur structure Angers
- diagnostic structurel Angers / diagnostic structure bâtiment existant Angers
- étude structure Angers / calcul de structure bois Angers
- vérification structure bâtiment Angers
- renforcement de structure Angers
- bureau d'études structure Maine-et-Loire

### Champ sémantique à mobiliser (issu de `.spec/mots clés.md`)

`Eurocode 5`, `Eurocode 3`, `descente de charges`, `note de calcul`, `charpente traditionnelle`, `fermettes`, `solivage bois`, `plancher à la française`, `section et entraxe`, `sens de portée`, `about de solive`, `ancrage dans la maçonnerie`, `flèche`, `capacité portante résiduelle`, `surcharge admissible`, `sondage mécanique des bois`, `humidité du bois`, `insectes xylophages`, `mérule`, `contreventement`, `préconisations de renforcement`, `relevé de charpente`, `bâti ancien`, `réhabilitation`.

Ces termes ne sont pas là pour « faire du mot clé » : ils servent à Google (compréhension du sujet) et surtout aux lecteurs professionnels (architectes, entreprises) qui jugent la compétence à la précision du vocabulaire.

### Longue traîne / intentions

| Intention | Exemple de requête | Page cible |
| --- | --- | --- |
| Trouver un BET local | bureau d'études structure Angers | Accueil |
| Vérifier une structure existante | diagnostic structure maison ancienne Angers | `/particuliers.html` |
| Sécuriser une opération | BET structure pour architecte Angers | `/architectes-maitres-oeuvre.html` |
| Problème concret | plancher bois qui s'affaisse Angers | Blog (à réactiver) |

---

## 6. Plan d'action on-page sur la page d'accueil

### 6.1 Balises à modifier — copier-coller prêt à l'emploi

**`<title>`** (52 caractères)

```html
<title>Bureau d'études structure à Angers | ABCD Ingénierie</title>
```

**Meta description** (149 caractères)

```html
<meta name="description" content="Bureau d'études structure à Angers, spécialisé bois et métal : conception, exécution, diagnostic structurel et renforcement. Parlons de votre projet.">
```

**`<h1>`** — remplacer le titre actuel par :

```html
<h1>Bureau d'études structure à Angers, spécialisé bois et métal</h1>
```

Conserver la phrase de marque en sous-titre, juste en dessous, en `<p class="lead">` ou `<h2>` :

> *La rigueur d'un bureau d'études, la proximité d'un partenaire de projet.*

**URL :** `/` — pas de changement (une URL racine est parfaitement adaptée).

**Canonical** à ajouter dans le `<head>` de **toutes** les pages :

```html
<link rel="canonical" href="https://abcd-ing.fr/">
```

### 6.2 Restructuration sémantique de la page

Plan de titres recommandé (H2/H3), en conservant le contenu existant :

| Niveau | Titre proposé | Contenu |
| --- | --- | --- |
| H1 | Bureau d'études structure à Angers, spécialisé bois et métal | Accroche + promesse |
| H2 | Nos prestations de bureau d'études structure à Angers | Les 4 offres en H3 : **Conception** · **Exécution** · **Diagnostic structurel avec recommandations** · **Diagnostic structurel sans recommandations (visuel)** |
| H2 | Nos expertises structure : bois, métal et bâtiment existant | Contenu actuel « Une étude structure, ce n'est pas seulement un calcul », enrichi |
| H2 | Un bureau d'études structure implanté à Angers et dans l'Ouest | Section implantation actuelle, réécrite avec le mot clé et des communes |
| H2 | Pourquoi confier votre étude structure à ABCD Ingénierie ? | **Nouveau** — preuves : Eurocodes, note de calcul, livrables, assurance, méthode |
| H2 | Nos références à Angers et en Maine-et-Loire | **Nouveau** — projets + photos (INPI, collèges, IFCE…) |
| H2 | Questions fréquentes sur un bureau d'études structure à Angers | **Nouveau** — 5 à 7 questions |
| H2 | Vous avez une question structure ? Parlons-en. | CTA actuel |

### 6.3 Nouveaux blocs de contenu à ajouter

**a) Section « Angers » enrichie.** Reprendre la section implantation et y ajouter :

- La phrase clé en ouverture : *« ABCD Ingénierie est un bureau d'études structure basé à Angers, au 15 rue Evain. »*
- Les communes proches explicitement nommées : Trélazé, Avrillé, Beaucouzé, Saint-Barthélemy-d'Anjou, Les Ponts-de-Cé, Tiercé, Cholet, Saumur, Beaupréau-en-Mauges, Segré.
- Une phrase sur le bâti local : *« Le bâti angevin — tuffeau, ardoise, planchers et charpentes bois traditionnels — demande une lecture fine de l'existant avant toute réhabilitation. »* C'est exact, spécifique et impossible à copier par un réseau national.
- Un **embed Google Maps** de l'adresse du siège (en `loading="lazy"` pour ne pas pénaliser la performance).

**b) Bloc « Pourquoi nous » / preuves.** C'est le point faible de tous les concurrents locaux. À afficher :

- Études menées selon les **Eurocodes** (EC0, EC1, EC3 pour le métal, EC5 pour le bois).
- Livrables précis : note de calcul, plans, rapport de diagnostic, préconisations hiérarchisées.
- Assurance professionnelle et décennale.
- Méthode en 5 étapes (déjà présente, à conserver — elle est bonne).
- Photographies de chantier réelles (le site en compte 28 : c'est un atout à exploiter, pas à laisser dormir).

**c) FAQ locale.** 5 à 7 questions, avec balisage `FAQPage`. Exemples :

1. *Qu'est-ce qu'un bureau d'études structure et quand faut-il le consulter ?*
2. *Intervenez-vous sur le bâti ancien à Angers et en Maine-et-Loire ?*
3. *Quelle différence entre un diagnostic structurel avec et sans recommandations ?*
4. *Quels livrables fournissez-vous à l'issue d'une étude structure ?*
5. *Travaillez-vous avec les architectes et les entreprises d'Angers ?*
6. *Quel est le délai et le coût d'une étude structure ?*
7. *Intervenez-vous en dehors d'Angers ?*

### 6.4 Maillage interne

Remplacer les ancres actuelles, trop génériques, par des ancres descriptives :

| Emplacement | Ancre actuelle | Ancre recommandée |
| --- | --- | --- |
| Bloc hero / corps | `Nos expertises` | `Nos expertises structure bois et métal` |
| Section particuliers | `Présenter votre projet` | `Diagnostic structurel d'une maison ancienne` |
| Section implantation | `contact` | `Demander une étude structure à Angers` |
| CTA final | `Parler de votre projet` | inchangé (bon) |

Ajouter également, depuis l'accueil :

- un lien vers la nouvelle page `/bureau-etudes-structure-angers.html` avec l'ancre **« bureau d'études structure à Angers »** ;
- un lien depuis le pied de page (présent sur toutes les pages — c'est ce qui la rendra découvrable par le crawler) ;
- un lien depuis `/nos-expertises.html` et `/domaines-intervention.html`.

**Règle :** 2 à 5 liens internes contextuels pour 1 000 mots, avec des ancres variées et descriptives. Jamais de répétition mécanique de l'ancre exacte.

### 6.5 Volume et profondeur

Passer de ~1 100 à **1 800–2 200 mots utiles**. L'objectif n'est pas le volume : c'est de couvrir les questions que se posent réellement les deux publics (professionnels et particuliers) et que les concurrents ignorent. Chaque paragraphe ajouté doit répondre à une question ou apporter une preuve.

---

## 7. SEO local : le levier décisif

C'est ici que se gagne la requête. Un site n°1 organique sans fiche Google Business Profile passe à côté de l'essentiel du trafic sur une requête locale.

### 7.1 Google Business Profile — checklist de création/optimisation

| Élément | Recommandation |
| --- | --- |
| **Catégorie principale** | À choisir dans l'interface : la plus proche de l'activité réelle (type « Bureau d'études » / ingénierie). **C'est le premier facteur du pack local** — une catégorie incorrecte est le premier facteur négatif. Vérifier les libellés exacts disponibles au moment de la création. |
| **Catégories secondaires** | Ajouter 3 à 4 catégories pertinentes (ingénierie, expertise bâtiment, etc.), sans en mettre d'incohérentes. |
| **Adresse** | 15 rue Evain, 49000 Angers. Doit être **strictement identique** à celle du site, du schema et de tous les annuaires. |
| **Téléphone** | Numéro local d'Angers, au format identique partout, cliquable en `tel:` sur le site. |
| **Site web** | Lier vers l'accueil. |
| **Zone desservie** | Angers + 49, 53, 72, 44, 56, 85 (et mention « France entière selon le projet » sur le site, pas dans la fiche). |
| **Horaires** | Renseignés (les entreprises ouvertes au moment de la recherche remontent mieux). |
| **Description** | 750 caractères, avec « bureau d'études structure », « Angers », « bois », « métal », « diagnostic ». |
| **Photos** | 15 à 30 photos réelles et géolocalisables : équipe, locaux, chantiers, avant/après. |
| **Posts** | 1 publication par mois minimum. |
| **Q&A** | Recréer les questions utiles (la fonctionnalité a évolué, mais le contenu FAQ du site couvre ce besoin). |
| **Statut** | Vérifier l'éligibilité au badge « Verified ». |
| **Attribut clé** | Ne pas pointer la fiche vers la page la plus forte du site si l'on veut protéger le référencement organique — ici, pointer simplement vers l'accueil. |

### 7.2 Avis clients

- **Seuil critique : 10 avis** (en dessous, l'effet est faible).
- **Note cible : ≥ 4,5/5** — 31 % des consommateurs ne considèrent que les notes ≥ 4,5.
- **Régularité :** ne jamais laisser passer 3 semaines sans nouvel avis (la « règle des 18 jours » : les positions chutent au-delà).
- **Réponse du propriétaire** à 100 % des avis, positifs comme négatifs.
- **Interdit :** filtrer les clients mécontents avant de demander un avis (pratique sanctionnée par Google et par le droit de la consommation).

### 7.3 NAP et citations

Le NAP (Nom, Adresse, Téléphone) est aujourd'hui **absent du site**. À corriger en priorité : pied de page + page contact + schema, avec une formulation identique partout.

Citations à obtenir, par ordre de priorité :

1. **Google Business Profile** (le socle).
2. **Bing Places** — alimente ChatGPT, Copilot et Alexa : devenu incontournable pour la visibilité IA.
3. **Apple Business Connect**.
4. **PagesJaunes / Solocal**.
5. **Fibois Pays de la Loire** — l'annuaire des adhérents de la filière bois régionale référence déjà Even Structures : c'est une cible évidente et crédible pour un BET bois.
6. **CCI Maine-et-Loire**, **Novabuild**, clusters et réseaux BTP régionaux.
7. **Pappers / Infogreffe / societe.com** — cohérence de la fiche entreprise (SIREN 109 754 275).
8. **LinkedIn** (page entreprise complète, cohérente avec le NAP).
9. Annuaires spécialisés BET / ingénierie.

**Point d'attention :** le brief mentionne un SIREN `000 000 000` alors que le pied de page affiche `109 754 275`. À harmoniser avant toute inscription en annuaire — une incohérence d'identifiant se propage vite.

### 7.4 Schema.org (JSON-LD) — à ajouter dans le `<head>` de l'accueil

Aucune donnée structurée n'existe aujourd'hui. Voici un bloc prêt à l'emploi, **à compléter avec les coordonnées définitives** :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://abcd-ing.fr/#organization",
  "name": "ABCD Ingénierie",
  "description": "Bureau d'études structure à Angers, spécialisé en structure bois, en renforcement métal et en diagnostic de bâtiments existants.",
  "url": "https://abcd-ing.fr/",
  "logo": "https://abcd-ing.fr/photos/abcd-logo.webp",
  "image": "https://abcd-ing.fr/photos/hero.webp",
  "telephone": "+33-XX-XX-XX-XX-XX",
  "email": "contact@abcd-ing.fr",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "15 rue Evain",
    "addressLocality": "Angers",
    "postalCode": "49000",
    "addressRegion": "Pays de la Loire",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 47.478419,
    "longitude": -0.563166
  },
  "areaServed": [
    { "@type": "City", "name": "Angers" },
    { "@type": "AdministrativeArea", "name": "Maine-et-Loire" },
    { "@type": "AdministrativeArea", "name": "Mayenne" },
    { "@type": "AdministrativeArea", "name": "Sarthe" },
    { "@type": "AdministrativeArea", "name": "Loire-Atlantique" },
    { "@type": "AdministrativeArea", "name": "Morbihan" },
    { "@type": "AdministrativeArea", "name": "Vendée" }
  ],
  "knowsAbout": [
    "Structure bois", "Structure métal", "Renforcement structurel",
    "Diagnostic structurel", "Charpente bois", "Eurocode 5", "Eurocode 3",
    "Réhabilitation du bâti ancien"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Prestations de bureau d'études structure",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Conception et dimensionnement de structure bois et métal" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Études d'exécution" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Diagnostic structurel avec recommandations" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Diagnostic structurel visuel sans recommandations" } }
    ]
  },
  "sameAs": []
}
</script>
```

À compléter ensuite, **uniquement si les données existent réellement** :

- `aggregateRating` — seulement quand il y a de vrais avis. Un balisage d'avis fictifs expose à une pénalité.
- `openingHoursSpecification`.
- `sameAs` — URLs LinkedIn, Fibois, PagesJaunes, etc.
- `founder` — utile pour l'E-E-A-T.

Ajouter aussi un bloc `WebSite` + `BreadcrumbList` sur l'accueil, et un `Service` sur chaque page d'expertise.

---

## 8. Corrections techniques

### 8.1 Indexation (priorité absolue)

**Créer `/robots.txt` :**

```
User-agent: *
Allow: /
Disallow: /merci.html

Sitemap: https://abcd-ing.fr/sitemap.xml
```

**Créer `/sitemap.xml`** — actuellement en 404. Il doit lister toutes les pages indexables avec leur date de dernière modification :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://abcd-ing.fr/</loc><lastmod>2026-10-02</lastmod><priority>1.0</priority></url>
  <url><loc>https://abcd-ing.fr/bureau-etudes-structure-angers.html</loc><lastmod>2026-10-02</lastmod><priority>0.9</priority></url>
  <url><loc>https://abcd-ing.fr/nos-expertises.html</loc><lastmod>2026-10-02</lastmod><priority>0.8</priority></url>
  <!-- ... une entrée par page ... -->
</urlset>
```

*(Espace de noms standard : `http://www.sitemaps.org/schemas/sitemap/0.9`. Le fichier peut être généré automatiquement par un script ou une extension à chaque build.)*

Exclure du sitemap : `/merci.html`, `/404.html`, et les URL redirigées.

**Search Console :** créer la propriété de domaine `abcd-ing.fr`, valider, soumettre le sitemap, puis demander l'indexation manuelle de l'accueil via l'inspection d'URL. À refaire après chaque modification majeure.

**Bing Webmaster Tools :** même chose — alimente ChatGPT et Copilot.

### 8.2 Autres correctifs

| Correctif | Pourquoi |
| --- | --- |
| Remplacer le CDN Tailwind par un CSS compilé | `cdn.tailwindcss.com` n'est pas destiné à la production : il dégrade les Core Web Vitals (LCP, CLS). |
| Ajouter `width`/`height` sur les `<img>` | Évite les décalages de mise en page (CLS). |
| `preload` sur l'image hero et sur la police Montserrat | Améliore le LCP. |
| Canonical auto-référent sur les 18 pages | Évite les doublons et consolide les signaux. |
| Corriger le canonical de l'article de blog | Il pointe aujourd'hui vers une URL redirigée en 302. |
| **Réactiver le blog et les réalisations** | Le blog est le moteur d'autorité thématique. Il porte déjà un contenu aligné sur les requêtes grand public (`plancher qui s'affaisse`). Le laisser redirigé en 302 supprime un actif SEO majeur. Si la décision de le masquer est définitive, prévoir un plan de contenu alternatif. |
| Ajouter les balises Open Graph | Sans impact direct sur le classement, mais améliore le partage social et donc les liens. |
| Retirer le widget `retours.stedzstudio.com` | Déjà signalé dans `.spec/note-tracking.md` : il envoie l'IP du visiteur à un tiers à chaque page vue. À supprimer avant mise en production. |

---

## 9. Contenu, preuves et E-E-A-T

Google évalue la crédibilité d'un site sur l'expérience, l'expertise, l'autorité et la fiabilité. Sur une requête impliquant la sécurité structurelle d'un bâtiment, ce critère est déterminant.

**À mettre en place :**

1. **Nommer les intervenants.** Un BET anonyme inspire moins confiance qu'un BET avec un ingénieur nommé, ses qualifications et son parcours. Ajouter une page ou une section « L'équipe » sur `/a-propos.html`.
2. **Publier des références exploitables.** Le site contient déjà 28 photographies de chantier (INPI, collèges Prégaudry et G. Halimi, IFCE, ferme traditionnelle, etc.). Chacune peut devenir une mini-étude de cas : le problème, la mission, ce qui a été fait, le résultat. C'est exactement ce qui manque aux pages concurrentes.
3. **Montrer les livrables.** Un extrait anonymisé de note de calcul, un sommaire de rapport de diagnostic : cela vaut mille adjectifs.
4. **Afficher l'assurance** et le cadre normatif (Eurocodes).
5. **Indiquer les délais et modalités** de prise en charge, comme le fait un concurrent strasbourgeois avec sa promesse de réponse sous 24 h.

---

## 10. Autorité et netlinking local

- **Presse locale et régionale** : Ouest-France, Courrier de l'Ouest, presse spécialisée BTP/bois.
- **Filière bois** : Fibois Pays de la Loire (adhésion + fiche annuaire), interprofessions, salons régionaux.
- **Partenariats** : architectes angevins, entreprises générales, promoteurs — avec citation sur leurs sites.
- **Interventions** : écoles d'ingénieurs, IUT, lycées professionnels, conférences.
- **Réseaux professionnels** : CCI, Novabuild, clubs d'entreprises.
- **Objectif de rythme** : 5 à 10 liens locaux de qualité par mois, pendant 6 mois. C'est le rythme de croisière d'une PME locale.
- **Signal fort pour la visibilité IA** : figurer dans les listes de type « meilleurs bureaux d'études à Angers » — ces classements sont aujourd'hui le premier facteur de citation par les IA.
- **Attention** : sur un domaine de 3 semaines, éviter toute acquisition massive ou automatisée. La progressivité est un signal de légitimité.

---

## 11. Mesure et pilotage

### Indicateurs à suivre

| Indicateur | Outil | Fréquence |
| --- | --- | --- |
| Indexation (`site:abcd-ing.fr`, couverture Search Console) | GSC | Hebdomadaire jusqu'à 100 % |
| Impressions / clics / position moyenne sur la requête cible | GSC | Hebdomadaire |
| Position réelle sur `bureau d'études structure Angers` | Suivi de position ou geo-grid | Hebdomadaire |
| Présence dans le pack local | Geo-grid (positions 3×3 ou 5×5 autour d'Angers) | Mensuel |
| Appels, demandes d'itinéraire, vues de la fiche | GBP Insights | Mensuel |
| Formulaires envoyés | Umami (déjà en place) — créer un événement sur `/merci.html` | Continu |
| Core Web Vitals | PageSpeed Insights / CrUX | Trimestriel |

**À faire maintenant :** prendre une **capture de référence** (position actuelle, indexation, avis, NAP) datée. Sans point de départ, impossible de prouver le progrès.

### Cible à 12 mois

| Échéance | Objectif |
| --- | --- |
| J+30 | Site indexé à 100 %, sitemap soumis, fiche GBP créée et vérifiée |
| J+60 | Accueil réécrit, schema en place, NAP complet partout, 5 avis |
| J+90 | Top 20 sur la requête cible, 10 avis, page Angers publiée et maillée |
| M+6 | Top 5 organique, présence régulière dans le pack local |
| M+9 à M+12 | **Position n°1 organique** et pack local stable |

---

## 12. Feuille de route

### Phase 0 — Débloquer (semaine 1)

1. Créer `robots.txt` et `sitemap.xml`.
2. Valider la propriété Search Console + Bing Webmaster Tools, soumettre le sitemap, demander l'indexation de l'accueil.
3. Ajouter les canonicals sur les 18 pages.
4. Renseigner le NAP complet (adresse + téléphone) dans le pied de page et sur `/contact.html`.
5. Corriger l'incohérence de SIREN entre le brief et le pied de page.

### Phase 1 — On-page (semaines 2 à 4)

6. Modifier `title`, meta description et `h1` de l'accueil.
7. Réécrire/restructurer les H2, ajouter la section Angers enrichie, le bloc preuves et la FAQ.
8. Ajouter le JSON-LD `ProfessionalService` + `WebSite` + `FAQPage`.
9. Corriger les ancres de maillage interne.
10. Intégrer la carte Google Maps en lazy-load.

### Phase 2 — Local (mois 2)

11. Créer et vérifier la fiche Google Business Profile, catégories, description, photos, horaires.
12. Lancer la collecte d'avis (objectif 10 avis, note ≥ 4,5).
13. Créer Bing Places et Apple Business Connect.
14. Soumettre aux annuaires prioritaires (PagesJaunes, Fibois, CCI, LinkedIn, Pappers).

### Phase 3 — Contenu et autorité (mois 2 à 6)

15. Publier `/bureau-etudes-structure-angers.html` et la mailler depuis l'accueil, le footer, les expertises.
16. Réactiver le blog et publier 2 articles par mois, alignés sur les requêtes de `.spec/mots clés.md`.
17. Transformer les 28 photos de chantier en études de cas.
18. Démarrer la prospection de liens locaux (presse, filière bois, partenaires).

### Phase 4 — Optimisation continue (mois 6 à 12)

19. Migrer Tailwind Play CDN vers un CSS compilé, optimiser les Core Web Vitals.
20. Publier les posts GBP, entretenir les avis, surveiller les positions.
21. Ajuster les contenus selon les requêtes réelles remontées par Search Console.

---

## 13. À ne pas faire

- **Bourrer les mots clés.** C'est la faute du principal concurrent (Sodeba) : répétition mécanique de « bureau d'études structure Angers » à chaque phrase. Cela dégrade la lecture sans améliorer le classement.
- **Créer des pages villes en série.** Des pages « Angers », « Nantes », « Rennes » au contenu interchangeable sont considérées comme des *doorway pages* et sanctionnées.
- **Acheter des liens** ou utiliser des annuaires de spam.
- **Baliser des avis inexistants** dans le schema.
- **Attendre des résultats sur un domaine non indexé.** L'indexation est le prérequis de tout le reste : à traiter avant toute optimisation de contenu.
- **Négliger la fiche Google Business Profile.** C'est le levier n°1 sur cette requête, avant même le contenu du site.

---

## 14. Limites de ce rapport

Ce rapport s'appuie sur l'analyse du code source, du SERP public et des fichiers de spécification du projet. Il ne peut pas, en l'état, évaluer :

- **les positions réelles et géolocalisées** (nécessite un outil de suivi ou un geo-grid) ;
- **le profil de backlinks** du domaine et des concurrents (nécessite Ahrefs, Semrush ou DataForSEO) ;
- **les données de la fiche Google Business Profile** (Insights : recherches, appels, itinéraires) ;
- **le volume de recherche exact** de la requête cible ;
- **la présence d'éventuelles pénalités** ou d'un historique sur d'anciens domaines liés.

Pour aller plus loin, deux compléments sont recommandés : un audit de backlinks (DataForSEO ou équivalent) et la mise en place d'un **geo-grid** pour mesurer la position réelle dans le pack local autour d'Angers.

---

## Annexes — livrables prêts à l'emploi

### A. En-tête de la page d'accueil (version cible)

```html
<title>Bureau d'études structure à Angers | ABCD Ingénierie</title>
<meta name="description" content="Bureau d'études structure à Angers, spécialisé bois et métal : conception, exécution, diagnostic structurel et renforcement. Parlons de votre projet.">
<link rel="canonical" href="https://abcd-ing.fr/">
```

### B. Hero réécrit

```html
<p class="eyebrow">Bureau d'études structure · Angers (49) · Bois &amp; métal</p>
<h1 class="...">Bureau d'études structure à Angers, spécialisé bois et métal</h1>
<p class="...">
  <strong>La rigueur d'un bureau d'études, la proximité d'un partenaire de projet.</strong>
  ABCD Ingénierie conçoit, calcule et diagnostique les structures bois et métalliques
  pour les professionnels et les particuliers, à Angers, en Maine-et-Loire
  et partout en France selon votre projet.
</p>
```

### C. Fichier robots.txt

```
User-agent: *
Allow: /
Disallow: /merci.html

Sitemap: https://abcd-ing.fr/sitemap.xml
```

*(Espace de noms standard : `http://www.sitemaps.org/schemas/sitemap/0.9`. Le domaine `abcd-ing.fr` est bien celui du site en production.)*

---

*Rapport établi le 2 octobre 2026 à partir de l'analyse du code source de `site/`, des fichiers `.spec/` et du SERP public sur la requête « bureau d'études structure Angers ». Mis à jour après application des correctifs.*

---

# Suivi des correctifs appliqués

## Fait — 2 octobre 2026

### Indexation et exploration

| Correctif | Détail |
| --- | --- |
| `site/robots.txt` créé | Autorise tout le site, exclut `/merci.html`, déclare le sitemap. Renvoyait auparavant la page 404. |
| `site/sitemap.xml` créé | 14 URL indexables, XML validé. Renvoyait auparavant 404. |
| Canonical sur les 20 pages | Auto-référent et absolu (`https://abcd-ing.fr/...`). Le canonical relatif et erroné de l'article de blog a été corrigé. |
| Sitemap déclaré aux crawlers | Via `robots.txt`. **Reste à faire côté humain :** créer la propriété Search Console et Bing Webmaster Tools, soumettre le sitemap, demander l'indexation de l'accueil. |

### Page d'accueil — balises et données structurées

| Élément | Avant | Après |
| --- | --- | --- |
| `<title>` | `Accueil — ABCD Ingénierie` | `Bureau d’études structure à Angers \| ABCD Ingénierie` (52 car.) |
| Meta description | Générique, sans local | 149 car., mot clé + offres + appel à l'action |
| `<h1>` | Phrase de marque | `Bureau d’études structure à Angers, spécialisé bois et métal` — la phrase de marque devient un sous-titre |
| Open Graph | Absent | 7 balises `og:` (titre, description, URL, image, locale) |
| JSON-LD | Absent sur tout le site | `ProfessionalService` (adresse, géo, zone desservie, catalogue d'offres), `WebSite`, `FAQPage` (7 questions) |

Les 7 questions du balisage `FAQPage` sont **identiques au texte visible** — vérifié automatiquement, sans écart.

### Page d'accueil — contenu et structure

| Ajout | Détail |
| --- | --- |
| Section « Nos prestations de bureau d'études structure à Angers » | **Nouvelle.** Expose les 4 offres prévues au brief (conception, exécution, diagnostic avec et sans recommandations), qui n'apparaissaient nulle part sur l'accueil. |
| Section « Pourquoi confier votre étude structure à ABCD Ingénierie ? » | **Nouvelle.** Six arguments appuyés sur ce que le site affirme déjà : spécialisation bois/métal, distinction constaté/calculé, relevés et sondages, Eurocodes selon la mission, limites de l'analyse signalées, interlocuteur unique. Aucune affirmation non vérifiable (pas d'assurance, de certification ni de chiffre inventé). |
| Section FAQ | **Nouvelle.** 7 questions, balisées `FAQPage`. |
| Section implantation enrichie | `h2` réécrit avec « bureau d'études structure » et « Angers ». Adresse du siège, 10 communes autour d'Angers, spécificité du bâti angevin (tuffeau, ardoise, planchers et charpentes bois). |
| Carte Google Maps | Intégrée sur l'accueil et sur la page contact, en `loading="lazy"`. |
| Maillage interne | Ancres descriptives ajoutées : « nos expertises structure bois et métal », « demander une étude structure à Angers », « notre méthode de travail ». |

Volume du corps de page : **1 307 mots** (contre ~1 100). Densité maîtrisée, sans bourrage :

- « bureau d'études structure à Angers » : 3 occurrences (0,23 %)
- « Angers » : 15 occurrences (1,15 %)
- « structure » : 2,14 %

### NAP et coordonnées

- Adresse complète « 15 rue Evain, 49000 Angers » ajoutée au **pied de page des 20 pages**, avec l'e-mail `contact@abcd-ing.fr` et la mention de la présence secondaire.
- Page contact : `h2` « Où nous trouver » complété (adresse, e-mail, zone d'intervention, carte).
- Coordonnées géographiques réelles relevées pour le balisage : `47.4604909, -0.5528481` (adresse vérifiée et géocodée).

### Page de support `/bureau-etudes-structure-angers.html` — créée

Page dédiée à la longue traîne locale, maillée depuis l'accueil, `nos-expertises.html` et `domaines-intervention.html`, et déclarée au sitemap.

| Élément | Valeur |
| --- | --- |
| `<title>` | `Bureau d’études structure à Angers \| ABCD Ingénierie` (52 car.) |
| Meta description | 142 car. |
| `<h1>` | `Bureau d’études structure à Angers` |
| JSON-LD | `Service` (fournisseur rattaché à l'organisation par `@id`), `BreadcrumbList`, `FAQPage` (6 questions) |
| Sections | Le bâti angevin et ses contraintes structurelles · Nos missions à Angers · Communes et départements · Déroulement d'une étude · FAQ · Contact |
| Volume | 1 136 mots |

Contenu entièrement original : **0 phrase de 10 mots en commun avec l'accueil** (vérifié automatiquement), en dehors du gabarit de navigation et de pied de page. La page ne reproduit ni les questions de la FAQ d'accueil, ni les formulations de la section « prestations », ce qui écarte le risque de page-passerelle.

Densités : « bureau d'études structure » 0,35 %, « Angers » 1,58 %, « Maine-et-Loire » 0,35 %.

## Décisions prises par le client

| Sujet | Décision |
| --- | --- |
| Migration Tailwind Play CDN | **Reportée** — à traiter une fois le reste stabilisé. |
| Blog et réalisations (302 vers l'accueil) | **Maintenus masqués** pour l'instant. |
| Numéro de téléphone | **Non fourni.** Il reste absent du site ; à ajouter dès qu'il sera disponible. |

### Points vérifiés, sans action nécessaire

- Le widget `retours.stedzstudio.com` **n'est plus présent** dans le site : le point de vigilance de `.spec/note-tracking.md` est donc résolu.
- La balise Umami est bien présente une seule fois sur chacune des pages.
- **Contrôle global** : 20/20 pages conformes (canonical, NAP, un seul `<title>`, un seul `<h1>`), 6 blocs JSON-LD valides, 640 liens internes vérifiés sans aucun lien cassé, HTML bien formé sur l'ensemble du site, sitemap cohérent avec les pages indexables.
- La structure HTML de l'accueil a été revalidée : aucune balise non fermée, aucune erreur d'imbrication.

## Reste à faire

### Bloquant — information manquante

1. **Numéro de téléphone.** Aucun numéro n'existe nulle part dans le projet. Il est volontairement absent des correctifs plutôt que remplacé par une valeur inventée. Dès qu'il est fourni, il doit être ajouté : pied de page (19 pages), page contact, balisage `telephone`, et fiche Google Business Profile — **au format strictement identique partout**.

### Technique

2. **Tailwind Play CDN.** `cdn.tailwindcss.com` est toujours chargé en production (20 pages). Migration reportée à la demande du client.
3. `width`/`height` sur les images et `preload` sur l'image hero et la police.

### SEO local (hors code)

4. Créer et vérifier la fiche **Google Business Profile** (catégorie principale, description, 15–30 photos, horaires).
5. Créer **Bing Places** et **Apple Business Connect**.
6. Lancer la collecte d'**avis** : objectif 10 avis, note ≥ 4,5, rythme régulier.
7. Soumettre aux annuaires : PagesJaunes, Fibois Pays de la Loire, CCI Maine-et-Loire, LinkedIn, Pappers, Novabuild.
8. **Search Console / Bing Webmaster Tools** : propriété à valider, sitemap à soumettre, indexation de l'accueil à demander.

### Contenu

9. ~~Créer la page de support `/bureau-etudes-structure-angers.html`~~ — **fait**.
10. Blog et réalisations : maintien du masquage acté par le client. À réexaminer si l'autorité thématique devient le facteur limitant.
11. Transformer les 28 photos de chantier en études de cas.
