const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// @desc    Upload an image to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin only)
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload an image file' });
  }
  
  // multer-storage-cloudinary attaches the secure URL to req.file.path
  res.status(200).json({
    success: true,
    data: req.file.path
  });
});

module.exports = router;
