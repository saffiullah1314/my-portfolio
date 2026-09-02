import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Switch, Select, MenuItem, FormControl,
  InputLabel, Chip, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const TYPES = ['Self-Learning', 'Course', 'Certification', 'Workshop', 'Training'];

const AdminLearning = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/learning');
      setItems(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch learning items');
    } finally { setLoading(false); }
  };

  const handleOpen = (item = null) => {
    setCurrent(item
      ? { ...item, topicsText: Array.isArray(item.topics) ? item.topics.join(', ') : '' }
      : { title: '', provider: '', type: 'Self-Learning', desc: '', date: '', url: '', topicsText: '', visible: true, order: 1 }
    );
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrent({ ...current, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      ...current,
      topics: current.topicsText?.split(',').map(t => t.trim()).filter(t => t) || []
    };
    delete payload.topicsText;
    try {
      if (current._id) {
        await api.put(`/learning/${current._id}`, payload);
        toast.success('Learning item updated');
      } else {
        await api.post('/learning', payload);
        toast.success('Learning item added');
      }
      fetchItems();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this learning item?')) return;
    try {
      await api.delete(`/learning/${id}`);
      toast.success('Deleted');
      fetchItems();
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Learning / Courses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Item
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Title', 'Provider', 'Type', 'Topics', 'Visible', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ color: 'white' }}>{row.title}</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.provider}</TableCell>
                <TableCell>
                  <Chip label={row.type} size="small" sx={{ bgcolor: row.type === 'Self-Learning' ? '#2a9d8f30' : '#854CE620', color: row.type === 'Self-Learning' ? '#2a9d8f' : '#854CE6' }} />
                </TableCell>
                <TableCell sx={{ color: 'white', fontSize: '12px' }}>{row.topics?.length || 0} topics</TableCell>
                <TableCell sx={{ color: 'white' }}>{row.visible ? '✅' : '❌'}</TableCell>
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
        <DialogTitle>{current?._id ? 'Edit Learning Item' : 'Add Learning Item'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Title" name="title" value={current?.title || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Provider (e.g. CampusX YouTube)" name="provider" value={current?.provider || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Type</InputLabel>
            <Select
              name="type" value={current?.type || 'Self-Learning'} onChange={handleChange} label="Type"
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
            >
              {TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField
            label="Date (e.g. 2025 - Present)" name="date" value={current?.date || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Course / Channel URL" name="url" value={current?.url || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Description" name="desc" value={current?.desc || ''} onChange={handleChange}
            fullWidth multiline rows={3}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Topics (comma separated)" name="topicsText" value={current?.topicsText || ''} onChange={handleChange}
            fullWidth multiline rows={4}
            InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white', fontSize: '13px' } }}
            helperText="e.g. ANN, MLP, CNN, LSTM, Transformers"
            FormHelperTextProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
          />
          <Box display="flex" alignItems="center">
            <Typography>Visible on Portfolio</Typography>
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

export default AdminLearning;
