// src/components/SignupForm.tsx
import { Button, TextField, Typography } from '@mui/material';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import './UserForm.css';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../ApiProvider';
import { Formik } from 'formik';

function UserForm() {
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
    <div className="container">
      <div className="shelf"></div>
      <div className="bar-container">
        <div className="book4"></div>
        <div className="book3">
          <div className="login">
            <Typography
              variant="h6"
              component="h2"
              align="center"
              color={'#f1f0eb'}
            >
              Add User
            </Typography>
            <Typography variant="body1" align="center" color={'#f1f0eb'}>
              Already have an account? <a href="/login">Login</a>
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
                  <div className="text-container">
                    <TextField
                      id="username"
                      label="Username"
                      variant="standard"
                      name="username"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.username && !!formik.errors.username
                      }
                      helperText={
                        formik.touched.username && formik.errors.username
                      }
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: '#f1f0eb',
                          ':after': {
                            color: '#f1f0eb',
                          },
                        },
                        '& .MuiInput-underline': { color: '#f1f0eb' },
                        ':after': {
                          borderBottomColor: '#f1f0eb',
                        },
                      }}
                      InputProps={{
                        style: { color: '#f1f0eb' },
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
                          color: '#f1f0eb',
                          ':after': {
                            color: '#f1f0eb',
                          },
                        },
                        '& .MuiInput-underline': { color: '#f1f0eb' },
                        ':after': {
                          borderBottomColor: '#f1f0eb',
                        },
                      }}
                      InputProps={{
                        style: { color: '#f1f0eb' },
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
                      error={
                        formik.touched.password && !!formik.errors.password
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: '#f1f0eb',
                          ':after': {
                            color: '#f1f0eb',
                          },
                        },
                        '& .MuiInput-underline': { color: '#f1f0eb' },
                        ':after': {
                          borderBottomColor: '#f1f0eb',
                        },
                      }}
                      InputProps={{
                        style: { color: '#f1f0eb' },
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
                        formik.touched.repeatPassword &&
                        formik.errors.repeatPassword
                      }
                      fullWidth
                      sx={{
                        '& .MuiInputLabel-root': {
                          color: '#f1f0eb',
                          ':after': {
                            color: '#f1f0eb',
                          },
                        },
                        '& .MuiInput-underline': { color: '#f1f0eb' },
                        ':after': {
                          borderBottomColor: '#f1f0eb',
                        },
                      }}
                      InputProps={{
                        style: { color: '#f1f0eb' },
                      }}
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      form="signForm"
                      disabled={!(formik.isValid && formik.dirty)}
                      fullWidth
                      sx={{
                        '&': {
                          backgroundColor: '#7678ED',
                        },
                        marginTop: 5,
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <div className="book2"></div>
        <div className="book1"></div>
      </div>
      <div className="pot-container">
        <div className="plant" />
      </div>
    </div>
  );
}

export default UserForm;
