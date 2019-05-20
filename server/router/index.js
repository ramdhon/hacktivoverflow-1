const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');
// const google = require('./google');
const user = require('./user');
const questions = require('./questions');
const answers = require('./answers');

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to Hackoverflow API :)' })
})

router.use('/register', register);
router.use('/login', login);
// router.use('/oauth/google', google);

router.use('/user', user);
router.use('/questions', questions);
router.use('/answers', answers);


module.exports = router;