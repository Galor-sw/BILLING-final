const { Router } = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllPSubscription);
subscriptionRouter.post('/new', subscriptionController.createSubscription);
subscriptionRouter.get('/getSubscriptionByID/:id', subscriptionController.getSubscriptionByID);
subscriptionRouter.get('/getAllSubscriptionsByPlanName/:planName', subscriptionController.getAllSubscriptionsByPlanName);

module.exports = subscriptionRouter;
