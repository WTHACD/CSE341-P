const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

const employeesController = require('../controllers/employees');

// #swagger.tags = ['Employees']
// Get all employees (with optional filters)
router.get('/', /* 
    #swagger.tags = ['Employees']
    #swagger.parameters['status'] = {
        in: 'query',
        description: 'Filter employees by status',
        required: false,
        type: 'string',
        enum: ['active', 'inactive']
    }
    #swagger.parameters['role'] = {
        in: 'query',
        description: 'Filter employees by role',
        required: false,
        type: 'string',
        enum: ['Waiter', 'Cashier', 'Cook', 'Manager']
    }
*/ employeesController.getAll);

// #swagger.tags = ['Employees']
// Get a single employee by ID
router.get('/:id', /* #swagger.tags = ['Employees'] */ employeesController.getSingle);

// #swagger.tags = ['Employees']
// Get orders assigned to an employee
router.get('/:id/orders', /* #swagger.tags = ['Employees'] */ employeesController.getOrders);

// #swagger.tags = ['Employees']
// Create a new employee (requires authentication)
router.post('/', isAuthenticated, /* 
    #swagger.tags = ['Employees']
    #swagger.description = 'Create a new employee with the specified details'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Employee information',
        required: true,
        schema: {
            firstName: 'John',
            lastName: 'Doe',
            role: 'Waiter',
            email: 'john.doe@restaurant.com',
            phoneNumber: '123-456-7890',
            hireDate: '2025-10-06',
            isActive: true
        }
    }
    #swagger.responses[201] = {
        description: 'Employee successfully created',
        schema: {
            message: 'Employee created successfully',
            employeeId: '507f1f77bcf86cd799439011'
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid input',
        schema: {
            message: 'Validation error message'
        }
    }
*/ employeesController.create);

// #swagger.tags = ['Employees']
// Update an employee (requires authentication)
router.put('/:id', isAuthenticated, /* 
    #swagger.tags = ['Employees']
    #swagger.description = 'Update an existing employee\'s information'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the employee to update',
        required: true,
        type: 'string'
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated employee information',
        required: true,
        schema: {
            firstName: 'John',
            lastName: 'Doe',
            role: 'Manager',
            email: 'john.doe@restaurant.com',
            phoneNumber: '123-456-7890',
            hireDate: '2025-10-06',
            isActive: true
        }
    }
    #swagger.responses[204] = {
        description: 'Employee successfully updated'
    }
    #swagger.responses[404] = {
        description: 'Employee not found'
    }
*/ employeesController.update);

// #swagger.tags = ['Employees']
// Delete (deactivate) an employee (requires authentication)
router.delete('/:id', isAuthenticated, /* #swagger.tags = ['Employees'] */ employeesController.deleteItem);

module.exports = router;