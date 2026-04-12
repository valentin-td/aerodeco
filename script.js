/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js (Version Netlify + Stripe Panier Dynamique)
 * Logique interactive complète de la boutique
 * ═══════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════
   1. ÉTAT GLOBAL
═══════════════════════════════════════════════════════════════ */
let panier = [];
let currentProduct = null;
let modalQty = 1;
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

// ─ Toast ─
const toast           = document.getElementById('toast');
const toastMessage    = document.getElementById('toast-message');

/* ═══════════════════════════════════════════════════════════════
   3. UTILITAIRES
═══════════════════════════════════════════════════════════════ */
function formatPrix(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(montant);
}

function afficherToast(message, duree = 3000) {
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duree);
}

function toggleScrollBody(bloquer) {
  document.body.classList.toggle('no-scroll', bloquer);
}

/* ═══════════════════════════════════════════════════════════════
   4. MODALE PRODUIT
═══════════════════════════════════════════════════════════════ */
function ouvrirModale(card) {
  currentProduct = {
    id       : card.dataset.id,
    name     : card.dataset.name,
    price    : parseFloat(card.dataset.price),
    ref      : card.dataset.ref,
    fullDesc : card.dataset.fullDesc,
    size     : card.dataset.size,
    material : card.dataset.material,
    finish   : card.dataset.finish,
    thumbHTML: card.querySelector('.product-img-wrap').innerHTML,
  };

  modalQty = 1;
  qtyValue.textContent = modalQty;

  modalImgWrap.innerHTML = currentProduct.thumbHTML;
  const badge = modalImgWrap.querySelector('.product-badge');
  if (badge) badge.remove();

  modalRef.textContent   = currentProduct.ref;
  modalName.textContent  = currentProduct.name;
  modalPrice.textContent = formatPrix(currentProduct.price);

  const phrases = currentProduct.fullDesc.split('|');
  modalDesc.innerHTML = phrases.map(p => `<p>${p.trim()}</p>`).join('');

  modalSpecs.innerHTML = `
    <div class="modal-spec-item"><span class="modal-spec-label">Taille</span><span class="modal-spec-value">${currentProduct.size}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Matériau</span><span class="modal-spec-value">${currentProduct.material}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Finition</span><span class="modal-spec-value">${currentProduct.finish}</span></div>
    <div class="modal-spec-item"><span class="modal-spec-label">Origine</span><span class="modal-spec-value">🇫🇷 France</span></div>
  `;

  productModal.removeAttribute('hidden');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => productModal.classList.add('is-visible'));
  });

  toggleScrollBody(true);
  modalCloseBtn.focus();
}

function fermerModale() {
  productModal.classList.remove('is-visible');
  setTimeout(() => {
    productModal.setAttribute('hidden', '');
    currentProduct = null;
  }, 380);
  toggleScrollBody(false);
}

/* ═══════════════════════════════════════════════════════════════
   5. PANIER — LOGIQUE
═══════════════════════════════════════════════════════════════ */
function calculerSousTotal() {
  return panier.reduce((acc, item) => acc + item.price * item.qty, 0);
}

function calculerLivraison(sousTotal) {
  return sousTotal >= 150 ? 0 : 9.90;
}

function ajouterAuPanier(produit, quantite) {
  const existing = panier.find(item => item.id === produit.id);
  if (existing) {
    existing.qty += quantite;
  } else {
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

function supprimerDuPanier(id) {
  panier = panier.filter(item => item.id !== id);
  mettreAJourBadgePanier();
  rendreListePanier();
}

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

function mettreAJourBadgePanier() {
  const total = panier.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = total;
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => cartBadge.style.transform = '', 220);
}

/* ═══════════════════════════════════════════════════════════════
   6. PANIER — RENDU DANS LA SIDEBAR
═══════════════════════════════════════════════════════════════ */
function rendreListePanier() {
  if (panier.length === 0) {
    cartEmpty.style.display  = 'flex';
    cartFooter.setAttribute('hidden', '');
    cartItemsList.innerHTML = '';
    return;
  }

  cartEmpty.style.display = 'none';
  cartFooter.removeAttribute('hidden');
  cartItemsList.innerHTML = '';

  panier.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.dataset.itemId = item.id;

    div.innerHTML = `
      <div class="cart-item-thumb">${item.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '')}</div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${formatPrix(item.price)} / unité</span>
        <div class="cart-item-qty-row">
          <button class="cart-qty-btn" data-action="moins" data-id="${item.id}" aria-label="Diminuer">−</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="cart-qty-btn" data-action="plus" data-id="${item.id}" aria-label="Augmenter">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Retirer du panier">✕</button>
        <span style="font-size:0.85rem;font-weight:500;color:var(--bright);">${formatPrix(item.price * item.qty)}</span>
      </div>
    `;
    cartItemsList.appendChild(div);
  });

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
function ouvrirPanier() {
  rendreListePanier();
  cartSidebar.classList.add('is-open');
  cartOverlay.classList.add('is-open');
  toggleScrollBody(true);
  cartCloseBtn.focus();
}

function fermerPanier() {
  cartSidebar.classList.remove('is-open');
  cartOverlay.classList.remove('is-open');
  toggleScrollBody(false);
}

/* ═══════════════════════════════════════════════════════════════
   8. FILTRES DE LA BOUTIQUE
═══════════════════════════════════════════════════════════════ */
function appliquerFiltre(filtre) {
  const cartes = document.querySelectorAll('.product-card');
  cartes.forEach(card => {
    const correspondance = filtre === 'all' || card.dataset.category === filtre;
    if (correspondance) {
      card.style.display    = '';
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(12px)';
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
   9. INITIALISATION — EVENT LISTENERS
═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Cartes produits ── */
  document.getElementById('products-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) ouvrirModale(card);
  });

  /* ── Modale produit ── */
  modalCloseBtn.addEventListener('click', fermerModale);
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) fermerModale();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!productModal.hasAttribute('hidden')) fermerModale();
      if (cartSidebar.classList.contains('is-open')) fermerPanier();
    }
  });

  qtyMinus.addEventListener('click', () => {
    if (modalQty > 1) {
      modalQty--;
      qtyValue.textContent = modalQty;
    }
  });

  qtyPlus.addEventListener('click', () => {
    if (modalQty < 10) {
      modalQty++;
      qtyValue.textContent = modalQty;
    }
  });

  modalAddBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    ajouterAuPanier(currentProduct, modalQty);
    fermerModale();
    setTimeout(() => ouvrirPanier(), 400);
  });

  /* ── Sidebar panier ── */
  cartToggleBtn.addEventListener('click', ouvrirPanier);
  cartCloseBtn.addEventListener('click', fermerPanier);
  cartOverlay.addEventListener('click', fermerPanier);

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

  /* ── Checkout avec Stripe & Netlify ── */
  checkoutBtn.addEventListener('click', async () => {
    if (panier.length === 0) {
      afficherToast('Votre panier est vide !');
      return;
    }

    // On change le texte du bouton et on le désactive pour éviter les doubles clics
    const originalText = checkoutBtn.textContent;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = '⏳ Sécurisation en cours...';

    try {
      // On prépare un tableau propre avec uniquement les IDs et quantités de tes fusées
      const itemsToSend = panier.map(item => ({ id: item.id, qty: item.qty }));

      // On envoie ce panier à notre nouvelle fonction secrète Netlify
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemsToSend)
      });

      const data = await response.json();

      // Si Stripe a bien créé une page, on redirige le client
      if (data.url) {
        window.location.href = data.url;
      } else {
        afficherToast("Erreur lors de la création de la session.");
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
      }
    } catch (error) {
      console.error(error);
      afficherToast("Erreur de connexion au serveur.");
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = originalText;
    }
  });

  /* ── Filtres boutique ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appliquerFiltre(btn.dataset.filter);
    });
  });

  /* ── Header : opacité au scroll ── */
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    header.style.background = window.scrollY > 60
      ? 'rgba(8,9,13,0.97)'
      : 'rgba(8,9,13,0.8)';
  }, { passive: true });

  /* ── Liens d'ancrage fluides ── */
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

  /* ── Animation d'apparition au scroll ── */
  const observateur = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observateur.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.pillar, .product-card, .checkout-step').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`;
    observateur.observe(el);
  });

}); // Fin DOMContentLoaded
