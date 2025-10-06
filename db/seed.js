const { connectToDb, closeDb } = require('./connect');

const sampleData = {
    menuItems: [
        {
            name: "Hamburguesa Clásica",
            price: 12.99,
            category: "Platos Principales",
            description: "Hamburguesa de carne con lechuga, tomate y queso",
            isAvailable: true
        },
        {
            name: "Pizza Margherita",
            price: 15.99,
            category: "Platos Principales",
            description: "Pizza con salsa de tomate, mozzarella y albahaca",
            isAvailable: true
        }
    ],
    employees: [
        {
            name: "Juan Pérez",
            position: "Mesero",
            email: "juan@restaurant.com",
            phone: "123-456-7890",
            isActive: true
        },
        {
            name: "María García",
            position: "Chef",
            email: "maria@restaurant.com",
            phone: "123-456-7891",
            isActive: true
        }
    ],
    tables: [
        {
            number: 1,
            capacity: 4,
            status: "available",
            location: "Interior"
        },
        {
            number: 2,
            capacity: 2,
            status: "available",
            location: "Terraza"
        }
    ],
    orders: [
        {
            tableId: null, // Se actualizará después
            items: [],     // Se actualizará después
            status: "pending",
            total: 28.98,
            createdAt: new Date(),
            employeeId: null // Se actualizará después
        }
    ]
};

async function seedDatabase() {
    try {
        const db = await connectToDb();
        
        // Insertar menú
        const menuResult = await db.collection('menuItems').insertMany(sampleData.menuItems);
        console.log('Menú insertado:', menuResult.insertedCount, 'items');

        // Insertar empleados
        const employeesResult = await db.collection('employees').insertMany(sampleData.employees);
        console.log('Empleados insertados:', employeesResult.insertedCount, 'empleados');

        // Insertar mesas
        const tablesResult = await db.collection('tables').insertMany(sampleData.tables);
        console.log('Mesas insertadas:', tablesResult.insertedCount, 'mesas');

        // Actualizar la orden con IDs reales
        sampleData.orders[0].tableId = tablesResult.insertedIds[0];
        sampleData.orders[0].employeeId = employeesResult.insertedIds[0];
        sampleData.orders[0].items = [
            {
                menuItemId: menuResult.insertedIds[0],
                quantity: 1,
                price: sampleData.menuItems[0].price
            },
            {
                menuItemId: menuResult.insertedIds[1],
                quantity: 1,
                price: sampleData.menuItems[1].price
            }
        ];

        // Insertar órdenes
        const ordersResult = await db.collection('orders').insertMany(sampleData.orders);
        console.log('Órdenes insertadas:', ordersResult.insertedCount, 'órdenes');

        console.log('Base de datos poblada exitosamente');
    } catch (error) {
        console.error('Error al poblar la base de datos:', error);
    } finally {
        await closeDb();
    }
}

// Ejecutar el script
seedDatabase();