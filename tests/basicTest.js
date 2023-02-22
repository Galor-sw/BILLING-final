const chai = require('chai');
const chaiHttp = require('chai-http');
const { initServer } = require('../index');
const assert = require('assert');
chai.should();
chai.use(chaiHttp);

describe('Task API', () => {
  before(async () => {
    await initServer(); // Start the server before tests run
  });

  describe('GET /accounts/:id/plans', () => {
    it('Should give all the plans', (done) => {
      chai.request(process.env.URL)
        .get('/accounts/63af758d7d6c80ed3dabdd6a/plans')
        .end((err, response) => {
          assert.strictEqual(response.status, 200);
          assert.strictEqual(typeof response.body, 'object');
          assert.strictEqual(typeof response.body.plans, 'object');
          assert.strictEqual(response.body.clientPlan.name, 'Pro');
          assert.strictEqual(response.body.clientPlan.type, 'year');
          done();
        });
    });
  });

  describe('POST /accounts/:id/plans', () => {
    it('Should provide url link to stripe', (done) => {
      const price = {
        name: 'Pro',
        interval: 'year',
        quantity: 1
      };
      chai.request(process.env.URL)
        .post('/accounts/63af758d7d6c80ed3dabdd6a/plans')
        .send(price)
        .end((err, response) => {
          // console.log(response.text);
          assert.strictEqual(response.status, 200);
          assert.strictEqual(typeof response.text, 'string');
          assert.ok(response.text.includes('https://checkout.stripe.com'), 'Response text does not include Stripe URL');
          done();
        });
    });
  });

  describe('GET /:id/plans/:plan', () => {
    it('Should get plan by name', (done) => {
      chai.request(process.env.URL)
        .get('/accounts/63af758d7d6c80ed3dabdd6a/plans/Free')

        .end((err, response) => {
          // console.log(typeof response.body.plans);
          assert.strictEqual(response.status, 200);
          assert.strictEqual(typeof response.body, 'object');
          assert.strictEqual(response.body.name, 'Free');
          assert.strictEqual(response.body.seats, 1);
          assert.strictEqual(typeof response.body.features, 'object');
          assert.strictEqual(response.body.features.length, 3);
          done();
        });
    });
  });

  describe('GET /subscription', () => {
    it('Should give all the subscriptions', (done) => {
      chai.request(process.env.URL)
        .get('/subscription')
        .end((err, response) => {
          // console.log(typeof response.body.plans);
          assert.strictEqual(response.status, 200);
          assert.strictEqual(typeof response.body, 'object');
          assert.strictEqual(typeof response.body[0], 'object'); // at least one subscription?
          done();
        });
    });
  });

  describe('POST /subscription', () => {
    it('Should provide url link to stripe', (done) => {
      const subscription = {
        accountId: 'id example' + Math.random(),
        plan: 'freePlan._id',
        start_date: '2023-01-07T17:44:17.000+00:00',
        payment: 'month',
        next_date: '2023-02-07T17:44:17.000+00:00',
        renewal: '2024-01-07T17:44:17.000+00:00',
        status: 'active'
      };
      chai.request(process.env.URL)
        .post('/subscription')
        .send(subscription)
        .end((err, response) => {
          assert.strictEqual(response.status, 200);
          done();
        });
    });
  });
});
