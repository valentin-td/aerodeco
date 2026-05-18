const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 🛑 TON CATALOGUE SÉCURISÉ
// C'est ici que tu définis tes prix. Stripe prend toujours les prix en CENTIMES.
const inventaire = {
  // ARTEMIS (3 tailles)
  "ADC-001-119": { nom: "Artemis Classic (25 cm)", prixCentimes: 11900 },
  "ADC-001-129": { nom: "Artemis Classic (50 cm)", prixCentimes: 12900 },
  "ADC-001-459": { nom: "Artemis Classic (1 Mètre)", prixCentimes: 45900 },
  
  // SATURN V (3 tailles)
  "ADC-002-219": { nom: "Saturn V Prestige (25 cm)", prixCentimes: 21900 },
  "ADC-002-229": { nom: "Saturn V Prestige (50 cm)", prixCentimes: 22900 },
  "ADC-002-559": { nom: "Saturn V Prestige (1 Mètre)", prixCentimes: 55900 },
  
  // AUTRES FUSÉES (Si elles n'ont qu'une taille pour l'instant)
  "ADC-003-229": { nom: "Falcon Gold Edition (40 cm)", prixCentimes: 22900 },
  "ADC-004-79": { nom: "Cosmos Bleu (25 cm)", prixCentimes: 7900 },
  "ADC-005-189": { nom: "Lourd Titan III (50 cm)", prixCentimes: 18900 },
  "ADC-006-259": { nom: "Stealth Noir Mat (38 cm)", prixCentimes: 25900 }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const panierClient = JSON.parse(event.body);
    let sousTotal = 0;

    const lineItems = panierClient.map(item => {
      // On cherche le produit par son ID + son PRIX pour trouver la bonne taille
      const cleRecherche = `${item.id}-${item.price}`;
      const produitSecurise = inventaire[cleRecherche];

      if (!produitSecurise) {
          throw new Error(`Produit ou prix non reconnu : ${cleRecherche}`);
      }

      sousTotal += produitSecurise.prixCentimes * item.qty;

      return {
        price_data: {
          currency: 'eur',
          product_data: { name: produitSecurise.nom },
          unit_amount: produitSecurise.prixCentimes,
        },
        quantity: item.qty,
      };
    });

    // Frais de port : 9.90€ si la commande est inférieure à 150€ (15000 centimes)
    if (sousTotal < 15000) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: "Livraison sécurisée" },
          unit_amount: 990,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
      line_items: lineItems,
      mode: 'payment',
      allow_promotion_codes: true, // Permet l'utilisation de codes promos dans la caisse
      
      // UR_LS MISES À JOUR AVEC TON NOM DE DOMAINE :
      success_url: 'https://aerodeco.fr/?success=true',
      cancel_url: 'https://aerodeco.fr/',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };

  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
