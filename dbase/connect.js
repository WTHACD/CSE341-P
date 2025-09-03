const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

const initDb = (callback) => {
  if (db) {
    console.log('Data base is already initialized!');
    return callback(null, db);
  }
  MongoClient.connect(process.env.MONGO_URI)
    .then((client) => {
      console.log('Successfully connected to MongoDB Atlas!'); // Added for debugging
      db = client.db('cse341');
      callback(null, db);
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB Atlas:', err); // Added for debugging
      callback(err);
    });
};

const getDb = () => {
  if (!db) {
    throw new Error('Data base is not initialized');
  }
  return db;
};

module.exports = {
  initDb,
  getDb,
};
