const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Restaurant Order System API',
    description: 'API for managing menu items and customer orders for a restaurant.',
  },
  host: 'cse341-p-wfbq.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // Point to your main router file

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
