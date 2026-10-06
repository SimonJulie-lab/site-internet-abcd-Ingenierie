# Migration Cloudflare — ABCD Ingénierie

Note de cadrage et procédure. Rien n'est encore déployé sur Cloudflare : les
fichiers décrits en « Déjà fait dans le dépôt » sont prêts mais inutilisés tant
que le site reste sur Netlify.

## Décisions retenues

| Point | Décision |
|---|---|
| Cible | **Cloudflare Pages** — contenu statique de `site/` + `functions/` pour le formulaire |
| Déploiement | Projet relié au dépôt GitHub, branche `main`, aucune commande de build |
| Formulaire | Pages Function `POST /api/contact` + **Brevo** (remplace Netlify Forms) |
| Pièces jointes | Conservées, **14 Mo au total** (vérifié côté serveur, pas seulement par JS) |
| Prestataire d'envoi | **Brevo** — société française, données traitées et stockées dans l'Union européenne |
| Anti-robot | Champ piège conservé ; Turnstile activable sans code, en ajoutant `TURNSTILE_SECRET` |
| E-mails | Restent chez **Infomaniak** — aucune modification prévue de l'hébergement mail |
| Périmètre | **Phase 1 : préversion sur `abcd-ing.pages.dev`**, sans changement de DNS ni d'URL publique |
| Bascule | Reportée, après recette complète sur l'URL de préversion |

## Prestataire d'envoi : Brevo

Le formulaire envoie ses e-mails par une API HTTP depuis la Function
Cloudflare. Le choix s'est porté sur **Brevo** (ex-Sendinblue, société
française) : c'est le prestataire qui est à la fois une société européenne,
qui stocke les données exclusivement dans l'Union européenne, et dont la
taille de pièce jointe reste exploitable.

| Prestataire | Société | Où sont les données | Pièces jointes | Offre gratuite |
|---|---|---|---|---|
| **Brevo** (retenu) | France | **UE uniquement** — « Les serveurs d'hébergement sur lesquels Brevo traite et stocke ses bases de données sont exclusivement situés au sein de l'Union européenne » ([source](https://help.brevo.com/hc/fr/articles/360001005510)) | 20 Mo par e-mail, pièces jointes comprises | 300 e-mails/jour |
| Mailjet | France (groupe Sinch) | UE — Google Cloud, Francfort et Saint-Ghislain | 15 Mo par message ([source](https://dev.mailjet.com/docs/email/api/send-api-v31/send-attached-files)) | 200 e-mails/jour |
| Resend | États-Unis | **États-Unis**, quelle que soit la région choisie — « All account data, including email metadata, logs, and API records, is stored in the United States regardless of the sending region you select » ([source](https://resend.com/docs/dashboard/domains/regions)) | 40 Mo après encodage | 3 000 e-mails/mois |
| MailerSend | **États-Unis** (New York), même si les serveurs de stockage sont dans l'UE | UE, avec transferts encadrés par le cadre UE–États-Unis ([source](https://www.mailersend.com/legal/privacy-policy)) | 25 Mo après décodage ([source](https://developers.mailersend.com/guides/adding-attachments-to-emails)) | 100 e-mails/mois |
| Scaleway Transactional Email | France | France (`fr-par`) | **2 Mo via l'API** ([source](https://www.scaleway.com/en/docs/transactional-email/reference-content/tem-capabilities-and-limits/)) | — |

Conséquence directe sur le formulaire : **le plafond des pièces jointes passe
de 8 Mo à 14 Mo**, et non à 25 Mo. Resend autoriserait 30 Mo de fichiers, mais
ce n'est pas une société européenne. À noter que la contrainte n'est **pas**
Cloudflare : ni la taille du corps de requête (100 Mo en offre Free, 413 au-delà)
ni la mémoire d'une Function (128 Mo) ne sont atteintes ici. C'est bien le
prestataire d'envoi qui plafonne.

### Ce que Brevo accepte réellement (mesuré, pas supposé)

L'API Brevo a été interrogée directement, avec la clé du compte réel, pour
relever ses limites au lieu de se fier à sa documentation : les deux ne
concordent pas.

| Question | Documentation Brevo | Mesure sur l'API |
|---|---|---|
| Poids d'une pièce jointe | « la pièce jointe doit faire moins de 4 Mo » | **inexact** : un PDF de 14 Mio passe |
| Poids du message | 20 Mo, pièces jointes comprises | **confirmé** : 14 Mio accepté, 19 Mo refusé (`400 MESSAGE_SIZE_EXCEEDED`, « Maximum mail size limit is 20MB ») |
| Extensions acceptées | liste fermée | **confirmé**, et plus courte que prévu |

Seize extensions qui semblent aller de soi ici sont en réalité **refusées** :
`dwg`, `dxf`, `ifc`, `kmz`, `stl`, `skp`, `dgn` (CAO, BIM, géomatique),
`rar`, `7z` (archives), `heic`, `heif`, `webp` (photos — or `.heic` est le
format par défaut des iPhone), `svg`, `psd`, `eml`, `odg`, `odp`. À l'inverse,
38 extensions ont été validées une par une : PDF, images JPG, PNG, TIFF, GIF,
BMP, CGM, documents Word, Excel, PowerPoint et OpenDocument, CSV, TXT, XML,
HTML, ZIP, TAR, ICS, MSG, PUB, EPS, et les formats audio et vidéo courants.

Conséquence sur le formulaire : ces formats sont refusés **avant l'envoi**,
côté navigateur (message immédiat dès le choix du fichier, plus l'attribut
`accept` sur les trois champs) et côté Function (réponse 415 avec un message
qui dit quoi faire : compresser en `.zip`, ou enregistrer la photo en JPG).
Le fichier n'est donc jamais transféré pour rien, et Brevo n'est jamais
appelé. Un filet de sécurité traduit en plus les deux réponses d'erreur de
Brevo (`Unsupported file format`, `MESSAGE_SIZE_EXCEEDED`) au cas où cette
liste évoluerait sans préavis.

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
- **Le domaine d'envoi n'est pas encore authentifié chez Brevo.** Brevo accepte deux voies : authentifier le domaine (enregistrements DNS) ou **valider une simple adresse expéditeur par un lien reçu dans la boîte**. C'est la seconde qui sert en phase 1 : `contact@abcd-ing.fr` est une boîte Infomaniak existante, donc aucun enregistrement DNS n'est nécessaire pour tester de bout en bout, pièces jointes comprises. Contrepartie assumée : sans SPF ni DKIM la délivrabilité est moindre, ce qui est sans conséquence pour une recette et se corrige à la bascule.
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
- `functions/api/contact.js` — nouveau : reçoit le POST, vérifie les champs, le champ piège, le poids des pièces jointes et Turnstile si configuré, envoie l'e-mail via Brevo (`POST https://api.brevo.com/v3/smtp/email`, authentification par en-tête `api-key`), puis redirige vers `/merci.html` (303). En cas d'erreur, il renvoie une page autonome avec un lien vers le formulaire, pour ne jamais laisser le visiteur sans réponse. Le corps du message est assemblé morceau par morceau et la base64 des pièces jointes est produite par blocs : on ne garde ainsi jamais en mémoire, au même moment, les octets du fichier, une chaîne binaire intermédiaire, la base64 complète et une copie JSON de celle-ci — ce qui compte dans les 128 Mo alloués à une Function.
- `site/contact.html` (suite) — la mention de taille passe à 14 Mo et les formats sont précisés : Brevo n'accepte qu'une liste d'extensions, qui contient `.zip` mais ni `.dwg`, `.dxf`, `.rar` ni `.7z`, d'où l'invitation à compresser ces fichiers.
- `site/_redirects` (suite) — règle `/*.html /:splat 200` ajoutée. Sans elle, Cloudflare Pages applique ses « URL propres » : `/page.html` reçoit une **redirection 308** vers `/page`, là où Netlify servait `/page.html` directement. Ce détail n'était pas prévu au cadrage et il n'est pas cosmétique : le site compte plus de 500 liens internes, 17 balises `canonical`, un sitemap et un historique Search Console tous en `.html`. Chaque canonical aurait redirigé vers une autre URL, donc plus auto-référente, et l'URL canonique de tout le site aurait changé en silence — exactement l'inconvénient reproché à l'option B. La règle réécrit `/page.html` vers elle-même (statut 200 : service direct, l'URL visible ne change pas) et rétablit le comportement de Netlify à l'identique. Les règles statiques, plus spécifiques, continuent de primer : `/realisations.html` reste bien une redirection vers l'accueil.
- `site/contact.html` — `action="/api/contact"`, attributs `data-netlify` et `netlify-honeypot` retirés (le champ `bot-field` reste en place et est contrôlé par la Function).
- `site/merci.html` — suppression du script de contrôle de taille devenu sans objet.
- `wrangler.toml` — projet `abcd-ing`, `pages_build_output_dir = "site"`, permet `npx wrangler pages dev` en local.

## Procédure (une fois le blocage tranché)

### 0. Recette locale — faite

`npx wrangler pages dev` sert le site avec les mêmes fichiers (`_redirects`,
`_headers`, `functions/`) que la production Cloudflare. Les variables de
`.dev.vars` (fichier ignoré par git) portent d'abord une clé factice, puis la
clé réelle du compte Brevo une fois celui-ci créé.

**32 vérifications sur 32 passent** : HSTS, `nosniff` et `Referrer-Policy`
pratiqués sur toutes les pages ; `Cache-Control` d'une semaine sur les photos ;
les 5 URL `/blog` et `/realisations` redirigées vers l'accueil (y compris
`/realisations.html`, alors que le fichier existe) ; les 17 pages `.html`
servies en 200 ; `/sitemap.xml`, `/robots.txt` et `/merci.html` en 200 ; une
adresse inconnue en 404 ; le formulaire en 405 en `GET`, 303 quand le champ
piège est rempli, 400 sur champs manquants ou e-mail invalide, 413 au-delà de
14 Mo, 415 sur un format refusé par Brevo (`.dwg`, `.heic`, `.rar`). Une pièce
jointe de 13 Mo est acceptée, et une de 14 Mio passe aussi.

S'y ajoutent deux vérifications qui ne dépendent plus du tout de la recette :

- le **corps JSON réellement adressé à Brevo**, intercepté hors réseau
  (21 contrôles) : endpoint, en-tête `api-key`, découpage de `CONTACT_FROM` en
  `sender.email` + `sender.name`, destinataires multiples, `replyTo`, objet du
  message, corps texte et HTML échappé, nom de pièce jointe translittéré
  (« plan été.pdf » → `plan-ete.pdf`) et contenu base64 identique octet pour
  octet au fichier d'origine. Les encodages par blocs ont aussi été comparés à
  `Buffer.toString('base64')` pour treize tailles, y compris non multiples de 3 ;
- un **envoi réel** vers la boîte du compte, avec et sans pièce jointe, et un
  ZIP de 5 Mo : Brevo répond 201, le compteur de crédits du compte passe de
  300 à 295, ce qui confirme que les messages sont bien partis.

Restent à vérifier en ligne, une fois le projet créé : l'envoi réel depuis la
préversion, la réception des pièces jointes, les en-têtes sur l'URL publique,
et le fait que `abcd-ing.pages.dev` n'entre pas dans l'index (balise
`canonical` vers `abcd-ing.fr`).

### 1. Projet Cloudflare Pages

Les commits de migration partent sur **`main`**. Le dépôt n'a ni statut de
commit, ni vérification, ni déploiement enregistré sur son dernier commit —
une intégration Netlify reliée à GitHub en déposerait — et un
`abcd-site-deploy.zip` est présent à la racine du dépôt : le déploiement Netlify
se fait vraisemblablement à la main, un `push` sur `main` ne déclenche donc rien.
Retour arrière si besoin : `git reset --hard c0933dc`, puis relancer le
déploiement Netlify habituel.

1. Créer le projet `abcd-ing`, relié au dépôt `SimonJulie-lab/site-internet-abcd-Ingenierie`, branche de production `main`, **aucune** commande de build, répertoire de sortie `site`.
2. Définir les variables d'environnement (Production **et** Preview) :
   - `BREVO_API_KEY` (secret) — clé API Brevo (`SMTP & API` → `API Keys` v3) ;
   - `CONTACT_TO` — adresse(s) de réception, séparées par une virgule ;
   - `CONTACT_FROM` — expéditeur validé chez Brevo, par exemple `Formulaire abcd-ing.fr <contact@abcd-ing.fr>` ;
   - `TURNSTILE_SECRET` (facultatif) — active la vérification anti-robot.
3. Vérifier le déploiement `https://abcd-ing.pages.dev`. En phase 1, **rien d'autre ne bouge** : aucun DNS, aucune bascule.

### 2. Envoi des e-mails (Brevo)

**En phase 1, aucun enregistrement DNS n'est nécessaire** : créer l'adresse
expéditeur `contact@abcd-ing.fr` dans Brevo, puis cliquer le lien de validation
reçu dans la boîte Infomaniak. L'envoi fonctionne alors vers n'importe quel
destinataire, sans SPF ni DKIM — délivrabilité moindre, sans conséquence pour
une recette.

Pour la production, authentifier le domaine d'envoi dans Brevo (`Senders,
Domains & Dedicated IPs` → `Domains`), par exemple `send.abcd-ing.fr`, et
ajouter **exactement** les enregistrements affichés (DKIM et code Brevo), sur
ce sous-domaine uniquement.

- Aucun conflit avec la messagerie : les enregistrements demandés portent sur le sous-domaine d'envoi, jamais sur `abcd-ing.fr`. Le `MX` racine (`mta-gw.infomaniak.ch`) et le `SPF` Infomaniak restent intacts.
- Offre gratuite Brevo : 300 e-mails par jour, sans commune mesure avec le trafic d'un formulaire de contact.
- Plafond réel : 20 Mo par e-mail, pièces jointes comprises, mesuré à l'appui. Le formulaire en accepte 14 Mo, ce qui laisse la marge nécessaire à l'encodage base64 (+33 %).

### 3. Recette avant bascule

| Test | Attendu |
|---|---|
| `/blog`, `/blog/`, `/realisations`, `/realisations/`, `/realisations.html` | 302 vers l'accueil, malgré les fichiers présents |
| Formulaire avec 1 à 3 pièces jointes (total < 14 Mo, dont un fichier de 13 Mo) | redirection vers `/merci.html`, e-mail reçu **avec** les pièces jointes, `Répondre` adressé au visiteur |
| Formulaire avec > 14 Mo | message d'erreur 413, aucun envoi |
| Pièce jointe `.dwg`, `.dxf`, `.heic`, `.rar` ou `.7z` | refusée avant envoi (415) : le message doit nommer le fichier fautif et indiquer quoi faire |
| Pièce jointe `.zip` contenant un `.dwg` | acceptée, c'est le contournement proposé au visiteur |
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

- Politique de confidentialité : la page mentionne les « prestataires techniques » sans les nommer. Ajouter **Brevo** parmi les sous-traitants, avec la mention de l'hébergement dans l'Union européenne — c'est justement le motif du changement, la page décrit déjà ce niveau de détail pour Umami. Aucun transfert hors UE n'est à déclarer pour les messages du formulaire.
- Search Console : conserver la propriété existante en option A ; en option B, ajouter la propriété `www` et soumettre le `sitemap.xml` mis à jour.
- Netlify : ne résilier qu'après quelques jours de recette. Conserver la configuration le temps de la période de retour arrière.
- Envisager une `Content-Security-Policy` : le site charge Tailwind et les polices Google depuis des CDN, la politique devra les autoriser explicitement.

## Points de vigilance

- **Rien n'est envoyé si `BREVO_API_KEY`, `CONTACT_TO` ou `CONTACT_FROM` manquent** : la Function renvoie une page invitant à écrire directement à `contact@abcd-ing.fr`. Le formulaire ne casse donc pas silencieusement.
- Les réponses d'erreur de Brevo sont journalisées (`console.error`) et consultables dans les logs temps réel du projet Pages.
- Brevo n'accepte qu'une liste fermée d'extensions. Le formulaire refuse donc lui-même les seize formats absents de cette liste (`.dwg`, `.heic`, `.rar`…) et propose de compresser en `.zip` — qui est accepté, y compris pour un plan de CAO ou une photo d'iPhone. Deux endroits portent la même liste (la Function et le script de la page) : les faire évoluer ensemble.
- La Function ne réalise pas de limitation de débit : en l'absence de `TURNSTILE_SECRET`, seuls le champ piège et la validation des champs protègent le formulaire. Activer Turnstile si le spam apparaît.
