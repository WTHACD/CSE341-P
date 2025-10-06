const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Order System API',
    description: `API for managing menu items and customer orders for a restaurant. This API requires authentication for POST, PUT, and DELETE operations.
    
    Authentication Instructions:
    1. To login: Visit Authorize directly in your browser
    2. Check authentication status: Use the /auth/status endpoint
    3. To logout: Use the /logout endpoint
    
    Note: POST, PUT, and DELETE operations require authentication.`,
    version: '1.0.0',
  },
  hideModels: true, 
  hideSchemas: true, 
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
const endpointsFiles = ['./routes/index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);
