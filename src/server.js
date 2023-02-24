const express = require('express');
const cors = require('cors');
const Logger = require('abtest-logger');

// Routers
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');
const stripeRouter = require('./routers/stripeRouter');

module.exports = class server {
  constructor () {
    this.app = express();
    this.logger = new Logger(process.env.CORE_QUEUE);
    this.setup();
  }

  setup () {
    this.setHeaders();
    this.setRouters();
  }

  setHeaders () {
    this.app.use(cors({ origin: true }));
    this.app.use(express.urlencoded({
      extended: true
    }));
  }

  setRouters () {
    this.app.use('/plans', express.json(), plansRouter);
    this.app.use('/subscriptions', express.json(), subscriptionRouter);
    this.app.use('/statistics', express.json(), statisticRouter);
    this.app.use('/stripe', express.json(), stripeRouter);
    this.app.use('/webhook', express.raw({ type: '*/*' }), webhooksRouter);
  }

  listen () {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => this.logger.info(`Server is listening on port ${process.env.PORT}`));
  }

  async start () {
    await this.listen();
  }
};
