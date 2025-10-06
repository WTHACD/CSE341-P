const express = require('express');
const router = express.Router();
const tablesController = require('../controllers/tables');

// #swagger.tags = ['Tables']
// Get all tables or filter by status
router.get('/', /* 
    #swagger.tags = ['Tables']
    #swagger.parameters['status'] = {
        in: 'query',
        description: 'Filter tables by status',
        required: false,
        type: 'string',
        enum: ['available', 'occupied', 'reserved']
    }
*/ tablesController.getAll);

// #swagger.tags = ['Tables']
// Get a single table by ID
router.get('/:id', /* #swagger.tags = ['Tables'] */ tablesController.getSingle);

// #swagger.tags = ['Tables']
// Get current order for a table
router.get('/:id/order', /* #swagger.tags = ['Tables'] */ tablesController.getCurrentOrder);

// #swagger.tags = ['Tables']
// Create a new table
router.post('/', /* 
    #swagger.tags = ['Tables']
    #swagger.description = 'Create a new table with the specified details'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Table information',
        required: true,
        schema: {
            tableNumber: 1,
            capacity: 4,
            status: 'available',
            location: 'Interior'
        }
    }
    #swagger.responses[201] = {
        description: 'Table successfully created',
        schema: {
            message: 'Table created successfully',
            tableId: '507f1f77bcf86cd799439011'
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid input',
        schema: {
            message: 'Validation error message'
        }
    }
*/ tablesController.create);

// #swagger.tags = ['Tables']
// Update a table
router.put('/:id', /* 
    #swagger.tags = ['Tables']
    #swagger.description = 'Update an existing table\'s information'
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the table to update',
        required: true,
        type: 'string'
    }
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Updated table information',
        required: true,
        schema: {
            tableNumber: 1,
            capacity: 6,
            status: 'available',
            location: 'Terraza'
        }
    }
    #swagger.responses[204] = {
        description: 'Table successfully updated'
    }
    #swagger.responses[404] = {
        description: 'Table not found'
    }
*/ tablesController.update);

// #swagger.tags = ['Tables']
// Delete a table
router.delete('/:id', /* #swagger.tags = ['Tables'] */ tablesController.deleteItem);

module.exports = router;