require('dotenv').config({ path: '.env' });
require('./mongoConnection');
const bodyparser = require('body-parser');
const path = require('path');

const express = require('express');
const serverLogger = require('./logger');
const cors = require('cors');
const startCronJob = require('./cronJob/cronJob');

// Routers
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');
const listenQueue = require('./RMQ/reciverQueueMessage');

const logger = serverLogger.log;
const app = express();

app.set('view engine', 'ejs');
app.use(cors({ origin: true }));
app.use(express.urlencoded({
  extended: true
}));

app.use('/accounts', express.json(), plansRouter);
app.use('/subscription', express.json(), subscriptionRouter);
app.use('/webhook', bodyparser.raw({ type: '*/*' }), webhooksRouter);
app.use('/statistics', express.json(), statisticRouter);

// load files
app.use('/css', express.static(path.join(__dirname, '/css')));
app.use('/js', express.static(path.join(__dirname, '/js')));

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
