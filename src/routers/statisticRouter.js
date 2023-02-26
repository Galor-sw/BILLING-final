const { Router } = require('express');
const statisticController = require('../controllers/statisticController');
const statisticRouter = Router();

statisticRouter.get('/arr/:year', statisticController.getARR);
statisticRouter.get('/mrr/:year/:month', statisticController.getMRR);
statisticRouter.get('/drr/:year/:month/:day', statisticController.getDRR);
statisticRouter.get('/revenues/:start_date/:end_date', statisticController.getStatisticsByRange);
statisticRouter.get('/popular', statisticController.getPopularPlan);
statisticRouter.get('/payment-intents/:year/:month', statisticController.getSucceededAndFailedPayment);
statisticRouter.get('/payment-intents/range/:start_date/:end_date', statisticController.getSucceededAndFailedPaymentByRange);

module.exports = statisticRouter;
