import { Button, TextField, Typography, MenuItem } from '@mui/material';
import { Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { useApi } from '../ApiProvider';
import { SignupRequestDto } from '../dto/register/signupRequest.dto';

function UserForm() {
  const apiClient = useApi();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = useCallback(
    async (values: SignupRequestDto, formik: { resetForm: () => void }) => {
      try {
        await apiClient?.signup(values);
        setSuccessMessage('User added successfully.');
        formik.resetForm();
      } catch (error) {
        setErrorMessage('Failed to add user. Please try again.');
      }
    },
    [apiClient]
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        username: yup.string().required('Required'),
        email: yup.string().email('Invalid email').required('Required'),
        password: yup
          .string()
          .required('Required')
          .min(5, 'Password too short'),
        role: yup.string().required('Required'),
      }),
    []
  );

  return (
    <div className="container">
      <Formik
        initialValues={{ username: '', email: '', password: '', role: 'USER' }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        validateOnChange
        validateOnBlur
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="form-group">
              <TextField
                id="username"
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                error={formik.touched.username && !!formik.errors.username}
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                id="password"
                name="password"
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                id="role"
                name="role"
                select
                label="Role"
                variant="outlined"
                fullWidth
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                error={formik.touched.role && !!formik.errors.role}
                helperText={formik.touched.role && formik.errors.role}
              >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </TextField>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                color="primary"
                disabled={!formik.isValid || !formik.dirty}
              >
                Add User
              </Button>
              {successMessage && (
                <Typography variant="body1" color="primary" align="center">
                  {successMessage}
                </Typography>
              )}
              {errorMessage && (
                <Typography variant="body1" color="error" align="center">
                  {errorMessage}
                </Typography>
              )}
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default UserForm;
