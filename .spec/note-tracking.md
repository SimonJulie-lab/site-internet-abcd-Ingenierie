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

Avant la mise en production, vérifier et documenter que la configuration Umami respecte ces conditions. Un moyen d'opposition direct est en place (voir « Moyen d'opposition » ci-dessous). Si les conditions d'exemption ne sont pas réunies, ne charger le script qu'après obtention du consentement préalable.

## Moyen d'opposition

Le site ne comporte aucun bandeau de consentement : il n'embarque ni pixel publicitaire, ni autre outil de mesure que celui-ci, ni vidéo intégrée. La mesure d'audience repose sur l'intérêt légitime, avec un moyen d'opposition accessible en un clic.

L'opposition est proposée dans la politique de confidentialité, section « Mesure d'audience » (`/politique-de-confidentialite.html#mesure-audience-opposition`) : un bouton bascule qui écrit le drapeau lu par le traceur.

```js
localStorage.setItem('umami.disabled', '1');   // opposition
localStorage.removeItem('umami.disabled');     // retour au réglage par défaut
```

Vérifié sur le script servi par `https://cloud.umami.is/script.js` : le traceur lit `localStorage.getItem("umami.disabled")` avant tout envoi. Testé en local — drapeau absent, la page vue part vers `gateway.umami.is/api/send` ; drapeau posé, aucun envoi. Le bouton a été testé dans les deux sens : refus, rechargement sans envoi, puis réactivation et retour des envois.

Le réglage porte sur le navigateur et l'appareil de la personne, pas sur un compte : la politique de confidentialité le précise. Un renvoi depuis la section « Vos droits » mène au bouton, et l'adresse e-mail du DPO reste ouverte à celles et ceux qui préfèrent écrire.

À noter : le traceur sait aussi respecter l'en-tête Do Not Track, mais uniquement si la balise porte `data-do-not-track="true"`. Sans cet attribut, le signal DNT du navigateur est ignoré — vérifié également.

## Widget de retours Stedz Studio

Toutes les pages chargent également `https://retours.stedzstudio.com/w.js` (script asynchrone en fin de `<body>`), ajouté par le studio pendant la phase de relecture. Le logo de l'en-tête est par ailleurs servi depuis `cdn.stedzstudio.com`.

Comportement vérifié : sans paramètre `?r=<jeton>` dans l'URL, le script ne fait rien — aucun widget injecté, aucune écriture de stockage, aucune requête supplémentaire. Avec un jeton, il injecte une interface de commentaires et interroge `comments?token=…`. C'est ce widget qui produit les ancrages du type `.shell:nth-child(9) > .rail` relevés dans la fiche des retours.

À retenir : même inerte, la balise provoque un appel à `retours.stedzstudio.com` à chaque page vue, qui reçoit donc l'adresse IP et le référent du visiteur. Ce point doit être soit déclaré dans la politique de confidentialité, soit supprimé du site : le script n'a pas sa place dans la version publiée une fois la relecture terminée.

Historique : absent des commits `960d0ec` à `00a6485`, apparu dans l'arbre de travail pendant la phase de relecture, puis intégré au commit `ec13387` faute d'avoir été repéré plus tôt.

## Références

- [Umami — collecte des données](https://docs.umami.is/docs/faq)
- [Umami Cloud — FAQ](https://docs.umami.is/docs/cloud/faq)
- [CNIL — conditions d'exemption des outils de mesure d'audience](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)
- [CNIL — droits des personnes](https://www.cnil.fr/fr/preparer-lexercice-des-droits-des-personnes)
