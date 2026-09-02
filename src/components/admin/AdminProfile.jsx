import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Grid, TextField, 
  Switch, CircularProgress, FormControlLabel, Divider
} from '@mui/material';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', resume: '', roles: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data.data && res.data.data.length > 0) {
        const p = res.data.data[0];
        setProfile(p);
        setForm({
          name: p.name || '',
          description: p.description || '',
          resume: p.resume || '',
          roles: Array.isArray(p.roles) ? p.roles.join(', ') : (p.roles || '')
        });
      }
    } catch (err) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      roles: form.roles.split(',').map(r => r.trim()).filter(r => r)
    };
    try {
      if (profile?._id) {
        await api.put(`/profile/${profile._id}`, payload);
      } else {
        await api.post('/profile', payload);
      }
      toast.success('Profile saved!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Typography variant="h5" color="white" mb={4}>Manage Profile</Typography>
      <Paper sx={{ bgcolor: '#22223b', p: 4, borderRadius: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Full Name" name="name" value={form.name} onChange={handleChange}
              fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: '#444' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Roles (comma separated)" name="roles" value={form.roles} onChange={handleChange}
              fullWidth InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: '#444' } }}
              helperText="e.g. Full Stack Developer, ML Engineer"
              FormHelperTextProps={{ style: { color: 'rgba(255,255,255,0.5)' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bio / Description" name="description" value={form.description}
              onChange={handleChange} fullWidth multiline rows={5}
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: '#444' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Resume URL (Google Drive / PDF link)" name="resume" value={form.resume}
              onChange={handleChange} fullWidth
              InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
              InputProps={{ style: { color: 'white' } }}
              sx={{ '& .MuiOutlinedInput-root fieldset': { borderColor: '#444' } }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSave} variant="contained" disabled={saving}
              sx={{ bgcolor: '#854CE6', px: 4, py: 1.5, '&:hover': { bgcolor: '#6C3CC9' } }}
            >
              {saving ? <CircularProgress size={22} color="inherit" /> : 'Save Profile'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminProfile;
