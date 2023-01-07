const { Router } = require('express');
const statisticController = require('../controllers/statisticController');

const statisticRouter = Router();
statisticRouter.get('/day/', statisticController.getMRRforDay);
statisticRouter.get('/month', statisticController.getMRRforMonth);
statisticRouter.get('/year/', statisticController.getMRRforYear);

module.exports = statisticRouter;
