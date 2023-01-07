const { Router } = require('express');
const statisticController = require('../controllers/statisticController');

const statisticRouter = Router();
statisticRouter.get('/ARR/:year', statisticController.getARR);
statisticRouter.get('/MRR/:year/:month', statisticController.getMRR);
statisticRouter.get('/DRR/:year/:month/:day', statisticController.getDRR);

module.exports = statisticRouter;
