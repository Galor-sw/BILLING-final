const express = require('express');
const fileLoaderController= require("../controllers/fileLoaderController");
const fileLoaderRouter = express.Router();

fileLoaderRouter.get('/',fileLoaderController.loadLoginFile);



module.exports = fileLoaderRouter;
