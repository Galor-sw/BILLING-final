require("dotenv").config({path: 'config/.env'});
//html files handler
const fileLoaderRouter = require('./routers/fileLoaderRouter');

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');

const app = express();
const fs = require('fs');
const stripe = require('stripe')(stripeSecretKey);

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/message', (req, res) => {
    res.sendFile(path.join(__dirname, './loginAndForm/message.html'));
});

app.use(express.urlencoded({
    extended: true
}))

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

const cors = require("cors")
const path = require("path");
app.use(cors({origin: true})); // enable origin cors
app.get('/GetAllProducts', async (req, res) => {
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
});


app.post('/purchase', async (req, res) => {
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
});


//load files
app.use('/', fileLoaderRouter);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/favicon.ico', express.static('./favicon.ico'));

//create server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
});

