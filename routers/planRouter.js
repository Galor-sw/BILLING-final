const {Router} = require('express');
const planController = require('../controllers/planController');
const planRouter = Router();

planRouter.get('/', planController.getAllPlans);
planRouter.get('/', planController.getPlanByName);
planRouter.post('/', planController.purchasePlan);


module.exports = planRouter;
