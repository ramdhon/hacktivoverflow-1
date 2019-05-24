const express = require('express');
const router = express.Router();

const QuestionController = require('../../controllers/question');
const AnswerController = require('../../controllers/answer');
const WatchedController = require('../../controllers/watchedTag');
const Authenticate = require('../../middlewares/authenticate');
const decodeToken = require('../../middlewares/decodeToken');

router.use(Authenticate);

router.get('/decode', decodeToken);
router.get('/questions', QuestionController.findAllAuth);
router.get('/answers', AnswerController.findAllAuth);

router.get('/watched', WatchedController.findAuth);

router.patch('/watched', WatchedController.findOneAuth, WatchedController.updatePatch);

module.exports = router;