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
import { PatchUserDto } from '../dto/user/patchUser.dto';
import { Formik } from 'formik';

const UsersPage: React.FC = () => {
  const { t } = useTranslation();
  const apiClient = useApi();
  const [users, setUsers] = useState<GetUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [user, setUser] = useState<GetUserDto>({
    id: 0,
    username: '',
    name: '',
    lastName: '',
    email: '',
    role: '',
  });
  const [openEditUserDialog, setOpenEditUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState<GetUserDto | null>(null);
  const [editUserForm, setEditUserForm] = useState<PatchUserDto>({
    username: '',
    name: '',
    lastName: '',
    email: '',
  });
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!apiClient) return;
      try {
        const response = await apiClient.getMe();
        if (response.success) {
          setUser((response.data || {}) as GetUserDto);
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
      if (!apiClient || !user) return;
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
  }, [user, apiClient]);

  const handleEditUser = async () => {
    if (!currentUser || !apiClient) return;

    const validEditUserForm: PatchUserDto = {
      username: editUserForm.username || '',
      name: editUserForm.name || '',
      lastName: editUserForm.lastName || '',
      email: editUserForm.email || '',
    };

    try {
      console.log('Editing user with data:', validEditUserForm);
      const response = await apiClient.patchUser(
        currentUser.id,
        validEditUserForm
      );
      if (response.success && response.data) {
        setUsers(
          users.map((user) =>
            user.id === currentUser.id ? response.data : user
          )
        );
        setOpenEditUserDialog(false);
      } else {
        throw new Error('Failed to edit user');
      }
    } catch (error) {
      console.error('Failed to edit user:', error);
    }
  };

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
    setCurrentUser(user);
    setEditUserForm({
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    });
    setOpenEditUserDialog(true);
  };

  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof PatchUserDto
  ) => {
    setEditUserForm({ ...editUserForm, [key]: e.target.value });
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <Box>
        <Typography>
          {t('You do not have permission to view this page')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          sx={{ width: 400 }}
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddUserDialog}
          sx={{
            backgroundColor: '#6e211b',
            color: '#f1f0eb',
            '&:hover': {
              backgroundColor: '#531a15',
            },
          }}
        >
          {t('Add User')}
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ width: 1300, background: '#F1F0EB' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('ID')}</TableCell>
              <TableCell>{t('Username')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Last Name')}</TableCell>
              <TableCell>{t('Email')}</TableCell>
              <TableCell>{t('Role')}</TableCell>
              <TableCell>{t('Edit')}</TableCell>
              <TableCell>{t('Delete')}</TableCell>
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
                  <IconButton onClick={() => handleOpenEditUserDialog(user)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
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

      <Dialog
        open={openEditUserDialog}
        onClose={() => setOpenEditUserDialog(false)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ marginTop: 4, marginBottom: 2 }}
            label="Username"
            value={editUserForm.username}
            onChange={(e) => handleInputChange(e, 'username')}
            fullWidth
          />
          <TextField
            sx={{ marginBottom: 2 }}
            label="Name"
            value={editUserForm.name}
            onChange={(e) => handleInputChange(e, 'name')}
            fullWidth
          />
          <TextField
            sx={{ marginBottom: 2 }}
            label="Last Name"
            value={editUserForm.lastName}
            onChange={(e) => handleInputChange(e, 'lastName')}
            fullWidth
          />
          <TextField
            sx={{ marginBottom: 2 }}
            label="Email"
            value={editUserForm.email}
            onChange={(e) => handleInputChange(e, 'email')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditUser}>Save</Button>
          <Button onClick={() => setOpenEditUserDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              role: 'USER',
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
                    label="Username"
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
                    label="Email"
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
                    label="Password"
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
                    label="Role"
                    variant="outlined"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    error={formik.touched.role && !!formik.errors.role}
                    helperText={formik.touched.role && formik.errors.role}
                    sx={{ marginBottom: 2 }}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
