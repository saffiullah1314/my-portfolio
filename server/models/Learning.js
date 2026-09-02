const mongoose = require('mongoose');

const LearningSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a learning title/topic']
  },
  provider: {
    type: String, // e.g., CampusX, YouTube
    required: [true, 'Please add a provider']
  },
  type: {
    type: String,
    default: 'Self-Learning' // Course, Self-Learning, Certification
  },
  date: {
    type: String
  },
  desc: {
    type: String
  },
  topics: {
    type: [String] // e.g., ANN, MLP, CNN
  },
  url: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Learning', LearningSchema);
