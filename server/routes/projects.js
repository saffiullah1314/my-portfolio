const express = require('express');
const { getProjects, getProject, createProject, updateProject, deleteProject, seedGithub } = require('../controllers/projects');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const optionalAuth = require('../middleware/optionalAuth');
router.route('/seed-github').get(seedGithub);

router.route('/')
  .get(optionalAuth, getProjects)
  .post(protect, upload.single('image'), createProject);

router.route('/:id')
  .get(getProject)
  .put(protect, upload.single('image'), updateProject)
  .delete(protect, deleteProject);

module.exports = router;
