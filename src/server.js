const express = require('express');
const cors = require('cors');
const Logger = require('abtest-logger');

// Routers
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');
const stripeRouter = require('./routers/stripeRouter');
const contactRouter = require('./routers/contactRouter');

module.exports = class server {
  constructor () {
    this.app = express();
    this.logger = new Logger(process.env.CORE_QUEUE);
    this.setup();
    this.handleErrors();
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
    this.app.use('/contact', express.json(), contactRouter);
    this.app.use('/webhook', express.raw({ type: '*/*' }), webhooksRouter);
  }

  handleErrors () {
    // Handle invalid routes
    this.app.use((req, res, next) => {
      const error = new Error('Bad Request');
      error.status = 404;
      next(error);
    });

    // Handle errors
    this.app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.send(`${err.status} : ${err.message}`);
    });
  }

  listen () {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => this.logger.info(`Server is listening on port ${process.env.PORT}`));
  }

  async start () {
    await this.listen();
  }
};
