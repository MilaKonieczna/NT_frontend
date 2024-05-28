import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import MenuAppBar from '../menu/MenuAppBar';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useApi } from '../ApiProvider';

function HomePage() {
  const apiClient = useApi();
  apiClient.getBooks().then((response) => {
    console.log(response);
  });
  const location = useLocation();

  const renderHomeContent = () => {
    if (location.pathname === '/home') {
      return (
        <>
          <Typography variant="body1" gutterBottom>
            Go back to exploring using these buttons:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="loans"
              sx={{ m: 1 }}
            >
              My Books
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="books"
              sx={{ m: 1 }}
            >
              All Books
            </Button>
          </Box>
          <Typography variant="body1" gutterBottom>
            Fun Fact!
          </Typography>
          <Typography variant="body2" gutterBottom>
            According to the International Federation of Library Associations
            and Institutions, there are around 2.8 million libraries worldwide.{' '}
          </Typography>
        </>
      );
    }
    return null;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ textAlign: 'left' }}>
        <MenuAppBar />
      </Box>
      <Box sx={{ textAlign: 'center', pt: 4 }}>
        {renderHomeContent()}
        {location.pathname !== '/home' && <Outlet />}
      </Box>
    </Box>
  );
}

export default HomePage;
