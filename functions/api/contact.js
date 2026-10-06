/**
 * ABCD Ingénierie — formulaire de contact
 * Cloudflare Pages Function : POST /api/contact
 *
 * Remplace Netlify Forms (attribut data-netlify="true"), qui n'existe pas
 * sur Cloudflare. Le POST est reçu ici, transmis par e-mail via l'API
 * Brevo, puis le visiteur est redirigé vers /merci.html (code 303, donc
 * POST -> GET : le rechargement de la page ne renvoie pas le formulaire).
 *
 * Brevo est une société française et stocke ses données exclusivement dans
 * l'Union européenne : aucun transfert hors UE pour les messages du
 * formulaire. Voir MIGRATION-CLOUDFLARE.md.
 *
 * Variables d'environnement à définir sur le projet Pages
 * (Settings → Variables and Secrets) :
 *   BREVO_API_KEY     (secret) clé API Brevo (SMTP & API → clés API v3)
 *   CONTACT_TO        destinataire(s), séparés par une virgule
 *   CONTACT_FROM      expéditeur validé chez Brevo, par exemple
 *                     "Formulaire abcd-ing.fr <formulaire@abcd-ing.fr>"
 *   TURNSTILE_SECRET  (facultatif) clé secrète Turnstile ; sans elle,
 *                     aucune vérification anti-robot n'est effectuée
 *
 * Le champ piège du formulaire (bot-field) reste actif : les robots qui le
 * remplissent reçoivent une réponse de succès, mais rien n'est envoyé.
 *
 * Les pièces jointes sont contrôlées avant l'envoi : poids total (14 Mo) et
 * format, Brevo n'acceptant qu'une liste fermée d'extensions. Les formats de
 * CAO (.dwg, .dxf, .ifc, .kmz), les archives .rar et .7z, les photos .heic
 * des iPhone comme le .webp, le .svg, le .psd et le .eml n'en font pas
 * partie : le formulaire invite à les compresser dans une archive .zip, qui
 * est acceptée.
 */

// Plafond des pièces jointes. Ce n'est pas qu'une question de confort : deux
// limites distinctes encadrent la valeur.
//   - Brevo refuse les e-mails transactionnels dépassant 20 Mo, pièces
//     jointes comprises, et l'encodage base64 gonfle le volume d'un tiers :
//     14 Mo de fichiers donnent environ 19 Mo de message, donc sous la limite
//     avec de la marge ;
//   - une Function Cloudflare ne dispose que de 128 Mo de mémoire, or le
//     fichier y transite (corps multipart, octets, base64, corps JSON).
// À titre de repère, la limite du corps de requête Cloudflare est de 100 Mo
// (offre Free) et la messagerie Infomaniak accepte 201 Mo par message : ni
// l'une ni l'autre n'est la contrainte ici, c'est bien Brevo.
const LIMITE_PIECES_JOINTES = 14 * 1024 * 1024;
const CHAMPS_OBLIGATOIRES = ['nom', 'email', 'commune', 'besoin', 'description'];
const CHAMPS_PIECES_JOINTES = ['pieces-jointes-1', 'pieces-jointes-2', 'pieces-jointes-3'];

// Extensions que Brevo accepte réellement. Ce n'est pas une précaution de
// principe : l'API répond « 400 Unsupported file format: xxx » à tout ce qui
// ne figure pas dans sa liste, et le visiteur n'aurait qu'une page d'erreur
// générique. Cette liste a été relevée en interrogeant l'API : les trente-huit
// premières ont été envoyées une par une, les formats audio et vidéo
// supplémentaires sont ceux de la documentation Brevo.
// À l'inverse, sont refusés et donc absents volontairement : dwg, dxf, ifc,
// kmz, stl, skp, dgn, odg, odp (CAO, BIM, bureautique libre), rar, 7z
// (archives), heic, heif, webp (photos, dont celles des iPhone), svg, psd,
// eml.
const EXTENSIONS_ACCEPTEES = new Set([
  'pdf', 'txt', 'rtf', 'csv', 'xml', 'ics', 'msg', 'pub', 'eps', 'ez',
  'doc', 'docx', 'docm', 'odt', 'xls', 'xlsx', 'ods', 'ppt', 'pptx',
  'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'cgm',
  'zip', 'tar', 'html', 'htm', 'shtml', 'css', 'mobi', 'pkpass',
  'mp3', 'mp4', 'mov', 'wav', 'm4a', 'm4v', 'wma', 'ogg', 'flac',
  'aif', 'aifc', 'aiff', 'avi', 'mkv', 'mpeg', 'mpg', 'wmv',
]);

const MESSAGE_FORMAT_REFUSE =
  "Compressez le fichier dans une archive .zip (ou enregistrez la photo en JPG) " +
  "et joignez l'archive à la place.";

// Libellés de l'e-mail, dans l'ordre du formulaire.
const CHAMPS = [
  ['nom', 'Prénom et nom'],
  ['societe', 'Société / organisation'],
  ['email', 'E-mail'],
  ['telephone', 'Téléphone'],
  ['commune', 'Commune ou localisation du projet'],
  ['profil', 'Profil'],
  ['besoin', 'Nature du besoin'],
  ['type-projet', 'Type de projet'],
  ['avancement', "État d'avancement"],
  ['description', 'Description du projet ou de la demande'],
  ['details', 'Détails utiles'],
];

export async function onRequestPost({ request, env }) {
  if (!env.BREVO_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return pageErreur(
      500,
      'Formulaire indisponible',
      "L'envoi du formulaire est mal configuré. Merci d'écrire directement à <a href=\"mailto:contact@abcd-ing.fr\">contact@abcd-ing.fr</a>."
    );
  }

  let donnees;
  try {
    donnees = await request.formData();
  } catch {
    return pageErreur(400, 'Envoi impossible', "Le contenu du formulaire n'a pas pu être lu. Merci de réessayer.");
  }

  // Champ piège : rempli par les robots seulement. On simule un succès.
  if (valeur(donnees, 'bot-field') !== '') {
    return redirectionVers('/merci.html', request);
  }

  if (env.TURNSTILE_SECRET && !(await turnstileValide(donnees.get('cf-turnstile-response'), request, env))) {
    return pageErreur(
      403,
      'Vérification anti-robot échouée',
      'La vérification anti-robot a échoué. Merci de recharger la page et de réessayer.'
    );
  }

  // Champs obligatoires (la validation HTML peut être contournée).
  const manquants = CHAMPS_OBLIGATOIRES.filter((nom) => valeur(donnees, nom) === '');
  if (manquants.length > 0) {
    return pageErreur(
      400,
      'Formulaire incomplet',
      'Merci de renseigner tous les champs obligatoires (nom, e-mail, commune, nature du besoin et description).'
    );
  }

  const email = valeur(donnees, 'email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return pageErreur(400, 'Adresse e-mail invalide', "L'adresse e-mail indiquée ne semble pas valide. Merci de la corriger.");
  }

  const reponse = await construireMessage(donnees);
  if (reponse instanceof Response) return reponse;

  const corps = corpsBrevo({
    from: env.CONTACT_FROM,
    to: env.CONTACT_TO.split(',').map((adresse) => adresse.trim()).filter(Boolean),
    replyTo: email,
    sujet: `Demande de contact — ${valeur(donnees, 'commune')} — ${valeur(donnees, 'nom')}`,
    texte: reponse.texte,
    html: reponse.html,
    fichiers: reponse.fichiers,
  });

  // Succès attendu : 201 (message envoyé) ou 202 (message programmé).
  const envoi = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: corps,
  });

  if (!envoi.ok) {
    const detail = await envoi.text().catch(() => '');
    console.error('Brevo a refusé l’envoi', envoi.status, detail);

    // Filet de sécurité : la liste d'extensions ci-dessus est relevée sur
    // l'API réelle, elle peut évoluer sans préavis. Si Brevo refuse malgré
    // tout, on traduit sa réponse plutôt que de renvoyer un « Envoi
    // impossible » que le visiteur ne peut pas interpréter.
    if (detail.includes('Unsupported file format')) {
      const format = (detail.split('Unsupported file format:')[1] || '').replace(/[^A-Za-z0-9]/g, '');
      return pageErreur(
        415,
        'Format de pièce jointe non accepté',
        `Le service d'envoi n'accepte pas les fichiers au format .${echapper(format)}. ` +
        MESSAGE_FORMAT_REFUSE
      );
    }
    if (detail.includes('MESSAGE_SIZE_EXCEEDED')) {
      return pageErreur(
        413,
        'Pièces jointes trop lourdes',
        'Vos pièces jointes dépassent 14 Mo au total. Merci de retirer un fichier ou de joindre une version plus légère.'
      );
    }

    return pageErreur(
      502,
      'Envoi impossible',
      "Votre demande n'a pas pu être transmise pour le moment. Merci de réessayer dans quelques minutes ou d'écrire à <a href=\"mailto:contact@abcd-ing.fr\">contact@abcd-ing.fr</a>."
    );
  }

  return redirectionVers('/merci.html', request);
}

// Toute autre méthode sur cette route.
export async function onRequest({ request }) {
  return pageErreur(405, 'Méthode non autorisée', "Cette adresse accepte uniquement l'envoi du formulaire de contact.");
}

/* ------------------------------------------------------------------ */
/* Composition du message                                             */
/* ------------------------------------------------------------------ */

async function construireMessage(donnees) {
  const lignes = [];
  for (const [nom, libelle] of CHAMPS) {
    const contenu = valeur(donnees, nom);
    if (contenu !== '') lignes.push([libelle, contenu]);
  }

  const cases = donnees.getAll('documents[]').map((v) => v.toString()).filter(Boolean);
  if (cases.length > 0) lignes.push(['Documents signalés', cases.join(', ')]);

  const fichiers = [];
  let poids = 0;
  for (const nom of CHAMPS_PIECES_JOINTES) {
    const fichier = donnees.get(nom);
    if (!fichier || typeof fichier === 'string' || fichier.size === 0) continue;

    // Le format d'abord : inutile de faire patienter le visiteur le temps du
    // transfert d'un fichier que Brevo refusera de toute façon.
    const extension = extensionDe(fichier.name);
    if (!EXTENSIONS_ACCEPTEES.has(extension)) {
      return pageErreur(
        415,
        'Format de pièce jointe non accepté',
        `Le fichier « ${echapper(fichier.name)} » est au format .${echapper(extension)}, ` +
        "que le service d'envoi n'accepte pas. " + MESSAGE_FORMAT_REFUSE
      );
    }

    // Le poids connu de FormData suffit : on refuse avant de lire les octets,
    // ce qui évite de charger en mémoire un envoi hors limite.
    poids += fichier.size;
    if (poids > LIMITE_PIECES_JOINTES) {
      return pageErreur(
        413,
        'Pièces jointes trop lourdes',
        'Vos pièces jointes dépassent 14 Mo au total. Merci de retirer un fichier ou de joindre une version plus légère.'
      );
    }

    fichiers.push({
      filename: nomFichierSur(fichier.name, nom),
      octets: await fichier.arrayBuffer(),
    });
  }

  if (fichiers.length > 0) {
    lignes.push(['Pièces jointes', fichiers.map((f) => f.filename).join(', ')]);
  }

  const texte = lignes.map(([libelle, contenu]) => `${libelle} :\n${contenu}`).join('\n\n');
  const html = [
    '<h2>Nouvelle demande de contact</h2>',
    '<table cellpadding="6" style="border-collapse:collapse">',
    ...lignes.map(([libelle, contenu]) =>
      `<tr><th align="left" valign="top" style="white-space:nowrap">${echapper(libelle)}</th>` +
      `<td>${echapper(contenu).replace(/\n/g, '<br>')}</td></tr>`
    ),
    '</table>',
  ].join('');

  return { texte, html, fichiers };
}

/*
 * Assemble le corps JSON attendu par l'API Brevo (POST /v3/smtp/email),
 * morceau par morceau, et produit la base64 de chaque pièce jointe par blocs
 * poussés directement dans le tableau.
 *
 * C'est ce qui permet d'accepter des fichiers volumineux : on ne garde jamais
 * en mémoire au même moment les octets du fichier, une chaîne binaire
 * intermédiaire, la base64 complète et une copie JSON de cette base64. Une
 * Function Cloudflare ne dispose que de 128 Mo, cet assemblage compte.
 */
function corpsBrevo({ from, to, replyTo, sujet, texte, html, fichiers }) {
  const expediteur = analyserExpediteur(from);
  const morceaux = [
    '{"sender":', destinataireJson(expediteur.email, expediteur.nom),
    ',"to":[', to.map((adresse) => destinataireJson(adresse)).join(','), ']',
    ',"replyTo":', destinataireJson(replyTo),
    ',"subject":', json(sujet),
    ',"textContent":', json(texte),
    ',"htmlContent":', json(html),
  ];

  if (fichiers.length > 0) {
    morceaux.push(',"attachment":[');
    fichiers.forEach((fichier, index) => {
      if (index > 0) morceaux.push(',');
      morceaux.push('{"name":', json(fichier.filename), ',"content":"');
      ajouterBase64(morceaux, fichier.octets);
      morceaux.push('"}');
    });
    morceaux.push(']');
  }

  morceaux.push('}');
  return morceaux.join('');
}

// Brevo attend l'adresse et le nom dans deux champs distincts. Le nom est
// omis quand il n'y en a pas : un JSON.stringify(undefined) écrirait
// littéralement « undefined » dans le corps de la requête.
function destinataireJson(adresse, nom) {
  const morceaux = ['{"email":', json(adresse)];
  if (nom) morceaux.push(',"name":', json(nom));
  morceaux.push('}');
  return morceaux.join('');
}

// Accepte « Nom <adresse@domaine> » comme « adresse@domaine ».
function analyserExpediteur(valeurExpediteur) {
  const correspondance = String(valeurExpediteur).match(/^\s*(.*?)\s*<\s*([^>]+?)\s*>\s*$/);
  if (correspondance) return { email: correspondance[2], nom: correspondance[1] };
  return { email: String(valeurExpediteur).trim() };
}

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */

function valeur(donnees, nom) {
  const brut = donnees.get(nom);
  // Les champs de formulaire reviennent avec des fins de ligne CRLF : on les
  // normalise, sinon le corps HTML du message contient des « \r » isolés.
  return brut === null || typeof brut !== 'string' ? '' : brut.replace(/\r\n/g, '\n').trim();
}

// Nom de fichier sûr pour la pièce jointe (certains caractères sont refusés
// par les passerelles de messagerie). Les accents sont translittérés plutôt
// que supprimés, pour que « plan été.pdf » reste lisible chez le destinataire.
function nomFichierSur(brut, secours) {
  const nettoye = (brut || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(-80);
  return nettoye || secours;
}

// Extension d'un nom de fichier, en minuscules et sans le point.
function extensionDe(nom) {
  const point = (nom || '').lastIndexOf('.');
  return point === -1 ? '' : nom.slice(point + 1).toLowerCase();
}

function json(valeur) {
  return JSON.stringify(valeur);
}

// btoa() n'accepte que des chaînes : conversion par blocs, poussés dans le
// tableau du corps de message sans jamais reconstituer la chaîne binaire
// complète. Le bloc est un multiple de 3 pour qu'aucun bloc intermédiaire ne
// produise de remplissage « = » au milieu de la base64.
const BLOC_BASE64 = 32766;

function ajouterBase64(morceaux, octets) {
  const vue = new Uint8Array(octets);
  for (let i = 0; i < vue.length; i += BLOC_BASE64) {
    morceaux.push(btoa(String.fromCharCode.apply(null, vue.subarray(i, i + BLOC_BASE64))));
  }
}

function echapper(texte) {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function turnstileValide(jeton, request, env) {
  if (!jeton || typeof jeton !== 'string') return false;
  const donnees = new FormData();
  donnees.append('secret', env.TURNSTILE_SECRET);
  donnees.append('response', jeton);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) donnees.append('remoteip', ip);
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: donnees,
    });
    return (await verification.json()).success === true;
  } catch (erreur) {
    console.error('Turnstile injoignable', erreur);
    return false;
  }
}

function redirectionVers(chemin, request) {
  return Response.redirect(new URL(chemin, request.url).toString(), 303);
}

// Page d'erreur autonome : aucune dépendance au reste du site.
function pageErreur(statut, titre, message) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${echapper(titre)} — ABCD Ingénierie</title>
  <style>
    body { margin:0; background:#F8F7F4; color:#202326; font:16px/1.6 Montserrat,Arial,sans-serif; }
    main { max-width:560px; margin:12vh auto; padding:0 24px; }
    h1 { font-size:1.5rem; letter-spacing:-.02em; }
    a { color:#C96B1B; }
  </style>
</head>
<body>
  <main>
    <h1>${echapper(titre)}</h1>
    <p>${message}</p>
    <p><a href="/contact.html">Revenir au formulaire de contact</a></p>
  </main>
</body>
</html>`;

  return new Response(html, {
    status: statut,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
