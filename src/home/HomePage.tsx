import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useApi } from '../ApiProvider';
import MenuAppBar from '../menu/MenuAppBar';
import './HomePage.css';
import { CurrentUser } from '../dto/me/currentUser.dto';

const HomePage: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const apiClient = useApi();

  useEffect(() => {
    if (!apiClient) return;

    const fetchCurrentUser = async () => {
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
    };

    fetchCurrentUser();
  }, [apiClient]);

  if (!user) {
    return <div>Loading...</div>;
  }
  const renderHomeContent = () => {
    if (location.pathname === '/home') {
      return (
        <>
          <Typography variant="body1" gutterBottom>
            Welcome,{user.username}
          </Typography>
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
            and Institutions, there are around 2.8 million libraries worldwide.
          </Typography>
        </>
      );
    }
    return null;
  };

  return (
    <Box className="home-container">
      <MenuAppBar />
      <Box className="main-content">
        {renderHomeContent()}
        {location.pathname !== '/home' && <Outlet />}
      </Box>
    </Box>
  );
};

export default HomePage;
