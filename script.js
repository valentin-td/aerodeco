/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js  (version Stripe Payment Links)
 * ═══════════════════════════════════════════════════════════════
 *
 * CHANGEMENTS PAR RAPPORT À LA VERSION PRÉCÉDENTE
 * ─────────────────────────────────────────────────
 * ✓  Toute la logique Panier (cart) supprimée
 * ✓  Toute la logique Checkout interne supprimée
 * ✓  Le bouton "Ajouter au panier" → "Acheter maintenant"
 * ✓  Au clic, redirection vers data-stripe-link du produit
 * ✓  Bouton Panier masqué dans le header (via index.html)
 * ✓  Modale produit inchangée dans sa présentation
 *
 * TABLE DES MATIÈRES
 * ──────────────────
 * 1. État global
 * 2. Sélection des éléments du DOM
 * 3. Utilitaires (formatage prix, toast, scroll lock)
 * 4. Modale Produit (ouverture, fermeture, injection du contenu)
 * 5. Filtres de la boutique
 * 6. Initialisation (event listeners)
 *
 * ► POUR METTRE À JOUR UN LIEN STRIPE :
 *   Ouvrez index.html, trouvez l'<article> du produit voulu
 *   et modifiez l'attribut data-stripe-link="https://buy.stripe.com/..."
 */


/* ═══════════════════════════════════════════════════════════════
   1. ÉTAT GLOBAL
═══════════════════════════════════════════════════════════════ */

/**
 * currentProduct : données du produit ouvert dans la modale.
 * Null si aucune modale n'est ouverte.
 * Structure :
 * {
 *   name       : string  — nom du produit
 *   price      : number  — prix en euros
 *   ref        : string  — référence produit
 *   fullDesc   : string  — description longue (phrases séparées par "|")
 *   size       : string  — taille (ex: "30 cm")
 *   material   : string  — matériau (ex: "PLA+ Premium")
 *   finish     : string  — finition
 *   thumbHTML  : string  — HTML de la miniature (SVG ou <img>)
 *   stripeLink : string  — URL du Stripe Payment Link
 * }
 */
let currentProduct = null;

/** Timer du toast (pour annulation si rappelé rapidement) */
let toastTimer = null;


/* ═══════════════════════════════════════════════════════════════
   2. SÉLECTION DES ÉLÉMENTS DU DOM
═══════════════════════════════════════════════════════════════ */

// ─ Modale produit ─
const productModal  = document.getElementById('product-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalImgWrap  = document.getElementById('modal-img-wrap');
const modalRef      = document.getElementById('modal-ref');
const modalName     = document.getElementById('modal-product-name');
const modalPrice    = document.getElementById('modal-price');
const modalDesc     = document.getElementById('modal-desc');
const modalSpecs    = document.getElementById('modal-specs');
const modalBuyBtn   = document.getElementById('modal-buy-btn');   // ← nouveau : lien Stripe

// ─ Toast ─
const toastEl       = document.getElementById('toast-stripe');
const toastMsgEl    = document.getElementById('toast-stripe-msg');


/* ═══════════════════════════════════════════════════════════════
   3. UTILITAIRES
═══════════════════════════════════════════════════════════════ */

/**
 * Formate un nombre en prix français (ex : 229 €).
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
 * Affiche un toast de notification.
 * @param {string} message
 * @param {number} [duree=3200]
 */
function afficherToast(message, duree = 3200) {
  if (!toastEl || !toastMsgEl) return;
  toastMsgEl.textContent = message;
  toastEl.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), duree);
}

/**
 * Bloque ou libère le scroll de la page.
 * @param {boolean} bloquer
 */
function toggleScrollBody(bloquer) {
  document.body.classList.toggle('no-scroll', bloquer);
}


/* ═══════════════════════════════════════════════════════════════
   4. MODALE PRODUIT
═══════════════════════════════════════════════════════════════ */

/**
 * Ouvre la modale et injecte les données du produit cliqué.
 *
 * ► DONNÉES LUES DEPUIS LES ATTRIBUTS data-* DE L'<article> :
 *   data-name, data-price, data-ref, data-full-desc,
 *   data-size, data-material, data-finish, data-stripe-link
 *
 * @param {HTMLElement} card — L'élément <article class="product-card">
 */
function ouvrirModale(card) {

  // ── Lecture des attributs data-* ──────────────────────────
  currentProduct = {
    name      : card.dataset.name,
    price     : parseFloat(card.dataset.price),
    ref       : card.dataset.ref,
    fullDesc  : card.dataset.fullDesc,   // phrases séparées par "|"
    size      : card.dataset.size,
    material  : card.dataset.material,
    finish    : card.dataset.finish,
    thumbHTML : card.querySelector('.product-img-wrap').innerHTML,
    stripeLink: card.dataset.stripeLink, // ← URL Stripe Payment Link
  };

  // ── Vérification de sécurité : lien Stripe manquant ───────
  if (!currentProduct.stripeLink || currentProduct.stripeLink.includes('REMPLACEZ')) {
    afficherToast('⚠ Lien de paiement non configuré pour ce produit.');
    console.warn(
      `[Aerodeco] Le produit "${currentProduct.name}" n'a pas de data-stripe-link valide.`,
      '\nOuvrez index.html et remplacez "REMPLACEZ_ADCxxx" par votre vrai lien Stripe.'
    );
  }

  // ── Injection de l'image ──────────────────────────────────
  modalImgWrap.innerHTML = currentProduct.thumbHTML;
  // Supprimer le badge de la version agrandie (évite le doublon)
  modalImgWrap.querySelector('.product-badge')?.remove();

  // ── Injection des textes ──────────────────────────────────
  modalRef.textContent   = currentProduct.ref;
  modalName.textContent  = currentProduct.name;
  modalPrice.textContent = formatPrix(currentProduct.price);

  // Description : chaque phrase séparée par "|" → un paragraphe <p>
  const phrases = (currentProduct.fullDesc || '').split('|');
  modalDesc.innerHTML = phrases
    .map(p => `<p>${p.trim()}</p>`)
    .join('');

  // ── Spécifications techniques ─────────────────────────────
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

  // ── Configurer le bouton "Acheter maintenant" ─────────────
  // On met à jour le href du lien <a> avec l'URL Stripe du produit
  if (modalBuyBtn) {
    modalBuyBtn.href = currentProduct.stripeLink || '#';
    // Mise à jour du texte avec le prix pour rassurer l'utilisateur
    modalBuyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
      Acheter — ${formatPrix(currentProduct.price)}
    `;
  }

  // ── Affichage de la modale avec transition ────────────────
  productModal.removeAttribute('hidden');
  // Micro-délai pour déclencher la transition CSS (opacity + scale)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => productModal.classList.add('is-visible'));
  });

  toggleScrollBody(true);
  modalCloseBtn?.focus(); // accessibilité : focus sur le bouton fermeture
}

/**
 * Ferme la modale produit.
 */
function fermerModale() {
  productModal.classList.remove('is-visible');
  // Masquer après la fin de la transition CSS (350ms)
  setTimeout(() => {
    productModal.setAttribute('hidden', '');
    currentProduct = null;
  }, 380);
  toggleScrollBody(false);
}


/* ═══════════════════════════════════════════════════════════════
   5. FILTRES DE LA BOUTIQUE
═══════════════════════════════════════════════════════════════ */

/**
 * Filtre les cartes produits selon la catégorie sélectionnée.
 * @param {string} filtre — 'all' | 'classique' | 'premium' | 'edition'
 */
function appliquerFiltre(filtre) {
  document.querySelectorAll('.product-card').forEach(card => {
    const visible = filtre === 'all' || card.dataset.category === filtre;
    if (visible) {
      card.style.display   = '';
      card.style.opacity   = '0';
      card.style.transform = 'translateY(12px)';
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
   6. INITIALISATION — EVENT LISTENERS
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Grille produits : clic → ouvrir la modale ────────────
     Délégation d'événements sur le conteneur parent (plus
     performant que d'attacher un listener à chaque carte).    */
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) ouvrirModale(card);
    });
  }


  /* ── Modale : fermeture ───────────────────────────────────*/

  // Bouton ✕
  modalCloseBtn?.addEventListener('click', fermerModale);

  // Clic sur l'overlay sombre (en dehors de .modal-box)
  productModal?.addEventListener('click', (e) => {
    if (e.target === productModal) fermerModale();
  });

  // Touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && productModal && !productModal.hasAttribute('hidden')) {
      fermerModale();
    }
  });


  /* ── Bouton "Acheter maintenant" dans la modale ───────────
     Le lien <a> est déjà configuré dans ouvrirModale().
     On ajoute juste un guard : si le lien n'est pas valide,
     on bloque la navigation et on affiche un toast d'erreur.  */
  modalBuyBtn?.addEventListener('click', (e) => {
    if (!currentProduct) return;

    const lien = currentProduct.stripeLink;

    // Guard : lien non configuré
    if (!lien || lien === '#' || lien.includes('REMPLACEZ')) {
      e.preventDefault();
      afficherToast('⚠ Lien Stripe non configuré. Contactez-nous pour commander.');
      return;
    }

    // Lien valide → le navigateur suit le href (target="_blank")
    // On ferme la modale après un court délai (UX propre)
    setTimeout(fermerModale, 300);
  });


  /* ── Filtres boutique ────────────────────────────────────*/
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appliquerFiltre(btn.dataset.filter);
    });
  });


  /* ── Opacité du header au scroll ────────────────────────*/
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 60
        ? 'rgba(8,9,13,0.97)'
        : 'rgba(8,9,13,0.72)';
    }, { passive: true });
  }


  /* ── Liens d'ancrage fluides ─────────────────────────────*/
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


  /* ── Apparition au scroll (Intersection Observer) ────────*/
  const observateur = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observateur.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.pillar, .product-card').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`;
    observateur.observe(el);
  });


  /* ── Mobile nav ──────────────────────────────────────────*/
  const hamburgerBtn  = document.getElementById('hamburger-btn');
  const mobileNav     = document.getElementById('mobile-nav');
  const mobileClose   = document.getElementById('mobile-nav-close');

  hamburgerBtn?.addEventListener('click', () => {
    mobileNav?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function fermerMobileNav() {
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileClose?.addEventListener('click', fermerMobileNav);
  document.querySelectorAll('.mobile-link').forEach(link =>
    link.addEventListener('click', fermerMobileNav)
  );

}); // Fin DOMContentLoaded
