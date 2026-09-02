import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1C1C27' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
