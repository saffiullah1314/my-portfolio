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
      ? { ...item, skillsText: item.skills.map(s => `${s.name}|${s.image}`).join('\n') }
      : { title: '', skillsText: '', order: 0 }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const skillsList = current.skillsText
      .split('\n')
      .filter(line => line.includes('|'))
      .map((line, i) => {
        const [name, image] = line.split('|');
        return { name: name.trim(), image: image.trim(), order: i + 1 };
      });

    const payload = {
      title: current.title,
      skills: skillsList,
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

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', minWidth: 520 } }}>
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
          <TextField
            label="Skills (one per line: Name|ImageURL)"
            name="skillsText" value={current?.skillsText || ''} onChange={handleChange}
            fullWidth multiline rows={10}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white', fontFamily: 'monospace', fontSize: '12px' } }}
            helperText="Format: SkillName|https://image-url.png  — one per line"
            FormHelperTextProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
          />
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
