const express = require('express');
const router = express.Router();

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
router.post('/', /* #swagger.tags = ['Employees'] */ employeesController.create);

// #swagger.tags = ['Employees']
// Update an employee (requires authentication)
router.put('/:id', /* #swagger.tags = ['Employees'] */ employeesController.update);

// #swagger.tags = ['Employees']
// Delete (deactivate) an employee (requires authentication)
router.delete('/:id', /* #swagger.tags = ['Employees'] */ employeesController.deleteItem);

module.exports = router;