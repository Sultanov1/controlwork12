import React, {useState} from 'react';
import {Alert, Box, Button, CircularProgress, Container, Grid, Link, TextField, Typography} from '@mui/material';
import {selectRegisterError, selectRegisterLoading} from './usersSlice';
import {googleLogin, register} from './usersThunk';
import {GoogleLogin} from '@react-oauth/google';
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {RegisterMutation} from "../../types";


const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>({
    email: '',
    password: '',
    displayName: '',
    avatar: null,
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(register(state)).unwrap();
      navigate('/login');
      alert('Вы успешно зарегистрировались! Войдите в аккаунт');
    } catch (e) {
      console.log('e');
    }
  };

  const getFieldError = (name: string) => {
    try {
      return error?.errors[name].message;
    } catch {
      return undefined;
    }
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  return (
    <>
      {!loading ? <Container component="main" maxWidth="xs">
        <Box
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
            Sign up
          </Typography>

          <Box sx={{ pt: 2 }}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void googleLoginHandler(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
              {error.message}
            </Alert>
          )}

          <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%', background: 'white', borderRadius: 2 }}
                  label="Email"
                  name="email"
                  autoComplete="new-username"
                  value={state.email}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('username'))}
                  helperText={getFieldError('username')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%', background: 'white', borderRadius: 2 }}
                  label="Name"
                  name="displayName"
                  autoComplete="new-name"
                  value={state.displayName}
                  onChange={inputChangeHandler}
                  error={!!getFieldError('name')}
                  helperText={getFieldError('name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: '100%', background: 'white', borderRadius: 2, marginBottom: '15px' }}
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  value={state.password}
                  onChange={inputChangeHandler}
                  error={Boolean(getFieldError('password'))}
                  helperText={getFieldError('password')}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, background: 'white', color: 'black' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container> : <CircularProgress sx={{margin: '0 auto'}}/>}
    </>
  );
};

export default Register;

