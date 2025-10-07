const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let client;
let db;

const connectToDb = async () => {
    if (db) {
        console.log('Database is already initialized!');
        return db;
    }
    try {
        // Agregamos opciones de conexión para mejor rendimiento
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        
        client = await MongoClient.connect(uri, options);
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('Could not connect to MongoDB:', err);
        throw err;
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    return db;
};

const closeDb = async () => {
    if (client) {
        await client.close();
        db = null;
        client = null;
    }
};

module.exports = {
    connectToDb,
    getDb,
    closeDb
};
