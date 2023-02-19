const { Router } = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllSubscriptions);
subscriptionRouter.post('/', subscriptionController.createSubscription);
subscriptionRouter.put('/:accountId', subscriptionController.editSubscription);
subscriptionRouter.get('/:planName', subscriptionController.getAllSubscriptionsByPlanName);

module.exports = subscriptionRouter;
