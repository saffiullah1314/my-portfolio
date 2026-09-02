const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  roles: {
    type: [String],
    required: [true, 'Please add at least one role']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  resume: {
    type: String
  },
  image: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
