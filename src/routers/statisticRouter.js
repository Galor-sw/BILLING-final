const { Router } = require('express');
const statisticController = require('../controllers/statisticController');

const statisticRouter = Router();
statisticRouter.get('/arr/:year', statisticController.getARR);
statisticRouter.get('/mrr/:year/:month', statisticController.getMRR);
statisticRouter.get('/drr/:year/:month/:day', statisticController.getDRR);

module.exports = statisticRouter;
