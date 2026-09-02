import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Box, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import styled from 'styled-components';

const LoginContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1C1C27;
`;

const LoginCard = styled(Paper)`
  padding: 40px;
  width: 100%;
  max-width: 400px;
  background-color: #22223b !important;
  color: white !important;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 12px !important;
  box-shadow: 0px 10px 30px -10px rgba(0,0,0,0.5) !important;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    color: white;
    & fieldset {
      border-color: rgba(255, 255, 255, 0.23);
    }
    &:hover fieldset {
      border-color: #854CE6;
    }
    &.Mui-focused fieldset {
      border-color: #854CE6;
    }
  }
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    &.Mui-focused {
      color: #854CE6;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <LoginContainer>
      <LoginCard elevation={3}>
        <Typography variant="h4" component="h1" fontWeight="600" textAlign="center" color="#854CE6" mb={2}>
          Admin Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <StyledTextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <StyledTextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: '#854CE6',
              color: 'white',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '600',
              mt: 2,
              '&:hover': {
                bgcolor: '#6C3CC9',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
