const { ObjectId } = require('mongodb');

// Validate required employee fields
const validateEmployee = (employee) => {
    if (!employee.firstName || typeof employee.firstName !== 'string') {
        return 'First name is required and must be a string';
    }
    if (!employee.lastName || typeof employee.lastName !== 'string') {
        return 'Last name is required and must be a string';
    }
    if (!employee.role || !['Waiter', 'Cashier', 'Cook', 'Manager'].includes(employee.role)) {
        return 'Valid role is required (Waiter, Cashier, Cook, Manager)';
    }
    if (!employee.email || typeof employee.email !== 'string' || !employee.email.includes('@')) {
        return 'Valid email is required';
    }
    if (!employee.phoneNumber || typeof employee.phoneNumber !== 'string') {
        return 'Phone number is required and must be a string';
    }
    if (!employee.hireDate || isNaN(Date.parse(employee.hireDate))) {
        return 'Valid hire date is required';
    }
    if (typeof employee.isActive !== 'boolean' && employee.isActive !== undefined) {
        return 'isActive status must be a boolean';
    }
    return null;
};

// GET all employees with optional filters
const getAll = async (req, res) => {
    try {
        const query = {};
        
        // Filter by active status
        if (req.query.status === 'active') {
            query.isActive = true;
        } else if (req.query.status === 'inactive') {
            query.isActive = false;
        }

        // Filter by role
        if (req.query.role && ['Waiter', 'Cashier', 'Cook', 'Manager'].includes(req.query.role)) {
            query.role = req.query.role;
        }

        const employees = await req.db.collection('employees').find(query).toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET a single employee by ID
const getSingle = async (req, res) => {
    try {
        const employeeId = new ObjectId(req.params.id);
        const result = await req.db.collection('employees').find({ _id: employeeId });
        result.toArray().then((lists) => {
            if (lists.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(lists[0]);
            } else {
                res.status(404).json({ message: 'Employee not found' });
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new employee
const create = async (req, res) => {
    try {
        const newEmployee = {
            ...req.body,
            hireDate: new Date(),
            isActive: true
        };
        
        const validationError = validateEmployee(newEmployee);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('employees').insertOne(newEmployee);
        if (response.acknowledged) {
            res.status(201).json({
                message: 'Employee created successfully',
                employeeId: response.insertedId
            });
        } else {
            res.status(500).json({ message: 'Error creating employee.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT to update an employee
const update = async (req, res) => {
    try {
        const employeeId = new ObjectId(req.params.id);
        const updatedEmployee = req.body;

        const validationError = validateEmployee(updatedEmployee);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const response = await req.db.collection('employees').replaceOne(
            { _id: employeeId }, 
            updatedEmployee
        );

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            const employeeExists = await req.db.collection('employees').findOne({ _id: employeeId });
            if (!employeeExists) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// DELETE an employee (soft delete by setting isActive to false)
const deleteItem = async (req, res) => {
    try {
        const employeeId = new ObjectId(req.params.id);
        const response = await req.db.collection('employees').updateOne(
            { _id: employeeId },
            { $set: { isActive: false } }
        );
        
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Employee deactivated successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET orders by employee
const getOrders = async (req, res) => {
    try {
        const employeeId = new ObjectId(req.params.id);
        const result = await req.db.collection('orders').find({ employeeId: employeeId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists);
        });
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
    getOrders
};