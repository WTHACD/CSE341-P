const express = require('express');
const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
    res.send('Welcome to the CSE341-P API');
});

// Contacts routes
router.use('/contacts', require('./contacts'));

module.exports = router;
