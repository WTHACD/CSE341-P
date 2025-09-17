const mongodb = require('../dbase/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
    const result = await mongodb.getDb().db().collection('contacts').find();
    result.toArray().then((contacts) => { 
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
    }); 
};


const getSingle = async (req, res) => {
    const contactId = new ObjectId(req.params.id);
    
    const result = await mongodb.getDb().db().collection('contacts').findOne({ _id: contactId });
    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Contact not found' });
    }
};

module.exports = { getAll, getSingle };