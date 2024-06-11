import { Button, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Formik } from 'formik';
import { useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../ApiProvider';
import { useTranslation } from 'react-i18next';
import './LoginForm.css';

function LoginForm() {
  const apiClient = useApi();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onSubmit = useCallback(
    (values: { username: string; password: string }, formik: any) => {
      if (!apiClient) return;

      apiClient.login(values).then((response) => {
        if (response.success) {
          navigate('/home/books');
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
    <div className="container">
      <div className="shelf"></div>
      <div className="bar-container">
        <div className="book4"></div>
        <div className="book3">
          <div className="login">
            <Typography
              variant="h4"
              component="h2"
              align="center"
              color={'#f1f0eb'}
            >
              {t('login')}
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
                          '&.Mui-focused': {
                            color: '#5A552F',
                          },
                        },
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#f1f0eb',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#5A552F',
                        },
                        '& .MuiInputBase-input': {
                          color: '#f1f0eb',
                        },
                        '& .MuiInputBase-input:focus': {
                          color: '#f1f0eb',
                        },
                      }}
                      margin="normal"
                      InputProps={{
                        style: { color: '#f1f0eb' },
                      }}
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
                          '&.Mui-focused': {
                            color: '#5A552F',
                          },
                        },
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#f1f0eb',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#5A552F',
                        },
                        '& .MuiInputBase-input': {
                          color: '#f1f0eb',
                        },
                        '& .MuiInputBase-input:focus': {
                          color: '#f1f0eb',
                        },
                      }}
                      margin="normal"
                      InputProps={{
                        style: { color: '#f1f0eb' },
                      }}
                    />

                    <Button
                      variant="contained"
                      startIcon={<LoginIcon />}
                      type="submit"
                      form="signForm"
                      disabled={!(formik.isValid && formik.dirty)}
                      fullWidth
                      style={{
                        backgroundColor: '#524D25',
                        color: '#f1f0eb',
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#524D25',
                        },
                        marginTop: 5,
                      }}
                    >
                      {t('signIn')}
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

export default LoginForm;
