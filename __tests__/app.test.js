const request = require('supertest');
const { createServer } = require('../utils/server');

const app = createServer();

describe('test app', () => {
    test('endpoint not found', async() => {
        const res = await request(app).get('/wrong-endpoint')
        expect(res.statusCode).toEqual(400)
    })
})