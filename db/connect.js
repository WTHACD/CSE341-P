const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
let db;

const connectToDb = (callback) => {
    if (db) {
        console.log('Data base is already initialized!');
        return callback(null, db);
    }
    MongoClient.connect(uri)
        .then((client) => {
            db = client.db();
            console.log('Connected to MongoDB');
            callback(null, db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!db) {
        throw new Error('Data base not initialized');
    }
    return db;
};

module.exports = {
    connectToDb,
    getDb,
};
