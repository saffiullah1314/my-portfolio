const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const Experience = require('../models/Experience');

const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth'); // Need to extract this

router.route('/')
  .get(optionalAuth, factory.getAll(Experience))
  .post(protect, factory.createOne(Experience));

router.route('/:id')
  .get(factory.getOne(Experience))
  .put(protect, factory.updateOne(Experience))
  .delete(protect, factory.deleteOne(Experience));

module.exports = router;
