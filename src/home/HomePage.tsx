import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUser } from '../ApiProvider';
import MenuAppBar from '../menu/MenuAppBar';
import './HomePage.css';
import { t } from 'i18next';
import funFacts from '../FunFacts';

const HomePage: React.FC = () => {
  const location = useLocation();
  const user = useUser();

  if (!user) {
    return (
      <div className="centered">
        <h4>{t('loading')}</h4>
      </div>
    );
  }

  const renderHomeContent = () => {
    if (location.pathname === '/home') {
      const lang = localStorage.getItem('i18nextLng') || 'en';

      const randomFact =
        funFacts[lang][Math.floor(Math.random() * funFacts[lang].length)];

      return (
        <>
          <Typography variant="h4" gutterBottom>
            {t('welcome')}, {user.username}
          </Typography>
          <Typography variant="h5" gutterBottom>
            {t('goBack')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="loans"
              sx={{
                m: 1,
                backgroundColor: '#A0451A',
                border: '3px solid',
                borderColor: '#87331B',
                '&:hover': {
                  backgroundColor: '#87331B',
                  borderColor: '#7B2A1B',
                },
                fontSize: '1.25rem',
              }}
            >
              {t('loans')}
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="books"
              sx={{
                m: 1,
                backgroundColor: '#A0451A',
                border: '3px solid',
                borderColor: '#87331B',
                '&:hover': {
                  backgroundColor: '#87331B',
                  borderColor: '#7B2A1B',
                },
                fontSize: '1.25rem',
              }}
            >
              {t('allbooks')}
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom sx={{ marginTop: 3 }}>
            {t('funFact')}
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
            {randomFact}
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
