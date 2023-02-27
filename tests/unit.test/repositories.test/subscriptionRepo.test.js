require('dotenv').config({ path: '.env' });
const subscriptionsRepo = require('../../../src/repositories/subscriptionRepo');
const connectDb = require('../../../src/mongoConnection');
const { beforeAll } = require('@jest/globals');
const listenQueue = require('../../../src/RMQ/reciverQueueMessage');
const { testAccountId, planId, customerID, accountId, sub } = require('../../../src/constants/constant');
describe('unit test on subscription repo', () => {
  beforeAll(async () => {
    try {
      await connectDb();
      await listenQueue();
    } catch (err) {

    }
  });
  describe('getSubscriptionByClientID', () => {
    it('should return an Subscription By Client ID', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByClientID(testAccountId);
      expect(subscriptions).not.toBeNull();
    });
    it('should return an Subscription By Client ID', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByClientID('Alona');
      expect(subscriptions).toBeNull();
    });
  });

  describe('createSubscription', () => {
    it('createSubscription', async () => {
      const subscriptions = await subscriptionsRepo.getAllSubscriptions(sub);
      expect(subscriptions).not.toBeNull();
    });
  });
  describe('get All Subscriptions', () => {
    it('should return an Subscription By plan ID', async () => {
      const subscriptions = await subscriptionsRepo.getAllSubscriptions();
      expect(subscriptions).not.toBeNull();
    });
  });
  describe('getAllSubscriptionsByPlanID', () => {
    it('should return an Subscription By plan ID', async () => {
      const subscriptions = await subscriptionsRepo.getAllSubscriptionsByPlanID(planId);
      expect(subscriptions).not.toBeNull();
    });
  });

  describe('get Subscription By Customer ID', () => {
    it('should return an getSubscriptionByCustomerID', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByCustomerID(customerID);
      expect(subscriptions).not.toBeNull();
    });
    it('should return an Subscription By wrong Customer ID', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByCustomerID('Alona');
      expect(subscriptions).toBeNull();
    });
  });
  describe('editSubscriptionByAccountId', () => {
    it('should editSubscriptionByAccountId should return the Subscription', async () => {
      const subscriptions = await subscriptionsRepo.editSubscriptionByAccountId(accountId, sub);
      expect(subscriptions).not.toBeNull();
    });
    it('should editSubscriptionByAccountId By wrong AccountId', async () => {
      const subscriptions = await subscriptionsRepo.editSubscriptionByAccountId('Alona', null);
      expect(subscriptions).toBeNull();
    });
  });
  describe('get Subscription By AccountId', () => {
    it('should editSubscriptionByAccountId should return bool value', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByClientID(accountId);
      expect(subscriptions).not.toBeNull();
    });
    it('should editSubscriptionByAccountId By wrong AccountId', async () => {
      const subscriptions = await subscriptionsRepo.getSubscriptionByClientID('Alona');
      expect(subscriptions).toBeNull();
    });
  });
});
