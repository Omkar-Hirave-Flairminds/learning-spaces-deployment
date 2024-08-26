const request = require('supertest');
const { createServer } = require('../utils/server');

const app = createServer();

describe('technology', () => {
    describe('get technologies', () => {
        describe('for an admin', () => {
            it('should return list of technologies', async() => {
                // expect(true).toBe(true)
                await request(app).get('/user/')
            })
        })
    })
})