# Arborescence du site — ABCD Ingénierie

Les éléments en capitales dans l'arborescence initiale correspondent aux pages. Les intitulés de niveau inférieur correspondent aux sections de ces pages. Les pages de profil sont directement accessibles depuis l'accueil.

```text
Accueil /
├── Architectes & maîtres d’œuvre /architectes-maitres-oeuvre
├── Entreprises /entreprises
├── Particulier /particuliers
│   ├── Diagnostic
│   └── Projet de construction
├── Syndics /syndics
├── Judiciaire /judiciaire
├── Secteur public /secteur-public
├── Nos expertises /nos-expertises
│   ├── Structure bois
│   ├── Structure métal
│   ├── Structure existante
│   ├── Renforcement
│   └── Extensions & transformations
├── Nos domaines d'intervention /domaines-intervention
│   ├── Construction neuve
│   ├── Rénovation
│   ├── Réhabilitation
│   ├── Extension
│   ├── Transformation
│   └── Projets spécifiques
├── Réalisations /realisations
│   └── Fiche projet /realisations/[nom-realisation]
├── À propos /a-propos
│   ├── ABCD Ingénierie
│   ├── Notre méthode
│   └── Notre secteur d'intervention
└── Contact /contact
```

## Navigation

Le formulaire de contact est le point de conversion principal. Chaque page doit proposer un appel à l'action vers `/contact`.

Le pied de page comprend les coordonnées validées et les liens vers les pages légales : `/mentions-legales` et `/politique-de-confidentialite`.

## Contenus associés

- Les contenus éditoriaux sont détaillés dans `.spec/squelette/`.
- Les expressions de recherche grand public et les termes métier sont intégrés aux squelettes concernés, principalement `particuliers.md`, `architectes-maitres-oeuvre.md`, `entreprises.md`, `nos-expertises.md` et `domaines-intervention.md`.
- Les pages légales restent nécessaires avant publication ; leurs informations sont à compléter et valider.
- Le blog est une évolution ultérieure et ne fait pas partie de cette arborescence de première phase.
