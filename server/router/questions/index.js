const express = require('express');
const router = express.Router();

const QuestionController = require('../../controllers/question');
const Authenticate = require('../../middlewares/authenticate');
const AuthorizeAuthUser = require('../../middlewares/authorizeAuthUser');
const tagsHandler = require('../../middlewares/tagsHandler');

router.get('/', QuestionController.findAll);
router.get('/:id', QuestionController.findOne);

router.use(Authenticate);
router.post('/', tagsHandler.generate, QuestionController.create);

router.use('/:id', AuthorizeAuthUser);
router.put('/:id', tagsHandler.generate, QuestionController.updatePut);
router.patch('/:id', tagsHandler.generate, QuestionController.updatePatch);
router.delete('/:id', QuestionController.delete);


module.exports = router;