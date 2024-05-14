import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import { Book, booksData } from '../book-list/data';

function BookList() {
  return (
    <div className="book-list-container" style={{ marginTop: '20px' }}>
      <Grid container spacing={2}>
        {booksData.map((book: Book) => (
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
                image={book.cover_image_url}
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
        ))}
      </Grid>
    </div>
  );
}

export default BookList;
