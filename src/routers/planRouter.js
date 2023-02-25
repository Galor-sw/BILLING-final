const { Router } = require('express');
const planController = require('../controllers/planController');
const planRouter = Router();

planRouter.get('/', planController.getAllPlans);
planRouter.post('/:accountId', planController.purchasePlan);

module.exports = planRouter;
