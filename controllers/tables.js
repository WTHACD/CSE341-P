const { ObjectId } = require('mongodb');

// Validate required table fields
const validateTable = (table) => {
    if (!table.tableNumber || typeof table.tableNumber !== 'number') {
        return 'Table number is required and must be a number';
    }
    if (!table.capacity || typeof table.capacity !== 'number') {
        return 'Capacity is required and must be a number';
    }
    if (!table.status || !['available', 'occupied', 'reserved'].includes(table.status)) {
        return 'Valid status is required (available, occupied, reserved)';
    }
    if (!table.location) {
        return 'Location is required';
    }
    return null;
};

// GET all tables
const getAll = async (req, res) => {
    try {
        const status = req.query.status;
        const query = status ? { status } : {};
        
        const result = await req.db.collection('tables').find(query);
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET a single table by ID
const getSingle = async (req, res) => {
    try {
        const tableId = new ObjectId(req.params.id);
        const result = await req.db.collection('tables').find({ _id: tableId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists[0]);
            } else {
                res.status(404).json({ message: 'Table not found' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new table
const create = async (req, res) => {
    try {
        const newTable = req.body;
        
        const validationError = validateTable(newTable);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('tables').insertOne(newTable);
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Table created successfully',
                tableId: response.insertedId
            });
        } else {
            res.status(500).json({ message: 'Error creating table.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT to update a table
const update = async (req, res) => {
    try {
        const tableId = new ObjectId(req.params.id);
        const updatedTable = req.body;

        const validationError = validateTable(updatedTable);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('tables').replaceOne(
            { _id: tableId }, 
            updatedTable
        );

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            const tableExists = await req.db.collection('tables').findOne({ _id: tableId });
            if (!tableExists) {
                return res.status(404).json({ message: 'Table not found' });
            }
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE a table
const deleteItem = async (req, res) => {
    try {
        const tableId = new ObjectId(req.params.id);
        const response = await req.db.collection('tables').deleteOne({ _id: tableId });
        
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Table deleted successfully' });
        } else {
            res.status(404).json({ message: 'Table not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET current order for a table
const getCurrentOrder = async (req, res) => {
    try {
        const tableId = new ObjectId(req.params.id);
        const order = await req.db.collection('orders').findOne({ 
            tableId: tableId,
            status: { $in: ['received', 'preparing', 'served'] }
        });

        if (order) {
            const employee = await req.db.collection('employees').findOne(
                { _id: order.employeeId },
                { projection: { firstName: 1, lastName: 1 } }
            );

            const enrichedItems = await Promise.all(order.items.map(async (item) => {
                const menuItem = await req.db.collection('menuItems').findOne(
                    { _id: item.menuItemId },
                    { projection: { name: 1, price: 1 } }
                );
                return {
                    ...item,
                    menuItem: menuItem ? {
                        name: menuItem.name,
                        price: menuItem.price
                    } : null
                };
            }));

            const enrichedOrder = {
                ...order,
                employee: employee ? {
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                } : null,
                items: enrichedItems
            };

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(enrichedOrder);
        } else {
            res.status(404).json({ message: 'No active order found for this table' });
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
    deleteItem,
    getCurrentOrder
};