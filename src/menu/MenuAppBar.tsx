import React, { useCallback, useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import eng from '../english.png';
import it from '../italian.png';
import pl from '../polish.png';
import { useApi } from '../ApiProvider';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#f18701',
        },
      },
    },
  },
});

const MenuAppBar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const apiClient = useApi();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [OpenCreateBook, setCreateBookOpen] = useState(false);
  const [OpenUpdateDetails, setUpdateDetailsOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [languageChanged, setLanguageChanged] = useState(false);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (route: string) => {
    navigate(route);
    handleMenuClose();
  };

  const handleUpdateDetailsOpen = () => {
    setUpdateDetailsOpen(true);
  };

  const handleUpdateDetailsClose = () => {
    setUpdateDetailsOpen(false);
    handleMenuClose();
  };

  const handleCreateBookOpen = () => {
    setCreateBookOpen(true);
  };

  const handleCreateBookClose = () => {
    setCreateBookOpen(false);
    handleMenuClose();
  };
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setLanguageChanged(true);
  };

  const onSubmit = useCallback(
    (
      values: {
        isbn: string;
        title: string;
        author: string;
        publisher: string;
        publicationYear: number;
        availableCopies: number;
      },
      formik: any
    ) => {
      if (!apiClient) return;
      apiClient.createBook(values).then((response) => {
        if (response.success) {
          navigate('/home/books');
          formik.resetForm();
          setCreateBookOpen(false);
        } else {
          formik.setFieldError('isbn', 'Failed to add book');
        }
      });
    },
    [apiClient, navigate]
  );

  const onSubmitDetails = useCallback(
    (
      values: {
        id: number;
        genre: string;
        summary: string;
        cover: string;
      },
      formik: any
    ) => {
      if (!apiClient) return;
      apiClient.patchDetails(values).then((response) => {
        if (response.success) {
          navigate('/home/books');
          formik.resetForm();
          setUpdateDetailsOpen(false);
        } else {
          formik.setFieldError('id', 'Failed to update details');
        }
      });
    },
    [apiClient, navigate]
  );

  const validateBook = useMemo(
    () =>
      yup.object().shape({
        isbn: yup
          .string()
          .required('ISBN is required')
          .matches(/^\d{10,13}$/, 'ISBN must be between 10 and 13 digits'),
        title: yup.string().required('Title is required'),
        author: yup.string().required('Author is required'),
        publisher: yup.string().required('Publisher is required'),
        publicationYear: yup
          .number()
          .required('Publication Year is required')
          .min(0, 'Invalid year')
          .integer('Year must be an integer'),
        availableCopies: yup
          .number()
          .required('Available Copies are required')
          .min(0, 'Invalid number of copies')
          .integer('Available copies must be an integer'),
      }),
    []
  );

  const validateDetails = useMemo(
    () =>
      yup.object().shape({
        id: yup.number().required('Id is required'),
        genre: yup.string(),
        summary: yup.string(),
        cover: yup.string(),
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ mr: 4 }}>
            {t('library')}
          </Typography>
          <MenuItem onClick={() => handleMenuItemClick('/home/books')}>
            {t('books')}
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('/home/loans')}>
            {t('loans')}
          </MenuItem>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size="large"
              color="inherit"
              aria-label="english"
              onClick={() => handleLanguageChange('en')}
              sx={{ mr: 2 }}
            >
              <img src={eng} alt="Icon 1" style={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="italian"
              onClick={() => handleLanguageChange('it')}
              sx={{ mr: 2 }}
            >
              <img src={it} alt="Icon 2" style={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="polish"
              onClick={() => handleLanguageChange('pl')}
              sx={{ mr: 2 }}
            >
              <img src={pl} alt="Icon 3" style={{ width: 24, height: 24 }} />
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              aria-label="account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCreateBookOpen}>{t('addBook')}</MenuItem>
          <MenuItem onClick={handleUpdateDetailsOpen}>
            {t('updateDetails')}
          </MenuItem>
        </Menu>
      </AppBar>
      <Dialog open={OpenUpdateDetails} onClose={handleUpdateDetailsClose}>
        <DialogTitle>{t('updateDetails')}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              id: 0,
              genre: '',
              summary: '',
              cover: '',
            }}
            onSubmit={onSubmitDetails}
            validationSchema={validateDetails}
            validateOnChange
            validateOnBlur
          >
            {(formik) => (
              <form id="detailsForm" onSubmit={formik.handleSubmit} noValidate>
                <TextField
                  id="id"
                  label={t('id')}
                  variant="outlined"
                  name="id"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.id && !!formik.errors.id}
                  helperText={formik.touched.id && formik.errors.id}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="genre"
                  label={t('genre')}
                  variant="outlined"
                  name="genre"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.genre && !!formik.errors.genre}
                  helperText={formik.touched.genre && formik.errors.genre}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="summary"
                  label={t('summary')}
                  variant="outlined"
                  name="summary"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.summary && !!formik.errors.summary}
                  helperText={formik.touched.summary && formik.errors.summary}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="cover"
                  label={t('cover')}
                  variant="outlined"
                  name="cover"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.cover && !!formik.errors.cover}
                  helperText={formik.touched.cover && formik.errors.cover}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <DialogActions>
                  <Button onClick={handleUpdateDetailsClose}>
                    {t('cancel')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    variant="contained"
                    color="primary"
                  >
                    {t('update')}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <Dialog open={OpenCreateBook} onClose={handleCreateBookClose}>
        <DialogTitle>{t('createABook')}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              isbn: '',
              title: '',
              author: '',
              publisher: '',
              publicationYear: 0,
              availableCopies: 0,
            }}
            onSubmit={onSubmit}
            validationSchema={validateBook}
            validateOnChange
            validateOnBlur
          >
            {(formik) => (
              <form id="bookForm" onSubmit={formik.handleSubmit} noValidate>
                <TextField
                  id="isbn"
                  label={t('isbn')}
                  variant="outlined"
                  name="isbn"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.isbn && !!formik.errors.isbn}
                  helperText={formik.touched.isbn && formik.errors.isbn}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="title"
                  label={t('title')}
                  variant="outlined"
                  name="title"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && !!formik.errors.title}
                  helperText={formik.touched.title && formik.errors.title}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="author"
                  label={t('author')}
                  variant="outlined"
                  name="author"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.author && !!formik.errors.author}
                  helperText={formik.touched.author && formik.errors.author}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="publisher"
                  label={t('publisher')}
                  variant="outlined"
                  name="publisher"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.publisher && !!formik.errors.publisher}
                  helperText={
                    formik.touched.publisher && formik.errors.publisher
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="publicationYear"
                  label={t('publicationYear')}
                  variant="outlined"
                  name="publicationYear"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.publicationYear &&
                    !!formik.errors.publicationYear
                  }
                  helperText={
                    formik.touched.publicationYear &&
                    formik.errors.publicationYear
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <TextField
                  id="availableCopies"
                  label={t('availableCopies')}
                  variant="outlined"
                  name="availableCopies"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.availableCopies &&
                    !!formik.errors.availableCopies
                  }
                  helperText={
                    formik.touched.availableCopies &&
                    formik.errors.availableCopies
                  }
                  fullWidth
                  margin="normal"
                  InputProps={{
                    style: { color: '#000' },
                  }}
                />
                <DialogActions>
                  <Button onClick={handleCreateBookClose}>{t('cancel')}</Button>
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                    variant="contained"
                    color="primary"
                  >
                    {t('create')}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default MenuAppBar;
