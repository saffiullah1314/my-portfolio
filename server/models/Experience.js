const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Please add a job role']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  date: {
    type: String,
    required: [true, 'Please add a date range']
  },
  desc: {
    type: String,
    required: [true, 'Please add a description']
  },
  skills: {
    type: [String]
  },
  image: {
    type: String
  },
  doc: {
    type: String // URL to a document/certificate
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

module.exports = mongoose.model('Experience', ExperienceSchema);
