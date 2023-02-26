const plansRepo = require('../../../src/repositories/plansRepo');
const { expect, beforeAll } = require('@jest/globals');
require('dotenv').config({ path: '.env' });
const connectDb = require('../../../src/mongoConnection');

describe('plansRepo', () => {
  beforeAll(async () => {
    try {
      await connectDb();
    } catch (err) {

    }
  });
  describe('getPlans', () => {
    it('should return an array of plans', async () => {
      const plans = await plansRepo.getPlans();
      expect(Array.isArray(plans)).toBe(true);
      expect(plans.length).toBeGreaterThan(0);
    });
  });

  describe('getPlanByName', () => {
    it('should return a plan with the given name', async () => {
      const planName = 'Free';
      const plan = await plansRepo.getPlanByName(planName);
      expect(plan.name).toBe(planName);
    });
    it('should return a plan with the given wrong name', async () => {
      const planName = 'Alona';
      const plan = await plansRepo.getPlanByName(planName);
      expect(plan).toBe(null);
    });
  });

  describe('getPlanByStripeId', () => {
    it('should return a plan with the given Stripe Id', async () => {
      const stripeId = 'prod_N13QXfZjIBscS8';
      const planName = 'Pro';
      const plan = await plansRepo.getPlanByStripeId(stripeId);
      expect(plan.name).toBe(planName);
    });
    it('should return a plan with the given wrong Stripe Id', async () => {
      const stripeId = 'blabla';
      // const planName = 'Pro';
      const plan = await plansRepo.getPlanByStripeId(stripeId);
      expect(plan).toBe(null);
    });
  });
  describe('updateFeaturesByPlanName', () => {
    it('should update a plan by plan name and return a bool is success or failed', async () => {
      const set = ['AB – Test', 'Multiple custom attribute', 'Multiple Goal support', 'Default experiment start time', 'Custom traffic allocation', 'Inclusive Experiments', 'Support limited number of experiments'];
      const planName = 'Pro';
      const result = await plansRepo.getPlanByStripeId(planName, set);
      expect(result).toBe(null);
    });
    it('should return a plan with the given wrong Stripe Id', async () => {
      const planName = 'blabla';
      const result = await plansRepo.getPlanByStripeId(planName, null);
      expect(result).toBe(null);
    });
  });
});
