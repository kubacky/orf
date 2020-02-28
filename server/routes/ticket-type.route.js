const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticket-type.controller');
const guard = require('../controllers/guard.controller');


router.route('/')
  .get([guard.loginRequired, guard.isModerator], ticketController.getAll)// Get all tickets
  .post([guard.loginRequired, guard.isAdmin], ticketController.create); // Create new ticket

router.route('/value/:id')
  .put([guard.loginRequired, guard.isAdmin], ticketController.updateValue) // Update ticket

router.route('/type/:type')
  .get(ticketController.getType); // Get single ticket

router.route('/user')
  .get(guard.loginRequired, ticketController.getForUser); // Get single ticket

router.route('/:id')
  .get([guard.loginRequired, guard.isAdmin], ticketController.get) // Get single ticket
  .put([guard.loginRequired, guard.isAdmin], ticketController.update) // Update ticket
  .delete([guard.loginRequired, guard.isAdmin], ticketController.delete) // Delete ticket

module.exports = router;