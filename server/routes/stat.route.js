const express = require('express');
const router = express.Router();

const guard = require('../controllers/guard.controller');
router.route('/')
  .get([guard.loginRequired, guard.isAdmin], require('express-status-monitor')());

module.exports = router;