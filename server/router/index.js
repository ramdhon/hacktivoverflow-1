const express = require('express');
const router = express.Router();

const register = require('./register');
const login = require('./login');
// const google = require('./google');
const user = require('./user');
const questions = require('./questions');

router.use('/register', register);
router.use('/login', login);
// router.use('/oauth/google', google);

router.use('/user', user);
router.use('/questions', questions);


module.exports = router;