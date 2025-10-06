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
router.post('/', /* #swagger.tags = ['Tables'] */ tablesController.create);

// #swagger.tags = ['Tables']
// Update a table
router.put('/:id', /* #swagger.tags = ['Tables'] */ tablesController.update);

// #swagger.tags = ['Tables']
// Delete a table
router.delete('/:id', /* #swagger.tags = ['Tables'] */ tablesController.deleteItem);

module.exports = router;