# Sitemap & contenus — ABCD Ingénierie

> Périmètre : site vitrine, phase 1. Ce document décrit la structure éditoriale et les contenus attendus ; il ne constitue pas une direction artistique ni une maquette.

## 1. Objectif et principe de navigation

**Promesse globale :** ABCD Ingénierie conçoit, analyse et sécurise les structures bois et métal pour des projets de construction, rénovation, extension ou transformation.

Le site doit répondre, dès les premières secondes, à trois questions :

1. De quel interlocuteur s'agit-il ? Un bureau d'études structure, expert bois et métal.
2. En quoi peut-il aider ? Conception, exécution ou diagnostic de l'existant.
3. Comment avancer ? En présentant simplement son projet via le formulaire de contact.

Le formulaire de contact est le point de conversion principal. Chaque page comporte un appel clair vers `/contact`.

## 2. Arborescence

```text
/
├── /prestations
│   ├── #conception
│   ├── #execution
│   ├── #diagnostic-avec-recommandations
│   └── #diagnostic-visuel
├── /a-propos
├── /contact
├── /mentions-legales
├── /politique-de-confidentialite
└── /blog                         (prévu, non publié en phase 1)
    └── /blog/[slug]              (prévu, non publié en phase 1)
```

### Navigation principale

- Logo ABCD Ingénierie → Accueil
- Prestations
- À propos
- Contact / « Parler de votre projet » (CTA visuellement prioritaire)

### Pied de page

- Coordonnées : 15 rue Evain, 49000 Angers ; établissement secondaire à Saint-Gildas-de-Rhuys.
- Liens : Prestations, À propos, Contact, Mentions légales, Politique de confidentialité.
- Raison sociale : ABCD Ingénierie, SAS — SIREN 000 000 000 — NAF 71.12B.
- Futur lien Blog, à activer au lancement de la rubrique.

---
+> met toutes la structure/copy des pages dans un dossier .spec/squelette/nom-de-la-page.md.
## 3. Page Accueil — `/`

### Rôle

Faire comprendre immédiatement le positionnement, diriger le visiteur vers le besoin correspondant et l'amener au contact.

### Séquence de contenus

#### 1. Hero — Hook

- **H1 :** `Des structures bois et métal pensées pour faire avancer votre projet.`
- **Texte :** `ABCD Ingénierie accompagne vos projets de construction, rénovation, extension et transformation, de l'étude de conception au diagnostic de l'existant.`
- **CTA principal :** `Présenter mon projet` → `/contact`
- **CTA secondaire :** `Découvrir nos prestations` → `/prestations`

#### 2. Réassurance — Le rôle du bureau d'études

- **H2 :** `Une expertise structure claire, à chaque étape du projet.`
- **Texte :** `Notre métier consiste à analyser, concevoir et dimensionner les structures bois et métal. Nous produisons des études compréhensibles et adaptées aux contraintes techniques, réglementaires et opérationnelles de votre projet.`
- **Points de preuve :**
  - Expertise ciblée : bois et métal.
  - Intervention sur le neuf comme sur l'existant.
  - Échanges clairs avec maîtres d'ouvrage, architectes, maîtres d'œuvre et entreprises.
  - Livrables ajustés à la phase et au besoin.

#### 3. Entrées par besoin — Zone d'intervention

- **H2 :** `De quel accompagnement avez-vous besoin ?`
- **Introduction :** `Identifiez la situation qui correspond à votre projet ; nous vous aidons à préciser le périmètre de l'étude.`

| Entrée | Besoin du visiteur | Message | Lien |
| --- | --- | --- | --- |
| Conception | J'ai un projet à imaginer, valider ou dimensionner. | `Définir une solution structurelle fiable dès les premières phases.` | `/prestations#conception` |
| Exécution | Mon projet est défini et doit être réalisé. | `Disposer des études et documents utiles à la bonne exécution des travaux.` | `/prestations#execution` |
| Diagnostic avec recommandations | Je constate un désordre, une fragilité ou une contrainte sur un ouvrage existant. | `Comprendre la situation et obtenir des préconisations d'intervention.` | `/prestations#diagnostic-avec-recommandations` |
| Diagnostic visuel | J'ai besoin d'un constat sur l'état apparent d'une structure existante. | `Bénéficier d'une analyse visuelle, sans préconisation de travaux.` | `/prestations#diagnostic-visuel` |

#### 4. Méthode — Réassurance

- **H2 :** `Un accompagnement rigoureux, sans complexifier les échanges.`
- **Étapes :**
  1. `Comprendre` — écoute du besoin, du contexte et des contraintes.
  2. `Analyser` — collecte des informations utiles et étude de la structure.
  3. `Proposer` — remise d'études, de constats ou de documents adaptés à la mission.
  4. `Échanger` — explication des résultats et coordination avec les intervenants concernés.

#### 5. Projets / références — Module évolutif

- **H2 :** `Des projets concrets, des réponses adaptées.`
- **Contenu au lancement :** `Les premières références ABCD Ingénierie seront bientôt présentées ici.`
- **Évolution prévue :** cartes projet avec contexte, type de mission, matériaux, enjeux et solution apportée. Ne pas inventer de références avant leur disponibilité.

#### 6. CTA final

- **Titre :** `Parlons de votre projet.`
- **Texte :** `Décrivez votre besoin, l'état d'avancement du projet et les documents dont vous disposez. Nous vous orienterons vers la mission adaptée.`
- **CTA :** `Accéder au formulaire de contact` → `/contact`

---

## 4. Page Prestations — `/prestations`

### Rôle

Expliquer précisément les quatre offres et éviter toute confusion, en particulier entre le diagnostic assorti de recommandations et le diagnostic visuel.

### En-tête — Hook

- **H1 :** `Des études structure adaptées à votre besoin, du projet à l'existant.`
- **Texte :** `ABCD Ingénierie intervient sur les structures bois et métal pour concevoir, préparer l'exécution ou analyser un ouvrage existant.`
- **CTA :** `Présenter mon besoin` → `/contact`

### Repère transversal

- **H2 :** `Choisir la bonne mission.`
- **Texte :** `Le niveau d'analyse et les livrables dépendent de votre situation. Nous vous aidons à définir un périmètre cohérent avant le démarrage de l'étude.`

### Offre 1 — `#conception`

- **H2 :** `Conception`
- **Accroche :** `Donner à votre projet une solution structurelle fiable dès les premières phases.`
- **Pour quels besoins ?** Construction neuve, rénovation, extension, transformation ou étude de faisabilité ; projet en phase d'esquisse, d'avant-projet ou de définition technique.
- **Ce que nous faisons :** analyse des contraintes, réflexion sur les principes porteurs, dimensionnement des solutions structurelles bois et métal, échange avec les autres intervenants du projet.
- **Livrables attendus :** notes de calcul et documents d'étude adaptés à la phase de conception ; éléments permettant de comprendre et valider le principe structurel retenu.
- **Bénéfice :** `Prendre des décisions éclairées avant d'engager les travaux.`
- **CTA :** `Échanger sur une étude de conception` → `/contact?besoin=conception`

### Offre 2 — `#execution`

- **H2 :** `Exécution`
- **Accroche :** `Transformer un projet défini en documents utiles à la bonne réalisation des travaux.`
- **Pour quels besoins ?** Projet prêt à entrer en réalisation, consultation ou chantier ; besoin de préciser les solutions prévues pour les entreprises et les équipes de maîtrise d'œuvre.
- **Ce que nous faisons :** approfondissement des études, vérification et dimensionnement des éléments nécessaires à l'exécution, production des documents relevant du périmètre de mission.
- **Livrables attendus :** études d'exécution et documents techniques définis au préalable avec le client, adaptés aux ouvrages bois et métal concernés.
- **Bénéfice :** `Sécuriser l'exécution en donnant aux intervenants un cadre technique lisible.`
- **CTA :** `Parler de mon projet en phase travaux` → `/contact?besoin=execution`

### Offre 3 — `#diagnostic-avec-recommandations`

- **H2 :** `Diagnostic structurel avec recommandations`
- **Accroche :** `Comprendre l'état d'une structure existante et identifier les interventions à envisager.`
- **Pour quels besoins ?** Désordre apparent, doute sur une structure, projet de transformation, changement d'usage, sinistre ou besoin de vérifier la faisabilité d'une intervention sur l'existant.
- **Ce que nous faisons :** visite et analyse de l'existant dans le périmètre défini, identification des désordres ou contraintes observés, analyse structurelle, formulation de préconisations d'intervention.
- **Livrables attendus :** rapport de diagnostic précisant les constats, l'analyse et les recommandations associées au périmètre de mission.
- **Limite à rendre explicite :** les recommandations sont établies à partir des informations accessibles et du périmètre validé ; des investigations complémentaires peuvent être nécessaires.
- **Bénéfice :** `Disposer d'une base technique pour décider des suites à donner au projet.`
- **CTA :** `Demander un diagnostic avec recommandations` → `/contact?besoin=diagnostic-recommandations`

### Offre 4 — `#diagnostic-visuel`

- **H2 :** `Diagnostic structurel sans recommandations — constat visuel`
- **Accroche :** `Obtenir un état des lieux visuel de l'existant, sans prescription de travaux.`
- **Pour quels besoins ?** Première appréciation de l'état apparent d'un ouvrage, besoin de documenter des observations, demande de constat limitée à ce qui est visible et accessible.
- **Ce que nous faisons :** visite visuelle de la structure, relevé des éléments et désordres apparents, restitution d'un constat dans le périmètre défini.
- **Livrables attendus :** compte rendu ou rapport de constat visuel décrivant les observations réalisées.
- **Limite essentielle :** `Cette mission ne comprend ni préconisation de travaux, ni dimensionnement, ni validation de la capacité structurelle au-delà des éléments observables.`
- **Bénéfice :** `Objectiver l'état apparent d'une structure avant de décider d'éventuelles investigations ou études complémentaires.`
- **CTA :** `Demander un constat visuel` → `/contact?besoin=diagnostic-visuel`

### Tableau comparatif — Réassurance et clarification

| Mission | Point de départ | Résultat attendu | Recommandations de travaux |
| --- | --- | --- | --- |
| Conception | Projet à définir ou à valider | Solution structurelle étudiée et dimensionnée selon la phase | Oui, sous forme de solution de conception |
| Exécution | Projet défini à réaliser | Études et documents d'exécution convenus | Oui, dans le périmètre des études d'exécution |
| Diagnostic avec recommandations | Ouvrage existant à analyser | Rapport d'analyse et préconisations | Oui |
| Diagnostic visuel | Ouvrage existant à constater | Compte rendu des observations visuelles | Non |

### CTA final

- **Titre :** `Vous hésitez sur la mission à prévoir ?`
- **Texte :** `Présentez-nous votre situation : nous vous aiderons à qualifier le besoin et les informations à transmettre.`
- **CTA :** `Être orienté vers la bonne prestation` → `/contact`

---

## 5. Page À propos — `/a-propos`

### Rôle

Humaniser le bureau d'études, expliquer sa manière de travailler et instaurer la confiance sans revendiquer d'informations non fournies.

### En-tête — Hook

- **H1 :** `La rigueur d'un bureau d'études, la clarté d'un partenaire de projet.`
- **Texte :** `ABCD Ingénierie est un bureau d'études structure spécialisé dans le bois et le métal. Nous aidons les acteurs d'un projet à faire des choix structurels justes, compréhensibles et réalisables.`
- **CTA :** `Parler de votre projet` → `/contact`

### Identité

- **H2 :** `ABCD Ingénierie, bureau d'études structure.`
- **Texte :** `Implantée à Angers et également présente à Saint-Gildas-de-Rhuys, ABCD Ingénierie intervient sur des projets de construction, rénovation, extension et transformation. Notre champ d'expertise est centré sur les structures bois et métal.`
- **Informations factuelles :** SAS créée le 9 septembre 2026 ; activité d'ingénierie et d'études techniques (NAF 71.12B). Ces mentions peuvent être réservées aux pages légales si elles alourdissent la lecture.

### Approche — Réassurance

- **H2 :** `Une démarche structurée et accessible.`
- **Texte :** `Une étude utile commence par une bonne compréhension du contexte. Nous clarifions le besoin, analysons les contraintes et partageons des conclusions adaptées aux décisions à prendre.`
- **Piliers :**
  - `Écouter` — tenir compte des objectifs, contraintes et usages du projet.
  - `Analyser avec précision` — s'appuyer sur les données disponibles et signaler les limites éventuelles de l'étude.
  - `Rendre lisible` — expliquer les enjeux structurels sans jargon inutile.
  - `Travailler en coordination` — faciliter le dialogue entre maître d'ouvrage, architecte, maître d'œuvre et entreprises.

### Pour qui ?

- **H2 :** `Un interlocuteur structure pour les acteurs du projet.`
- **Publics :** maîtres d'ouvrage, architectes, maîtres d'œuvre, entreprises et porteurs de projet.
- **Texte :** `Quel que soit votre rôle, nous adaptons nos échanges et nos livrables à la décision ou à l'action que vous devez engager.`

### Matériaux et terrains d'intervention

- **H2 :** `Bois et métal : une expertise dédiée.`
- **Texte :** `Ces matériaux appellent une analyse attentive de leurs assemblages, de leurs contraintes et de leur interaction avec l'existant. Notre mission est de les mettre au service d'une structure cohérente et durable.`

### CTA final

- **Titre :** `Un projet à étudier, un existant à analyser ?`
- **CTA :** `Nous présenter votre besoin` → `/contact`

---

## 6. Page Contact — `/contact`

### Rôle

Réduire l'effort de prise de contact, préciser les informations utiles et convertir toute intention en demande exploitable.

### En-tête — Hook

- **H1 :** `Parlons de votre projet.`
- **Texte :** `Décrivez votre besoin en quelques mots. Plus nous comprenons le contexte, plus nous pouvons vous orienter vers la mission adaptée.`

### Réassurance avant formulaire

- **Titre :** `Vous ne savez pas encore quelle étude prévoir ?`
- **Texte :** `Indiquez simplement l'état d'avancement du projet ou ce que vous observez sur l'existant. Nous vous aiderons à préciser votre demande.`

### Formulaire

Champs recommandés :

- Prénom et nom* 
- Société / organisation (facultatif)
- E-mail* 
- Téléphone (facultatif)
- Commune ou localisation du projet*
- Votre profil : maître d'ouvrage, architecte, maître d'œuvre, entreprise, particulier / porteur de projet, autre
- Nature du besoin* : conception, exécution, diagnostic avec recommandations, constat visuel, besoin à préciser
- Type de projet : construction, rénovation, extension, transformation, autre
- État d'avancement : réflexion, conception, consultation, travaux, ouvrage existant, autre
- Description du projet ou de la demande*
- Documents disponibles : plans, photos, rapport existant, autre (pièces jointes facultatives si la solution technique le permet)
- Consentement au traitement des données* avec lien vers la politique de confidentialité

**Bouton d'envoi :** `Envoyer ma demande`

**Message de réassurance :** `Les informations transmises servent uniquement à étudier votre demande et à vous recontacter.`

### Informations de contact direct

- **H2 :** `Coordonnées`
- Siège social : 15 rue Evain, 49000 Angers.
- Établissement secondaire : Saint-Gildas-de-Rhuys.
- Téléphone et adresse e-mail : à renseigner avant publication.
- Horaires : à renseigner si souhaités.

### Confirmation après envoi

- **Titre :** `Votre demande a bien été envoyée.`
- **Texte :** `Merci pour ces premières informations. ABCD Ingénierie reviendra vers vous afin de préciser votre besoin et les prochaines étapes.`
- **CTA secondaire :** `Retour à l'accueil` → `/`

---

## 7. Pages légales

### Mentions légales — `/mentions-legales`

À publier avant mise en ligne avec les informations complètes sur l'éditeur, l'hébergeur, le responsable de publication, les coordonnées de contact et le SIREN. Base connue : ABCD Ingénierie, SAS, siège au 15 rue Evain, 49000 Angers, SIREN 000 000 000, code NAF 71.12B.

### Politique de confidentialité — `/politique-de-confidentialite`

Décrire les données collectées par le formulaire, la finalité de traitement (répondre aux demandes), la base légale, la durée de conservation, les destinataires, les droits des personnes et le moyen de les exercer. À valider avec les responsables juridiques avant publication.

---

## 8. Blog — préparation éditoriale, hors publication phase 1

### Positionnement

Le futur blog prolonge le rôle pédagogique du site : expliquer simplement les enjeux de structure, valoriser les matériaux bois et métal et aider les visiteurs à mieux préparer leur projet.

### Catégories suggérées

- Comprendre la structure
- Construire en bois
- Construire en métal
- Rénover et transformer l'existant
- Diagnostics et bonnes pratiques
- Vie des projets

### Gabarit d'article

- Titre orienté question ou bénéfice.
- Introduction : situation rencontrée et promesse de lecture.
- Explication structurée, en langage accessible.
- Encadré : points de vigilance / ce qu'il faut retenir.
- CTA : `Vous avez un projet similaire ? Présentez-le-nous.` → `/contact`

---

## 9. Règles éditoriales transversales

- Employer un ton professionnel, accessible et précis ; privilégier les verbes concrets : analyser, concevoir, dimensionner, vérifier, expliquer, accompagner.
- Éviter le jargon non expliqué et les promesses absolues (par exemple « garantie », « sans risque » ou « expertise complète ») qui ne seraient pas justifiées.
- Distinguer systématiquement constat, analyse, préconisation et étude d'exécution.
- Ne pas présenter le diagnostic visuel comme une validation structurelle ou une prescription de travaux.
- Ne publier aucune référence, certification, zone d'intervention précise, coordonnée téléphonique ou adresse e-mail non confirmée.
- Faire apparaître un CTA vers le formulaire au minimum dans le hero et en conclusion de chaque page principale.
