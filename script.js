/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js (Version Stripe Express)
 * ═══════════════════════════════════════════════════════════════
 */

/* ── 1. ÉTAT GLOBAL ── */
let currentProduct = null;
let toastTimer = null;

/* ── 2. SÉLECTION DES ÉLÉMENTS DU DOM ── */
const productModal    = document.getElementById('product-modal');
const modalCloseBtn   = document.getElementById('modal-close-btn');
const modalImgWrap    = document.getElementById('modal-img-wrap');
const modalRef        = document.getElementById('modal-ref');
const modalName       = document.getElementById('modal-product-name');
const modalPrice      = document.getElementById('modal-price');
const modalDesc       = document.getElementById('modal-desc');
const modalSpecs      = document.getElementById('modal-specs');
const modalAddBtn     = document.getElementById('modal-add-btn'); // Devient le bouton d'achat
const toast           = document.getElementById('toast');
const toastMessage    = document.getElementById('toast-message');

/* ── 3. UTILITAIRES ── */
function formatPrix(montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(montant);
}

function afficherToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

function toggleScrollBody(bloquer) {
  document.body.classList.toggle('no-scroll', bloquer);
}

/* ── 4. MODALE PRODUIT ── */
function ouvrirModale(card) {
  currentProduct = {
    id         : card.dataset.id,
    name       : card.dataset.name,
    price      : parseFloat(card.dataset.price),
    ref        : card.dataset.ref,
    fullDesc   : card.dataset.fullDesc,
    size       : card.dataset.size,
    material   : card.dataset.material,
    finish     : card.dataset.finish,
    stripeLink : card.dataset.stripeLink, // RÉCUPÈRE TON LIEN STRIPE ICI
    thumbHTML  : card.querySelector('.product-img-wrap').innerHTML,
  };

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

  // Mise à jour du texte du bouton
  modalAddBtn.textContent = "🚀 COMMANDER MAINTENANT";

  productModal.removeAttribute('hidden');
  requestAnimationFrame(() => productModal.classList.add('is-visible'));
  toggleScrollBody(true);
}

function fermerModale() {
  productModal.classList.remove('is-visible');
  setTimeout(() => { productModal.setAttribute('hidden', ''); currentProduct = null; }, 380);
  toggleScrollBody(false);
}

/* ── 5. INITIALISATION ── */
document.addEventListener('DOMContentLoaded', () => {

  // Clic sur une carte produit
  document.getElementById('products-grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) ouvrirModale(card);
  });

  // Fermeture modale
  modalCloseBtn.addEventListener('click', fermerModale);
  productModal.addEventListener('click', (e) => { if (e.target === productModal) fermerModale(); });

  // ACTION D'ACHAT (REDIRECTION STRIPE)
  modalAddBtn.addEventListener('click', () => {
    if (currentProduct && currentProduct.stripeLink) {
      afficherToast("Redirection vers le paiement sécurisé...");
      // Redirige vers ton lien Stripe après un court délai
      setTimeout(() => {
        window.location.href = currentProduct.stripeLink;
      }, 800);
    } else {
      afficherToast("Erreur : Lien de paiement indisponible.");
    }
  });

  // Filtres boutique
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtre = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (filtre === 'all' || card.dataset.category === filtre) ? '' : 'none';
      });
    });
  });

  // Liens d'ancrage fluides
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const cible = document.querySelector(id);
      if (cible) { e.preventDefault(); window.scrollTo({ top: cible.offsetTop - 80, behavior: 'smooth' }); }
    });
  });
});
