const { Router } = require('express');
const planController = require('../controllers/planController');
const planRouter = Router();

planRouter.get('/:id', planController.sendHtmlFile);
planRouter.get('/:id/message', planController.sendMassageFile);

planRouter.get('/:id/plans', planController.getAllPlans);
planRouter.post('/:id/plans', planController.purchasePlan);
planRouter.get('/:id/plans/:plan', planController.getPlanByName);

module.exports = planRouter;
