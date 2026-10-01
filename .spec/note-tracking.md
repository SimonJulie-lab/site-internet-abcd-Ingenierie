# Mesure d'audience — Umami

## Code installé

Le code de suivi est chargé dans le `<head>` de chaque page du site, juste après la balise `<title>` :

```html
<script defer src="https://cloud.umami.is/script.js" data-website-id="fee80ad3-228d-4069-9e42-6f5cad8a54b8"></script>
```

L'identifiant de site Umami est `fee80ad3-228d-4069-9e42-6f5cad8a54b8`. La balise est reprise à l'identique dans les 18 pages HTML de `site/`, y compris `404.html` et les pages `blog/` et `realisations/`. Toute page ajoutée par la suite doit reprendre cette balise dans son `<head>`, ou hériter d'un gabarit commun qui la porte.

## Mesures annoncées par Umami

La documentation d'Umami indique que le traceur ne dépose pas de cookies et collecte notamment les pages vues, les URL référentes, le navigateur, le système d'exploitation, le type d'appareil et le pays. Umami indique aussi que les données sont anonymisées. Vérifier les données réellement reçues et les options actives dans le compte ABCD Ingénierie avant publication.

Umami Cloud indique que ses serveurs peuvent être situés dans l'Union européenne ou aux États-Unis, selon la région du compte. Relever la région du compte ABCD Ingénierie, la durée de conservation configurée et les garanties prévues au contrat (DPA) avant de finaliser l'information de confidentialité.

## Information des visiteurs et conformité

La politique de confidentialité mentionne désormais l'utilisation d'Umami Cloud. Cette mention ne suffit pas à établir à elle seule qu'aucun consentement préalable n'est requis. La CNIL n'exempte la mesure d'audience de consentement que sous conditions strictes : finalité limitée à la mesure d'audience pour le compte de l'éditeur, production de statistiques anonymes, absence de recoupement avec d'autres traitements et absence de suivi intersites. Les traitements restent par ailleurs soumis au RGPD et à l'exercice des droits.

Avant la mise en production, vérifier et documenter que la configuration Umami respecte ces conditions et prévoir un moyen d'opposition au traitement fondé sur l'intérêt légitime. Si les conditions d'exemption ne sont pas réunies, ne charger le script qu'après obtention du consentement préalable.

## Références

- [Umami — collecte des données](https://docs.umami.is/docs/faq)
- [Umami Cloud — FAQ](https://docs.umami.is/docs/cloud/faq)
- [CNIL — conditions d'exemption des outils de mesure d'audience](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [CNIL — droits des personnes](https://www.cnil.fr/fr/preparer-lexercice-des-droits-des-personnes)
