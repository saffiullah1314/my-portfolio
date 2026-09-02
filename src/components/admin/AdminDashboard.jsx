import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import api from '../../utils/api';
import styled from 'styled-components';

const StatCard = styled(Paper)`
  padding: 24px;
  background-color: #22223b !important;
  color: white !important;
  border-radius: 12px !important;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
  border-left: 4px solid #854CE6;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, skillRes, expRes, eduRes] = await Promise.all([
          api.get('/projects'),
          api.get('/skills'),
          api.get('/experience'),
          api.get('/education')
        ]);
        
        setStats({
          projects: projRes.data.count || 0,
          skills: skillRes.data.count || 0,
          experience: expRes.data.count || 0,
          education: eduRes.data.count || 0
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <CircularProgress color="primary" />;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={4} color="white">
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">Total Projects</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.projects}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">Skill Categories</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.skills}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">Experiences</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.experience}</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Typography variant="h6" color="rgba(255,255,255,0.7)">Education</Typography>
            <Typography variant="h3" fontWeight="bold">{stats.education}</Typography>
          </StatCard>
        </Grid>
      </Grid>
      
      <Box mt={6} p={4} sx={{ bgcolor: '#22223b', borderRadius: '12px' }}>
        <Typography variant="h5" mb={2}>Welcome to your CMS</Typography>
        <Typography variant="body1" color="rgba(255,255,255,0.7)">
          Use the sidebar to navigate through different sections of your portfolio. 
          Changes made here will instantly reflect on your live website.
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
