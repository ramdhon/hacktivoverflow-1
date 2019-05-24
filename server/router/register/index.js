const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/user');
const WatchedController = require('../../controllers/watchedTag');


router.post('/', UserController.register, WatchedController.createRegister);


module.exports = router;