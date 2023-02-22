const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
  getPaymentIntentsInCents: async (startRangeTimestamp, endRangeTimestamp) => {
    const paymentIntents = await stripe.paymentIntents.list({
      created: { gte: startRangeTimestamp, lte: endRangeTimestamp },
      limit: 100 // Maximum limit (10 is default)
    });
    return paymentIntents;
  }
};
