const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require('./dbase/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Use require to load and parse JSON

app.use(express.json());

// CORS Headers Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// --- Robust Swagger UI Setup ---
// This logic removes the host and schemes from the swagger.json at runtime.
// This makes the Swagger UI work correctly on any host (localhost, Render, etc.).
delete swaggerDocument.host;
delete swaggerDocument.schemes;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// --------------------------------

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