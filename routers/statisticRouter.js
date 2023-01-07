const { Router } = require('express');
const statisticController = require('../controllers/statisticController');

const statisticRouter = Router();
statisticRouter.get('/DRR', statisticController.getMRRforDay);
statisticRouter.get('/MRR', statisticController.getMRR);
statisticRouter.get('/ARR', statisticController.getARR);

module.exports = statisticRouter;
