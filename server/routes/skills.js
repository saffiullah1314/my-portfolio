const express = require('express');
const { protect } = require('../middleware/auth');
const factory = require('../controllers/crudFactory');
const Skill = require('../models/Skill');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

router.route('/')
  .get(optionalAuth, factory.getAll(Skill))
  .post(protect, factory.createOne(Skill));

router.route('/:id')
  .get(factory.getOne(Skill))
  .put(protect, factory.updateOne(Skill))
  .delete(protect, factory.deleteOne(Skill));

module.exports = router;
