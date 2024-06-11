import React, { useEffect, useState, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Pagination,
} from '@mui/material';
import { useApi } from '../ApiProvider';
import { GetBookDto } from '../dto/book/getBook.dto';
import { GetUserDto } from '../dto/user/getUser.dto';
import { useTranslation } from 'react-i18next';
import { CreateLoanRequestDto } from '../dto/loan/createLoanRequest.dto';
import { useNavigate } from 'react-router-dom';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<GetUserDto | null>(null);
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

  const handleLoan = useCallback(
    async (bookId: number | undefined) => {
      if (!bookId || !currentUser || !apiClient) return;

      const loan: CreateLoanRequestDto = {
        userId: currentUser.id,
        bookId,
        loanDate: new Date(),
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      };

      try {
        const response = await apiClient.createLoan(loan);
        if (response.success) {
          console.log('Loan created successfully:', response.data);
        } else {
          console.error('Failed to create loan:', response.status);
        }
      } catch (error) {
        console.error('Error creating loan:', error);
      }
    },
    [apiClient, currentUser]
  );

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
            <Grid item xs={12} sm="auto" md="auto" lg={2.4} key={book.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  margin: 'auto',
                  marginLeft: 2,
                  marginRight: 2,
                }}
                onClick={() => handleBookClick(book.id)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.detail?.cover}
                  alt={book.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    sx={{ lineHeight: '1' }}
                  >
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.detail?.genre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.detail?.summary}
                  </Typography>
                </CardContent>
                <Button
                  sx={{
                    marginLeft: 2,
                    marginRight: 2,
                    marginBottom: 2,
                    width: 250,
                    alignSelf: 'center',
                    backgroundColor: '#7678ed',
                  }}
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoan(book.id);
                  }}
                >
                  Loan
                </Button>
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
    </div>
  );
};

export default BookList;
