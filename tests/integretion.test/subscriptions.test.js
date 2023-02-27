require('dotenv').config({ path: '.env' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
chai.should();
chai.use(chaiHttp);
const { accountId } = require('../../src/constants/constant');
const newAccountId = 'id example' + Math.random();

describe('Task API', () => {
  describe('GET /subscriptions', () => {
    it('Should give all the subscriptions', async () => {
      const response = await chai.request(process.env.URL).get('/subscriptions');
      assert.strictEqual(response.status, 200);
      assert.strictEqual(typeof response.body, 'object');
    });
  });
  describe('POST /subscriptions', () => {
    it('Should provide url link to stripe', async () => {
      const subscription = {
        accountId: newAccountId,
        plan: 'freePlan._id',
        start_date: '2023-01-07T17:44:17.000+00:00',
        payment: 'month',
        next_date: '2023-02-07T17:44:17.000+00:00',
        renewal: '2024-01-07T17:44:17.000+00:00',
        status: 'active'
      };
      const response = await chai.request(process.env.URL)
        .post('/subscriptions')
        .send(subscription);
      assert.strictEqual(response.status, 200);
    });
  });
  describe('PUT /subscriptions/:accountId', () => {
    it('Should edit subscription', async () => {
      const subscription = {
        subId: '63ba199dce98aa887b1f8d4b',
        newSub: {
          payment: 'year',
          status: 'suspended'
        }
      };
      const response = await chai.request(process.env.URL)
        .put('/subscriptions/' + newAccountId)
        .send(subscription);
      assert.strictEqual(response.status, 200);
    });
    it('Error in edit subscription', async () => {
      const subscription = {
        subId: '123123',
        newSub: {
          payment: 'today',
          status: 'blabla'
        }
      };
      const response = await chai.request(process.env.URL)
        .put('/subscriptions/123123')
        .send(subscription);
      // Check if the response body is an empty object
      expect(response.body).toEqual({});
    });
  });
  describe('GET /subscriptions/:accountId', () => {
    it('Should give the subscription by account id', async () => {
      const response = await chai.request(process.env.URL).get('/subscriptions/' + accountId);
      assert.strictEqual(response.status, 200);
      expect(response.text).toMatch(/"planName":"\w+", "type":"\w+"/);
    });
    it('Should give the subscription by wrong account id', async () => {
      const response = await chai.request(process.env.URL).get('/subscriptions/1212');
      assert.strictEqual(response.status, 400);
    });
  });
});
