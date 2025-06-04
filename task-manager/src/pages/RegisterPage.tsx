import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from '@mui/material';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, email, mobileNumber, password } = form;

    if (!firstName.trim()) return toast.error('First Name is required');
    if (!lastName.trim()) return toast.error('Last Name is required');
    if (!email.trim()) return toast.error('Email is required');
    if (!mobileNumber.trim()) return toast.error('Mobile Number is required');
    if (!password.trim()) return toast.error('Password is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error('Invalid email format');

    try {
      const response = await axios.post('/auth/register', form);
      toast.success('Registration successful! You can now manage your tasks.');
      const { token, userName } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', userName);
      navigate('/tasks'); 
       } catch (error: any) {
      toast.error(error.response?.data || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
        TaskWave
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            margin="normal"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            margin="normal"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobileNumber"
            margin="normal"
            value={form.mobileNumber}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Register
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
