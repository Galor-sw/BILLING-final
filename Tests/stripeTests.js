require("dotenv").config({path: '../.env'});

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const getPlans = async () => {

    try {
        const products = await stripe.products.list({
            active: true
        });
        console.log(products)

    } catch (err) {
        console.log(err.message)
    }
}

const getPrices = async () => {
    const prices = await stripe.prices.list({
        active: true
    });

    console.log(prices)
}

getPlans();
getPrices();
