const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Get all orders with complete details including employee names, table information, and menu item details'
*/ ordersController.getAll);

router.get('/available-items', /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Get all available menu items that can be ordered'
    #swagger.responses[200] = {
        description: 'List of available menu items',
        schema: [{
            _id: '507f1f77bcf86cd799439011',
            name: 'Pizza Margarita',
            price: 12.99,
            description: 'Classic Italian pizza with tomato and mozzarella'
        }]
    }
*/ ordersController.getAvailableItems);

router.get('/:id', /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Get a single order with complete details including employee names, table information, and menu item details'
    #swagger.parameters['id'] = {
        description: 'Order ID',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Order found successfully'
    }
    #swagger.responses[404] = {
        description: 'Order not found'
    }
*/ ordersController.getSingle);

router.post('/', isAuthenticated, /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Create a new order with menu items, table, and employee information'
    #swagger.parameters['obj'] = {
        in: 'body',
        description: 'Order information',
        required: true,
        schema: {
            $items: [
                {
                    menuItemId: '507f1f77bcf86cd799439011',
                    quantity: 2,
                    notes: 'Sin cebolla'
                }
            ],
            tableId: '507f1f77bcf86cd799439012',
            employeeId: '507f1f77bcf86cd799439013',
            status: 'received',
            specialInstructions: 'Cliente alérgico al maní',
            total: 25.98
        }
    }
    #swagger.responses[201] = {
        description: 'Order successfully created',
        schema: {
            message: 'Order created successfully',
            orderId: '507f1f77bcf86cd799439011'
        }
    }
    #swagger.responses[400] = {
        description: 'Invalid input'
    }
*/ ordersController.create);

router.put('/:id', isAuthenticated, /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Update an order status'
    #swagger.parameters['id'] = {
        description: 'Order ID',
        required: true,
        type: 'string'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Order status update',
        required: true,
        schema: {
            status: 'preparing'
        }
    }
    #swagger.responses[204] = {
        description: 'Order updated successfully'
    }
    #swagger.responses[404] = {
        description: 'Order not found'
    }
*/ ordersController.update);

router.delete('/:id', isAuthenticated, /* 
    #swagger.tags = ['Orders']
    #swagger.description = 'Delete an order'
    #swagger.parameters['id'] = {
        description: 'Order ID',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
        description: 'Order deleted successfully'
    }
    #swagger.responses[404] = {
        description: 'Order not found'
    }
*/ ordersController.deleteItem);

module.exports = router;
