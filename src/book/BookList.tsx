import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
  Snackbar,
} from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../dto/book/getBook.dto';
import { GetUserDto } from '../dto/user/getUser.dto';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<GetUserDto | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const apiClient = useApi();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!apiClient) return;

      try {
        const response = await apiClient.getMe();
        if (response.success && response.data) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, [apiClient]);

  useEffect(() => {
    if (!apiClient) return;

    console.log('Fetching books for page:', currentPage);
    apiClient
      .getBooks(currentPage)
      .then((response) => {
        console.log('Response:', response);
        if (response.success && response.data) {
          console.log('Books data:', response.data.books);
          setBooks(response.data.books);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        } else {
          setBooks([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, [currentPage, apiClient]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
  };

  const handleDeleteBook = async (bookId: number | undefined) => {
    if (!apiClient || !bookId) return;

    try {
      const response = await apiClient.deleteBook(bookId);

      if (response.success) {
        setCurrentPage(0);
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
        console.log('Book deleted successfully');
      } else {
        setSnackbarMessage('Book have been loaned thus cannot be deleted');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Failed to delete the book. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleBookClick = (bookId: number | undefined) => {
    if (bookId !== undefined) {
      navigate(`/home/books/${bookId}`);
    }
  };

  return (
    <div className="book-list-container" style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        {Array.isArray(books) && books.length > 0 ? (
          books.map((book) => (
            <Grid
              item
              xs={12}
              sm="auto"
              md="auto"
              lg={2.4}
              key={book.id}
              style={{ marginBottom: '20px' }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 'auto',
                  marginLeft: 2,
                  marginBottom: 2,
                  marginRight: 2,
                  backgroundColor: '#F1EEE5',
                  border: '3px solid',
                  borderColor: '#F0EBDE',
                  position: 'relative',
                }}
                onClick={() => handleBookClick(book.id)}
              >
                {currentUser?.role === 'ROLE_ADMIN' && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                    startIcon={<DeleteIcon />}
                    sx={{
                      position: 'absolute',
                      top: 210,
                      right: 5,
                      color: '#000000',
                    }}
                    variant="text"
                  />
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={book.detail?.cover}
                  alt={book.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ lineHeight: '1' }}
                  >
                    {book.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {book.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" component="div" sx={{ margin: 'auto' }}>
            {t('noBooksAvailable')}
          </Typography>
        )}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        sx={{ marginTop: 2 }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default BookList;
