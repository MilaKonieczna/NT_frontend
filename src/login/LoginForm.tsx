import { Button, TextField, Typography } from '@mui/material';
import './LoginForm.css';
import LoginIcon from '@mui/icons-material/Login';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import read from '../read.png';

import { useNavigate } from 'react-router-dom';
import { useApi } from '../ApiProvider';

function LoginForm() {
  const apiClient = useApi();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (values: { username: string; password: string }, formik: any) => {
      apiClient.login(values).then((response) => {
        if (response.success) {
          navigate('/home');
        } else {
          formik.setFieldError('username', 'Invalid username or password');
        }
      });
    },
    [apiClient, navigate]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Required'),
        password: yup
          .string()
          .required('Required')
          .min(5, 'Password too short'),
      }),
    []
  );

  return (
    <div className="auth-container">
      <div className="auth-form">
        <Typography variant="h4" component="h2" align="center">
          Login
        </Typography>
        <Typography variant="body2" align="center">
          Don't have an account? <a href="/signup">Sign Up</a>
        </Typography>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
        >
          {(formik: any) => (
            <form id="signForm" onSubmit={formik.handleSubmit} noValidate>
              <TextField
                id="username"
                label="Username"
                variant="standard"
                name="username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#FEB207',
                    },
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#FEB207',
                  },
                }}
                margin="normal"
              />
              <TextField
                id="password"
                label="Password"
                variant="standard"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
                sx={{
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#FEB207',
                    },
                  },
                  '& .MuiInput-underline:after': {
                    borderBottomColor: '#FEB207',
                  },
                }}
                margin="normal"
              />
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                type="submit"
                form="signForm"
                disabled={!(formik.isValid && formik.dirty)}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Sign in
              </Button>
            </form>
          )}
        </Formik>
      </div>
      <div className="auth-image">
        <img src={read} alt="Graphics" />
      </div>
    </div>
  );
}

export default LoginForm;
