const path = require('path');
const express = require('express');
const cors = require('cors');
const Logger = require('abtest-logger');
// Routers
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');

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
    // this help us render web pages with react I think we won't use it.
    this.app.set('view engine', 'ejs');

    this.app.use(cors({ origin: true }));
    this.app.use(express.urlencoded({
      extended: true
    }));
  }

  setRouters () {
    this.app.use('/accounts', express.json(), plansRouter);
    this.app.use('/subscription', express.json(), subscriptionRouter);
    this.app.use('/webhook', express.raw({ type: '*/*' }), webhooksRouter);
    this.app.use('/statistics', express.json(), statisticRouter);

    // Temporary until we use React
    this.app.use('/css', express.static(path.join(__dirname, '../public/css')));
    this.app.use('/js', express.static(path.join(__dirname, '../public/js')));
  }

  listen () {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => this.logger.info(`Server is listening on port ${process.env.PORT}`));
  }

  async start () {
    await this.listen();
  }
};
