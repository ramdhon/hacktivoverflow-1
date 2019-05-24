const express = require('express');
const router = express.Router();

const WatchedController = require('../../controllers/watchedTag');
const Authenticate = require('../../middlewares/authenticate');

router.get('/', WatchedController.findAll);

router.use(Authenticate);
router.post('/', WatchedController.createDecoded);


module.exports = router;