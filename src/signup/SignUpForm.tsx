// src/components/SignupForm.tsx
import { Button, TextField, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import './SignUpForm.css';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../ApiProvider';
import { Formik } from 'formik';
import read from '../read.png';

function SignupForm() {
  const apiClient = useApi();
  const navigate = useNavigate();

  const onSubmit = useCallback(
    (
      values: {
        username: string;
        email: string;
        password: string;
        repeatPassword: string;
      },
      formik: any
    ) => {
      apiClient
        .signup({
          username: values.username,
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          if (response.success) {
            navigate('/login');
          } else {
            formik.setFieldError('username', 'Username already taken');
          }
        });
    },
    [apiClient, navigate]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Required'),
        email: yup.string().email('Invalid email').required('Required'),
        password: yup
          .string()
          .required('Required')
          .min(6, 'Password too short')
          .matches(/[0-9]/, 'Password must contain a number')
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            'Password must contain a special character'
          ),
        repeatPassword: yup
          .string()
          .required('Required')
          .oneOf([yup.ref('password')], 'Passwords must match'),
      }),
    []
  );

  return (
    <div className="auth-container signup">
      <div className="auth-image">
        <img src={read} alt="Graphics" />
      </div>
      <div className="auth-form">
        <Typography variant="h4" component="h2" align="center">
          Create an account
        </Typography>
        <Typography variant="body2" align="center">
          Already have an account? <a href="/login">Log In</a>
        </Typography>
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
          }}
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
                id="email"
                label="Email"
                variant="standard"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
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
              <TextField
                id="repeatPassword"
                label="Repeat Password"
                variant="standard"
                type="password"
                name="repeatPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.repeatPassword &&
                  !!formik.errors.repeatPassword
                }
                helperText={
                  formik.touched.repeatPassword && formik.errors.repeatPassword
                }
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
                type="submit"
                form="signForm"
                disabled={!(formik.isValid && formik.dirty)}
                fullWidth
                sx={{ marginTop: 2 }}
              >
                Sign Up
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default SignupForm;
