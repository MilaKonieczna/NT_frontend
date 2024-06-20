import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApi } from '../ApiProvider';
import * as yup from 'yup';
import { SignupRequestDto } from '../dto/register/signupRequest.dto';
import { useTranslation } from 'react-i18next';
import { GetUserDto } from '../dto/user/getUser.dto';
import { Formik } from 'formik';
import { PatchUserDto } from '../dto/user/patchUser.dto';

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const apiClient = useApi();
  const [users, setUsers] = useState<GetUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentUser, setCurrentUser] = useState<GetUserDto>({
    id: 0,
    username: '',
    name: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [editUser, setEditUser] = useState<GetUserDto | null>(null);
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [refreshPage, setRefreshPage] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!apiClient) return;
      try {
        const response = await apiClient.getMe();
        if (response.success) {
          setCurrentUser((response.data || {}) as GetUserDto);
        } else {
          throw new Error('Failed to fetch current user data');
        }
      } catch (error) {
        console.error('Failed to fetch current user data:', error);
      }
    };

    fetchCurrentUser();
  }, [apiClient]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!apiClient || !currentUser) return;
      try {
        const response = await apiClient.getUsers();
        if (response.data && response.data.users) {
          setUsers(response.data.users);
        } else {
          throw new Error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, apiClient, refreshPage]);

  const handleEditUser = useCallback(
    (
      values: { id: number; name: string; lastName: string; email: string },
      formik: any
    ) => {
      if (!apiClient) return;

      const { id, ...data } = values;

      const patchData: PatchUserDto = {
        email: data.email,
        name: data.name,
        lastName: data.lastName,
      };

      apiClient.patchUser(id, patchData).then((response) => {
        if (response.success) {
          formik.resetForm();
          setOpenEditUserDialog(false);
          setRefreshPage(true);
        } else {
          formik.setFieldError('id', 'Failed to update details');
        }
      });
    },
    [apiClient]
  );

  const handleDeleteUser = async (id: number) => {
    if (!apiClient) return;

    try {
      await apiClient.deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleOpenEditUserDialog = (user: GetUserDto) => {
    setEditUser(user);
    setOpenEditUserDialog(true);
  };

  const handleCloseEditUserDialog = () => {
    setOpenEditUserDialog(false);
    setEditUser(null);
  };

  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleAddUser = useCallback(
    async (values: SignupRequestDto, formik: { resetForm: () => void }) => {
      try {
        console.log('Adding user with data:', values);
        const response = await apiClient?.addUser(values);
        console.log('Add user response:', response);
        if (response && response.success && response.data) {
          setSuccessMessage('User added successfully.');
          formik.resetForm();
          setOpenAddUserDialog(false);
          setRefreshPage(true);
        } else {
          setErrorMessage('Failed to add user. Please try again.');
          console.error('Failed to add user. Response:', response);
        }
      } catch (error) {
        setErrorMessage('Failed to add user. Please try again.');
        console.error('Failed to add user:', error);
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

  const filteredUsers = users.filter(
    (user) =>
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{(error as Error).message}</Typography>;
  }

  if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
    return (
      <Box>
        <Typography>{t('NoPremission')}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          sx={{ width: 400, marginRight: 80, marginBottom: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddUserDialog}
          sx={{
            marginRight: 2,
            color: '#F1F0EB',
            backgroundColor: '#AAA45A',
            border: '3px solid',
            borderColor: '#7E7940',
            '&:hover': {
              backgroundColor: '#7E7940',
              border: '3px solid',
              borderColor: '#524D25',
            },
          }}
        >
          {t('addUser')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<EditIcon />}
          onClick={() => handleOpenEditUserDialog(editUser as GetUserDto)}
          sx={{
            marginRight: 2,
            color: '#F1F0EB',
            backgroundColor: '#AAA45A',
            border: '3px solid',
            borderColor: '#7E7940',
            '&:hover': {
              backgroundColor: '#7E7940',
              border: '3px solid',
              borderColor: '#524D25',
            },
          }}
        >
          {t('editUser')}
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ width: 1300, background: '#F1F0EB' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('id')}</TableCell>
              <TableCell>{t('username')}</TableCell>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('lastname')}</TableCell>
              <TableCell>{t('email')}</TableCell>
              <TableCell>{t('role')}</TableCell>
              <TableCell>{t('delete')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditUserDialog} onClose={handleCloseEditUserDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: editUser?.id || 0,
              name: editUser?.name || '',
              lastName: editUser?.lastName || '',
              email: editUser?.email || '',
            }}
            onSubmit={handleEditUser}
            validateOnChange
            validateOnBlur
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit} noValidate>
                <TextField
                  id="id"
                  name="id"
                  label={t('id')}
                  variant="outlined"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.id}
                  error={formik.touched.id && !!formik.errors.id}
                  helperText={formik.touched.id && formik.errors.id}
                  sx={{ marginBottom: 2, marginTop: 2 }}
                />
                <TextField
                  id="name"
                  name="name"
                  label={t('name')}
                  variant="outlined"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  id="lastName"
                  name="lastName"
                  label={t('lastname')}
                  variant="outlined"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  error={formik.touched.lastName && !!formik.errors.lastName}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  id="email"
                  name="email"
                  label={t('email')}
                  variant="outlined"
                  fullWidth
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  error={formik.touched.email && !!formik.errors.email}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ marginBottom: 2 }}
                />
                <DialogActions>
                  <Button onClick={handleCloseEditUserDialog}>
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    {t('save')}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              role: 'ROLE_READER',
            }}
            onSubmit={handleAddUser}
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
                    label={t('username')}
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    error={formik.touched.username && !!formik.errors.username}
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                    sx={{ marginBottom: 2, marginTop: 2 }}
                  />
                  <TextField
                    id="email"
                    name="email"
                    label={t('email')}
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={formik.touched.email && !!formik.errors.email}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    id="password"
                    name="password"
                    label={t('password')}
                    variant="outlined"
                    type="password"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    error={formik.touched.password && !!formik.errors.password}
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    sx={{ marginBottom: 2 }}
                  />
                  <TextField
                    id="role"
                    name="role"
                    select
                    label={t('role')}
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    error={formik.touched.role && !!formik.errors.role}
                    helperText={formik.touched.role && formik.errors.role}
                    sx={{ marginBottom: 2 }}
                  >
                    <MenuItem value="ROLE_READER">Reader</MenuItem>
                    <MenuItem value="ROLE_ADMIN">Admin</MenuItem>
                  </TextField>

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
                <DialogActions>
                  <Button onClick={handleCloseAddUserDialog}>Cancel</Button>
                  <Button
                    type="submit"
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Save
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
