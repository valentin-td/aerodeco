/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js (Version Finale Sécurisée)
 * ═══════════════════════════════════════════════════════════════
 */

let panier = [];
let currentProduct = null;
let modalQty = 1;
let toastTimer = null;

/* ── 1. UTILITAIRES ── */
function formatPrix(montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(montant);
}

function afficherToast(message, duree = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  if (!toast || !toastMessage) return;
  
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duree);
}

function toggleScrollBody(bloquer) {
  document.body.classList.toggle('no-scroll', bloquer);
}

/* ── 2. MODALE PRODUIT ── */
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
    thumbHTML: card.querySelector('.product-img-wrap') ? card.querySelector('.product-img-wrap').innerHTML : '',
  };

  modalQty = 1;
  const qtyValue = document.getElementById('qty-value');
  if (qtyValue) qtyValue.textContent = modalQty;

  const modalImgWrap = document.getElementById('modal-img-wrap');
  if (modalImgWrap) {
    modalImgWrap.innerHTML = currentProduct.thumbHTML;
    const badge = modalImgWrap.querySelector('.product-badge');
    if (badge) badge.remove();
  }

  const modalRef = document.getElementById('modal-ref');
  const modalName = document.getElementById('modal-product-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');

  if (modalRef) modalRef.textContent = currentProduct.ref;
  if (modalName) modalName.textContent = currentProduct.name;
  if (modalPrice) modalPrice.textContent = formatPrix(currentProduct.price);

  if (modalDesc) {
    const phrases = currentProduct.fullDesc.split('|');
    modalDesc.innerHTML = phrases.map(p => `<p>${p.trim()}</p>`).join('');
  }

  if (modalSpecs) {
    modalSpecs.innerHTML = `
      <div class="modal-spec-item"><span class="modal-spec-label">Taille</span><span class="modal-spec-value">${currentProduct.size}</span></div>
      <div class="modal-spec-item"><span class="modal-spec-label">Matériau</span><span class="modal-spec-value">${currentProduct.material}</span></div>
      <div class="modal-spec-item"><span class="modal-spec-label">Finition</span><span class="modal-spec-value">${currentProduct.finish}</span></div>
      <div class="modal-spec-item"><span class="modal-spec-label">Origine</span><span class="modal-spec-value">🇫🇷 France</span></div>
    `;
  }

  const productModal = document.getElementById('product-modal');
  if (productModal) {
    productModal.classList.add('open');
    toggleScrollBody(true);
  }
}

function fermerModale() {
  const productModal = document.getElementById('product-modal');
  if (productModal) productModal.classList.remove('open');
  toggleScrollBody(false);
  currentProduct = null;
}

/* ── 3. PANIER LOGIQUE ── */
function mettreAJourBadgePanier() {
  const cartBadge = document.getElementById('cart-badge');
  if (!cartBadge) return;
  const total = panier.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = total;
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => cartBadge.style.transform = '', 220);
}

function ajouterAuPanier(produit, quantite) {
  const existing = panier.find(item => item.id === produit.id);
  if (existing) existing.qty += quantite;
  else panier.push({ id: produit.id, name: produit.name, price: produit.price, qty: quantite, thumbHTML: produit.thumbHTML });
  
  mettreAJourBadgePanier();
  afficherToast(`✓ "${produit.name}" ajouté au panier`);
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
  if (item.qty <= 0) supprimerDuPanier(id);
  else {
    mettreAJourBadgePanier();
    rendreListePanier();
  }
}

/* ── 4. RENDU PANIER ── */
function rendreListePanier() {
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartShipping = document.getElementById('cart-shipping-label');
  const cartTotal = document.getElementById('cart-total');

  if (!cartItemsList) return;

  if (panier.length === 0) {
    if (cartEmpty) cartEmpty.style.display = 'flex';
    if (cartFooter) cartFooter.setAttribute('hidden', '');
    cartItemsList.innerHTML = '';
    return;
  }

  if (cartEmpty) cartEmpty.style.display = 'none';
  if (cartFooter) cartFooter.removeAttribute('hidden');
  cartItemsList.innerHTML = '';

  let sousTotal = 0;

  panier.forEach(item => {
    sousTotal += item.price * item.qty;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    const svgClean = item.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '');
    
    div.innerHTML = `
      <div class="cart-thumb">${svgClean}</div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-unit">${formatPrix(item.price)} / unité</span>
        <div class="cart-item-controls">
          <button class="cart-ctrl" data-action="moins" data-id="${item.id}">−</button>
          <span class="cart-qty-display">${item.qty}</span>
          <button class="cart-ctrl" data-action="plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <button class="cart-remove" data-id="${item.id}">✕</button>
        <span class="cart-item-subtotal">${formatPrix(item.price * item.qty)}</span>
      </div>
    `;
    cartItemsList.appendChild(div);
  });

  const livraison = sousTotal >= 150 ? 0 : 9.90;
  if (cartSubtotal) cartSubtotal.textContent = formatPrix(sousTotal);
  if (cartShipping) cartShipping.textContent = livraison === 0 ? '🎁 Offerte' : formatPrix(livraison);
  if (cartTotal) cartTotal.textContent = formatPrix(sousTotal + livraison);
}

function ouvrirPanier() {
  rendreListePanier();
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartSidebar) cartSidebar.classList.add('open');
  if (cartOverlay) cartOverlay.classList.add('open');
  toggleScrollBody(true);
}

function fermerPanier() {
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  if (cartSidebar) cartSidebar.classList.remove('open');
  if (cartOverlay) cartOverlay.classList.remove('open');
  toggleScrollBody(false);
}

/* ── 5. INITIALISATION (SÉCURISÉE) ── */
document.addEventListener('DOMContentLoaded', () => {

  // Clics Boutique
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) ouvrirModale(card);
    });
  }

  // Contrôles Modale
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const productModal = document.getElementById('product-modal');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', fermerModale);
  if (productModal) productModal.addEventListener('click', (e) => { if (e.target === productModal) fermerModale(); });

  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const qtyValue = document.getElementById('qty-value');
  
  if (qtyMinus) qtyMinus.addEventListener('click', () => { if (modalQty > 1) { modalQty--; qtyValue.textContent = modalQty; }});
  if (qtyPlus) qtyPlus.addEventListener('click', () => { if (modalQty < 10) { modalQty++; qtyValue.textContent = modalQty; }});

  const modalAddBtn = document.getElementById('modal-add-btn');
  if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
      if (!currentProduct) return;
      ajouterAuPanier(currentProduct, modalQty);
      fermerModale();
      setTimeout(ouvrirPanier, 300);
    });
  }

  // Contrôles Panier
  const cartToggleBtn = document.getElementById('cart-toggle-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  
  if (cartToggleBtn) cartToggleBtn.addEventListener('click', ouvrirPanier);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', fermerPanier);
  if (cartOverlay) cartOverlay.addEventListener('click', fermerPanier);

  const cartItemsList = document.getElementById('cart-items-list');
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (e.target.classList.contains('cart-ctrl') && id) {
        changerQuantitePanier(id, e.target.dataset.action === 'plus' ? 1 : -1);
      }
      if (e.target.classList.contains('cart-remove') && id) {
        supprimerDuPanier(id);
        afficherToast('Article retiré.');
      }
    });
  }

  // Redirection Stripe Netlify
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (panier.length === 0) return;
      
      const originalText = checkoutBtn.textContent;
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = '⏳ Sécurisation...';

      try {
        const itemsToSend = panier.map(item => ({ id: item.id, qty: item.qty }));
        const response = await fetch('/.netlify/functions/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemsToSend)
        });
        const data = await response.json();
        if (data.url) window.location.href = data.url;
        else throw new Error("Pas d'URL Stripe");
      } catch (error) {
        console.error(error);
        afficherToast("Erreur de connexion au serveur.");
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;
      }
    });
  }

  // Échap pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fermerModale();
      fermerPanier();
    }
  });

  // Filtres
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
      });
    });
  });

  // Header Scroll
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 60 ? 'rgba(8,9,13,0.97)' : 'rgba(8,9,13,0.72)';
    }, { passive: true });
  }

  // ✨ CORRECTION DE L'ANIMATION "REVEAL" ✨
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); // Fait apparaître le texte et les fusées
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // On observe tous les éléments qui ont la classe "reveal"
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

}); // Fin DOMContentLoaded
