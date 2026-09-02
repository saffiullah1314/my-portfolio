import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Switch, Select, MenuItem, FormControl,
  InputLabel, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const PLATFORMS = ['github', 'linkedin', 'email', 'insta', 'facebook', 'twitter', 'youtube', 'other'];

const AdminSocial = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchLinks(); }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/social-links');
      setLinks(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch social links');
    } finally { setLoading(false); }
  };

  const handleOpen = (item = null) => {
    setCurrent(item || { platform: 'github', url: '', order: 1, visible: true });
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
        await api.put(`/social-links/${current._id}`, current);
        toast.success('Link updated');
      } else {
        await api.post('/social-links', current);
        toast.success('Link added');
      }
      fetchLinks();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this link?')) return;
    try {
      await api.delete(`/social-links/${id}`);
      toast.success('Deleted');
      fetchLinks();
    } catch (err) { toast.error('Failed to delete'); }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h5" color="white">Manage Social Links</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ bgcolor: '#854CE6' }}>
          Add Link
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ bgcolor: '#22223b' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Platform', 'URL', 'Order', 'Visible', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{ color: 'white', textTransform: 'capitalize' }}>{row.platform}</TableCell>
                <TableCell sx={{ color: '#854CE6', fontSize: '12px' }}>
                  <a href={row.url} target="_blank" rel="noreferrer" style={{ color: '#854CE6' }}>{row.url?.substring(0, 40)}...</a>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>{row.order}</TableCell>
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

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: '#22223b', color: 'white', minWidth: 440 } }}>
        <DialogTitle>{current?._id ? 'Edit Social Link' : 'Add Social Link'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Platform</InputLabel>
            <Select
              name="platform" value={current?.platform || 'github'} onChange={handleChange}
              label="Platform"
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }}
            >
              {PLATFORMS.map(p => (
                <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="URL" name="url" value={current?.url || ''} onChange={handleChange}
            fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
            InputProps={{ style: { color: 'white' } }}
          />
          <TextField
            label="Display Order" name="order" value={current?.order || 1} onChange={handleChange}
            type="number" fullWidth
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

export default AdminSocial;
