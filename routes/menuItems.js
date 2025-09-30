const express = require('express');
const router = express.Router();
const menuItemsController = require('../controllers/menuItems');

// GET all menu items
router.get('/', menuItemsController.getAll);

// GET a single menu item by ID
router.get('/:id', menuItemsController.getSingle);

// POST a new menu item
router.post('/', /* #swagger.parameters['body'] = { in: 'body', schema: { name: 'Pizza Margherita', description: 'Classic pizza...', price: 12.50, category: 'Pizzas', stock: 50, supplier: 'Napoli Supplies', entryDate: '2025-09-26' } } */ menuItemsController.create);

// PUT to update a menu item by ID
router.put('/:id', /* #swagger.parameters['body'] = { in: 'body', schema: { name: 'Pizza Margherita', description: 'Classic pizza...', price: 12.50, category: 'Pizzas', stock: 50, supplier: 'Napoli Supplies', entryDate: '2025-09-26' } } */ menuItemsController.update);

// DELETE a menu item by ID
router.delete('/:id', menuItemsController.deleteItem);

module.exports = router;
