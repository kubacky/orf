const express = require('express');
const router = express.Router();

const memberController = require('../controllers/member.controller');
const guard = require('../controllers/guard.controller');

router.route('/')
  .get(guard.loginRequired, memberController.getAll)// Get all members
/*
router.route('/parse/ticket')
  .get(memberController.parseTicket);// Get all members

router.route('/parse/list')
  .get(memberController.parseList);// Get all members

router.route('/parse/alias')
  .get(memberController.parseAlias);// Get all members

router.route('/parse/date')
  .get(memberController.parseDate);// Get all members
*/
router.route('/deactivate')
  .put([guard.loginRequired, guard.isAdmin], memberController.deactivateMany);

router.route('/issuing')
  .put(guard.loginRequired, memberController.issuingMany);

router.route('/summary')
  .get([guard.loginRequired, guard.isAdmin], memberController.summary);

router.route('/return')
  .put([guard.loginRequired, guard.isModerator], memberController.returnMany);

router.route('/many')
  .put([guard.loginRequired, guard.isAdmin], memberController.activateMany);

router.route('/find')
  .put(guard.loginRequired, memberController.find);

router.route('/many/delete')
  .put([guard.loginRequired, guard.isAdmin], memberController.deleteMany);

router.route('/:id')
  .get([guard.loginRequired, guard.isAdmin], memberController.get) // Get single member
  .put([guard.loginRequired, guard.isAdmin], memberController.update) // Update member
  .delete([guard.loginRequired, guard.isAdmin], memberController.delete) // Delete member

module.exports = router;
module.exports = router;