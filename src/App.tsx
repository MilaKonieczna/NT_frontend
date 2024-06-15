import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApiProvider from './ApiProvider';
import HomePage from './home/HomePage';
import LoanList from './loan/Loan';
import BookList from './book/BookList';
import LoginForm from './login/LoginForm';
import UserForm from './user/UserForm';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import BookPage from './book/BookPage';
import UsersPage from './user/UsersPage';
import ReviewsPage from './review/ReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <ApiProvider>
          <Routes>
            <Route path="/home/*" element={<HomePage />}>
              <Route path="loans" element={<LoanList />} />
              <Route path="books/:bookId" element={<BookPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="books" element={<BookList />} />
              <Route path="reviews" element={<ReviewsPage />} />
            </Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<UserForm />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </ApiProvider>
      </I18nextProvider>
    </BrowserRouter>
  );
}

export default App;
