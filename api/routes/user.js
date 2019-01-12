const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.post('/login', userController.login);

router.post('/signup', userController.signup);

router.get('/list', userController.userList);

module.exports = router;