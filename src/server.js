require('dotenv').config({ path: '.env' });

const path = require('path');
const express = require('express');
const serverLogger = require('./logger');
const cors = require('cors');
const mongoose = require('mongoose');

// Routers
const plansRouter = require('./routers/planRouter');
const webhooksRouter = require('./routers/webhooksRouter');
const subscriptionRouter = require('./routers/subscriptionRouter');
const statisticRouter = require('./routers/statisticRouter');

module.exports = class server {
  constructor () {
    this.app = express();
    this.logger = serverLogger.log;
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

  async connectStorage () {
    const options = {
      useNewUrlParser: true, // For deprecation warnings
      useUnifiedTopology: true // For deprecation warnings
    };

    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(process.env.DB_HOST, options);
      this.logger.info('successfully connected to mongoDB');
    } catch (err) {
      this.logger.error(`connection error: ${err.message}`);
    }
  }

  async start () {
    await this.connectStorage();
    await this.listen();
  }
};
