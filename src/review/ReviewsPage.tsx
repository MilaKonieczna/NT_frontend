import React, { useState, useEffect } from 'react';
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
  IconButton,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useApi } from '../api/ApiProvider';
import { GetReviewDto } from '../dto/review/getReview.dto';
import { useTranslation } from 'react-i18next';

const ReviewsPage: React.FC = () => {
  const apiClient = useApi();
  const [reviews, setReviews] = useState<GetReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReviews = async () => {
      if (!apiClient) return;
      try {
        const response = await apiClient.getReviews();
        if (response.success && response.data) {
          setReviews(response.data.reviews);
        } else {
          throw new Error('Failed to fetch reviews');
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [apiClient]);

  const handleDeleteReview = async (id: number) => {
    if (!apiClient) return;

    try {
      await apiClient.deleteReview(id);
      setReviews(reviews.filter((review) => review.id !== id));
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredReviews = reviews.filter(
    (review) =>
      (review.rating &&
        review.rating.toString().includes(searchTerm.toLowerCase())) ||
      (review.comment &&
        review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.userId.id &&
        review.userId.id.toString().includes(searchTerm.toLowerCase())) ||
      (review.bookId.id &&
        review.bookId.id.toString().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{(error as Error).message}</Typography>;
  }

  return (
    <Box>
      <TextField
        label={t('search')}
        variant="outlined"
        size="small"
        sx={{
          width: 400,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#AAA45A',
            },
            '&:hover fieldset': {
              borderColor: '#AAA45A',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#AAA45A',
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              color: '#AAA45A',
            },
          },
        }}
        value={searchTerm}
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table sx={{ width: 1300, background: '#F1F0EB' }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>{t('delete')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.id}</TableCell>
                <TableCell>{review.rating ?? 'N/A'}</TableCell>
                <TableCell>{review.comment ?? 'N/A'}</TableCell>
                <TableCell>{review.userId.id ?? 'N/A'}</TableCell>
                <TableCell>{review.bookId.id ?? 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => review.id && handleDeleteReview(review.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReviewsPage;
