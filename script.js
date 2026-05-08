/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js
 * ═══════════════════════════════════════════════════════════════
 */

let panier = [];
let currentProduct = null;
let modalQty = 1;
let toastTimer = null;

let lightboxImages = [];
let lightboxIndex = 0;

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

/* ── 2. LIGHTBOX (Plein écran) ── */
function ouvrirLightbox(index) {
  const lightbox = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg || lightboxImages.length === 0) return;
  lightboxIndex = index;
  lightboxImg.src = lightboxImages[lightboxIndex];
  lightbox.classList.add('open');
}

function fermerLightbox() {
  const lightbox = document.getElementById('lightbox-overlay');
  if (lightbox) lightbox.classList.remove('open');
}

function navLightbox(delta) {
  if (lightboxImages.length === 0) return;
  lightboxIndex += delta;
  if (lightboxIndex < 0) lightboxIndex = lightboxImages.length - 1;
  if (lightboxIndex >= lightboxImages.length) lightboxIndex = 0;
  document.getElementById('lightbox-img').src = lightboxImages[lightboxIndex];
}

/* ── 3. MODALE PRODUIT ── */
function ouvrirModale(card) {
  currentProduct = {
    id       : card.dataset.id,
    name     : card.dataset.name,
    price    : parseFloat(card.dataset.price),
    basePrice: parseFloat(card.dataset.price),
    prices   : card.dataset.prices ? card.dataset.prices.split(',') : [card.dataset.price], // Lit les 3 prix
    ref      : card.dataset.ref,
    fullDesc : card.dataset.fullDesc,
    size     : card.dataset.size,
    material : card.dataset.material,
    finish   : card.dataset.finish,
    thumbHTML: card.querySelector('.product-img-wrap') ? card.querySelector('.product-img-wrap').innerHTML : '',
    images   : card.dataset.images ? card.dataset.images.split(',').filter(img => img.trim() !== '') : [],
    model3D  : card.dataset['3d'] || ''
  };

  modalQty = 1;
  const qtyValue = document.getElementById('qty-value');
  if (qtyValue) qtyValue.textContent = modalQty;

  const carousel = document.getElementById('image-carousel');
  const container3D = document.getElementById('3d-container');
  const viewer3D = document.getElementById('model-3d');
  const toggleBtn = document.getElementById('toggle-3d-btn');

  if (carousel && container3D && toggleBtn) {
    carousel.style.display = 'flex';
    container3D.style.display = 'none';
    toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> Voir en 3D (Réalité Augmentée)`;

    if (currentProduct.images.length > 0) {
      lightboxImages = currentProduct.images.map(img => img.trim());
      carousel.innerHTML = lightboxImages.map((img, idx) => 
        `<img src="${img}" class="carousel-img" alt="${currentProduct.name}" data-idx="${idx}" style="cursor: zoom-in;">`
      ).join('');

      carousel.querySelectorAll('.carousel-img').forEach(imgEl => {
        imgEl.addEventListener('click', (e) => {
          ouvrirLightbox(parseInt(e.target.dataset.idx));
        });
      });

      const btnPrev = document.getElementById('carousel-prev');
      const btnNext = document.getElementById('carousel-next');
      if (btnPrev && btnNext) {
        if (currentProduct.images.length > 1) {
          btnPrev.style.display = 'flex';
          btnNext.style.display = 'flex';
          btnPrev.onclick = () => carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
          btnNext.onclick = () => carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
        } else {
          btnPrev.style.display = 'none';
          btnNext.style.display = 'none';
        }
      }
    } else {
      const cleanSVG = currentProduct.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '');
      carousel.innerHTML = `<div class="carousel-img" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">${cleanSVG}</div>`;
      lightboxImages = [];
    }

    if (currentProduct.model3D) {
      toggleBtn.style.display = 'flex';
      toggleBtn.onclick = () => {
        if (container3D.style.display === 'none') {
          carousel.style.display = 'none';
          container3D.style.display = 'block';
          if (viewer3D) viewer3D.src = currentProduct.model3D;
          toggleBtn.innerHTML = 'Retour aux photos';
        } else {
          carousel.style.display = 'flex';
          container3D.style.display = 'none';
          toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg> Voir en 3D (Réalité Augmentée)`;
        }
      };
    } else {
      toggleBtn.style.display = 'none';
    }
  }

  const modalRef = document.getElementById('modal-ref');
  const modalName = document.getElementById('modal-product-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  const sizeSelector = document.getElementById('rocket-size');

  if (modalRef) modalRef.textContent = currentProduct.ref;
  if (modalName) modalName.textContent = currentProduct.name;
  
  // GÉNÉRATION DYNAMIQUE DU MENU DÉROULANT DES PRIX
  if (sizeSelector && modalPrice) {
      sizeSelector.innerHTML = ''; // On vide l'ancien menu
      
      if (currentProduct.prices.length === 3) {
          // S'il y a bien 3 prix renseignés dans le HTML
          sizeSelector.innerHTML = `
              <option value="${currentProduct.prices[0]}">25 cm — Modèle Bureau</option>
              <option value="${currentProduct.prices[1]}" selected>50 cm — Édition Collector</option>
              <option value="${currentProduct.prices[2]}">1 Mètre — Format Monumental</option>
          `;
          // Par défaut, on sélectionne l'Edition Collector (50cm) au centre
          currentProduct.price = parseFloat(currentProduct.prices[1]);
          currentProduct.size = "50 cm";
      } else {
          // Secours si tu n'as mis qu'un seul prix
          sizeSelector.innerHTML = `<option value="${currentProduct.basePrice}" selected>${currentProduct.size}</option>`;
      }

      modalPrice.innerHTML = `<span id="dynamic-price">${currentProduct.price}</span><span> €</span>`;
      
      const newSizeSelector = sizeSelector.cloneNode(true);
      sizeSelector.parentNode.replaceChild(newSizeSelector, sizeSelector);
      
      newSizeSelector.addEventListener('change', function() {
          const newPrice = parseFloat(this.value);
          currentProduct.price = newPrice;
          
          const sizeSpecValue = document.querySelector('.modal-specs .modal-spec-item:first-child .modal-spec-value');
          const selectedText = this.options[this.selectedIndex].text;
          
          if (selectedText.includes('25 cm')) { currentProduct.size = "25 cm"; if(sizeSpecValue) sizeSpecValue.textContent = "25 cm"; }
          else if (selectedText.includes('50 cm')) { currentProduct.size = "50 cm"; if(sizeSpecValue) sizeSpecValue.textContent = "50 cm"; }
          else if (selectedText.includes('1 Mètre')) { currentProduct.size = "1 Mètre"; if(sizeSpecValue) sizeSpecValue.textContent = "1 Mètre"; }

          modalPrice.style.opacity = 0;
          setTimeout(() => {
              modalPrice.innerHTML = `<span id="dynamic-price">${newPrice}</span><span> €</span>`;
              modalPrice.style.opacity = 1;
          }, 300);
      });
  }

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

/* ── 4. PANIER LOGIQUE ── */
function mettreAJourBadgePanier() {
  const cartBadge = document.getElementById('cart-badge');
  if (!cartBadge) return;
  const total = panier.reduce((acc, item) => acc + item.qty, 0);
  cartBadge.textContent = total;
  cartBadge.style.transform = 'scale(1.4)';
  setTimeout(() => cartBadge.style.transform = '', 220);
}

function ajouterAuPanier(produit, quantite) {
  const cartId = produit.id + '-' + produit.price;
  const existing = panier.find(item => item.cartId === cartId);
  
  if (existing) {
      existing.qty += quantite;
  } else {
      panier.push({ 
          cartId: cartId,
          id: produit.id, 
          name: produit.name + ' (' + produit.size + ')',
          price: produit.price, 
          qty: quantite, 
          thumbHTML: produit.thumbHTML 
      });
  }
  mettreAJourBadgePanier();
  afficherToast(`✓ "${produit.name}" ajouté au panier`);
}

function supprimerDuPanier(cartId) {
  panier = panier.filter(item => item.cartId !== cartId);
  mettreAJourBadgePanier();
  rendreListePanier();
}

function changerQuantitePanier(cartId, delta) {
  const item = panier.find(i => i.cartId === cartId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) supprimerDuPanier(cartId);
  else {
    mettreAJourBadgePanier();
    rendreListePanier();
  }
}

/* ── 5. RENDU PANIER ── */
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
          <button class="cart-ctrl" data-action="moins" data-cartid="${item.cartId}">−</button>
          <span class="cart-qty-display">${item.qty}</span>
          <button class="cart-ctrl" data-action="plus" data-cartid="${item.cartId}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <button class="cart-remove" data-cartid="${item.cartId}">✕</button>
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

/* ── 6. INITIALISATION DES ÉVÉNEMENTS ── */
document.addEventListener('DOMContentLoaded', () => {

  // Clics Boutique
  const grid = document.getElementById('products-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (card) ouvrirModale(card);
    });
  }

  // Événements Lightbox
  const lightboxCloseBtn = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxOverlay = document.getElementById('lightbox-overlay');

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', fermerLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(-1); });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navLightbox(1); });
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-overlay') fermerLightbox();
  });

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
      const cartId = e.target.dataset.cartid; 
      if (e.target.classList.contains('cart-ctrl') && cartId) {
        changerQuantitePanier(cartId, e.target.dataset.action === 'plus' ? 1 : -1);
      }
      if (e.target.classList.contains('cart-remove') && cartId) {
        supprimerDuPanier(cartId);
        afficherToast('Article retiré.');
      }
    });
  }

  // ====== MENU MOBILE (HAMBURGER) ======
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      toggleScrollBody(true);
    });
  }
  
  if (mobileNavClose && mobileNav) {
    mobileNavClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggleScrollBody(false);
    });
  }

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav) mobileNav.classList.remove('open');
      toggleScrollBody(false);
    });
  });

  // Redirection Stripe Netlify
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (panier.length === 0) return;
      const originalText = checkoutBtn.textContent;
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = '⏳ Sécurisation...';
      try {
        const itemsToSend = panier.map(item => ({ id: item.id, qty: item.qty, price: item.price }));
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

  // Échap et flèches clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lightbox = document.getElementById('lightbox-overlay');
      if (lightbox && lightbox.classList.contains('open')) {
        fermerLightbox();
      } else {
        fermerModale();
        fermerPanier();
      }
    }
    const lightbox = document.getElementById('lightbox-overlay');
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
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

  // ✨ ANIMATION "REVEAL" ✨
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible'); 
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ✨ LOGIQUE DE LA FAQ (Accordéon) ✨
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.faq-item');
      const isActive = currentItem.classList.contains('active');
      
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });

}); // Fin DOMContentLoaded