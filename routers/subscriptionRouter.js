const {Router} = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const subscriptionRouter = Router();

subscriptionRouter.get('/', subscriptionController.getAllPSubscription)

module.exports = subscriptionRouter;

