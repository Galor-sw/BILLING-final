const { Router } = require('express');
const contatController = require('../controllers/contactController');
const contactRouter = Router();

contactRouter.post('/', contatController.saveContactUsReq);

module.exports = contactRouter;
