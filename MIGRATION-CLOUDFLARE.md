# Migration Cloudflare — ABCD Ingénierie

Note de cadrage et procédure. Rien n'est encore déployé sur Cloudflare : les
fichiers décrits en « Déjà fait dans le dépôt » sont prêts mais inutilisés tant
que le site reste sur Netlify.

## Décisions retenues

| Point | Décision |
|---|---|
| Cible | **Cloudflare Pages** — contenu statique de `site/` + `functions/` pour le formulaire |
| Déploiement | Projet relié au dépôt GitHub, branche `main`, aucune commande de build |
| Formulaire | Pages Function `POST /api/contact` + **Resend** (remplace Netlify Forms) |
| Pièces jointes | Conservées, **8 Mo au total** (vérifié côté serveur, pas seulement par JS) |
| Anti-robot | Champ piège conservé ; Turnstile activable sans code, en ajoutant `TURNSTILE_SECRET` |
| E-mails | Restent chez **Infomaniak** — aucune modification prévue de l'hébergement mail |
| Périmètre | **Phase 1 : préversion sur `abcd-ing.pages.dev`**, sans changement de DNS ni d'URL publique |
| Bascule | Reportée, après recette complète sur l'URL de préversion |

## Phase 1 — migrer sans toucher au DNS ni à l'URL

C'est possible, à une condition : **en préversion uniquement**. Le site est
publié sur `https://abcd-ing.pages.dev`, `abcd-ing.fr` continue d'être servi par
Netlify, aucun enregistrement DNS ne bouge et les visiteurs ne voient aucune
différence. Tout ce qui peut être validé l'est dans ce cadre : redirections,
en-têtes, page 404, formulaire, photos, performances.

Ce qui n'est pas possible, en revanche, c'est de **basculer la production** sans
toucher au DNS : `abcd-ing.fr` est un domaine apex, et Cloudflare Pages exige que
l'apex soit une zone du compte Cloudflare (voir la section suivante). Aucun
contournement raisonnable :

- `ANAME` de l'apex vers `<projet>.pages.dev` : Infomaniak sait créer cet enregistrement, mais Pages ne rattache pas le nom d'hôte sans la zone. L'API qui l'accepte malgré tout est un chemin non documenté, qui casse sans prévenir. À écarter.
- Zone en « CNAME setup » (partial) : permettrait de garder les serveurs de noms Infomaniak tout en proxifiant l'apex, mais c'est réservé aux offres **Business et Enterprise** (indisponible en Free et Pro), et la combinaison avec Pages n'est pas documentée. Hors de proportion ici.

### Ce que la phase 1 ne couvre pas

- **Pas de WAF, de cache ni de règles Cloudflare sur `abcd-ing.fr`** : ils ne s'appliqueraient qu'après la bascule du DNS.
- **Le formulaire n'envoie pas encore depuis `contact@abcd-ing.fr`** : sans domaine vérifié chez Resend, l'envoi part de `onboarding@resend.dev` et **uniquement vers l'adresse du compte Resend**. Suffisant pour tester de bout en bout, pièces jointes comprises, sans ajouter le moindre enregistrement DNS.
- **Le site existe en double** (Netlify sur `abcd-ing.fr`, Pages sur `abcd-ing.pages.dev`). Les balises `canonical` déjà en place pointent vers `https://abcd-ing.fr/`, ce qui neutralise le contenu dupliqué ; à confirmer en relevant les en-têtes du déploiement Pages (`X-Robots-Tag`).

## ⚠️ Blocage à trancher : le domaine apex

La doc Cloudflare est sans ambiguïté :

> « To deploy your Pages project to a custom apex domain, that custom domain
> must be a zone on the Cloudflare account you have created your Pages project on. »
> — <https://developers.cloudflare.com/pages/configuration/custom-domains/>

Autrement dit : **avec les serveurs de noms conservés chez Infomaniak
(`nsany1/2.infomaniak.com`), `abcd-ing.fr` ne peut pas être servi par Cloudflare
Pages.** Seul un sous-domaine le peut, via un simple CNAME. Le domaine apex
actuel (`A 75.2.60.5`, le load balancer Netlify) n'a pas d'équivalent côté
Cloudflare : Pages n'expose pas d'adresse IP publique stable à mettre en `A`, et
la validation d'un domaine personnalisé pour un apex suppose la zone dans le
compte Cloudflare. L'astuce consistant à pointer un `ANAME` (que le DNS
Infomaniak sait créer) vers `<projet>.pages.dev` n'est pas un chemin supporté :
le certificat et le rattachement du nom d'hôte échoueront.

Deux chemins possibles — c'est le seul point qui reste à décider :

### Option A — basculer les serveurs de noms vers Cloudflare *(voie complète)*

La zone `abcd-ing.fr` est recréée à l'identique dans Cloudflare, puis les NS
sont changés chez Infomaniak (qui reste propriétaire du nom de domaine).

- ✅ Apex **et** `www` sur Pages, certificats automatiques, WAF, cache, règles Cloudflare, Turnstile.
- ✅ URL canonique inchangée : `https://abcd-ing.fr/` (aucun impact SEO).
- ✅ Les e-mails ne bougent pas : Infomaniak reste l'hébergeur mail, ses enregistrements `MX`, `SPF` et `DKIM` sont recopiés à l'identique dans Cloudflare.
- ⚠️ La zone DNS est désormais administrée chez Cloudflare : **toute** évolution future des enregistrements (y compris mail) se fera là-bas, plus dans le Manager Infomaniak.
- Retour arrière : remettre les NS Infomaniak chez le registraire (propagation ~1 h à 24 h).

### Option B — ne pas toucher aux NS *(hybride)*

`www.abcd-ing.fr` en `CNAME` vers `<projet>.pages.dev`, et l'apex redirigé vers
`www` ailleurs.

- ✅ Aucune modification des serveurs de noms.
- ⚠️ L'apex doit être redirigé par un tiers : soit un site Netlify réduit à une redirection 301 (Netlify reste donc en place), soit la redirection d'URL du Manager Infomaniak.
- ⚠️ **Changement d'URL canonique** : le site passe de `abcd-ing.fr` à `www.abcd-ing.fr`. Il faut reprendre les balises `canonical`, `og:url`, `sitemap.xml`, la ligne `Sitemap:` de `robots.txt`, puis déclarer la nouvelle propriété dans la Search Console. Perte de cache/WAF Cloudflare sur l'apex (qui ne fait plus que rediriger, donc impact limité).
- Retour arrière : modifier un seul enregistrement `CNAME` / `A`.

## Déjà fait dans le dépôt (valable dans les deux options)

- `site/_redirects` — passé en syntaxe Cloudflare : le `!` de Netlify a été retiré. Inutile ici, car contrairement à Netlify, Cloudflare applique toujours les redirections, même si un fichier existe au chemin demandé (« Redirects are always followed, regardless of whether or not an asset matches the incoming request »). Les redirections `/blog` et `/realisations` continuent donc de masquer les fichiers réellement présents dans `site/`.
- `site/_headers` — nouveau : Cloudflare Pages n'ajoute aucun en-tête de sécurité par défaut, ce fichier remet le HSTS que Netlify envoyait, plus `nosniff` et `Referrer-Policy`, et met les photos en cache une semaine.
- `functions/api/contact.js` — nouveau : reçoit le POST, vérifie les champs, le champ piège, le poids des pièces jointes et Turnstile si configuré, envoie l'e-mail via Resend, puis redirige vers `/merci.html` (303). En cas d'erreur, il renvoie une page autonome avec un lien vers le formulaire, pour ne jamais laisser le visiteur sans réponse.
- `site/_redirects` (suite) — règle `/*.html /:splat 200` ajoutée. Sans elle, Cloudflare Pages applique ses « URL propres » : `/page.html` reçoit une **redirection 308** vers `/page`, là où Netlify servait `/page.html` directement. Ce détail n'était pas prévu au cadrage et il n'est pas cosmétique : le site compte plus de 500 liens internes, 17 balises `canonical`, un sitemap et un historique Search Console tous en `.html`. Chaque canonical aurait redirigé vers une autre URL, donc plus auto-référente, et l'URL canonique de tout le site aurait changé en silence — exactement l'inconvénient reproché à l'option B. La règle réécrit `/page.html` vers elle-même (statut 200 : service direct, l'URL visible ne change pas) et rétablit le comportement de Netlify à l'identique. Les règles statiques, plus spécifiques, continuent de primer : `/realisations.html` reste bien une redirection vers l'accueil.
- `site/contact.html` — `action="/api/contact"`, attributs `data-netlify` et `netlify-honeypot` retirés (le champ `bot-field` reste en place et est contrôlé par la Function).
- `site/merci.html` — suppression du script de contrôle de taille devenu sans objet.
- `wrangler.toml` — projet `abcd-ing`, `pages_build_output_dir = "site"`, permet `npx wrangler pages dev` en local.

## Procédure (une fois le blocage tranché)

### 0. Recette locale — faite

`npx wrangler pages dev` sert le site avec les mêmes fichiers (`_redirects`,
`_headers`, `functions/`) que la production Cloudflare, sans aucun identifiant.
Variables factices dans `.dev.vars` (fichier ignoré par git).

**27 vérifications sur 27 passent** : HSTS, `nosniff` et `Referrer-Policy`
pratiqués sur toutes les pages ; `Cache-Control` d'une semaine sur les photos ;
les 5 URL `/blog` et `/realisations` redirigées vers l'accueil (y compris
`/realisations.html`, alors que le fichier existe) ; les 17 pages `.html`
servies en 200 ; `/sitemap.xml`, `/robots.txt` et `/merci.html` en 200 ; une
adresse inconnue en 404 ; le formulaire en 405 en `GET`, 303 quand le champ
piège est rempli, 400 sur champs manquants ou e-mail invalide, 413 au-delà de
8 Mo. Un envoi valide atteint bien l'API Resend (502 attendu avec une clé
factice, et la page d'erreur affiche le lien vers le formulaire).

Restent à vérifier en ligne, une fois le projet créé : l'envoi réel des e-mails
avec les pièces jointes, les en-têtes sur l'URL publique, et le fait que
`abcd-ing.pages.dev` n'entre pas dans l'index (balise `canonical` vers
`abcd-ing.fr`).

### 1. Projet Cloudflare Pages

Les commits de migration sont poussés sur une **branche dédiée**
(`migration-cloudflare`), pas sur `main` : si Netlify construit le site depuis
ce dépôt, un `push` sur `main` basculerait la production immédiatement, or le
formulaire Netlify Forms a été retiré au profit de la Function. Cloudflare
construit alors une **préversion** de cette branche
(`https://migration-cloudflare.abcd-ing.pages.dev`), `main` et Netlify restent
intacts. La fusion vers `main` se fera à la bascule.

1. Créer le projet `abcd-ing`, relié au dépôt `SimonJulie-lab/site-internet-abcd-Ingenierie`, branche de production `main`, **aucune** commande de build, répertoire de sortie `site`.
2. Définir les variables d'environnement (Production **et** Preview) :
   - `RESEND_API_KEY` (secret) — clé API Resend, portée « Sending access » ;
   - `CONTACT_TO` — adresse(s) de réception, séparées par une virgule ;
   - `CONTACT_FROM` — expéditeur vérifié chez Resend (en phase 1 : `Test <onboarding@resend.dev>`) ;
   - `TURNSTILE_SECRET` (facultatif) — active la vérification anti-robot.
3. Vérifier la préversion `https://abcd-ing.pages.dev`. En phase 1, **rien d'autre ne bouge** : aucun DNS, aucune bascule.

### 2. Envoi des e-mails (Resend)

**En phase 1, aucun enregistrement DNS n'est nécessaire.** Avec
`CONTACT_FROM = "Test <onboarding@resend.dev>"` et `CONTACT_TO` réglé sur
l'adresse du compte Resend, l'envoi fonctionne sans domaine vérifié — Resend
n'autorise alors que ce destinataire, ce qui suffit pour la recette.

Pour la production, créer un domaine d'envoi dédié, par exemple
`send.abcd-ing.fr`, plutôt que le domaine racine, et ajouter **exactement** les
enregistrements affichés par Resend, sur ce sous-domaine uniquement.

- Aucun conflit avec la messagerie : l'enregistrement `MX` demandé par Resend porte sur `send.abcd-ing.fr`, jamais sur `abcd-ing.fr`. Le `MX` racine (`mta-gw.infomaniak.ch`) et le `SPF` Infomaniak restent intacts.
- Offre gratuite Resend : 100 e-mails par jour, 3 000 par mois ; pièces jointes jusqu'à 40 Mo par message (après encodage), donc les 8 Mo du formulaire passent sans difficulté.

### 3. Recette avant bascule

| Test | Attendu |
|---|---|
| `/blog`, `/blog/`, `/realisations`, `/realisations/`, `/realisations.html` | 302 vers l'accueil, malgré les fichiers présents |
| Formulaire avec 1 à 3 pièces jointes (< 8 Mo) | redirection vers `/merci.html`, e-mail reçu **avec** les pièces jointes, `Répondre` adressé au visiteur |
| Formulaire avec > 8 Mo | message d'erreur, aucun envoi |
| Champ `bot-field` rempli | redirection vers `/merci.html`, aucun e-mail envoyé |
| Champs obligatoires vides, e-mail invalide | page d'erreur avec lien vers le formulaire |
| `/merci.html`, `/sitemap.xml`, `/robots.txt`, `/404.html` | servis normalement |
| `curl -I https://abcd-ing.pages.dev/` | `Strict-Transport-Security` présent |
| `curl -I https://abcd-ing.pages.dev/photos/hero.webp` | `Cache-Control: public, max-age=604800` |
| `npx wrangler pages dev` en local | le formulaire fonctionne avec un fichier `.dev.vars` |

### 4. Bascule (option A)

1. Recréer la zone dans Cloudflare. Enregistrements relevés depuis le DNS public :

   | Type | Nom | Valeur |
   |---|---|---|
   | MX | `@` | `5 mta-gw.infomaniak.ch.` |
   | TXT | `@` | `v=spf1 include:spf.infomaniak.ch -all` |
   | TXT | `@` | `google-site-verification=jdUSZPbGldUB-7OzW2hF8F1Er0ulvZs1F7LBWez5vDg` |

   ⚠️ Il manque au minimum l'enregistrement `DKIM` (nom en `*._domainkey`) et
   l'éventuel `_dmarc` : **récupérer un export complet de la zone Infomaniak
   avant de changer les NS**, sans quoi la délivrabilité des e-mails se
   dégradera. Les enregistrements `A`/`CNAME` de Netlify, eux, sont à supprimer
   (c'est Pages qui les recréera).
2. Ajouter le domaine personnalisé `abcd-ing.fr` au projet Pages (Cloudflare crée alors son propre `CNAME`), puis `www` en redirection vers l'apex.
3. Changer les serveurs de noms chez le registraire pour ceux fournis par Cloudflare.
4. Surveiller la validité du certificat et l'arrivée des e-mails du formulaire pendant 24 h.

### 5. Après la bascule

- Politique de confidentialité : la page mentionne les « prestataires techniques » sans les nommer. Ajouter Resend (société américaine) parmi les destinataires, avec la mention du transfert hors Union européenne, la page décrit déjà ce niveau de détail pour Umami.
- Search Console : conserver la propriété existante en option A ; en option B, ajouter la propriété `www` et soumettre le `sitemap.xml` mis à jour.
- Netlify : ne résilier qu'après quelques jours de recette. Conserver la configuration le temps de la période de retour arrière.
- Envisager une `Content-Security-Policy` : le site charge Tailwind et les polices Google depuis des CDN, la politique devra les autoriser explicitement.

## Points de vigilance

- **Rien n'est envoyé si `RESEND_API_KEY`, `CONTACT_TO` ou `CONTACT_FROM` manquent** : la Function renvoie une page invitant à écrire directement à `contact@abcd-ing.fr`. Le formulaire ne casse donc pas silencieusement.
- Les réponses d'erreur de Resend sont journalisées (`console.error`) et consultables dans les logs temps réel du projet Pages.
- La Function ne réalise pas de limitation de débit : en l'absence de `TURNSTILE_SECRET`, seuls le champ piège et la validation des champs protègent le formulaire. Activer Turnstile si le spam apparaît.
