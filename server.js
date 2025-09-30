const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDb, getDb } = require('./db/connect');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to attach db object to every request
app.use((req, res, next) => {
    try {
        req.db = getDb();
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/', require('./routes'));


connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } else {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
});


