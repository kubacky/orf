const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const guard = require('../controllers/guard.controller');


router.route('/')
  .get([guard.loginRequired, guard.isAdmin], userController.getAll)// Get all users
  .post(guard.loginRequired, userController.create); // Create new user


router.route('/many/:token')
  .put([guard.loginRequired, guard.isAdmin], userController.activateMany)
  .delete([guard.loginRequired, guard.isAdmin], userController.deleteMany)

router.route('/current')
  .get(guard.loginRequired, userController.getCurrent)
  .put(guard.loginRequired, userController.updateCurrent)

router.route('/:id')
  .get([guard.loginRequired, guard.isAdmin], userController.get) // Get single user
  .put(guard.loginRequired, userController.update) // Update user
  .delete(guard.loginRequired, userController.delete) // Delete user


module.exports = router;