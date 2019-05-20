const express = require('express');
const router = express.Router();

const AnswerController = require('../../controllers/answer');
const Authenticate = require('../../middlewares/authenticate');
const AuthorizeAuthUserAnswer = require('../../middlewares/authorizeAuthUserAnswer');

router.get('/', AnswerController.findAll);
router.get('/:id', AnswerController.findOne);

router.use(Authenticate);
router.post('/', AnswerController.create);

router.use('/:id', AuthorizeAuthUserAnswer);
router.put('/:id', AnswerController.updatePut);
router.patch('/:id', AnswerController.updatePatch);
router.delete('/:id', AnswerController.delete);


module.exports = router;