const request = require('supertest');
const app = require('../server');
const { connectToDb, closeDb } = require('../db/connect');

describe('Auth API Test', () => {
    beforeAll(async () => {
        await connectToDb();
    });

    afterAll(async () => {
        await closeDb();
    });

    // Auth Test
    describe('GET /auth/status', () => {
        it('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .get('/auth/status');
            expect(response.status).toBe(401);
        });
    });
});
