const { Router } = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllSubscription);
subscriptionRouter.post('/new', subscriptionController.createSubscription);
subscriptionRouter.put('/status', subscriptionController.changeSubscriptionStatus);
subscriptionRouter.put('/', subscriptionController.editSubscription);
subscriptionRouter.get('/getSubscriptionByID/:id', subscriptionController.getSubscriptionByID);
subscriptionRouter.get('/getAllSubscriptionsByPlanName/:planName', subscriptionController.getAllSubscriptionsByPlanName);

module.exports = subscriptionRouter;
