require('dotenv').config({ path: '.env' });
require('./mongoConnection');
const path = require('path');

const express = require('express');
const serverLogger = require('./logger');
const cors = require('cors');
const startCronJob = require('./cronJob/cronJob');

// Routers
const fileLoaderRouter = require('./routers/fileLoaderRouter');
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');
const listenQueue = require('./RMQ/reciverQueueMessage');

const logger = serverLogger.log;
const app = express();

app.set('view engine', 'ejs');
app.use(cors({ origin: true })); // enable origin cors
// app.use(express.json()); NEEDED TO REMOVE IT FOR THE WEBHOOK TO SUCCEESS
app.use(express.urlencoded({
  extended: true
}));

// Router uses - CHECK IF IT IS A PROPER WAY TO USE IT
app.use('/plan-management', express.json(), plansRouter);
app.use('/subscription', express.json(), subscriptionRouter);
app.use('/webhook', express.raw({ type: 'application/json' }), webhooksRouter);
app.use('/statistics', express.json(), statisticRouter);

// load files
app.use('/users', fileLoaderRouter);
app.use('/users/css', express.static(path.join(__dirname, '/css')));
app.use('/users/js', express.static(path.join(__dirname, '/js')));
app.use('/users/favicon.ico', express.static('./favicon.ico'));

// create server
app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server is listening on port ${process.env.PORT}`);
});

const startCron = () => {
  startCronJob();
  logger.info('cron job has been set');
};
listenQueue();
startCron();
