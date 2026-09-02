const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  platform: {
    type: String, // e.g., github, linkedin, email, insta, facebook
    required: [true, 'Please add a platform name']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL']
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

module.exports = mongoose.model('SocialLink', SocialLinkSchema);
