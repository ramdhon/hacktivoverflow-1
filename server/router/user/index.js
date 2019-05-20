const express = require('express');
const router = express.Router();

const QuestionController = require('../../controllers/question');
const Authenticate = require('../../middlewares/authenticate');

router.use(Authenticate);

router.get('/questions', QuestionController.findAllAuth);


module.exports = router;