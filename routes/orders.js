const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', /* #swagger.tags = ['Orders'] */ ordersController.getAll);
router.get('/:id', /* #swagger.tags = ['Orders'] */ ordersController.getSingle);
router.post('/', isAuthenticated, /* #swagger.tags = ['Orders'] */ /* #swagger.parameters['body'] = { in: 'body', schema: { items: ['60c72b2f9b1d8c001f8e4d2a'], tableNumber: 5, status: 'received', notes: 'Extra cheese' } } */ ordersController.create);
router.put('/:id', isAuthenticated, /* #swagger.tags = ['Orders'] */ /* #swagger.parameters['body'] = { in: 'body', schema: { status: 'preparing' } } */ ordersController.update);
router.delete('/:id', isAuthenticated, /* #swagger.tags = ['Orders'] */ ordersController.deleteItem);

module.exports = router;
