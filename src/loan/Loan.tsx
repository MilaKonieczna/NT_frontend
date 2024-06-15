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
  const [currentUser, setCurrentUser] = useState<GetUserDto | null>(null);
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

    const fetchLoans = async () => {
      try {
        const response = await apiClient.getLoans(currentPage);
        if (response.success && response.data) {
          const allLoans = response.data.loans;

          const filteredLoans =
            currentUser?.role === 'ROLE_ADMIN'
              ? allLoans
              : allLoans.filter((loan) => loan.userId?.id === currentUser?.id);

          setLoans(filteredLoans);
          setTotalPages(response.data.totalPages);
        } else {
          setLoans([]);
        }
      } catch (error) {
        console.error('Failed to fetch loans:', error);
      }
    };

    fetchLoans();
  }, [currentPage, apiClient, currentUser]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value - 1);
  };

  const handleDeleteLoan = async (loanId: number) => {
    if (!apiClient) return;
    try {
      await apiClient.deleteLoan(loanId);
      fetchLoans();
    } catch (error) {
      console.error('Failed to delete loan:', error);
    }
  };

  const handleReturnLoan = async (loanId: number) => {
    if (!apiClient) return;
    try {
      await apiClient.returnLoan(loanId);
      fetchLoans();
    } catch (error) {
      console.error('Failed to return loan:', error);
    }
  };

  const fetchLoans = async () => {
    if (!apiClient) return;

    try {
      const response = await apiClient.getLoans(currentPage);
      if (response.success && response.data) {
        const allLoans = response.data.loans;

        const filteredLoans =
          currentUser?.role === 'ROLE_ADMIN'
            ? allLoans
            : allLoans.filter((loan) => loan.userId?.id === currentUser?.id);

        setLoans(filteredLoans);
        setTotalPages(response.data.totalPages);
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

  return (
    <div className="Loan-list">
      <Grid container spacing={2} justifyContent="center">
        {Array.isArray(loans) && loans.length > 0 ? (
          loans.map((loan) => (
            <Grid item key={loan.id} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={loan.bookId?.detail?.cover}
                  alt={loan.bookId?.title}
                  className="loan-cover-image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {loan.bookId?.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Loan Date: {loan.loanDate?.toString()}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Due Date: {loan.dueDate?.toString()}
                  </Typography>
                </CardContent>
                {currentUser?.role === 'ROLE_ADMIN' && (
                  <div
                    className="button-container"
                    style={{ textAlign: 'center' }}
                  >
                    <Button
                      onClick={() => handleReturnLoan(loan.id || 0)}
                      variant="contained"
                      sx={{
                        marginBottom: 2,
                        width: 100,
                        alignSelf: 'center',
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
                      {t('return')}
                    </Button>
                    <br />
                    <Button
                      onClick={() => handleDeleteLoan(loan.id || 0)}
                      variant="contained"
                      sx={{
                        marginBottom: 2,
                        width: 100,
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
                      {t('delete')}
                    </Button>
                  </div>
                )}
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" component="div" className="loan-list-title">
            {t('noLoansFound')}
          </Typography>
        )}
      </Grid>
      <Pagination
        count={totalPages}
        page={currentPage + 1}
        onChange={handlePageChange}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default LoanList;
