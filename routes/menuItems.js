const express = require('express');
const router = express.Router();
const menuItemsController = require('../controllers/menuItems');
const { isAuthenticated } = require('../middleware/auth');

// GET all menu items
router.get('/', /* #swagger.tags = ['Menu Items'] */ menuItemsController.getAll);

// GET a single menu item by ID
router.get('/:id', /* #swagger.tags = ['Menu Items'] */ menuItemsController.getSingle);

// POST a new menu item
router.post('/', isAuthenticated, /* #swagger.tags = ['Menu Items'] */ /* #swagger.parameters['body'] = { in: 'body', schema: { name: 'Pizza Margherita', description: 'Classic pizza...', price: 12.50, category: 'Pizzas', stock: 50, supplier: 'Napoli Supplies', entryDate: '2025-09-26' } } */ menuItemsController.create);

// PUT to update a menu item by ID
router.put('/:id', isAuthenticated, /* #swagger.tags = ['Menu Items'] */ /* #swagger.parameters['body'] = { in: 'body', schema: { name: 'Pizza Margherita', description: 'Classic pizza...', price: 12.50, category: 'Pizzas', stock: 50, supplier: 'Napoli Supplies', entryDate: '2025-09-26' } } */ menuItemsController.update);

// DELETE a menu item by ID
router.delete('/:id', isAuthenticated, /* #swagger.tags = ['Menu Items'] */ menuItemsController.deleteItem);

module.exports = router;
