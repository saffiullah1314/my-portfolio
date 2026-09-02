const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp', 'svg']
  }
});

const parser = multer({ storage: storage });

module.exports = parser;
