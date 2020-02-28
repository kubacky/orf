const express = require('express');
const router = express.Router();

const listController = require('../controllers/list.controller');
const guard = require('../controllers/guard.controller');


//router.route('/parse').get(listController.parse);

router.route('/')
  .get([guard.loginRequired, guard.isModerator], listController.getAll)// Get all lists
  .post(guard.loginRequired, listController.create); // Create new list

router.route('/read/:id')
  .put([guard.loginRequired, guard.isModerator], listController.markAsRead);

router.route('/many/:token')
  .put([guard.loginRequired, guard.isModerator], listController.activateMany)
  .delete([guard.loginRequired, guard.isModerator], listController.deleteMany);

router.route('/user')
  .get(guard.loginRequired, listController.getForUser)
  .put(guard.loginRequired, listController.update) // Update list

router.route('/:id')
  .get([guard.loginRequired, guard.isModerator], listController.get) // Get single list
  .put([guard.loginRequired, guard.isModerator], listController.update) // Update list
  .delete([guard.loginRequired, guard.isModerator], listController.delete) // Delete list

module.exports = router;