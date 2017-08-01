const express = require('express');
const storeController = require('./../controllers/storeController');
const { catchErrors } = require('./../handlers/errorHandlers');

const router = express.Router();

// Do work here
router.get('/', storeController.homePage);
// show all stores on stores page
router.get('/stores', storeController.getStores);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

module.exports = router;
