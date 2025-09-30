const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');

router.get('/', ordersController.getAll);
router.get('/:id', ordersController.getSingle);
router.post('/', /* #swagger.parameters['body'] = { in: 'body', schema: { items: ['60c72b2f9b1d8c001f8e4d2a'], tableNumber: 5, status: 'received', notes: 'Extra cheese' } } */ ordersController.create);
router.put('/:id', /* #swagger.parameters['body'] = { in: 'body', schema: { status: 'preparing' } } */ ordersController.update);
router.delete('/:id', ordersController.deleteItem);

module.exports = router;
