import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import api from '../../utils/api';

const ImageUpload = ({ label, name, value, onChange, required = false }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    setError(null);

    try {
      // Use the api instance so credentials (cookies) are passed
      const res = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const imageUrl = res.data.data;
      
      // Simulate a standard event object so it works natively with existing onChange handlers
      onChange({ target: { name, value: imageUrl } });
      
    } catch (err) {
      console.error('Image upload failed', err);
      setError('Upload failed. Check Cloudinary settings or file size.');
    } finally {
      setUploading(false);
      // Clear input so same file can be selected again if needed
      e.target.value = null;
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
      <TextField
        fullWidth
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        error={!!error}
        helperText={error || "Paste image URL or upload file"}
        variant="outlined"
      />
      <Button
        component="label"
        variant="contained"
        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
        disabled={uploading}
        sx={{ height: '56px', minWidth: '130px', whiteSpace: 'nowrap' }}
      >
        {uploading ? 'Uploading' : 'Upload'}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileUpload}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload;
