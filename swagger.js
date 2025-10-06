const swaggerAutogen = require('swagger-autogen')();

const doc = {
  swagger: '2.0',
  info: {
    title: 'Restaurant Management System API',
    description: `Complete API for managing a restaurant's operations including menu items, orders, employees, and tables.

    Key Features:
    - Menu Management: Create and manage menu items with prices, categories, and availability
    - Order Processing: Handle customer orders from creation to completion
    - Employee Management: Track staff information, roles, and assignments
    - Table Management: Monitor table status, capacity, and current orders
    
    Authentication Instructions:
    1. To login: Click the Authorize button and use GitHub OAuth
    2. Check authentication status: Use the /auth/status endpoint
    3. To logout: Use the /logout endpoint
    
    Important Notes:
    - POST, PUT, and DELETE operations require authentication
    - All responses are in JSON format
    - Dates should be provided in ISO 8601 format
    - IDs are MongoDB ObjectIds
    
    Error Handling:
    - 200: Success
    - 201: Resource created
    - 400: Invalid input
    - 401: Not authenticated
    - 404: Resource not found
    - 500: Server error`,
    version: '1.0.0',
    contact: {
      name: 'Restaurant API Support',
      url: 'https://github.com/WTHACD/CSE341-P'
    }
  },
  hideModels: true, 
  hideSchemas: true, 
  host: 'cse341-p-wfbq.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    githubAuth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: '/login',
      description: 'GitHub OAuth2 Authentication'
    }
  },

  tags: [
    {
      name: 'Authentication',
      description: 'OAuth endpoints for secure user authentication and session management'
    },
    {
      name: 'Menu Items',
      description: 'Manage the restaurant menu including items, prices, categories, and availability status'
    },
    {
      name: 'Orders',
      description: 'Handle customer orders from creation to delivery, including status updates and assignments'
    },
    {
      name: 'Employees',
      description: 'Manage staff information, roles, schedules, and track order assignments'
    },
    {
      name: 'Tables',
      description: 'Monitor table status, capacity, current orders, and reservations'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/index.js',
    './routes/employees.js',
    './routes/tables.js',
    './routes/menuItems.js',
    './routes/orders.js'
]; 

swaggerAutogen(outputFile, endpointsFiles, doc);
