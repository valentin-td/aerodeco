/**
 * ═══════════════════════════════════════════════════════════════
 * AERODECO — script.js (Version Finale avec Carrousel, 3D AR & Tailles)
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

/* ── 2. MODALE PRODUIT (AVEC CARROUSEL ET 3D) ── */
function ouvrirModale(card) {
  currentProduct = {
    id       : card.dataset.id,
    name     : card.dataset.name,
    price    : parseFloat(card.dataset.price),
    basePrice: parseFloat(card.dataset.price), // On sauvegarde le prix de base (50cm)
    ref      : card.dataset.ref,
    fullDesc : card.dataset.fullDesc,
    size     : card.dataset.size,
    material : card.dataset.material,
    finish   : card.dataset.finish,
    thumbHTML: card.querySelector('.product-img-wrap') ? card.querySelector('.product-img-wrap').innerHTML : '',
    // Récupération des données pour le carrousel et la 3D
    images   : card.dataset.images ? card.dataset.images.split(',').filter(img => img.trim() !== '') : [],
    model3D  : card.dataset['3d'] || ''
  };

  modalQty = 1;
  const qtyValue = document.getElementById('qty-value');
  if (qtyValue) qtyValue.textContent = modalQty;

  // ── GESTION DU MÉDIA (CARROUSEL / 3D) ──
  const carousel = document.getElementById('image-carousel');
  const container3D = document.getElementById('3d-container');
  const viewer3D = document.getElementById('model-3d');
  const toggleBtn = document.getElementById('toggle-3d-btn');

  if (carousel && container3D && toggleBtn) {
    // 1. Réinitialisation de l'affichage par défaut (on montre les photos)
    carousel.style.display = 'flex';
    container3D.style.display = 'none';
    toggleBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      Voir en 3D (Réalité Augmentée)
    `;

    // 2. Injection des images dans le carrousel
    if (currentProduct.images.length > 0) {
      // S'il y a des liens d'images dans data-images
      carousel.innerHTML = currentProduct.images.map(img => `<img src="${img.trim()}" class="carousel-img" alt="${currentProduct.name}">`).join('');
    } else {
      // Fallback : s'il n'y a pas d'image, on affiche le SVG de la carte
      const cleanSVG = currentProduct.thumbHTML.replace(/<span[^>]*product-badge[^>]*>.*?<\/span>/gi, '');
      carousel.innerHTML = `<div class="carousel-img" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">${cleanSVG}</div>`;
    }

    // 3. Logique du bouton 3D
    if (currentProduct.model3D) {
      toggleBtn.style.display = 'flex'; // On montre le bouton
      toggleBtn.onclick = () => {
        if (container3D.style.display === 'none') {
          // On bascule en mode 3D
          carousel.style.display = 'none';
          container3D.style.display = 'block';
          if (viewer3D) viewer3D.src = currentProduct.model3D; // Charge le fichier 3D
          toggleBtn.innerHTML = 'Retour aux photos';
        } else {
          // On revient aux photos
          carousel.style.display = 'flex';
          container3D.style.display = 'none';
          toggleBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Voir en 3D (Réalité Augmentée)
          `;
        }
      };
    } else {
      // Si la fusée n'a pas de fichier 3D, on cache le bouton
      toggleBtn.style.display = 'none';
    }
  }

  // ── MISE A JOUR DES TEXTES ──
  const modalRef = document.getElementById('modal-ref');
  const modalName = document.getElementById('modal-product-name');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalSpecs = document.getElementById('modal-specs');
  
  // NOUVEAU : Récupération du sélecteur de taille
  const sizeSelector = document.getElementById('rocket-size');

  if (modalRef) modalRef.textContent = currentProduct.ref;
  if (modalName) modalName.textContent = currentProduct.name;
  
  // Affichage du prix initial sans le formateur (juste le chiffre + €)
  if (modalPrice) {
      modalPrice.innerHTML = `<span id="dynamic-price">${currentProduct.price}</span><span> €</span>`;
  }

  // ── NOUVEAU : GESTION DU SÉLECTEUR DE TAILLE (Prix Dynamique) ──
  if (sizeSelector && modalPrice) {
      // On s'assure que le menu déroulant affiche toujours le prix de base à l'ouverture
      sizeSelector.value = "389"; // Tu peux ajuster cette valeur selon ton prix de base
      
      // On retire les anciens écouteurs pour éviter les doublons si on ouvre plusieurs fusées
      const newSizeSelector = sizeSelector.cloneNode(true);
      sizeSelector.parentNode.replaceChild(newSizeSelector, sizeSelector);
      
      // On écoute le changement de taille
      newSizeSelector.addEventListener('change', function() {
          const newPrice = parseFloat(this.value);
          
          // On met à jour l'objet currentProduct en mémoire pour que le panier prenne le bon prix
          currentProduct.price = newPrice;
          
          // Mise à jour de la taille dans les specs visuellement (optionnel mais sympa)
          const sizeSpecValue = document.querySelector('.modal-specs .modal-spec-item:first-child .modal-spec-value');
          if (newPrice === 189) { currentProduct.size = "25 cm"; if(sizeSpecValue) sizeSpecValue.textContent = "25 cm"; }
          else if (newPrice === 389) { currentProduct.size = "50 cm"; if(sizeSpecValue) sizeSpecValue.textContent = "50 cm"; }
          else if (newPrice === 990) { currentProduct.size = "1 Mètre"; if(sizeSpecValue) sizeSpecValue.textContent = "1 Mètre"; }

          // Animation CSS (fondu)
          modalPrice.style.opacity = 0;
          
          setTimeout(() => {
              // Met à jour le texte du prix
              modalPrice.innerHTML = `<span id="dynamic-price">${newPrice}</span><span> €</span>`;
              // Fait réapparaître le prix
              modalPrice.style.opacity = 1;
          }, 300); // 300ms correspond au temps de la transition CSS
      });
  }
  // ── FIN DU NOUVEAU BLOC ──

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

  // ── OUVERTURE DE LA MODALE ──
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
  // On utilise l'ID + le Prix pour différencier une fusée de 50cm d'une fusée de 1m dans le panier !
  const cartId = produit.id + '-' + produit.price;
  const existing = panier.find(item => item.cartId === cartId);
  
  if (existing) {
      existing.qty += quantite;
  } else {
      panier.push({ 
          cartId: cartId, // Nouvel ID unique
          id: produit.id, 
          name: produit.name + ' (' + produit.size + ')', // On ajoute la taille au nom dans le panier
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
      // On utilise maintenant cartid (ID + Prix) pour gérer les quantités
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

  // ✨ ANIMATION "REVEAL" ✨
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

  // ✨ LOGIQUE DE LA FAQ (Accordéon) ✨
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const currentItem = button.closest('.faq-item');
      const isActive = currentItem.classList.contains('active');
      
      // On ferme d'abord toutes les questions
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // On ouvre la question cliquée (seulement si elle n'était pas déjà ouverte)
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });

}); // Fin DOMContentLoaded
