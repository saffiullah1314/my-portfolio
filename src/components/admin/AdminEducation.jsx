import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Switch, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchEducation(); }, []);

  const fetchEducation = async () => {
    try {
      const res = await api.get('/education');
      setEducation(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch education');
    } finally { setLoading(false); }
  };

  const handleOpen = (item = null) => {
    setCurrent(item || { school: '', degree: '', date: '', grade: '', desc: '', visible: true });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrent({ ...current, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (current._id) {
        await api.put(`/education/${current._id}`, current);
        toast.success('Education updated');
      } else {
        await api.post('/education', current);
        toast.success('Education added');
      }
      fetchEducation();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return;
    try {
      await api.delete(`/education/${id}`);
      toast.success('Deleted');
      fetchEducation();
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Education</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Education
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Degree', 'School', 'Date', 'Grade', 'Visible', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {education.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ color: 'white' }}>{row.degree}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.school}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.date}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.grade}</TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', minWidth: 480 } }}>
        <DialogTitle>{current?._id ? 'Edit Education' : 'Add Education'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {[
            { label: 'Institution / School', name: 'school' },
            { label: 'Degree', name: 'degree' },
            { label: 'Date (e.g. Sep 2025 - Present)', name: 'date' },
            { label: 'Grade / GPA', name: 'grade' },
          ].map(({ label, name }) => (
            <TextField
              key={name} label={label} name={name} value={current?.[name] || ''} onChange={handleChange}
              fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
            />
          ))}
          <TextField
            label="Description" name="desc" value={current?.desc || ''} onChange={handleChange}
            fullWidth multiline rows={4}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <Box display="flex" alignItems="center">
            <Typography>Visible</Typography>
            <Switch name="visible" checked={current?.visible || false} onChange={handleChange} color="primary" />
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

export default AdminEducation;
