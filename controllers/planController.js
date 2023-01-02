const {Plan} = require('../models/plan')

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);

const serverLogger = require(`../logger`);
const logger = serverLogger.log;

module.exports = {
    getAllPlans: async (req, res) => {

        let plans, prices;

        try {
            plans = await getPlans();
            prices = await getPrices();

        } catch (err) {
            logger.error(`retrieve from stripe error: ${err.message}`)
        }

        // Plan.find({}).then(result => {
        //     res.send(result);
        // })
        //     .catch(err => loggers.error(err));
    },
    getPlanByName: async (req, res) => {
        Plan.findOne({'name': name}).then(result => {
            if (result) {
                res.send(result);
            } else {
                res.send("Does not exist, try again");
            }
        }).catch(err => loggers.error(err));
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
                metadata: {
                    // we can insert here key value pairs with data we want to get whe nwebhooks arrives.
                    planId: "insert Id here"
                }
            })
            const urlCheckOut = session.url;
            res.send(urlCheckOut);
        } catch (e) {
            console.log("error " + e.message);
        }
    }
}

const getPlans = () => {
    let planList = [];

    const plans = stripe.products.list({
        active: true
    });

    plans.data.forEach(elem => {
        const plan = {
            id: elem.id,
            name: elem.name,
            description: elem.description,
            //prices:
        }
        planList.push(plan);
    })

    return planList;
}

const getPrices = () => {
    let pricesDict = {};

    let prices = stripe.prices.list({
        active: true
    });

    prices.data.forEach(elem => {
        const price = {
            id: elem.id,
            currency: elem.currency,
            product: elem.product,
            amount: elem.amount / 100,
        }
        pricesDict["??"] = price;
    })

    return prices;
}

// const getPricesForProduct = async (product) => {
//     product.prices = [];
//     try {
//         const price = await stripe.prices.search({
//             query: `product:\'${product.id}\'`,
//         });
//         for (let i in price.data) {
//             product.prices[i] = {};
//             product.prices[i].id = price.data[i].id;
//             product.prices[i].price = price.data[i].unit_amount / 100;
//             if (price.data[i].type == 'recurring')
//                 product.prices[i].interval = price.data[i].recurring.interval;
//             if (price.data[i].type == 'one_time')
//                 product.prices[i].interval = price.data[i].type;
//         }
//         return product;
//
//     } catch (e) {
//         console.log("error " + e.message);
//     }
//
// }
