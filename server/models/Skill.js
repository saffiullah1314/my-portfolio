const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a skill category title (e.g., Frontend, Backend)']
  },
  skills: [{
    name: {
      type: String,
      required: [true, 'Please add a skill name']
    },
    image: {
      type: String, // URL from Cloudinary or base64 or external URL
      required: [true, 'Please add a skill image']
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
