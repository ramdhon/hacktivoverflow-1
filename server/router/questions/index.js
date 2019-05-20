const express = require('express');
const router = express.Router();

const QuestionController = require('../../controllers/question');
const Authenticate = require('../../middlewares/authenticate');
const AuthorizeAuthUser = require('../../middlewares/authorizeAuthUser');
// const upload = require('../../middlewares/upload');

router.get('/', QuestionController.findAll);
router.get('/:id', QuestionController.findOne);

router.use(Authenticate);
router.post('/', QuestionController.create);
router.put('/:id', AuthorizeAuthUser, QuestionController.updatePut);
router.patch('/:id', AuthorizeAuthUser, QuestionController.updatePatch);
router.delete('/:id', AuthorizeAuthUser, QuestionController.delete);


module.exports = router;