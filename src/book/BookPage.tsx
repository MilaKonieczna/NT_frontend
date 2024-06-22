import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  DialogTitle,
  TextField,
} from '@mui/material';
import './BookPage.css';
import { GetReviewDto } from '../dto/review/getReview.dto';
import { GetBookDto } from '../dto/book/getBook.dto';
import { GetBooksPageResponseDto } from '../dto/book/getBookPageResponse.dto';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { useTranslation } from 'react-i18next';
import { GetUserDto } from '../dto/user/getUser.dto';
import { CreateLoanRequestDto } from '../dto/loan/createLoanRequest.dto';
import { CreateReviewRequestDto } from '../dto/review/createReviewRequest.dto';
import { useApi, useUser } from '../api/ApiProvider';

const StarRating: React.FC<{
  rating: number;
  onChange?: (rating: number) => void;
}> = ({ rating, onChange }) => {
  return (
    <Box display="flex" alignItems="center">
      {[...Array(5)].map((_, index) => (
        <Box
          key={index}
          onClick={() => onChange && onChange(index + 1)}
          sx={{ cursor: onChange ? 'pointer' : 'default' }}
        >
          {index < rating ? (
            <StarOutlinedIcon sx={{ color: '#C98116' }} />
          ) : (
            <StarBorderOutlinedIcon sx={{ color: '#C98116' }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

const BookPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<GetBookDto | null>(null);
  const [reviews, setReviews] = useState<GetReviewDto[]>([]);
  const [relatedBooks, setRelatedBooks] =
    useState<GetBooksPageResponseDto | null>(null);
  const user = useUser();
  const apiClient = useApi();
  const { t } = useTranslation();
  const [, setUser] = useState<GetUserDto | null>(null);
  const [open, setOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveReview = async (rating: number, comment: string) => {
    try {
      if (!user || !book?.id || !apiClient) {
        console.error('User, book, or API client not found');
        return;
      }

      const reviewData: CreateReviewRequestDto = {
        rating: rating,
        comment: comment,
        userId: user.id,
        bookId: book.id,
      };

      const response = await apiClient.createReview(reviewData);

      if (response.success && response.data) {
        console.log('Review created successfully:', response.data);
      } else {
        console.error('Failed to save review:', response.status);
      }
    } catch (error) {
      console.error('Error saving review:', error);
    } finally {
      handleClose();
    }
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

  const handleLoan = useCallback(
    async (bookId: number | undefined) => {
      if (!bookId || !apiClient) return;

      const loan: CreateLoanRequestDto = {
        userId: user?.id,
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
    [apiClient, user?.id]
  );
  const handleBookClick = (bookId: number | undefined) => {
    if (bookId !== undefined) {
      navigate(`/home/books/${bookId}`);
    }
  };
  if (!book) return <div>{t('noBookAvailable')}</div>;

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
        <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2}>
          <Card>
            <CardMedia
              component="img"
              image={book.detail?.cover || ''}
              alt={book.title}
              sx={{ height: 700, maxWidth: 460 }}
            />
          </Card>
          <div className="book-info">
            <Box flex="1" marginLeft={2}>
              <div className="top">
                <Typography
                  variant="h3"
                  component="div"
                  alignItems="center"
                  sx={{ marginBottom: 2 }}
                >
                  {book.title}
                  <CircleIcon
                    sx={{
                      color: book.available ? '#AAA45A' : '#87331B',
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
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ marginTop: '20px', marginBottom: '20px' }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleLoan(book.id)}
                    sx={{
                      height: '35px',
                      width: '150px',
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
                    {t('loan')}
                  </Button>
                </Box>
              </div>
              <Divider sx={{ marginY: 2 }} />
              <Box
                sx={{
                  width: '100%',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '0px solid #ddd',
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
                  <Box display="flex" alignItems="center">
                    <Typography variant="h4" sx={{ marginRight: 2 }}>
                      {t('reviews')}
                    </Typography>
                    <StarRating rating={Math.round(averageRating)} />
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      height: '35px',
                      width: '150px',
                      color: '#F1F0EB',
                      marginLeft: '32px',
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
                    <Card
                      key={review.id}
                      sx={{ marginBottom: 2, backgroundColor: '#f1f0eb' }}
                    >
                      <CardContent>
                        <Box
                          display="flex"
                          alignItems="center"
                          marginBottom={1}
                        >
                          <StarRating rating={review.rating ?? 0} />
                        </Box>
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          - {review.userId?.name ?? 'Anonymous'}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Box>
          </div>
        </Box>
      </div>

      {relatedBooks?.books && relatedBooks.books.length > 1 && (
        <div className="related">
          <Divider sx={{ marginY: 2, width: 1430 }} />
          <Box>
            <Typography
              variant="h5"
              sx={{ marginBottom: 2, marginRight: '16px' }}
            >
              {t('inThisGenre')}
            </Typography>
            <Grid container spacing={1}>
              {relatedBooks.books
                .filter(
                  (relatedBook) => relatedBook.id !== parseInt(bookId || '')
                )
                .map((relatedBook) => (
                  <Grid item xs={12} sm={5} md={2.4} key={relatedBook.id}>
                    <Card sx={{ marginBottom: 2, width: 240 }}>
                      <CardMedia
                        component="img"
                        image={relatedBook.detail?.cover || ''}
                        alt={relatedBook.title}
                        className="book-cover"
                        onClick={() => handleBookClick(relatedBook.id)}
                      />
                      <CardContent>
                        <Typography variant="body2">
                          {relatedBook.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {relatedBook.author}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </div>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h6">{t('addReview')}</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" marginBottom={2} width={300}>
            <StarRating
              rating={newReview.rating}
              onChange={(rating) => setNewReview({ ...newReview, rating })}
            />
          </Box>
          <TextField
            autoFocus
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
          <Button
            onClick={() =>
              handleSaveReview(newReview.rating, newReview.comment)
            }
            color="primary"
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookPage;
