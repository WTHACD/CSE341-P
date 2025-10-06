const request = require('supertest');
const app = require('../server');
const { connectToDb, closeDb } = require('../db/connect');

describe('Basic API Tests', () => {
    beforeAll(async () => {
        await connectToDb();
    });

    afterAll(async () => {
        await closeDb();
    });
    // MenuItems Tests
    describe('GET /menuItems', () => {
        it('should respond with json', async () => {
            const response = await request(app)
                .get('/menuItems')
                .expect('Content-Type', /json/);
            expect(response.status).toBe(200);
        });
    });

    // Orders Tests
    describe('GET /orders', () => {
        it('should respond with json', async () => {
            const response = await request(app)
                .get('/orders')
                .expect('Content-Type', /json/);
            expect(response.status).toBe(200);
        });
    });

    // Tables Tests
    describe('GET /tables', () => {
        it('should respond with json', async () => {
            const response = await request(app)
                .get('/tables')
                .expect('Content-Type', /json/);
            expect(response.status).toBe(200);
        });
    });

    // Employees Tests
    describe('GET /employees', () => {
        it('should respond with json', async () => {
            const response = await request(app)
                .get('/employees')
                .expect('Content-Type', /json/);
            expect(response.status).toBe(200);
        });
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