const express = require('express');
const router = express.Router();
const lobbyController = require('../controllers/lobbyController');

/* GET home page. */
router.get('/', lobbyController.setup);



module.exports = router;
