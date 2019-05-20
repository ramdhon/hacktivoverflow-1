const express = require('express');
const router = express.Router();

const QuestionController = require('../../controllers/question');
const AnswerController = require('../../controllers/answer');
const Authenticate = require('../../middlewares/authenticate');

router.use(Authenticate);

router.get('/questions', QuestionController.findAllAuth);
router.get('/answers', AnswerController.findAllAuth);


module.exports = router;