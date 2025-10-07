const { ObjectId } = require('mongodb');

// Validate required menu item fields
const validateMenuItem = (item) => {
    if (!item.name || !item.price || !item.description) {
        return 'Name, price, and description are required fields.';
    }
    if (typeof item.price !== 'number') {
        return 'Price must be a number.';
    }
    return null; 
};

// GET all menu items
const getAll = async (req, res) => {
    try {
        const result = await req.db.collection('menuItems').find();
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET a single menu item by ID
const getSingle = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const result = await req.db.collection('menuItems').find({ _id: itemId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists[0]);
            } else {
                res.status(404).json({ message: 'Menu item not found' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new menu item
const create = async (req, res) => {
    try {
        const newItem = req.body;
        const validationError = validateMenuItem(newItem);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('menuItems').insertOne(newItem);
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Menu item created successfully',
                itemId: response.insertedId
            });
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the menu item.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT to update a menu item by ID
const update = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const updatedItem = req.body;

        const validationError = validateMenuItem(updatedItem);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('menuItems').replaceOne({ _id: itemId }, updatedItem);
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            
            const itemExists = await req.db.collection('menuItems').findOne({ _id: itemId });
            if (!itemExists) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            res.status(204).send(); 
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE a menu item by ID
const deleteItem = async (req, res) => {
    try {
        const itemId = new ObjectId(req.params.id);
        const response = await req.db.collection('menuItems').deleteOne({ _id: itemId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Menu item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET all available menu items
const getAvailableItems = async (req, res) => {
    try {
        const result = await req.db.collection('menuItems')
            .find({ isAvailable: true })
            .toArray();
        
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAll,
    getSingle,
    create,
    update,
    deleteItem,
    getAvailableItems
};
