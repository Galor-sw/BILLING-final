const { Router } = require('express');
const fileLoaderController= require("../controllers/fileLoaderController");
const fileLoaderRouter = Router();

fileLoaderRouter.get('/',fileLoaderController.loadLoginFile);
fileLoaderRouter.get('/message',fileLoaderController.loadMassageFile);



module.exports = fileLoaderRouter;
