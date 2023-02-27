const { Router } = require('express');
const stripeController = require('../controllers/stripeController');
const stripeRouter = Router();

stripeRouter.get('/config', stripeController.sendPublishableKey);
stripeRouter.post('/create-payment-intent', stripeController.createPaymentIntent);

module.exports = stripeRouter;
