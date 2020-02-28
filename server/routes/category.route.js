const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const guard = require('../controllers/guard.controller');


router.route('/')
  .get(guard.loginRequired, categoryController.getAll)// Get all categories
  .post([guard.loginRequired, guard.isAdmin], categoryController.create); // Create new category

router.route('/:id')
  .get([guard.loginRequired, guard.isAdmin], categoryController.get) // Get single category
  .put([guard.loginRequired, guard.isAdmin], categoryController.update) // Update category
  .delete([guard.loginRequired, guard.isAdmin], categoryController.delete) // Delete category

module.exports = router;