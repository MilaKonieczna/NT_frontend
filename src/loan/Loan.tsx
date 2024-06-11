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
import { GetUserDto } from '../dto/user/getUser.dto';
import { useTranslation } from 'react-i18next';
import { GetLoanDto } from '../dto/loan/getLoan.dto';

const LoanList: React.FC = () => {
  const [loans, setLoans] = useState<GetLoanDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [, setCurrentUser] = useState<GetUserDto | null>(null);
  const apiClient = useApi();
  const { t } = useTranslation();

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

    apiClient
      .getLoans(currentPage)
      .then((response) => {
        if (response.success && response.data) {
          setLoans(response.data.loans);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        } else {
          setLoans([]);
        }
      })
      .catch((error) => {});
  }, [currentPage, apiClient]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
  };

  return (
    <div className="loan-list-container" style={{ marginTop: '20px' }}>
      <Grid container spacing={3}>
        {Array.isArray(loans) && loans.length > 0 ? (
          loans.map((loan) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={loan.id}>
              <Card
                sx={{
                  width: '250px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={loan.bookId?.detail?.cover}
                  alt={loan.bookId?.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="body1"
                    component="div"
                    sx={{ lineHeight: '1' }}
                  >
                    {loan.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.loanDate?.toString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.dueDate?.toString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.bookId?.id?.toString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {loan.userId?.id?.toString()}
                  </Typography>
                </CardContent>
                <Button
                  sx={{
                    marginLeft: 2,
                    marginRight: 2,
                    marginBottom: 2,
                    width: '80%',
                    alignSelf: 'center',
                    backgroundColor: '#7678ed',
                  }}
                  variant="contained"
                >
                  {t('return')}
                </Button>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" component="div" sx={{ margin: 'auto' }}>
            {t('noLoansFound')}
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

export default LoanList;
