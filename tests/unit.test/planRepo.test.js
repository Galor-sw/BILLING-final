const plansRepo = require('../../src/repositories/plansRepo');
const {Plan} = require('../../src/models/plan');

jest.mock('../../src/models/plan');

describe('plansRepo', () => {
    describe('getPlans', () => {
        it('should return an array of plans', async () => {
            Plan.find.mockResolvedValueOnce([{name: 'Free'}, {name: 'Premium'}]);
            const plans = await plansRepo.getPlans();
            expect(Array.isArray(plans)).toBe(true);
            expect(plans.length).toBeGreaterThan(0);
        });
    });

    describe('getPlanByName', () => {
        it('should return a plan with the given name', async () => {
            const planName = 'Free';
            Plan.findOne.mockResolvedValueOnce({name: planName});
            const plan = await plansRepo.getPlanByName(planName);
            expect(plan.name).toBe(planName);
        });
    });
});