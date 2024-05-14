import { Navigate, Route, Routes } from 'react-router-dom';
import LoginForm from './login-form/LoginForm';
import HomePage from './home-page/HomePage';
import LoanList from './loan-page/loan';
import BookList from './book-list/BookList';

function App() {
  return (
    <Routes>
      <Route path="/home/*" element={<HomePage />}>
        <Route path="loans" element={<LoanList />} />
        <Route path="books" element={<BookList />} />
      </Route>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;
