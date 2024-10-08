import React, { useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Typography, Grid, Link, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; // Ensure this import is correct
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const navigate = useNavigate();
  const { fullName, email, password, phone, address } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        fullName,
        email,
        password,
        role: 'customer', // Role is automatically set to 'customer'
        phone,
        address,
      });
      alert('User registered successfully');
      navigate('/'); // Redirect to login page after successful registration
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '400px', // Adjust maxWidth for overall form size
        margin: '0 auto',
        padding: 3,
        backgroundColor: 'transparent',
        boxShadow: 'none',
      }}
    >
      <CssBaseline />
      <Avatar sx={{ m: 1, bgcolor: '#007BFF' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Register
      </Typography>
      <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="fullName"
              label="Full Name"
              value={fullName}
              onChange={handleChange}
              sx={{ mb: 2, maxWidth: '100%' }} // Adjust width as needed
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={handleChange}
              sx={{ mb: 2, maxWidth: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={handleChange}
              sx={{ mb: 2, maxWidth: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="phone"
              label="Phone"
              value={phone}
              onChange={handleChange}
              sx={{ mb: 2, maxWidth: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="address"
              label="Address"
              value={address}
              onChange={handleChange}
              sx={{ mb: 2, maxWidth: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {'Already have an account? '}
          <Link color="inherit" href="/">
            Login here
          </Link>
        </Typography>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {'Copyright © '}
          <Link color="inherit" href="https://mui.com/">
            MyHelpDesk
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </div>
    </Box>
  );
};

export default Register;