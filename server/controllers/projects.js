const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    let query;
    if (req.user) {
      // If admin, show all
      query = Project.find().sort({ order: 1, createdAt: -1 });
    } else {
      // If public, show only visible
      query = Project.find({ visible: true }).sort({ order: 1, createdAt: -1 });
    }

    const projects = await query;
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res, next) => {
  try {
    // If image is uploaded via multer, it will be in req.file.path
    if (req.file) {
      req.body.image = req.file.path;
    }
    
    // Parse tags if they are sent as string
    if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (req.file) {
      req.body.image = req.file.path;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
        req.body.tags = req.body.tags.split(',').map(tag => tag.trim());
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await project.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
