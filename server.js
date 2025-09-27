const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require('./dbase/connect');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

app.use(express.json());

// CORS Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// This route serves the swagger.json file with no-cache headers
app.get('/swagger-spec.json', (req, res) => {
  const swaggerFile = fs.readFileSync('./swagger.json', 'utf8');
  const swaggerDocument = JSON.parse(swaggerFile);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json(swaggerDocument);
});

// Set up Swagger UI to fetch the spec from our new no-cache route
const options = {
  swaggerOptions: {
    url: '/swagger-spec.json',
  },
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});