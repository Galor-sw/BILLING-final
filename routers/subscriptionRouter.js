const {Router} = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllPSubscription)
subscriptionRouter.get('/getAllSubscriptionByName/:name', subscriptionController.getAllSubscriptionByName)

module.exports = subscriptionRouter;

