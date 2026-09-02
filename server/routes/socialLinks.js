const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const SocialLink = require('../models/SocialLink');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.route('/')
  .get(optionalAuth, factory.getAll(SocialLink))
  .post(protect, factory.createOne(SocialLink));

router.route('/:id')
  .get(factory.getOne(SocialLink))
  .put(protect, factory.updateOne(SocialLink))
  .delete(protect, factory.deleteOne(SocialLink));

module.exports = router;
