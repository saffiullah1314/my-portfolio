import axios from 'axios';

// Set up the base URL based on the environment
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true // Important for sending/receiving cookies
});

export default api;
