const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');


router.route('/')
  .post(authController.authenticate)

module.exports = router;