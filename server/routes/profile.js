const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const Profile = require('../models/Profile');

const router = express.Router();

// Profile usually just has one entry, but we'll use standard CRUD just in case
router.route('/')
  .get(factory.getAll(Profile))
  .post(protect, factory.createOne(Profile));

router.route('/:id')
  .get(factory.getOne(Profile))
  .put(protect, factory.updateOne(Profile))
  .delete(protect, factory.deleteOne(Profile));

module.exports = router;
