const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
    getEvents: async (req, res) => {

        const payload = req.body;
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_ENDPOINT_SECRETKEY;

        let event;

        try {
            event = stripe.webhooks.constructEvent(payload, sig.toString(), endpointSecret)
        } catch (err) {
            console.log(err.message)
            res.status(400).json({success: false})
            return;
        }

        console.log(event.type);
        console.log(event.data);
    }
}
