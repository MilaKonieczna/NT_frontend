import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import './BookPage.css';
import { useApi } from '../ApiProvider';
import { GetReviewDto } from '../dto/review/getReview.dto';
import { GetBookResponseDto } from '../dto/book/getBookResponse.dto';
import { GetBooksPageResponseDto } from '../dto/book/getBookPageResponse.dto';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from 'react-i18next';
import { CurrentUser } from '../dto/me/currentUser.dto';

const BookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<GetBookResponseDto | null>(null);
  const [reviews, setReviews] = useState<GetReviewDto[]>([]);
  const [relatedBooks, setRelatedBooks] =
    useState<GetBooksPageResponseDto | null>(null);
  const apiClient = useApi();
  const { t } = useTranslation();
  const [, setUser] = useState<CurrentUser | null>(null);
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveReview = async () => {
    // Implement review saving logic here
    handleClose();
  };

  useEffect(() => {
    if (!apiClient || !bookId) return;

    const fetchCurrentUser = async () => {
      try {
        const response = await apiClient.getMe();
        if (response.success) {
          console.log('Current user data:', response.data);
          setUser(response.data);
        } else {
          console.error(
            'Failed to fetch current user data:',
            response.statusCode
          );
        }
      } catch (error) {
        console.error('Error fetching current user data:', error);
      }
    };

    const fetchBookDetails = async () => {
      try {
        const response = await apiClient.getBook(parseInt(bookId, 10));
        if (response.success && response.data) {
          console.log('Book data fetched:', response.data);
          setBook(response.data);
        } else if (response.status === 404) {
          console.error('Book not found');
        } else {
          console.error('Failed to fetch book details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await apiClient.getReviewsForBook(
          parseInt(bookId, 10)
        );
        if (response.success && response.data) {
          console.log('Reviews fetched:', response.data.reviews);
          setReviews(response.data.reviews);
        } else {
          console.error('Failed to fetch reviews:', response.status);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchCurrentUser();
    fetchBookDetails();
    fetchReviews();
  }, [apiClient, bookId]);

  useEffect(() => {
    if (!apiClient) return;
    if (book?.detail?.genre) {
      const fetchRelatedBooks = async () => {
        try {
          console.log(
            `Fetching related books for genre: ${book.detail?.genre}`
          );
          const response = await apiClient.getBooksByGenre(book.detail?.genre);
          if (response.success && response.data) {
            console.log('Related books fetched:', response.data);
            setRelatedBooks(response.data);
          } else {
            console.error('Failed to fetch related books:', response.status);
          }
        } catch (error) {
          console.error('Error fetching related books:', error);
        }
      };

      fetchRelatedBooks();
    }
  }, [apiClient, book]);

  if (!book) return <div>{t('noBookAvailable')}</div>;

  const availableCopies = book.availableCopies ?? 0;

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + (review.rating ?? 0), 0) /
      reviews.length
    : 0;

  return (
    <div
      className="book-detail-container"
      style={{ marginTop: '20px', justifyContent: 'center' }}
    >
      <div className="current-book">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <Card>
              <CardMedia
                component="img"
                image={book.detail?.cover || ''}
                alt={book.title}
                sx={{ height: 500 }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={8} md={6} style={{ marginLeft: '20px' }}>
            <Typography
              variant="h3"
              component="div"
              display="flex"
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              {book.title}
              <CircleIcon
                sx={{
                  color: availableCopies > 0 ? '#AAA45A' : '#87331B',
                  fontSize: '1rem',
                  marginLeft: '10px',
                }}
              />
            </Typography>

            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              {book.author}
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              {`${book.detail?.genre} | ${book.publicationYear} | ${book.publisher}`}
            </Typography>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              {book.detail?.summary}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                height: '35px',
                width: '634px',
                padding: '16px',
                marginTop: '20px',
                marginBottom: '20px',
                backgroundColor: '#D3990F',
                border: '3px solid',
                borderColor: '#C98116',
                '&:hover': {
                  backgroundColor: '#C98116',
                  border: '3px solid',
                  borderColor: '#C26C13',
                },
              }}
            >
              {t('loan')}
            </Button>
            <Divider sx={{ marginY: 2 }} />
            <Box
              sx={{
                width: '600px',
                maxHeight: '300px',
                overflowY: 'auto',
                border: '0px solid #ddd',
                padding: '16px',
                marginTop: '20px',
                backgroundColor: '#f1f0eb',
                scrollbarColor: '#f1f0eb',
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ marginBottom: 2 }}
              >
                <Typography variant="h5">Reviews</Typography>
                <Box display="flex">
                  {[...Array(5)].map((_, index) => (
                    <StarOutlinedIcon
                      key={index}
                      sx={{
                        color:
                          index < Math.round(averageRating)
                            ? '#FFD700'
                            : '#C0C0C0',
                      }}
                    />
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    color: '#F1F0EB',
                    marginLeft: '16px',
                    backgroundColor: '#AAA45A',
                    border: '3px solid',
                    borderColor: '#7E7940',
                    '&:hover': {
                      backgroundColor: '#7E7940',
                      border: '3px solid',
                      borderColor: '#524D25',
                    },
                  }}
                  onClick={handleClickOpen}
                >
                  {t('addReview')}
                </Button>
              </Box>

              {reviews &&
                reviews.map((review) => (
                  <Card key={review.id} sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography variant="body2">
                        {review.rating ?? 'No rating'}
                      </Typography>
                      <Typography variant="body2">{review.comment}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        - {review.userId?.name ?? 'Anonymous'}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </Grid>
        </Grid>
      </div>

      <Divider sx={{ marginY: 2 }} />
      <Typography variant="h5" sx={{ marginBottom: 2, marginRight: '16px' }}>
        {t('relatedBooks')}
      </Typography>
      <Grid container spacing={1}>
        {relatedBooks?.books &&
          relatedBooks.books
            .filter((relatedBook) => relatedBook.id !== parseInt(bookId || ''))
            .map((relatedBook) => (
              <Grid item xs={12} sm={5} md={2.4} key={relatedBook.id}>
                <Card sx={{ marginBottom: 2, width: 240 }}>
                  <CardMedia
                    component="img"
                    image={relatedBook.detail?.cover || ''}
                    alt={relatedBook.title}
                    sx={{ width: 240, height: 350 }}
                  />
                  <CardContent>
                    <Typography variant="body2">{relatedBook.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {relatedBook.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('addReview')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('writeReview')}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('rating')}
            type="number"
            fullWidth
            variant="standard"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: parseInt(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label={t('comment')}
            type="text"
            fullWidth
            variant="standard"
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleSaveReview} color="primary">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookPage;
