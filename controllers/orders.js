const { ObjectId } = require('mongodb');

// Validate required fields for new order
const validateOrderForCreate = (order) => {
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        return 'The "items" array is required and cannot be empty.';
    }
    if (!order.tableNumber || typeof order.tableNumber !== 'number') {
        return '"tableNumber" is required and must be a number.';
    }
   
    if (!order.status || typeof order.status !== 'string') {
        return '"status" is required and must be a string (e.g., "received").';
    }
    return null;
};

// Validation for updating an order
const validateOrderForUpdate = (order) => {   
    if (order.status && typeof order.status !== 'string') {
        return '"status" must be a string.';
    }
    
    return null;
};


// GET all orders
const getAll = async (req, res) => {
    try {
        const result = await req.db.collection('orders').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET a single order by ID
const getSingle = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const result = await req.db.collection('orders').find({ _id: orderId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists[0]);
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new order
const create = async (req, res) => {
    try {
        const newOrder = req.body;
        const validationError = validateOrderForCreate(newOrder);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('orders').insertOne(newOrder);
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Order created successfully',
                orderId: response.insertedId
            });
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the order.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT to update an order by ID
const update = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const orderUpdate = req.body;

        const validationError = validateOrderForUpdate(orderUpdate);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const updatedFields = {
            $set: orderUpdate
        };
        const response = await req.db.collection('orders').updateOne({ _id: orderId }, updatedFields);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            const orderExists = await req.db.collection('orders').findOne({ _id: orderId });
            if (!orderExists) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(204).send(); 
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE an order by ID
const deleteItem = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const response = await req.db.collection('orders').deleteOne({ _id: orderId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAll,
    getSingle,
    create,
    update,
    deleteItem
};
