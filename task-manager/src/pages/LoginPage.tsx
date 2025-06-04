import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from '@mui/material';
import axios from '../api/axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const { email, password } = form;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return;
    }

    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }

    try {
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      const { token, userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', userName);
    
      navigate('/tasks');
    } catch (error: any) {
      toast.error(error.response?.data || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 10, p: 4, borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" gutterBottom>
            TaskWave
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              type="email"
              value={email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              margin="normal"
              type="password"
              value={password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Login
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link href="/register" underline="hover">
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
