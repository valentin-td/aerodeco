const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 🛑 TON CATALOGUE SÉCURISÉ
// C'est ici que tu définis tes prix. Stripe prend toujours les prix en CENTIMES. (ex: 89€ = 8900)
const inventaire = {
  "ADC-001": { nom: "Ariane Classic", prixCentimes: 8900 },
  "ADC-002": { nom: "Saturn V Prestige", prixCentimes: 14900 },
  "ADC-003": { nom: "Falcon Gold Edition", prixCentimes: 22900 },
  "ADC-004": { nom: "Cosmos Bleu", prixCentimes: 7900 },
  "ADC-005": { nom: "Lourd Titan III", prixCentimes: 18900 },
  "ADC-006": { nom: "Stealth Noir Mat", prixCentimes: 25900 },
  "ADC-007": { nom: "Artemis I (1m)", prixCentimes: 45000 },
  "ADC-008": { nom: "Ensemble Artemis + Pas de Tir", prixCentimes: 65000 }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const panierClient = JSON.parse(event.body);
    let sousTotal = 0;

    const lineItems = panierClient.map(item => {
      const produitSecurise = inventaire[item.id];
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
      // 👇 REMPLACE LES URLS CI-DESSOUS PAR TON LIEN NETLIFY EXACT
      success_url: 'https://keen-licorice-f3a3f7.netlify.app/?success=true',
      cancel_url: 'https://keen-licorice-f3a3f7.netlify.app/',
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
