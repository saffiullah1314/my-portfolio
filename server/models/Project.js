const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a project title']
  },
  date: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  image: {
    type: String,
    required: [true, 'Please add a project image']
  },
  tags: {
    type: [String],
    required: [true, 'Please add at least one tag/technology']
  },
  category: {
    type: String,
    default: 'web app' // e.g. 'web app', 'machine learning'
  },
  github: {
    type: String
  },
  webapp: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
