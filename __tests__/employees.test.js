const request = require('supertest');
const app = require('../server'); // Adjust this path if needed
const { connectToDb, closeDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

describe('Employees API', () => {
    let mongo;
    let testEmployeeId, testTableId, testMenuItemId, testOrderId;

    beforeAll(async () => {
        mongo = await connectToDb();
        // Create prerequisite data for tests
        const employee = await mongo.collection('employees').insertOne({ 
            firstName: 'Test', lastName: 'Employee', role: 'Waiter', email: 'test.emp.orders@test.com', phoneNumber: '123', hireDate: new Date(), isActive: true 
        });
        testEmployeeId = employee.insertedId;

        const table = await mongo.collection('tables').insertOne({ 
            tableNumber: 98, capacity: 2, status: 'available', location: 'test-area-emp' 
        });
        testTableId = table.insertedId;

        const menuItem = await mongo.collection('menuItems').insertOne({ 
            name: 'Test Dish for Employee', price: 9.99, description: 'A dish for employee testing', isAvailable: true 
        });
        testMenuItemId = menuItem.insertedId;

        const order = await mongo.collection('orders').insertOne({
            items: [
                { menuItemId: testMenuItemId, quantity: 1 }
            ],
            tableId: testTableId,
            employeeId: testEmployeeId,
            status: 'received',
            total: 9.99
        });
        testOrderId = order.insertedId;
    });

    afterAll(async () => {
        // Clean up all test data
        if (testOrderId) await mongo.collection('orders').deleteOne({ _id: testOrderId });
        if (testEmployeeId) await mongo.collection('employees').deleteOne({ _id: testEmployeeId });
        if (testTableId) await mongo.collection('tables').deleteOne({ _id: testTableId });
        if (testMenuItemId) await mongo.collection('menuItems').deleteOne({ _id: testMenuItemId });
        
        await closeDb();
    });

    describe('Authentication', () => {
        it('should return 401 for POST /employees without authentication', async () => {
            const res = await request(app)
                .post('/employees')
                .send({
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'Waiter',
                    email: 'test.user@test.com',
                    phoneNumber: '111-222-3333',
                    hireDate: new Date().toISOString()
                });
            expect(res.status).toBe(401);
        });

        it('should return 401 for PUT /employees/:id without authentication', async () => {
            const res = await request(app).put('/employees/some-id').send({ role: 'Manager' });
            expect(res.status).toBe(401);
        });

        it('should return 401 for DELETE /employees/:id without authentication', async () => {
            const res = await request(app).delete('/employees/some-id');
            expect(res.status).toBe(401);
        });
    });

    describe('CRUD Lifecycle', () => {
        let createdEmployeeId;

        it('should get all employees', async () => {
            const res = await request(app).get('/employees');
            expect(res.status).toBe(200);
            expect(res.header['content-type']).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it('should create a new employee', async () => {
            // Establecer autenticación como verdadera
            global.mockAuthenticatedState = true;

            const newEmployee = {
                firstName: 'John',
                lastName: 'Doe',
                role: 'Waiter',
                email: 'john.doe@test.com',
                phoneNumber: '123-456-7890',
                hireDate: new Date().toISOString()
            };

            const res = await request(app)
                .post('/employees')
                .send(newEmployee);
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('employeeId');
            createdEmployeeId = res.body.employeeId;

            // Verificar que el empleado fue creado
            const checkRes = await request(app).get(`/employees/${createdEmployeeId}`);
            expect(checkRes.status).toBe(200);
            expect(checkRes.body.firstName).toBe(newEmployee.firstName);
            expect(checkRes.body.lastName).toBe(newEmployee.lastName);

            // Restablecer autenticación a falso
            global.mockAuthenticatedState = false;
        });

        it('should return 400 for invalid employee data on creation', async () => {
            // Establecer autenticación como verdadera
            global.mockAuthenticatedState = true;

            const invalidEmployee = {
                firstName: 'Invalid',
                // Missing required fields
            };

            const res = await request(app)
                .post('/employees')
                .send(invalidEmployee);
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');

            // Restablecer autenticación a falso
            global.mockAuthenticatedState = false;
        });

        it('should update an existing employee', async () => {
            // Establecer autenticación como verdadera
            global.mockAuthenticatedState = true;

            const updateData = {
                firstName: 'John Updated',
                lastName: 'Doe Updated',
                role: 'Manager',
                email: 'john.updated@test.com',
                phoneNumber: '987-654-3210',
                hireDate: new Date().toISOString(),
                isActive: true
            };

            const res = await request(app)
                .put(`/employees/${createdEmployeeId}`)
                .send(updateData);
            
            expect(res.status).toBe(204);

            // Verificar la actualización
            const checkRes = await request(app).get(`/employees/${createdEmployeeId}`);
            expect(checkRes.status).toBe(200);
            expect(checkRes.body.firstName).toBe(updateData.firstName);
            expect(checkRes.body.role).toBe(updateData.role);

            // Restablecer autenticación a falso
            global.mockAuthenticatedState = false;
        });

        it('should return 400 for invalid employee data on update', async () => {
            // Establecer autenticación como verdadera
            global.mockAuthenticatedState = true;

            const invalidUpdate = {
                role: 'InvalidRole' // Invalid role value
            };

            const res = await request(app)
                .put(`/employees/${createdEmployeeId}`)
                .send(invalidUpdate);
            
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');

            // Restablecer autenticación a falso
            global.mockAuthenticatedState = false;
        });

        it('should delete (deactivate) an employee', async () => {
            // Establecer autenticación como verdadera
            global.mockAuthenticatedState = true;

            const res = await request(app)
                .delete(`/employees/${createdEmployeeId}`);
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Employee deactivated successfully');

            // Verificar que el empleado fue desactivado
            const checkRes = await request(app).get(`/employees/${createdEmployeeId}`);
            expect(checkRes.status).toBe(200);
            expect(checkRes.body.isActive).toBe(false);

            // Restablecer autenticación a falso
            global.mockAuthenticatedState = false;
        });

        it('should return 404 for a non-existent employee ID', async () => {
            const nonExistentId = '111111111111111111111111';
            const res = await request(app).get(`/employees/${nonExistentId}`);
            expect(res.status).toBe(404);
        });
    });

    describe('Employee Specific Routes', () => {
        it('should get all orders for a specific employee', async () => {
            const res = await request(app).get(`/employees/${testEmployeeId}/orders`);
            expect(res.status).toBe(200);
            expect(res.header['content-type']).toMatch(/json/);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('_id');
            expect(res.body[0]._id).toBe(testOrderId.toString());
        });

        it('should return an empty array for an employee with no orders', async () => {
            // Create an employee with no orders
            const noOrderEmployee = await mongo.collection('employees').insertOne({ 
                firstName: 'NoOrder', lastName: 'Person', role: 'Waiter', email: 'no.order@test.com', phoneNumber: '456', hireDate: new Date(), isActive: true 
            });
            const noOrderEmployeeId = noOrderEmployee.insertedId;

            const res = await request(app).get(`/employees/${noOrderEmployeeId}/orders`);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(0);

            // Clean up
            await mongo.collection('employees').deleteOne({ _id: noOrderEmployeeId });
        });

        it('should return 404 for a non-existent employee ID when getting orders', async () => {
            const nonExistentId = '111111111111111111111111';
            const res = await request(app).get(`/employees/${nonExistentId}/orders`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message');
        });
    });
});