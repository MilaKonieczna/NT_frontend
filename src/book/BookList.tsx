import React, { useEffect, useState } from 'react';
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

const BookList: React.FC = () => {
  const [books, setBooks] = useState<GetBookDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const apiClient = useApi();

  useEffect(() => {
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
                    marginTop: 2,
                    marginLeft: 2,
                    marginRight: 2,
                    marginBottom: 2,
                    width: 150,
                    alignSelf: 'center',
                  }}
                  variant="contained"
                >
                  Loan
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" component="div" sx={{ margin: 'auto' }}>
            No books available.
          </Typography>
        )}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        color="primary"
        sx={{ marginTop: 2 }}
      />
    </div>
  );
};

export default BookList;
