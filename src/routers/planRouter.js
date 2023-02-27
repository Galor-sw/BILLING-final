const { Router } = require('express');
const planController = require('../controllers/planController');
const planRouter = Router();

planRouter.get('/', planController.getAllPlans);

module.exports = planRouter;
