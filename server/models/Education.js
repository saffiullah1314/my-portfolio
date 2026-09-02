const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: [true, 'Please add a school/institution name']
  },
  date: {
    type: String,
    required: [true, 'Please add a date range']
  },
  grade: {
    type: String,
    required: [true, 'Please add a grade/score']
  },
  image: {
    type: String
  },
  desc: {
    type: String,
    required: [true, 'Please add a description']
  },
  degree: {
    type: String,
    required: [true, 'Please add a degree name']
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

module.exports = mongoose.model('Education', EducationSchema);
