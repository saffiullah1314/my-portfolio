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

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (project = null) => {
    setCurrentProject(project || {
      title: '', description: '', tags: '', category: 'web app',
      github: '', webapp: '', image: '', visible: true, featured: false
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProject(null);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentProject({
      ...currentProject,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    
    // Create JSON payload
    const payload = { ...currentProject };
    if (Array.isArray(payload.tags)) {
      payload.tags = payload.tags.join(', ');
    }

    try {
      if (currentProject._id) {
        await api.put(`/projects/${currentProject._id}`, payload);
        toast.success('Project updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created');
      }
      fetchProjects();
      handleClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Project
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Image</TableCell>
              <TableCell sx={{ color: 'white' }}>Title</TableCell>
              <TableCell sx={{ color: 'white' }}>Category</TableCell>
              <TableCell sx={{ color: 'white' }}>Visible</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <img src={row.image} alt={row.title} style={{ width: 50, height: 50, borderRadius: 4, objectFit: 'cover' }} />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{row.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.category}</TableCell>
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

      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', minWidth: 500 } }}>
        <DialogTitle>{currentProject?._id ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField 
            label="Title" name="title" value={currentProject?.title || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Description" name="description" value={currentProject?.description || ''} onChange={handleChange} 
            fullWidth multiline rows={4} InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Tags (comma separated)" name="tags" 
            value={Array.isArray(currentProject?.tags) ? currentProject.tags.join(', ') : (currentProject?.tags || '')} 
            onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Category" name="category" value={currentProject?.category || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="GitHub URL" name="github" value={currentProject?.github || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <TextField 
            label="Live WebApp URL" name="webapp" value={currentProject?.webapp || ''} onChange={handleChange} 
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }} 
            InputProps={{ style: { color: 'white' } }} 
          />
          <ImageUpload 
            label="Project Image" 
            name="image" 
            value={currentProject?.image || ''} 
            onChange={handleChange} 
          />

          <Box display="flex" alignItems="center">
            <Typography>Visible</Typography>
            <Switch name="visible" checked={currentProject?.visible || false} onChange={handleChange} color="primary" />
            <Typography sx={{ ml: 3 }}>Featured</Typography>
            <Switch name="featured" checked={currentProject?.featured || false} onChange={handleChange} color="primary" />
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

export default AdminProjects;
