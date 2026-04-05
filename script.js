/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js
 * Logique interactive complète de la boutique
 * ═══════════════════════════════════════════════════════════════
 *
 * TABLE DES MATIÈRES
 * 1. État global (panier, produit sélectionné, quantité modale)
 * 2. Sélection des éléments du DOM
 * 3. Utilitaires (formatage prix, toast, scroll lock)
 * 4. Modale Produit (ouverture, fermeture, injection du contenu)
 * 5. Panier : logique (ajout, suppression, mise à jour quantité)
 * 6. Panier : rendu dans la sidebar
 * 7. Sidebar Panier (ouverture / fermeture)
 * 8. Checkout : ouverture, rendu du récap, formatage carte
 * 9. Paiement : validation et affichage du succès
 * 10. Filtres de la boutique
 * 11. Formatage numéro de carte (espaces automatiques)
 * 12. Initialisation (event listeners)
 */


/* ═══════════════════════════════════════════════════════════════
   1. ÉTAT GLOBAL
═══════════════════════════════════════════════════════════════ */

/**
 * panier : tableau des articles dans le panier.
 * Chaque article est un objet :
 * {
 *   id        : string  — identifiant unique du produit (data-id)
 *   name      : string  — nom du produit
 *   price     : number  — prix unitaire en euros
 *   qty       : number  — quantité commandée
 *   thumbHTML : string  — HTML de la miniature (SVG ou <img>)
 * }
 */
let panier = [];

/**
 * currentProduct : les données du produit actuellement affiché
 * dans la modale. Null si aucune modale ouverte.
 */
let currentProduct = null;

/**
 * modalQty : quantité sélectionnée dans la modale produit.
 * Réinitialisée à 1 à chaque ouverture.
 */
let modalQty = 1;

/** Référence au timer du toast (pour annuler si rappelé rapidement) */
let toastTimer = null;


/* ═══════════════════════════════════════════════════════════════
   2. SÉLECTION DES ÉLÉMENTS DU DOM
═══════════════════════════════════════════════════════════════ */

// ─ Header ─
const cartToggleBtn  = document.getElementById('cart-toggle-btn');
const cartBadge      = document.getElementById('cart-badge');

// ─ Modale produit ─
const productModal    = document.getElementById('product-modal');
const modalCloseBtn   = document.getElementById('modal-close-btn');
const modalImgWrap    = document.getElementById('modal-img-wrap');
const modalRef        = document.getElementById('modal-ref');
const modalName       = document.getElementById('modal-product-name');
const modalPrice      = document.getElementById('modal-price');
const modalDesc       = document.getElementById('modal-desc');
const modalSpecs      = document.getElementById('modal-specs');
const qtyMinus        = document.getElementById('qty-minus');
const qtyPlus         = document.getElementById('qty-plus');
const qtyValue        = document.getElementById('qty-value');
const modalAddBtn     = document.getElementById('modal-add-btn');

// ─ Sidebar panier ─
const cartOverlay     = document.getElementById('cart-overlay');
const cartSidebar     = document.getElementById('cart-sidebar');
const cartCloseBtn    = document.getElementById('cart-close-btn');
const cartItemsList   = document.getElementById('cart-items-list');
const cartEmpty       = document.getElementById('cart-empty');
const cartFooter      = document.getElementById('cart-footer');
const cartSubtotal    = document.getElementById('cart-subtotal');
const cartShipping    = document.getElementById('cart-shipping-label');
const cartTotal       = document.getElementById('cart-total');
const checkoutBtn     = document.getElementById('checkout-btn');

// ─ Checkout ─
const checkoutOverlay = document.getElementById('checkout-overlay');
const checkoutCloseBtn= document.getElementById('checkout-close-btn');
const checkoutSummary = document.getElementById('checkout-items-summary');
const coSubtotal      = document.getElementById('co-subtotal');
const coShipping      = document.getElementById('co-shipping');
const coTotal         = document.getElementById('co-total');
const payTotalLabel   = document.getElementById('pay-total-label');
const payBtn          = document.getElementById('pay-btn');
const cardNumInput    = document.getElementById('f-card-num');
const cardNumPreview  = document.getElementById('card-num-preview');

// ─ Succès ─
const successOverlay  = document.getElementById('success-overlay');
const successOrderId  = document.getElementById('success-order-id');
const successBackBtn  = document.getElementById('success-back-btn');

// ─ Toast ─
const toast           = document.getElementById('toast');
const toastMessage    = document.getElementById('toast-message');


/* ═══════════════════════════════════════════════════════════════
   3. UTILITAIRES
═══════════════════════════════════════════════════════════════ */

/**
 * Formate un nombre en prix français (ex: 1 490,00 €)
 * @param {number} montant
 * @returns {string}
 */
function formatPrix(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(montant);
}

/**
 * Affiche un toast de notification en bas de l'écran.
 * @param {string} message - Texte à afficher
 * @param {number} [duree=3000] - Durée en ms avant disparition
 */
function afficherToast(message, duree = 3000) {
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duree);
}

/**
 * Bloque ou débloque le scroll de la page.
 * @param {boolean} bloquer - true = bloquer, false = libérer
 */
function toggleScrollBody(bloquer) {
  document.body.classList.toggle('no-scroll', bloquer);
}

/**
 * Génère un ID de commande aléatoire pour la page de succès.
 * @returns {string}
 */
function genererIdCommande() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'ADC-';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}


/* ═══════════════════════════════════════════════════════════════
   4. MODALE PRODUIT
═══════════════════════════════════════════════════════════════ */

/**
 * Ouvre la modale et injecte les données du produit cliqué.
 * Appelé par un clic sur une .product-card.
 * @param {HTMLElement} card - L'élément <article class="product-card">
 */
function ouvrirModale(card) {
  // ─ Récupération des données depuis les attributs data-* ─
  currentProduct = {
    id       : card.dataset.id,
    name     : card.dataset.name,
    price    : parseFloat(card.dataset.price),
    ref      : card.dataset.ref,
    fullDesc : card.dataset.fullDesc, // phrases séparées par "|"
    size     : card.dataset.size,
    material : card.dataset.material,
    finish   : card.dataset.finish,
    // On clone le SVG/img depuis la carte pour l'afficher en grand
    thumbHTML: card.querySelector('.product-img-wrap').innerHTML,
  };

  // ─ Réinitialisation de la quantité ─
  modalQty = 1;
  qtyValue.textContent = modalQty;

  // ─ Injection du contenu dans la modale ─

  // Image (clone le HTML de la miniature)
  modalImgWrap.innerHTML = currentProduct.thumbHTML;
  // On retire le badge de la version grande pour ne pas doublon
  const badge = modalImgWrap.querySelector('.product-badge');
  if (badge) badge.remove();

  // Textes
  modalRef.textContent   = currentProduct.ref;
  modalName.textContent  = currentProduct.name;
  modalPrice.textContent = formatPrix(currentProduct.price);

  // Description complète : chaque phrase séparée par "|" devient un <p>
  const phrases = currentProduct.fullDesc.split('|');
  modalDesc.innerHTML = phrases.map(p => `<p>${p.trim()}</p>`).join('');

  // Spécifications techniques
  modalSpecs.innerHTML = `
    <div class="modal-spec-item">
      <span class="modal-spec-label">Taille</span>
      <span class="modal-spec-value">${currentProduct.size}</span>
    </div>
    <div class="modal-spec-item">
      <span class="modal-spec-label">Matériau</span>
      <span class="modal-spec-value">${currentProduct.material}</span>
    </div>
    <div class="modal-spec-item">
      <span class="modal-spec-label">Finition</span>
      <span class="modal-spec-value">${currentProduct.finish}</span>
    </div>
    <div class="modal-spec-item">
      <span class="modal-spec-label">Origine</span>
      <span class="modal-spec-value">🇫🇷 France</span>
    </div>
  `;

  // ─ Affichage de la modale ─
  productModal.removeAttribute('hidden');
  // Délai micro pour déclencher la transition CSS
  requestAnimationFrame(() => {
    requestAnimationFrame(() => productModal.classList.add('is-visible'));
  });

  toggleScrollBody(true);
  modalCloseBtn.focus(); // accessibilité
}

/**
 * Ferme la modale produit.
 */
function fermerModale() {
  productModal.classList.remove('is-visible');
  // On cache la modale après la transition (350ms)
  setTimeout(() => {
    productModal.setAttribute('hidden', '');
    currentProduct = null;
  }, 380);
  toggleScrollBody(false);
}


/* ═══════════════════════════════════════════════════════════════
   5. PANIER — LOGIQUE
═══════════════════════════════════════════════════════════════ */

/**
 * Calcule le sous-total du panier.
 * @returns {number}
 */
function calculerSousTotal() {
  return panier.reduce((acc, item) => acc + item.price * item.qty, 0);
}

/**
 * Calcule les frais de livraison.
 * Règle : offerts si sous-total ≥ 150€, sinon 9.90€.
 * @param {number} sousTotal
 * @returns {number}
 */
function calculerLivraison(sousTotal) {
  return sousTotal >= 150 ? 0 : 9.90;
}

/**
 * Ajoute un article au panier ou augmente sa quantité.
 * @param {Object} produit - { id, name, price, thumbHTML }
 * @param {number} quantite
 */
function ajouterAuPanier(produit, quantite) {
  const existing = panier.find(item => item.id === produit.id);
  if (existing) {
    // Le produit est déjà dans le panier : on augmente la quantité
    existing.qty += quantite;
  } else {
    // Nouveau produit
    panier.push({
      id       : produit.id,
      name     : produit.name,
      price    : produit.price,
      qty      : quantite,
      thumbHTML: produit.thumbHTML,
    });
  }
  mettreAJourBadgePanier();
  afficherToast(`✓ "${produit.name}" ajouté au panier (×${quantite})`);
}

/**
 * Retire complètement un article du panier.
 * @param {string} id - L'id du produit à supprimer
 */
function supprimerDuPanier(id) {
  panier = panier.filter(item => item.id !== id);
  mettreAJourBadgePanier();
  rendreListePanier();
}

/**
 * Modifie la quantité d'un article dans le panier.
 * Si la nouvelle quantité est ≤ 0, l'article est supprimé.
 * @param {string} id
 * @param {number} delta - Variation (+1 ou -1)
 */
function changerQuantitePanier(id, delta) {
  const item = panier.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    supprimerDuPanier(id);
    return;
  }
  mettreAJourBadgePanier();
  rendreListePanier();
}

/**
 * Met à jour le badge numérique du bouton panier dans le header.
 */
function mettreAJourBadgePanier() {
  const total = panier.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = total;
  // Animation rapide pour attirer l'attention
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => cartBadge.style.transform = '', 220);
}


/* ═══════════════════════════════════════════════════════════════
   6. PANIER — RENDU DANS LA SIDEBAR
═══════════════════════════════════════════════════════════════ */

/**
 * Construit et injecte le HTML de la liste des articles dans la sidebar.
 * Met aussi à jour les totaux.
 */
function rendreListePanier() {
  if (panier.length === 0) {
    // Panier vide : afficher le message
    cartEmpty.style.display  = 'flex';
    cartFooter.setAttribute('hidden', '');
    // On vide les éventuels articles restants
    const items = cartItemsList.querySelectorAll('.cart-item');
    items.forEach(el => el.remove());
    return;
  }

  // Panier non vide
  cartEmpty.style.display = 'none';
  cartFooter.removeAttribute('hidden');

  // ─ Construction du HTML des articles ─
  // On reconstruit tout proprement
  const existing = cartItemsList.querySelectorAll('.cart-item');
  existing.forEach(el => el.remove());

  panier.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.dataset.itemId = item.id;

    div.innerHTML = `
      <!-- Miniature du produit -->
      <div class="cart-item-thumb">${item.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '')}</div>

      <!-- Nom + prix + contrôles quantité -->
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatPrix(item.price)} / unité</span>
        <div class="cart-item-qty-row">
          <button class="cart-qty-btn" data-action="moins" data-id="${item.id}" aria-label="Diminuer">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" data-action="plus" data-id="${item.id}" aria-label="Augmenter">+</button>
        </div>
      </div>

      <!-- Bouton supprimer + sous-total de l'article -->
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Retirer du panier">✕</button>
        <span style="font-size:0.85rem;font-weight:500;color:var(--bright);">${formatPrix(item.price * item.qty)}</span>
      </div>
    `;

    cartItemsList.appendChild(div);
  });

  // ─ Mise à jour des totaux ─
  const sousTotal   = calculerSousTotal();
  const livraison   = calculerLivraison(sousTotal);
  const totalFinal  = sousTotal + livraison;

  cartSubtotal.textContent       = formatPrix(sousTotal);
  cartShipping.textContent       = livraison === 0 ? '🎁 Offerte' : formatPrix(livraison);
  cartTotal.textContent          = formatPrix(totalFinal);
}


/* ═══════════════════════════════════════════════════════════════
   7. SIDEBAR PANIER — OUVERTURE / FERMETURE
═══════════════════════════════════════════════════════════════ */

/**
 * Ouvre le panneau latéral panier.
 */
function ouvrirPanier() {
  rendreListePanier(); // refresh du contenu avant affichage
  cartSidebar.classList.add('is-open');
  cartOverlay.classList.add('is-open');
  toggleScrollBody(true);
  cartCloseBtn.focus();
}

/**
 * Ferme le panneau latéral panier.
 */
function fermerPanier() {
  cartSidebar.classList.remove('is-open');
  cartOverlay.classList.remove('is-open');
  toggleScrollBody(false);
}


/* ═══════════════════════════════════════════════════════════════
   8. CHECKOUT — OUVERTURE & RENDU DU RÉCAPITULATIF
═══════════════════════════════════════════════════════════════ */

/**
 * Ouvre l'interface de paiement plein écran.
 * Injecte le récapitulatif de commande et met à jour les totaux.
 */
function ouvrirCheckout() {
  fermerPanier();

  // ─ Injection du récapitulatif ─
  checkoutSummary.innerHTML = '';

  panier.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('co-item');
    div.innerHTML = `
      <div class="co-item-thumb">
        ${item.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '')}
      </div>
      <div class="co-item-info">
        <div class="co-item-name">${item.name}</div>
        <div class="co-item-meta">Quantité : ${item.qty}</div>
      </div>
      <span class="co-item-price">${formatPrix(item.price * item.qty)}</span>
    `;
    checkoutSummary.appendChild(div);
  });

  // ─ Totaux ─
  const sousTotal  = calculerSousTotal();
  const livraison  = calculerLivraison(sousTotal);
  const total      = sousTotal + livraison;

  coSubtotal.textContent    = formatPrix(sousTotal);
  coShipping.textContent    = livraison === 0 ? '🎁 Offerte' : formatPrix(livraison);
  coTotal.textContent       = formatPrix(total);
  payTotalLabel.textContent = formatPrix(total);

  // Affichage
  checkoutOverlay.removeAttribute('hidden');
  toggleScrollBody(true);
  document.getElementById('f-prenom').focus();
}

/**
 * Ferme l'interface de paiement et retourne au panier.
 */
function fermerCheckout() {
  checkoutOverlay.setAttribute('hidden', '');
  toggleScrollBody(false);
  ouvrirPanier();
}


/* ═══════════════════════════════════════════════════════════════
   9. PAIEMENT — VALIDATION & SUCCÈS
═══════════════════════════════════════════════════════════════ */

/**
 * Valide les champs du formulaire de paiement.
 * Retourne true si tout est OK, false sinon.
 * En cas d'erreur, met en évidence le premier champ invalide.
 * @returns {boolean}
 */
function validerFormulaire() {
  // Liste des champs obligatoires avec leur message d'erreur
  const champsObligatoires = [
    { id: 'f-prenom',   label: 'le prénom' },
    { id: 'f-nom',      label: 'le nom' },
    { id: 'f-email',    label: "l'e-mail" },
    { id: 'f-adresse',  label: "l'adresse" },
    { id: 'f-cp',       label: 'le code postal' },
    { id: 'f-ville',    label: 'la ville' },
    { id: 'f-card-name',label: 'le nom sur la carte' },
    { id: 'f-card-num', label: 'le numéro de carte' },
    { id: 'f-card-exp', label: "la date d'expiration" },
    { id: 'f-card-cvc', label: 'le CVC' },
  ];

  for (const champ of champsObligatoires) {
    const el = document.getElementById(champ.id);
    if (!el.value.trim()) {
      // Mise en évidence du champ manquant
      el.style.borderColor = '#ff4d4d';
      el.style.boxShadow   = '0 0 0 3px rgba(255,77,77,0.15)';
      el.focus();
      afficherToast(`⚠ Veuillez renseigner ${champ.label}.`);
      // Retirer la mise en évidence après 2 secondes
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow   = '';
      }, 2000);
      return false;
    }
  }

  // Vérification basique du format email
  const email = document.getElementById('f-email').value.trim();
  if (!email.includes('@') || !email.includes('.')) {
    const el = document.getElementById('f-email');
    el.style.borderColor = '#ff4d4d';
    el.focus();
    afficherToast("⚠ Format d'e-mail invalide.");
    setTimeout(() => el.style.borderColor = '', 2000);
    return false;
  }

  // Vérification longueur numéro de carte (16 chiffres)
  const numCarte = document.getElementById('f-card-num').value.replace(/\s/g, '');
  if (numCarte.length < 16) {
    const el = document.getElementById('f-card-num');
    el.style.borderColor = '#ff4d4d';
    el.focus();
    afficherToast('⚠ Numéro de carte invalide (16 chiffres requis).');
    setTimeout(() => el.style.borderColor = '', 2000);
    return false;
  }

  return true;
}

/**
 * Simule le paiement : valide le formulaire, vide le panier,
 * ferme le checkout et affiche l'écran de succès.
 */
function traiterPaiement() {
  if (!validerFormulaire()) return;

  // ─ Simulation du chargement ─
  payBtn.disabled = true;
  payBtn.textContent = '⏳ Traitement en cours…';

  setTimeout(() => {
    // Vider le panier
    panier = [];
    mettreAJourBadgePanier();

    // Fermer checkout
    checkoutOverlay.setAttribute('hidden', '');

    // Générer un ID de commande aléatoire
    const idCommande = genererIdCommande();
    successOrderId.textContent = `Numéro de commande : ${idCommande}`;

    // Afficher l'écran de succès
    successOverlay.removeAttribute('hidden');

    // Réinitialiser le bouton pour la prochaine fois
    payBtn.disabled = false;
    payBtn.innerHTML = `🔒 Payer ma commande — <span id="pay-total-label">0 €</span>`;

  }, 1800); // Délai simulant le traitement réseau
}


/* ═══════════════════════════════════════════════════════════════
   10. FILTRES DE LA BOUTIQUE
═══════════════════════════════════════════════════════════════ */

/**
 * Filtre les cartes produits selon la catégorie sélectionnée.
 * @param {string} filtre - 'all' | 'classique' | 'premium' | 'edition'
 */
function appliquerFiltre(filtre) {
  const cartes = document.querySelectorAll('.product-card');
  cartes.forEach(card => {
    const correspondance = filtre === 'all' || card.dataset.category === filtre;
    // Animation de disparition / apparition
    if (correspondance) {
      card.style.display    = '';
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(12px)';
      // Légère animation d'apparition
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      });
    } else {
      card.style.display = 'none';
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   11. FORMATAGE NUMÉRO DE CARTE (espaces automatiques)
═══════════════════════════════════════════════════════════════ */

/**
 * Formate le numéro de carte bancaire en temps réel :
 * - Supprime les non-chiffres
 * - Insère un espace toutes les 4 positions
 * - Met à jour la prévisualisation de la carte
 */
function formaterNumeroCarte(e) {
  // Supprimer tout ce qui n'est pas un chiffre
  let v = e.target.value.replace(/\D/g, '');
  // Limiter à 16 chiffres
  v = v.substring(0, 16);
  // Insérer les espaces : "1234 5678 9012 3456"
  const groups = [];
  for (let i = 0; i < v.length; i += 4) {
    groups.push(v.substring(i, i + 4));
  }
  e.target.value = groups.join(' ');

  // Mise à jour de la prévisualisation sur la carte
  if (v.length > 0) {
    // Masquer les chiffres affichés, montrer les 4 derniers
    let affichage = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) affichage += ' ';
      affichage += (i < v.length) ? v[i] : '•';
    }
    cardNumPreview.textContent = affichage;
  } else {
    cardNumPreview.textContent = '•••• •••• •••• ••••';
  }
}


/* ═══════════════════════════════════════════════════════════════
   12. INITIALISATION — EVENT LISTENERS
   ► Tous les écouteurs d'événements sont centralisés ici
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Cartes produits : délégation d'événements ─────────── */
  // On écoute les clics sur le conteneur de la grille plutôt que
  // sur chaque carte individuellement (plus performant).
  document.getElementById('products-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) ouvrirModale(card);
  });


  /* ── Modale produit ─────────────────────────────────────── */

  // Bouton fermeture "✕"
  modalCloseBtn.addEventListener('click', fermerModale);

  // Clic sur l'overlay (zone sombre) ferme la modale
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) fermerModale();
  });

  // Touche Échap ferme la modale
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!productModal.hasAttribute('hidden')) fermerModale();
      if (cartSidebar.classList.contains('is-open')) fermerPanier();
    }
  });

  // Sélecteur de quantité : bouton "−"
  qtyMinus.addEventListener('click', () => {
    if (modalQty > 1) {
      modalQty--;
      qtyValue.textContent = modalQty;
    }
  });

  // Sélecteur de quantité : bouton "+"
  qtyPlus.addEventListener('click', () => {
    if (modalQty < 10) { // Limite à 10 par commande
      modalQty++;
      qtyValue.textContent = modalQty;
    }
  });

  // Bouton "Ajouter au panier" dans la modale
  modalAddBtn.addEventListener('click', () => {
    if (!currentProduct) return;

    ajouterAuPanier(currentProduct, modalQty);
    fermerModale();
    // Ouvrir automatiquement le panier après ajout
    setTimeout(() => ouvrirPanier(), 400);
  });


  /* ── Sidebar panier ─────────────────────────────────────── */

  // Ouverture via le bouton header
  cartToggleBtn.addEventListener('click', ouvrirPanier);

  // Fermeture via le bouton "✕"
  cartCloseBtn.addEventListener('click', fermerPanier);

  // Fermeture via l'overlay
  cartOverlay.addEventListener('click', fermerPanier);

  // Délégation pour les boutons dans la liste du panier
  // (quantité + / − et suppression)
  cartItemsList.addEventListener('click', (e) => {
    const id     = e.target.dataset.id;
    const action = e.target.dataset.action;

    if (e.target.classList.contains('cart-qty-btn') && id) {
      const delta = action === 'plus' ? +1 : -1;
      changerQuantitePanier(id, delta);
    }

    if (e.target.classList.contains('cart-remove-btn') && id) {
      supprimerDuPanier(id);
      afficherToast('Article retiré du panier.');
    }
  });

  // Bouton "Passer à la caisse"
  checkoutBtn.addEventListener('click', () => {
    if (panier.length === 0) {
      afficherToast('Votre panier est vide !');
      return;
    }
    ouvrirCheckout();
  });


  /* ── Checkout ────────────────────────────────────────────── */

  // Retour au panier
  checkoutCloseBtn.addEventListener('click', fermerCheckout);

  // Touche Échap dans le checkout → retour au panier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !checkoutOverlay.hasAttribute('hidden')) {
      fermerCheckout();
    }
  });

  // Formatage automatique du numéro de carte
  cardNumInput.addEventListener('input', formaterNumeroCarte);

  // Formatage de la date d'expiration (MM/AA)
  document.getElementById('f-card-exp').addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    e.target.value = v;
  });

  // Bouton "Payer ma commande"
  payBtn.addEventListener('click', traiterPaiement);


  /* ── Succès ─────────────────────────────────────────────── */

  // Retour à la boutique depuis l'écran de succès
  successBackBtn.addEventListener('click', () => {
    successOverlay.setAttribute('hidden', '');
    toggleScrollBody(false);
    // Réinitialiser les formulaires
    document.querySelectorAll('input, select').forEach(el => {
      if (el.tagName === 'SELECT') return; // garder la valeur du select pays
      el.value = '';
    });
    // Remettre les prévisualisations carte à zéro
    cardNumPreview.textContent = '•••• •••• •••• ••••';
    document.getElementById('card-holder-preview').textContent = 'VOTRE NOM';
    document.getElementById('card-exp-preview').textContent    = 'MM/AA';
    // Scroll vers la boutique
    document.getElementById('boutique').scrollIntoView({ behavior: 'smooth' });
  });


  /* ── Filtres boutique ────────────────────────────────────── */

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Mettre à jour le style actif
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Appliquer le filtre
      appliquerFiltre(btn.dataset.filter);
    });
  });


  /* ── Header : opacité au scroll ─────────────────────────── */

  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60
      ? 'rgba(8,9,13,0.97)'
      : 'rgba(8,9,13,0.8)';
  }, { passive: true });


  /* ── Liens d'ancrage fluides ─────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const cible = document.querySelector(id);
      if (cible) {
        e.preventDefault();
        const offset = cible.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ── Animation d'apparition au scroll (Intersection Observer) ─ */

  // On observe tous les éléments avec la classe .reveal
  const observateur = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observateur.unobserve(entry.target); // observer une seule fois
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  // On ajoute le style initial puis on observe
  document.querySelectorAll('.pillar, .product-card, .checkout-step').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`;
    observateur.observe(el);
  });

}); // Fin DOMContentLoaded
