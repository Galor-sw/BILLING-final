const {Router} = require('express');
const fileLoaderController = require("../controllers/fileLoaderController");
const fileLoaderRouter = Router();

fileLoaderRouter.get('/:email', fileLoaderController.loadLoginFile);
fileLoaderRouter.get('/:email/message', fileLoaderController.loadMassageFile);


module.exports = fileLoaderRouter;
