const { Plan } = require('../models/plan')

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
// const stripe = require('stripe')(stripeSecretKey);

module.exports = {
    getAllPlans: (req, res) => {
        Plan.find({}).then(result => {
            res.send(result);
        })
            .catch(err => loggers.error(err));
    },
    getPlanByName: async (req,res) => {
        Plan.findOne({'name':name}).then(result=>{
            if (result) {
                res.send(result);
            } else {
                res.send("Does not exist, try again");
            }
        }).catch(err => loggers.error(err));
    }
}
    // purchasePlan: async (req, res) => {
    //     try {
    //         const session = await stripe.checkout.sessions.create({
    //             success_url: 'http://localhost:5000/message',
    //             cancel_url: 'http://localhost:5000/message',
    //             line_items: [
    //                 {price: req.body.id, quantity: req.body.quantity},
    //             ],
    //             mode: 'subscription',
    //         })
    //         const urlCheckOut = session.url;
    //         res.send(urlCheckOut);
    //     } catch (e) {
    //         console.log("error " + e.message);
    //     }
    // }
// }
//
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
// }
