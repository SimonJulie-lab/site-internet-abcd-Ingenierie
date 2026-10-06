/**
 * ABCD Ingénierie — formulaire de contact
 * Cloudflare Pages Function : POST /api/contact
 *
 * Remplace Netlify Forms (attribut data-netlify="true"), qui n'existe pas
 * sur Cloudflare. Le POST est reçu ici, transmis par e-mail via l'API
 * Resend, puis le visiteur est redirigé vers /merci.html (code 303, donc
 * POST -> GET : le rechargement de la page ne renvoie pas le formulaire).
 *
 * Variables d'environnement à définir sur le projet Pages
 * (Settings → Variables and Secrets) :
 *   RESEND_API_KEY    (secret) clé API Resend, portée « Sending access »
 *   CONTACT_TO        destinataire(s), séparés par une virgule
 *   CONTACT_FROM      expéditeur vérifié chez Resend, par exemple
 *                     "Formulaire abcd-ing.fr <formulaire@send.abcd-ing.fr>"
 *   TURNSTILE_SECRET  (facultatif) clé secrète Turnstile ; sans elle,
 *                     aucune vérification anti-robot n'est effectuée
 *
 * Le champ piège du formulaire (bot-field) reste actif : les robots qui le
 * remplissent reçoivent une réponse de succès, mais rien n'est envoyé.
 */

const LIMITE_PIECES_JOINTES = 8 * 1024 * 1024; // 8 Mo au total, comme avant
const CHAMPS_OBLIGATOIRES = ['nom', 'email', 'commune', 'besoin', 'description'];
const CHAMPS_PIECES_JOINTES = ['pieces-jointes-1', 'pieces-jointes-2', 'pieces-jointes-3'];

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
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
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

  const envoi = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO.split(',').map((adresse) => adresse.trim()).filter(Boolean),
      reply_to: email,
      subject: `Demande de contact — ${valeur(donnees, 'commune')} — ${valeur(donnees, 'nom')}`,
      text: reponse.texte,
      html: reponse.html,
      attachments: reponse.piecesJointes,
    }),
  });

  if (!envoi.ok) {
    const detail = await envoi.text().catch(() => '');
    console.error('Resend a refusé l’envoi', envoi.status, detail);
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

  const piecesJointes = [];
  let poids = 0;
  for (const nom of CHAMPS_PIECES_JOINTES) {
    const fichier = donnees.get(nom);
    if (!fichier || typeof fichier === 'string' || fichier.size === 0) continue;

    poids += fichier.size;
    if (poids > LIMITE_PIECES_JOINTES) {
      return pageErreur(
        413,
        'Pièces jointes trop lourdes',
        'Vos pièces jointes dépassent 8 Mo au total. Merci de retirer un fichier ou de joindre une version plus légère.'
      );
    }

    piecesJointes.push({
      filename: nomFichierSur(fichier.name, nom),
      content: versBase64(await fichier.arrayBuffer()),
    });
  }

  if (piecesJointes.length > 0) {
    lignes.push(['Pièces jointes', piecesJointes.map((p) => p.filename).join(', ')]);
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

  return { texte, html, piecesJointes };
}

/* ------------------------------------------------------------------ */
/* Utilitaires                                                        */
/* ------------------------------------------------------------------ */

function valeur(donnees, nom) {
  const brut = donnees.get(nom);
  return brut === null || typeof brut !== 'string' ? '' : brut.trim();
}

// Nom de fichier sûr pour la pièce jointe (Resend refuse certains caractères).
function nomFichierSur(brut, secours) {
  const nettoye = (brut || '').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-80);
  return nettoye || secours;
}

// btoa() n'accepte que des chaînes : conversion par blocs pour rester
// économe en mémoire sur les fichiers de plusieurs mégaoctets.
function versBase64(buffer) {
  const octets = new Uint8Array(buffer);
  const bloc = 0x8000;
  let binaire = '';
  for (let i = 0; i < octets.length; i += bloc) {
    binaire += String.fromCharCode.apply(null, octets.subarray(i, i + bloc));
  }
  return btoa(binaire);
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
