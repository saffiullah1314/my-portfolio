import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ImageUpload from './ImageUpload';

const AdminSkills = () => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkillCategories(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch skills');
    } finally { setLoading(false); }
  };

  const handleOpen = (item = null) => {
    setCurrent(item
      ? { ...item, skills: item.skills.map(s => ({ ...s })) }
      : { title: '', skills: [], order: 0 }
    );
    setOpen(true);
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...current.skills];
    updatedSkills[index][field] = value;
    setCurrent({ ...current, skills: updatedSkills });
  };

  const addSkill = () => {
    setCurrent({ ...current, skills: [...current.skills, { name: '', image: '', order: current.skills.length + 1 }] });
  };

  const removeSkill = (index) => {
    const updatedSkills = current.skills.filter((_, i) => i !== index);
    setCurrent({ ...current, skills: updatedSkills });
  };

  const handleChange = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      title: current.title,
      skills: current.skills.filter(s => s.name.trim()), // Filter out empty skills
      order: parseInt(current.order) || 0
    };

    try {
      if (current._id) {
        await api.put(`/skills/${current._id}`, payload);
        toast.success('Skill category updated');
      } else {
        await api.post('/skills', payload);
        toast.success('Skill category added');
      }
      fetchSkills();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Deleted');
      fetchSkills();
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Skills</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Category
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Category', 'Skills Count', 'Order', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {skillCategories.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ color: 'white' }}>{row.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {row.skills.slice(0, 3).map((s, i) => (
                      <Chip key={i} label={s.name} size="small" sx={{ bgcolor: '#854CE620', color: '#854CE6' }} />
                    ))}
                    {row.skills.length > 3 && <Chip label={`+${row.skills.length - 3} more`} size="small" sx={{ bgcolor: '#444', color: 'white' }} />}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{row.order}</TableCell>
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
          + Add New Category
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', width: '100%', maxWidth: 600 } }}>
        <DialogTitle>{current?._id ? 'Edit Skill Category' : 'Add Skill Category'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Category Title (e.g. Frontend)" name="title" value={current?.title || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Display Order" name="order" value={current?.order || 0} onChange={handleChange}
            type="number" fullWidth
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: 'white' }}>Skills</Typography>
              <Button size="small" variant="outlined" onClick={addSkill} sx={{ color: '#854CE6', borderColor: '#854CE6' }}>+ Add Skill</Button>
            </Box>
            
            {current?.skills?.map((skill, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', bgcolor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: 1 }}>
                <TextField
                  label="Skill Name"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                  sx={{ minWidth: '150px' }}
                  InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                  InputProps={{ style: { color: 'white' } }}
                />
                <ImageUpload 
                  label="Skill Icon"
                  name={`skill-image-${index}`}
                  value={skill.image}
                  onChange={(e) => handleSkillChange(index, 'image', e.target.value)}
                />
                <IconButton onClick={() => removeSkill(index)} sx={{ color: '#ef476f', mt: 1 }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            {current?.skills?.length === 0 && (
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', py: 2 }}>No skills added yet.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} sx={{ bgcolor: '#854CE6' }}>
            {saving ? <CircularProgress size={22} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSkills;
