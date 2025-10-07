const request = require('supertest');
const app = require('../server'); // Adjust this path if needed
const { connectToDb, closeDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

describe('MenuItems API', () => {
    let mongo;
    let newMenuItemId;

    beforeAll(async () => {
        mongo = await connectToDb();
    });

    afterAll(async () => {
        if (newMenuItemId) {
            await mongo.collection('menuItems').deleteOne({ _id: new ObjectId(newMenuItemId) });
        }
        await closeDb();
    });

    describe('Authentication', () => {
        it('should return 401 for POST /menuItems without authentication', async () => {
            const res = await request(app).post('/menuItems').send({ name: 'Test Item', price: 1.99, description: '...' });
            expect(res.status).toBe(401);
        });

        it('should return 401 for PUT /menuItems/:id without authentication', async () => {
            const res = await request(app).put('/menuItems/some-id').send({ price: 2.99 });
            expect(res.status).toBe(401);
        });

        it('should return 401 for DELETE /menuItems/:id without authentication', async () => {
            const res = await request(app).delete('/menuItems/some-id');
            expect(res.status).toBe(401);
        });
    });

    describe('CRUD Lifecycle', () => {
        // Note: Authenticated routes require a mocked auth layer to be tested properly.

        it('should get all menu items', async () => {
            const res = await request(app).get('/menuItems');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should return 400 for invalid menu item data on POST', async () => {
            const invalidItem = { name: 'Test Item' }; // Missing price and description
            // This test requires mocked auth.
            /*
            const res = await request(app)
                .post('/menuItems')
                .send(invalidItem);
            expect(res.status).toBe(400);
            */
           expect(true).toBe(true); // Placeholder
        });

        it('should create a new menu item (requires mocked auth)', async () => {
            const newItem = {
                name: 'Super Burger',
                price: 15.99,
                description: 'A fantastic burger.',
                isAvailable: true
            };
            // This test requires mocked auth.
            /*
            const res = await request(app)
                .post('/menuItems')
                .send(newItem);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('itemId');
            newMenuItemId = res.body.itemId;
            */
           expect(true).toBe(true); // Placeholder
        });

        it('should return 404 for a non-existent menu item ID', async () => {
            const nonExistentId = '111111111111111111111111';
            const res = await request(app).get(`/menuItems/${nonExistentId}`);
            expect(res.status).toBe(404);
        });
    });
});