const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.route('/')
  .post(userController.create); // Create new user

module.exports = router;