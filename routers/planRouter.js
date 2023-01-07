const {Router} = require('express');
const planController = require('../controllers/planController');
const planRouter = Router();

planRouter.get('/users/:id/plans', planController.getAllPlans);
planRouter.post('/users/:id/plans', planController.purchasePlan);
planRouter.get('/:name', planController.getPlanByName);


module.exports = planRouter;
