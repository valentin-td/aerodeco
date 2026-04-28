/* ═══════════════════════════════════════════════════════════════
   AERODECO — style.css
   Design premium · Thème sombre · Aérospatial
   ═══════════════════════════════════════════════════════════════

   TABLE DES MATIÈRES
   1. Variables CSS (palette, typographie, espacements)
   2. Reset & Base
   3. Header fixe
   4. Section Héro
   5. Bande défilante (Marquee)
   6. Section Boutique & Grille Produits
   7. Section Savoir-Faire
   8. Footer
   9. Modale Produit
   10. Sidebar Panier
   11. Interface de Paiement (Checkout)
   12. Overlay Succès Paiement
   13. Toast Notification
   14. Animations & Keyframes
   15. Responsive (Tablette & Mobile)
═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────
   1. VARIABLES CSS
   ► Modifiez ces valeurs pour changer toute la charte graphique
───────────────────────────────────────────────────────────────*/
:root {
  /* Palette de couleurs */
  --void:       #08090d;   /* Fond principal — noir espace */
  --deep:       #0d1018;   /* Fond légèrement plus clair */
  --surface:    #13161f;   /* Surfaces des cartes */
  --panel:      #1a1e2b;   /* Panneaux et modales */
  --rim:        #252a3a;   /* Bordures subtiles */
  --muted:      #3a4058;   /* Éléments désactivés */
  --subtle:     #6b7394;   /* Texte secondaire */
  --text:       #c8cfe0;   /* Texte courant */
  --bright:     #e8ecf5;   /* Texte mis en valeur */
  --white:      #f5f7fc;   /* Blanc stellaire */
  --silver:     #b8c4d8;   /* Argenté métallique */

  /* Couleurs d'accent */
  --cyan:       #4ddcff;   /* Accent principal — bleu cyan */
  --cyan-dim:   #1a8aaa;   /* Cyan assombri */
  --orange:     #ff6b2b;   /* Accent secondaire — orange aérospatial */
  --gold:       #d4a843;   /* Or pour les éditions limitées */
  --success:    #28d983;   /* Vert succès */

  /* Typographie */
  --font-display: 'Bebas Neue', sans-serif;   /* Titres impactants */
  --font-body:    'DM Sans', sans-serif;      /* Corps de texte */

  /* Espacements */
  --sp-xs:  0.5rem;
  --sp-sm:  1rem;
  --sp-md:  1.5rem;
  --sp-lg:  2.5rem;
  --sp-xl:  4rem;

  /* Rayons de bordure */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Transitions */
  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Glassmorphism */
  --glass-bg:     rgba(19, 22, 31, 0.75);
  --glass-border: rgba(77, 220, 255, 0.12);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(77, 220, 255, 0.08);
}


/* ─────────────────────────────────────────────────────────────
   2. RESET & BASE
───────────────────────────────────────────────────────────────*/
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  background-color: var(--void);
  color: var(--text);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
}

/* Empêche le scroll de la page quand un overlay est ouvert */
body.no-scroll { overflow: hidden; }

img { display: block; max-width: 100%; }
button { font-family: var(--font-body); cursor: pointer; }
a { color: inherit; text-decoration: none; }
input, select, textarea { font-family: var(--font-body); }

/* Scrollbar personnalisée */
::-webkit-scrollbar        { width: 5px; }
::-webkit-scrollbar-track { background: var(--void); }
::-webkit-scrollbar-thumb { background: var(--muted); border-radius: 3px; }


/* ─────────────────────────────────────────────────────────────
   COMPOSANTS RÉUTILISABLES
───────────────────────────────────────────────────────────────*/

/* Bouton principal (fond cyan) */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--cyan);
  color: var(--void);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 14px 28px;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  background: #7deaff;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(77, 220, 255, 0.25);
}
.btn-primary:active { transform: translateY(0); }

/* Bouton secondaire (contour) */
.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--silver);
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 13px 28px;
  border: 1px solid var(--rim);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  text-decoration: none;
}
.btn-outline:hover { border-color: var(--silver); color: var(--white); }

/* Wrapper de section */
.section-wrapper { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

/* En-tête de section standard */
.section-header { text-align: center; margin-bottom: 3.5rem; }
.section-label {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 0.75rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  letter-spacing: 0.06em;
  color: var(--white);
  line-height: 1;
}
.section-desc {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  font-weight: 300;
  color: var(--subtle);
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}


/* ─────────────────────────────────────────────────────────────
   3. HEADER FIXE
───────────────────────────────────────────────────────────────*/
#main-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  height: 68px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: rgba(8, 9, 13, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--glass-border);
  transition: background 0.3s var(--ease-in-out);
}

/* Logo */
.logo { display: flex; align-items: center; gap: 10px; }
.logo-mark { width: 32px; height: 32px; flex-shrink: 0; }
.logo-text {
  font-family: var(--font-display);
  font-size: 1.55rem;
  letter-spacing: 0.12em;
  color: var(--white);
  line-height: 1;
}
.logo-text span { color: var(--cyan); }

/* Navigation */
#main-header nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}
#main-header nav a {
  color: var(--silver);
  font-size: 0.78rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  position: relative;
  transition: color 0.2s;
}
#main-header nav a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0; right: 0;
  height: 1px;
  background: var(--cyan);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out);
}
#main-header nav a:hover { color: var(--white); }
#main-header nav a:hover::after { transform: scaleX(1); }

/* Bouton panier */
.cart-icon-btn {
  position: relative;
  background: none;
  border: 1px solid var(--rim);
  color: var(--silver);
  width: 42px; height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}
.cart-icon-btn:hover {
  border-color: var(--cyan);
  color: var(--cyan);
  background: rgba(77, 220, 255, 0.07);
}

/* Badge compteur panier */
.cart-badge {
  position: absolute;
  top: -4px; right: -4px;
  background: var(--orange);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 600;
  width: 17px; height: 17px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}


/* ─────────────────────────────────────────────────────────────
   4. SECTION HÉRO
───────────────────────────────────────────────────────────────*/
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}

/* Grille de fond perspective */
.hero-grid-bg {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(77,220,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(77,220,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%);
  pointer-events: none;
}
/* Halo lumineux central */
.hero-glow {
  position: absolute;
  top: 35%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(77,220,255,0.06) 0%, transparent 65%);
  pointer-events: none;
}

.hero-content { position: relative; max-width: 920px; z-index: 1; }

/* Bandeau d'accroche */
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 1.5rem;
  padding: 6px 16px;
  border: 1px solid rgba(77,220,255,0.25);
  border-radius: var(--radius-sm);
  animation: fadeInDown 0.8s var(--ease-out) both;
}

/* Titre héro */
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 9vw, 8rem);
  line-height: 0.9;
  letter-spacing: 0.04em;
  color: var(--white);
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.9s 0.1s var(--ease-out) both;
}
.title-outline {
  color: transparent;
  -webkit-text-stroke: 1px rgba(77,220,255,0.5);
}
.title-orange { color: var(--orange); }

.hero-sub {
  font-size: 1rem;
  font-weight: 300;
  color: var(--subtle);
  max-width: 520px;
  margin: 0 auto 2.5rem;
  animation: fadeInUp 1s 0.2s var(--ease-out) both;
}
.hero-sub strong { color: var(--silver); font-weight: 400; }

.hero-cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s 0.3s var(--ease-out) both;
}

/* Statistiques sous le héro */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--rim);
  flex-wrap: wrap;
  animation: fadeInUp 1s 0.5s var(--ease-out) both;
}
.stat { text-align: center; }
.stat-num {
  display: block;
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--white);
}
.stat-lbl {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--subtle);
}


/* ─────────────────────────────────────────────────────────────
   5. BANDE DÉFILANTE (MARQUEE)
───────────────────────────────────────────────────────────────*/
.specs-strip {
  padding: 1.2rem 0;
  border-top: 1px solid var(--rim);
  border-bottom: 1px solid var(--rim);
  background: var(--surface);
  overflow: hidden;
  white-space: nowrap;
}
.marquee-track {
  display: inline-flex;
  gap: 3rem;
  animation: marquee 30s linear infinite;
}
.spec-item {
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  flex-shrink: 0;
}


/* ─────────────────────────────────────────────────────────────
   6. SECTION BOUTIQUE & GRILLE PRODUITS
───────────────────────────────────────────────────────────────*/
.boutique { padding: var(--sp-xl) 0; }

/* Boutons de filtrage */
.products-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2.5rem;
}
.filter-btn {
  background: none;
  border: 1px solid var(--rim);
  color: var(--subtle);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}
.filter-btn:hover { border-color: var(--cyan); color: var(--cyan); }
.filter-btn.active {
  background: rgba(77,220,255,0.1);
  border-color: var(--cyan);
  color: var(--cyan);
}

/* Grille des produits */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5px;
  background: var(--rim); /* La couleur de fond crée l'effet de séparation */
  border: 1px solid var(--rim);
}

/* Carte produit */
.product-card {
  background: var(--deep);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  position: relative;
  overflow: hidden;
}
.product-card:hover { background: var(--surface); }

/* Effet de bordure luisante au survol */
.product-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid var(--cyan);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  z-index: 1;
}
.product-card:hover::after { opacity: 1; }

/* Wrapper de l'image produit */
.product-img-wrap {
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  background: var(--surface);
}
.product-img-wrap svg,
.product-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out);
}
.product-card:hover .product-img-wrap svg,
.product-card:hover .product-img-wrap img {
  transform: translateY(-6px) scale(1.03); /* Légère lévitation au survol */
}

/* Badges produit (Nouveau, Best-seller, Édition Limitée) */
.product-badge {
  position: absolute;
  top: 1rem; left: 1rem;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 2px;
  z-index: 2;
}
.product-badge.new     { background: var(--cyan);    color: var(--void); }
.product-badge.hot     { background: var(--orange);  color: #fff; }
.product-badge.limited { background: var(--gold);    color: var(--void); }

/* Corps de la carte */
.product-body {
  padding: 1.4rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--rim);
}
.product-ref {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.2rem;
}
.product-name {
  font-family: var(--font-display);
  font-size: 1.45rem;
  letter-spacing: 0.06em;
  color: var(--bright);
  margin-bottom: 0.4rem;
  line-height: 1.1;
}
.product-desc-short {
  font-size: 0.8rem;
  font-weight: 300;
  color: var(--subtle);
  flex: 1;
  margin-bottom: 1rem;
  line-height: 1.6;
}
.product-footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.product-price {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: 0.04em;
  color: var(--white);
}
.product-price em {
  font-style: normal;
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--muted);
  font-weight: 300;
}
/* Lien "Voir le détail" */
.btn-voir {
  font-size: 0.72rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: var(--subtle);
  transition: color 0.2s;
  white-space: nowrap;
}
.product-card:hover .btn-voir { color: var(--cyan); }


/* ─────────────────────────────────────────────────────────────
   7. SECTION SAVOIR-FAIRE
───────────────────────────────────────────────────────────────*/
.savoir-faire {
  padding: var(--sp-xl) 0;
  background: var(--deep);
  border-top: 1px solid var(--rim);
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5px;
  background: var(--rim);
  border: 1px solid var(--rim);
}
.pillar {
  background: var(--deep);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}
.pillar::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.5s var(--ease-out);
}
.pillar:hover::before { transform: scaleX(1); }
.pillar:hover { background: var(--surface); }
.pillar-num {
  font-family: var(--font-display);
  font-size: 4.5rem;
  line-height: 1;
  letter-spacing: 0.05em;
  color: var(--rim);
  position: absolute;
  top: 1.2rem; right: 1.5rem;
  transition: color 0.3s;
  pointer-events: none;
}
.pillar:hover .pillar-num { color: rgba(77,220,255,0.1); }
.pillar-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  color: var(--bright);
  margin-bottom: 0.75rem;
  line-height: 1.1;
}
.pillar-text {
  font-size: 0.875rem;
  font-weight: 300;
  color: var(--subtle);
  line-height: 1.75;
}


/* ─────────────────────────────────────────────────────────────
   8. FOOTER
───────────────────────────────────────────────────────────────*/
footer {
  background: var(--void);
  border-top: 1px solid var(--rim);
  padding: 3.5rem 0 1.5rem;
}
.footer-inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2.5rem;
}
.footer-brand { display: flex; flex-direction: column; gap: 0.75rem; }
.footer-brand p { font-size: 0.82rem; font-weight: 300; color: var(--muted); line-height: 1.7; }
.footer-brand a { font-size: 0.82rem; color: var(--cyan); }
.footer-links-col { display: flex; flex-direction: column; gap: 0.5rem; }
.footer-links-col h4 {
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.1em;
  color: var(--bright);
  margin-bottom: 0.5rem;
}
.footer-links-col a { font-size: 0.82rem; font-weight: 300; color: var(--muted); transition: color 0.2s; }
.footer-links-col a:hover { color: var(--text); }
.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid var(--rim);
  text-align: center;
  font-size: 0.72rem;
  color: var(--muted);
}


/* ─────────────────────────────────────────────────────────────
   9. MODALE PRODUIT (Vue détaillée)
───────────────────────────────────────────────────────────────*/

/* Overlay sombre derrière la modale */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.35s var(--ease-out);
}

/* État visible */
.modal-overlay.is-visible { opacity: 1; }

/* Masqué via l'attribut hidden (JS ajoute/retire l'attribut) */
.modal-overlay[hidden] { display: none; }

/* Boîte de la modale — effet glassmorphism */
.modal-box {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  max-width: 820px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  transform: scale(0.95) translateY(12px);
  transition: transform 0.35s var(--ease-out);
}
.modal-overlay.is-visible .modal-box {
  transform: scale(1) translateY(0);
}

/* Bouton fermeture */
.modal-close {
  position: absolute;
  top: 1rem; right: 1rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--rim);
  color: var(--silver);
  width: 36px; height: 36px;
  border-radius: 50%;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.modal-close:hover { background: rgba(77,220,255,0.1); color: var(--cyan); border-color: var(--cyan); }

/* Image dans la modale */
.modal-img-wrap {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  background: var(--surface);
}
.modal-img-wrap svg,
.modal-img-wrap img {
  width: 100%; height: 100%;
  object-fit: cover;
}

/* Contenu textuel de la modale */
.modal-content {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
}
.modal-ref {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 0.25rem;
}
.modal-name {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--white);
  line-height: 1.05;
  margin-bottom: 0.75rem;
}

/* ─ NOUVEAU : SÉLECTEUR DE TAILLE DANS LA MODALE ─ */
.selector-container {
  margin: 10px 0 15px 0;
}
.selector-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--subtle);
  margin-bottom: 6px;
}
.aerodeco-dropdown {
  appearance: none;
  background-color: var(--void);
  color: var(--white);
  border: 1px solid var(--rim);
  padding: 10px 14px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  width: 100%;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  /* Petite flèche personnalisée à droite */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234DDCFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 14px top 50%;
  background-size: 10px auto;
}
.aerodeco-dropdown:focus, .aerodeco-dropdown:hover {
  outline: none;
  border-color: var(--cyan);
  box-shadow: 0 0 10px rgba(77, 220, 255, 0.15);
}
/* ─ FIN NOUVEAU SÉLECTEUR ─ */

.modal-price {
  font-family: var(--font-display);
  font-size: 2.2rem;
  letter-spacing: 0.05em;
  color: var(--cyan);
  margin-bottom: 1rem;
  transition: opacity 0.3s ease; /* Ajout d'une transition pour le changement dynamique */
}
.modal-desc {
  font-size: 0.85rem;
  font-weight: 300;
  color: var(--subtle);
  line-height: 1.75;
  margin-bottom: 1rem;
  flex: 1;
}
.modal-desc p { margin-bottom: 0.5rem; }

/* Spécifications techniques */
.modal-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--rim);
  border-radius: var(--radius-md);
}
.modal-spec-item { display: flex; flex-direction: column; gap: 2px; }
.modal-spec-label {
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}
.modal-spec-value { font-size: 0.82rem; color: var(--text); }

/* Sélecteur de quantité + bouton ajout */
.modal-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
}
.qty-selector {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--rim);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.qty-btn {
  background: var(--surface);
  border: none;
  color: var(--silver);
  width: 36px; height: 40px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}
.qty-btn:hover { background: var(--panel); color: var(--cyan); }
.qty-value {
  min-width: 36px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--bright);
  padding: 0 4px;
  background: var(--deep);
  line-height: 40px;
}
.btn-add-to-cart { flex: 1; justify-content: center; }


/* ─────────────────────────────────────────────────────────────
   10. SIDEBAR PANIER (panneau glissant)
───────────────────────────────────────────────────────────────*/

/* Overlay transparent sur la page quand le panier est ouvert */
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s var(--ease-out);
}
.cart-overlay.is-open { opacity: 1; pointer-events: all; }

/* Panneau latéral */
.cart-sidebar {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  z-index: 400;
  width: min(420px, 100vw);
  background: var(--panel);
  border-left: 1px solid var(--glass-border);
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.4s var(--ease-out);
}
.cart-sidebar.is-open { transform: translateX(0); }

/* En-tête du panier */
.cart-sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--rim);
  flex-shrink: 0;
}
.cart-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  color: var(--white);
}
.cart-close-btn {
  background: none;
  border: 1px solid var(--rim);
  color: var(--silver);
  width: 34px; height: 34px;
  border-radius: 50%;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s, color 0.2s;
}
.cart-close-btn:hover { border-color: var(--cyan); color: var(--cyan); }

/* Zone des articles */
.cart-items-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
}

/* Message panier vide */
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem 1rem;
  text-align: center;
  color: var(--muted);
}
.cart-empty svg { opacity: 0.3; }
.cart-empty p { font-size: 0.9rem; }
.cart-empty small { font-size: 0.78rem; font-weight: 300; }

/* Article dans le panier */
.cart-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 0.75rem;
  align-items: start;
  padding: 1rem 0;
  border-bottom: 1px solid var(--rim);
  animation: fadeInUp 0.3s var(--ease-out) both;
}
.cart-item-thumb {
  width: 56px; height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--surface);
  flex-shrink: 0;
}
.cart-item-thumb svg,
.cart-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.cart-item-info { display: flex; flex-direction: column; gap: 0.2rem; }
.cart-item-name { font-size: 0.85rem; font-weight: 500; color: var(--bright); }
.cart-item-price { font-size: 0.78rem; color: var(--subtle); }
/* Contrôles de quantité inline dans le panier */
.cart-item-qty-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.4rem;
}
.cart-qty-btn {
  background: var(--surface);
  border: 1px solid var(--rim);
  color: var(--silver);
  width: 24px; height: 24px;
  border-radius: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.cart-qty-btn:hover { background: var(--muted); color: var(--white); }
.cart-item-qty { font-size: 0.82rem; font-weight: 500; color: var(--text); min-width: 20px; text-align: center; }
/* Bouton supprimer */
.cart-remove-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 0.75rem;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
  align-self: flex-start;
  margin-top: 2px;
}
.cart-remove-btn:hover { color: #ff4d4d; }

/* Footer du panier */
.cart-sidebar-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--rim);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex-shrink: 0;
  background: rgba(0,0,0,0.2);
}
.cart-subtotal-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--subtle);
}
.cart-shipping { font-size: 0.75rem; }
.cart-total-row { padding-top: 0.5rem; border-top: 1px solid var(--rim); }
.cart-total-row strong { font-size: 1rem; color: var(--white); }
.btn-checkout { width: 100%; justify-content: center; font-size: 0.9rem; padding: 16px; }


/* ─────────────────────────────────────────────────────────────
   11. INTERFACE DE PAIEMENT (Checkout plein écran)
───────────────────────────────────────────────────────────────*/
.checkout-overlay {
  position: fixed;
  inset: 0;
  z-index: 600;
  background: var(--void);
  overflow-y: auto;
  animation: fadeIn 0.3s var(--ease-out) both;
}
.checkout-overlay[hidden] { display: none; }

/* Conteneur principal */
.checkout-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 2rem 3rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* En-tête checkout */
.checkout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--rim);
  margin-bottom: 2rem;
  flex-shrink: 0;
}
.checkout-close-btn {
  background: none;
  border: none;
  color: var(--subtle);
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}
.checkout-close-btn:hover { color: var(--cyan); }

/* Corps : 2 colonnes (formulaires | récapitulatif) */
.checkout-body {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 3rem;
  align-items: start;
  flex: 1;
}

/* ─ Formulaires ─ */
.checkout-forms { display: flex; flex-direction: column; gap: 2rem; }

/* Étape numérotée */
.checkout-step {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}
.checkout-step-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  letter-spacing: 0.08em;
  color: var(--white);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px; height: 28px;
  background: var(--cyan);
  color: var(--void);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 50%;
}

/* Badges sécurité paiement */
.security-badges { display: flex; gap: 6px; margin-left: auto; }
.badge-ssl {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--rim);
  color: var(--silver);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 3px;
}

/* Grille de formulaire */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.form-full { grid-column: 1 / -1; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--subtle);
}
.form-group input,
.form-group select {
  background: var(--surface);
  border: 1px solid var(--rim);
  border-radius: var(--radius-sm);
  color: var(--bright);
  font-size: 0.9rem;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-group input::placeholder { color: var(--muted); }
.form-group input:focus,
.form-group select:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(77, 220, 255, 0.1);
}
.form-group select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7394' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 36px;
}
option { background: var(--panel); }

/* ─ Carte bancaire (prévisualisation) ─ */
.card-preview {
  background: linear-gradient(135deg, #1a2040 0%, #0d1530 100%);
  border: 1px solid rgba(77,220,255,0.2);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}
/* Reflet haut gauche */
.card-preview::before {
  content: '';
  position: absolute;
  top: -30px; left: -30px;
  width: 120px; height: 120px;
  background: radial-gradient(circle, rgba(77,220,255,0.06), transparent 70%);
  pointer-events: none;
}
.card-chip {
  width: 36px; height: 28px;
  background: linear-gradient(135deg, var(--gold), #c8951a);
  border-radius: 5px;
  margin-bottom: 1.5rem;
  position: relative;
}
.card-chip::after {
  content: '';
  position: absolute;
  inset: 6px 0;
  border-top: 1px solid rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(0,0,0,0.3);
}
.card-number-preview {
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  letter-spacing: 0.25em;
  color: var(--bright);
  margin-bottom: 1rem;
}
.card-meta-preview {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.card-meta-preview span {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--silver);
}

/* ─ Bouton paiement final ─ */
.btn-pay {
  width: 100%;
  justify-content: center;
  padding: 18px;
  font-size: 1rem;
  letter-spacing: 0.12em;
  background: var(--cyan);
  box-shadow: 0 4px 20px rgba(77, 220, 255, 0.3);
}
.btn-pay:hover { box-shadow: 0 6px 28px rgba(77, 220, 255, 0.45); }

.checkout-notice {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 300;
  color: var(--muted);
  margin-top: 0.75rem;
  letter-spacing: 0.02em;
}

/* ─ Récapitulatif commande (colonne droite) ─ */
.checkout-summary {
  position: sticky;
  top: 1.5rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}
.checkout-summary-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  color: var(--white);
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--rim);
}

/* Article dans le récap */
.co-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.co-item-thumb {
  width: 44px; height: 44px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--surface);
  flex-shrink: 0;
}
.co-item-thumb svg,
.co-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
.co-item-info { flex: 1; }
.co-item-name { font-size: 0.82rem; font-weight: 500; color: var(--bright); }
.co-item-meta { font-size: 0.72rem; color: var(--muted); }
.co-item-price { font-size: 0.9rem; font-weight: 500; color: var(--white); white-space: nowrap; }

.checkout-total-block { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.checkout-total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--subtle);
}
.checkout-grand-total { padding-top: 0.75rem; border-top: 1px solid var(--rim); }
.checkout-grand-total strong { font-size: 1rem; color: var(--white); }

.checkout-mif-badge {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--subtle);
  padding: 8px;
  border: 1px dashed var(--rim);
  border-radius: var(--radius-sm);
}


/* ─────────────────────────────────────────────────────────────
   12. OVERLAY SUCCÈS PAIEMENT
───────────────────────────────────────────────────────────────*/
.success-overlay {
  position: fixed;
  inset: 0;
  z-index: 700;
  background: rgba(8, 9, 13, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s var(--ease-out);
}
.success-overlay[hidden] { display: none; }

.success-box {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: scaleIn 0.4s 0.1s var(--ease-out) both;
}

/* Animation SVG checkmark */
.success-checkmark {
  width: 80px; height: 80px;
  margin-bottom: 0.5rem;
}
.success-circle {
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  animation: drawCircle 0.7s 0.2s var(--ease-out) forwards;
}
.success-check {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  animation: drawCheck 0.5s 0.7s var(--ease-out) forwards;
}

.success-title {
  font-family: var(--font-display);
  font-size: 2rem;
  letter-spacing: 0.06em;
  color: var(--white);
}
.success-sub {
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--subtle);
  line-height: 1.7;
}
.success-order-id {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  padding: 8px 16px;
  border: 1px dashed var(--rim);
  border-radius: var(--radius-sm);
}


/* ─────────────────────────────────────────────────────────────
   13. TOAST NOTIFICATION
───────────────────────────────────────────────────────────────*/
.toast {
  position: fixed;
  bottom: 2rem; right: 2rem;
  z-index: 800;
  background: var(--surface);
  border: 1px solid var(--cyan);
  color: var(--bright);
  font-size: 0.82rem;
  padding: 12px 18px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 8px;
  transform: translateY(80px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s var(--ease-out), opacity 0.4s;
  box-shadow: 0 4px 20px rgba(77, 220, 255, 0.15);
}
.toast svg { color: var(--cyan); flex-shrink: 0; }
.toast.is-visible { transform: translateY(0); opacity: 1; pointer-events: all; }


/* ─────────────────────────────────────────────────────────────
   14. ANIMATIONS & KEYFRAMES
───────────────────────────────────────────────────────────────*/
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* Animations du checkmark de succès */
@keyframes drawCircle {
  to { stroke-dashoffset: 0; }
}
@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}


/* ─────────────────────────────────────────────────────────────
   15. RESPONSIVE (Tablette & Mobile)
───────────────────────────────────────────────────────────────*/

/* ─ Tablette (≤ 900px) ─ */
@media (max-width: 900px) {
  /* Header : cacher nav, garder logo + panier */
  #main-header nav { display: none; }

  /* Modale en colonne unique */
  .modal-box {
    grid-template-columns: 1fr;
    max-height: 95vh;
  }
  .modal-img-wrap {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 240px;
  }

  /* Checkout en colonne unique */
  .checkout-body { grid-template-columns: 1fr; }
  .checkout-summary { position: static; }

  /* Footer */
  .footer-inner { grid-template-columns: 1fr 1fr; gap: 2rem; }

  /* Grille produits : 2 colonnes */
  .products-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}

/* ─ Mobile (≤ 600px) ─ */
@media (max-width: 600px) {
  #main-header { padding: 0 1rem; }
  .section-wrapper { padding: 0 1rem; }
  .hero { padding: 6rem 1rem 3rem; }
  .hero-stats { gap: 1.5rem; }

  /* Grille produits : 1 colonne */
  .products-grid { grid-template-columns: 1fr; }

  /* Modale actions */
  .modal-actions { flex-direction: column; }
  .btn-add-to-cart { width: 100%; }

  /* Checkout grille formulaire */
  .form-grid { grid-template-columns: 1fr; }
  .form-full { grid-column: auto; }
  .checkout-container { padding: 1rem; }

  /* Toast en bas centré */
  .toast { left: 1rem; right: 1rem; bottom: 1rem; justify-content: center; }

  /* Footer en colonne */
  .footer-inner { grid-template-columns: 1fr; }

  /* Piliers savoir-faire */
  .pillars-grid { grid-template-columns: 1fr; }
}
