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
    next(err);
  }
};

// @desc    Seed GitHub projects
// @route   GET /api/projects/seed-github
// @access  Public
exports.seedGithub = async (req, res, next) => {
  try {
    const existingProjects = await Project.find();
    const existingNames = existingProjects.map(p => p.title.toLowerCase());
    const existingGithub = existingProjects.map(p => p.github?.toLowerCase()).filter(Boolean);

    const fetch = (await import('node-fetch')).default || globalThis.fetch;
    const response = await fetch('https://api.github.com/users/saffiullah1314/repos?sort=updated&per_page=100');
    const repos = await response.json();

    let added = 0;
    for (const repo of repos) {
      if (repo.fork) continue; 
      if (!repo.description && (!repo.topics || repo.topics.length === 0)) continue; 
      
      if (existingNames.includes(repo.name.toLowerCase()) || 
          (repo.html_url && existingGithub.includes(repo.html_url.toLowerCase()))) {
        continue;
      }

      let category = 'other';
      if (repo.topics?.includes('machine-learning') || repo.language === 'Python' || repo.language === 'Jupyter Notebook') {
        category = 'machine learning';
      } else if (repo.topics?.includes('react') || repo.topics?.includes('web') || repo.language === 'JavaScript' || repo.language === 'TypeScript' || repo.language === 'HTML') {
        category = 'web app';
      } else if (repo.language === 'C++') {
        category = 'c++';
      }

      const p = new Project({
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
        description: repo.description || 'GitHub Project',
        tags: repo.topics?.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
        category: category,
        github: repo.html_url,
        webapp: repo.homepage || '',
        image: '', 
        visible: true,
        featured: repo.stargazers_count > 0,
      });

      await p.save();
      added++;
    }

    res.status(200).json({ success: true, message: `Seeded ${added} projects.` });
  } catch (err) {
    next(err);
  }
};
