const { Plan } = require('../models/plan')

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

module.exports = {
    getAllPlans: async (req, res) => {
        let jsonProducts = {};
        try {
            const products = await stripe.products.list();
            jsonProducts.data = [];
            for (let i in products.data) {
                let jsonProduct = {};
                if (products.data[i].active) {

                    jsonProduct.id = products.data[i].id;
                    jsonProduct.name = products.data[i].name;
                    jsonProducts.data[i] = await getPricesForProduct(jsonProduct);
                }
            }
            res.send(jsonProducts);
        } catch (e) {
            console.log("error " + e.message);
        }
    },

    purchasePlan: async (req, res) => {
        try {
            const session = await stripe.checkout.sessions.create({
                success_url: 'http://localhost:5000/message',
                cancel_url: 'http://localhost:5000/message',
                line_items: [
                    {price: req.body.id, quantity: req.body.quantity},
                ],
                mode: 'subscription',
            })
            const urlCheckOut = session.url;
            res.send(urlCheckOut);
        } catch (e) {
            console.log("error " + e.message);
        }
    }
}

const getPricesForProduct = async (product) => {
    product.prices = [];
    try {
        const price = await stripe.prices.search({
            query: `product:\'${product.id}\'`,
        });
        for (let i in price.data) {
            product.prices[i] = {};
            product.prices[i].id = price.data[i].id;
            product.prices[i].price = price.data[i].unit_amount / 100;
            if (price.data[i].type == 'recurring')
                product.prices[i].interval = price.data[i].recurring.interval;
            if (price.data[i].type == 'one_time')
                product.prices[i].interval = price.data[i].type;
        }
        return product;

    } catch (e) {
        console.log("error " + e.message);
    }
}
