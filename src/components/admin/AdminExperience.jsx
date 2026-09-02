import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Switch, CircularProgress 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload';

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/experience');
      setExperiences(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (exp = null) => {
    setCurrentExp(exp || {
      role: '', company: '', date: '', desc: '', skills: '', image: '', visible: true
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentExp(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentExp({
      ...currentExp,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = { ...currentExp };
    if (typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim());
    }

    try {
      if (currentExp._id) {
        await api.put(`/experience/${currentExp._id}`, payload);
        toast.success('Experience updated');
      } else {
        await api.post('/experience', payload);
        toast.success('Experience created');
      }
      fetchExperiences();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save experience');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.delete(`/experience/${id}`);
        toast.success('Experience deleted');
        fetchExperiences();
      } catch (err) {
        toast.error('Failed to delete experience');
      }
    }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Experience</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Experience
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Logo</TableCell>
              <TableCell sx={{ color: 'white' }}>Role</TableCell>
              <TableCell sx={{ color: 'white' }}>Company</TableCell>
              <TableCell sx={{ color: 'white' }}>Date</TableCell>
              <TableCell sx={{ color: 'white' }}>Visible</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {experiences.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <img src={row.image} alt={row.company} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{row.role}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.company}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.date}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.visible ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(row)} sx={{ color: '#854CE6' }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(row._id)} sx={{ color: '#ef476f' }}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6', px: 4, py: 1.5, fontSize: '16px' }}>
          + Add New Experience
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', width: '100%', maxWidth: 600 } }}>
        <DialogTitle>{currentExp?._id ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField 
            label="Job Role" name="role" value={currentExp?.role || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Company" name="company" value={currentExp?.company || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <ImageUpload 
            label="Company Logo" 
            name="image" 
            value={currentExp?.image || ''} 
            onChange={handleChange} 
          />
          <TextField 
            label="Date (e.g. June 2023 - Present)" name="date" value={currentExp?.date || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Description" name="desc" value={currentExp?.desc || ''} onChange={handleChange} 
            fullWidth multiline rows={4} InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Skills (comma separated)" name="skills" 
            value={Array.isArray(currentExp?.skills) ? currentExp.skills.join(', ') : (currentExp?.skills || '')} 
            onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          
          <Box display="flex" alignItems="center">
            <Typography>Visible</Typography>
            <Switch name="visible" checked={currentExp?.visible || false} onChange={handleChange} color="primary" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} sx={{ bgcolor: '#854CE6' }}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminExperience;
