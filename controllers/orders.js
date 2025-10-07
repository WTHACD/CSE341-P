const { ObjectId } = require('mongodb');

// Validate required fields for new order
const validateOrderForCreate = async (order, db) => {
    if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
        return 'The "items" array is required and cannot be empty.';
    }

    // Validate tableId exists
    if (!order.tableId) {
        return 'tableId is required.';
    }
    try {
        const table = await db.collection('tables').findOne({ _id: order.tableId });
        if (!table) {
            return 'Invalid tableId - table not found.';
        }
    } catch (err) {
        return 'Invalid tableId format.';
    }

    // Validate employeeId exists
    if (!order.employeeId) {
        return 'employeeId is required.';
    }
    try {
        const employee = await db.collection('employees').findOne({ _id: order.employeeId });
        if (!employee) {
            return 'Invalid employeeId - employee not found.';
        }
    } catch (err) {
        return 'Invalid employeeId format.';
    }

    // Validate each menu item exists
    for (const item of order.items) {
        if (!item.menuItemId || !item.quantity) {
            return 'Each item must have menuItemId and quantity.';
        }
        try {
            const menuItem = await db.collection('menuItems').findOne({ _id: item.menuItemId });
            if (!menuItem) {
                return `Invalid menuItemId - item not found: ${item.menuItemId}`;
            }
        } catch (err) {
            return `Invalid menuItemId format: ${item.menuItemId}`;
        }
    }
   
    if (!order.status || !['received', 'preparing', 'ready', 'served', 'completed', 'cancelled'].includes(order.status)) {
        return 'status must be one of: received, preparing, ready, served, completed, cancelled';
    }

    if (typeof order.total !== 'number' || order.total <= 0) {
        return 'total must be a positive number';
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
        const orders = await req.db.collection('orders').find().toArray();
        
        // Enriquecer las órdenes con información adicional
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            // Obtener información del empleado
            const employee = order.employeeId ? 
                await req.db.collection('employees').findOne(
                    { _id: order.employeeId },
                    { projection: { firstName: 1, lastName: 1, role: 1 } }
                ) : null;

            // Obtener información de la mesa
            const table = order.tableId ?
                await req.db.collection('tables').findOne(
                    { _id: order.tableId },
                    { projection: { tableNumber: 1, location: 1 } }
                ) : null;

            // Obtener información de los items del menú
            const enrichedItems = await Promise.all(order.items.map(async (item) => {
                const menuItem = item.menuItemId ?
                    await req.db.collection('menuItems').findOne(
                        { _id: item.menuItemId },
                        { projection: { name: 1, price: 1 } }
                    ) : null;
                
                return {
                    ...item,
                    menuItem: menuItem ? {
                        name: menuItem.name,
                        price: menuItem.price
                    } : null
                };
            }));

            return {
                ...order,
                employee: employee ? {
                    id: order.employeeId,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    role: employee.role
                } : null,
                table: table ? {
                    id: order.tableId,
                    number: table.tableNumber,
                    location: table.location
                } : null,
                items: enrichedItems
            };
        }));

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(enrichedOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET a single order by ID
const getSingle = async (req, res) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const order = await req.db.collection('orders').findOne({ _id: orderId });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Obtener información del empleado
        const employee = order.employeeId ? 
            await req.db.collection('employees').findOne(
                { _id: order.employeeId },
                { projection: { firstName: 1, lastName: 1, role: 1 } }
            ) : null;

        // Obtener información de la mesa
        const table = order.tableId ?
            await req.db.collection('tables').findOne(
                { _id: order.tableId },
                { projection: { tableNumber: 1, location: 1 } }
            ) : null;

        // Obtener información de los items del menú
        const enrichedItems = await Promise.all(order.items.map(async (item) => {
            const menuItem = item.menuItemId ?
                await req.db.collection('menuItems').findOne(
                    { _id: item.menuItemId },
                    { projection: { name: 1, price: 1 } }
                ) : null;
            
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
                id: order.employeeId,
                firstName: employee.firstName,
                lastName: employee.lastName,
                role: employee.role
            } : null,
            table: table ? {
                id: order.tableId,
                number: table.tableNumber,
                location: table.location
            } : null,
            items: enrichedItems
        };

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(enrichedOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new order
const create = async (req, res) => {
    try {
        const newOrder = {
            ...req.body,
            createdAt: new Date(),
            status: req.body.status || 'received',
            tableId: new ObjectId(req.body.tableId),
            employeeId: new ObjectId(req.body.employeeId),
            items: req.body.items.map(item => ({
                ...item,
                menuItemId: new ObjectId(item.menuItemId)
            }))
        };

        const validationError = await validateOrderForCreate(newOrder, req.db);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Update table status to occupied
        await req.db.collection('tables').updateOne(
            { _id: newOrder.tableId },
            { $set: { status: 'occupied' } }
        );

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

        // Convert IDs from string to ObjectId if they exist in the update body
        if (orderUpdate.tableId) {
            orderUpdate.tableId = new ObjectId(orderUpdate.tableId);
        }
        if (orderUpdate.employeeId) {
            orderUpdate.employeeId = new ObjectId(orderUpdate.employeeId);
        }
        if (orderUpdate.items) {
            orderUpdate.items = orderUpdate.items.map(item => ({
                ...item,
                menuItemId: new ObjectId(item.menuItemId)
            }));
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


// GET available menu items for order creation
const getAvailableItems = async (req, res) => {
    try {
        const availableItems = await req.db.collection('menuItems')
            .find({ isAvailable: true })
            .project({
                name: 1,
                price: 1,
                category: 1,
                description: 1
            })
            .toArray();

        const formattedItems = availableItems.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description
        }));

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(formattedItems);
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
