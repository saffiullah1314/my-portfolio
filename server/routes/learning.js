const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const Learning = require('../models/Learning');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.route('/')
  .get(optionalAuth, factory.getAll(Learning))
  .post(protect, factory.createOne(Learning));

router.route('/:id')
  .get(factory.getOne(Learning))
  .put(protect, factory.updateOne(Learning))
  .delete(protect, factory.deleteOne(Learning));

module.exports = router;
