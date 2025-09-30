const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Order System API',
    description: 'API for managing menu items and customer orders for a restaurant.',
  },
  host: 'localhost:3000', // Change this to your deployed host
  schemes: ['http'],      // Change this to ['https'_] for production
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // Point to your main router file

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
