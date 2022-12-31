const { Router } = require('express');
const webhooksController = require("../controllers/webhooksController");
const webhooksRouter = Router();

webhooksRouter.post('/', webhooksController.getEvents);


module.exports = webhooksRouter;
