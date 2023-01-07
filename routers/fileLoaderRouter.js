const { Router } = require('express');
const fileLoaderController = require('../controllers/fileLoaderController');
const fileLoaderRouter = Router();

fileLoaderRouter.get('/:id/plans', fileLoaderController.loadLoginFile);
fileLoaderRouter.get('/:id/plans/message', fileLoaderController.loadMassageFile);

module.exports = fileLoaderRouter;
