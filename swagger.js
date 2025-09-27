const swaggerAutogen = require('swagger-autogen')();

const isProduction = process.env.NODE_ENV === 'production';

const doc = {
  info: {
    title: 'My Contacts API',
    description: 'Contacts API for CSE341'
  },
  host: isProduction ? 'cse341-p.onrender.com' : 'localhost:3000',
  schemes: [isProduction ? 'https' : 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
