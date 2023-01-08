const { Router } = require('express');
const webhooksController = require('../controllers/webhooksController');
const webhooksRouter = Router();

webhooksRouter.post('/', webhooksController.getEvent);

module.exports = webhooksRouter;
