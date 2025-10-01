const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Order System API',
    description: `API for managing menu items and customer orders for a restaurant. This API requires authentication for POST, PUT, and DELETE operations.
    
    Authentication Instructions:
    1. To login: Visit /login directly in your browser
    2. Check authentication status: Use the /auth/status endpoint
    3. To logout: Use the /logout endpoint
    
    Note: POST, PUT, and DELETE operations require authentication.`,
    version: '1.0.0',
  },
  host: 'cse341-p-wfbq.onrender.com',
  schemes: ['https'],
  tags: [
    {
      name: "Authentication",
      description: "Endpoints for user authentication"
    },
    {
      name: "Menu Items",
      description: "Endpoints for managing restaurant menu items"
    },
    {
      name: "Orders",
      description: "Endpoints for managing customer orders"
    }
  ],
  securityDefinitions: {
    githubAuth: {
      type: 'oauth2',
      flow: 'implicit',
      authorizationUrl: '/login',
      description: 'GitHub OAuth2 Authentication'
    }
  },
  definitions: {
    MenuItem: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Pizza Margherita' },
        description: { type: 'string', example: 'Classic pizza...' },
        price: { type: 'number', example: 12.50 },
        category: { type: 'string', example: 'Pizzas' },
        stock: { type: 'number', example: 50 },
        supplier: { type: 'string', example: 'Napoli Supplies' },
        entryDate: { type: 'string', example: '2025-09-26' }
      }
    },
    Order: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { type: 'string' }, example: ['60c72b2f9b1d8c001f8e4d2a'] },
        tableNumber: { type: 'number', example: 5 },
        status: { type: 'string', example: 'received' },
        notes: { type: 'string', example: 'Extra cheese' }
      }
    }
  },
  tags: [
    {
      name: 'Authentication',
      description: 'OAuth endpoints for user authentication'
    },
    {
      name: 'Menu Items',
      description: 'Endpoints for managing restaurant menu items'
    },
    {
      name: 'Orders',
      description: 'Endpoints for managing customer orders'
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // Point to your main router file

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
