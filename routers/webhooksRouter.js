const { Router } = require('express');
const webhooksController = require('../controllers/webhooksController');
const webhooksRouter = Router();

// webhooksRouter.post('/', webhooksController.getEvents);
webhooksRouter.post('/', webhooksController.getEvent);
// webhooksRouter.get('/', webhooksController.start);

module.exports = webhooksRouter;
