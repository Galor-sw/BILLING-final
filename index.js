require("dotenv").config({path: '.env'});
require('./mongoConnection');

const express = require('express');
const serverLogger = require(`./logger`);
const cors = require("cors")

//Routers
const fileLoaderRouter = require('./routers/fileLoaderRouter');
const plansRouter = require('./routers/planRouter');

const logger = serverLogger.log;
const app = express();

app.set('view engine', 'ejs')
app.use(cors({origin: true})); // enable origin cors
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


app.use('/plans', plansRouter);

//load files
app.use('/', fileLoaderRouter);
app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/favicon.ico', express.static('./favicon.ico'));


//create server
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Server is listening on port ${process.env.PORT}`)
});

