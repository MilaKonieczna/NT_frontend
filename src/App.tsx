import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ApiProvider from './ApiProvider';
import HomePage from './home/HomePage';
import LoanList from './loan/Loan';
import BookList from './book/BookList';
import LoginForm from './login/LoginForm';

function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Routes>
          <Route path="/home/*" element={<HomePage />}>
            <Route path="loans" element={<LoanList />} />
            <Route path="books" element={<BookList />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

export default App;
