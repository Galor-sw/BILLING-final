const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
chai.should();
chai.use(chaiHttp);
const id ='63af758d7d6c80ed3dabdd6a';

describe('Task API', () => {

    describe('GET /accounts/:id/plans', () => {
        it('Bad request to the server', async () => {
            const response = await chai.request(process.env.URL).get('/accounts/'+id+'/plans');
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.text, '404 : Bad Request');
        });
    });
    describe('GET /plans', () => {
        it('should return an array with length of 3', async () => {
            const response = await chai.request(process.env.URL).get('/plans');
            expect(response.status).toEqual(200);
            const plans = JSON.parse(response.text);
            expect(plans).toBeInstanceOf(Array);
            expect(plans.length).toEqual(3);
            plans.forEach(product => {
                expect(product.prices).toBeTruthy();
                if(product.name != 'Free'){
                    expect(product.prices.month).toBeTruthy();
                    expect(product.prices.year).toBeTruthy();
                }
                expect(product.seats).toBeGreaterThan(0);
                expect(product.features).toBeTruthy();
                expect(product.features.length).toBeGreaterThan(0);
                expect(product.description).toBeTruthy();
            });
        });
    });
});