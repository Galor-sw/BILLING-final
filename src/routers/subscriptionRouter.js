const { Router } = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllSubscriptions);
subscriptionRouter.get('/:accountId', subscriptionController.getAccountSubDetails);
subscriptionRouter.post('/', subscriptionController.createSubscription);
subscriptionRouter.put('/:accountId', subscriptionController.editSubscription);

module.exports = subscriptionRouter;
