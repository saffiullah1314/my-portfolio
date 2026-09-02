const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const Education = require('../models/Education');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.route('/')
  .get(optionalAuth, factory.getAll(Education))
  .post(protect, factory.createOne(Education));

router.route('/:id')
  .get(factory.getOne(Education))
  .put(protect, factory.updateOne(Education))
  .delete(protect, factory.deleteOne(Education));

module.exports = router;
