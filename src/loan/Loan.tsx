import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import './Loan.css';
import { Book, booksData } from '../book/Data';

const LoanList: React.FC = () => {
  const [expandedBookId, setExpandedBookId] = useState<number | null>(null);

  const handleBookClick = (bookId: number) => {
    setExpandedBookId((prevId) => (prevId === bookId ? null : bookId));
  };

  return (
    <div className="book-list-container">
      <List dense className="book-list">
        {booksData.map((book: Book) => (
          <React.Fragment key={book.id}>
            <ListItem
              className="book-list-item"
              onClick={() => handleBookClick(book.id)}
            >
              <ListItemIcon>
                <img
                  src={book.cover_image_url}
                  alt={book.title}
                  className="book-cover-image"
                />
              </ListItemIcon>
              <ListItemText
                primary={book.title}
                secondary={`${book.author} - ${book.genre}`}
              />
              {expandedBookId === book.id ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse
              in={expandedBookId === book.id}
              timeout="auto"
              unmountOnExit
            >
              <ListItemText
                className="expanded-content"
                primary={`Description: ${book.description}`}
                secondary={`Publisher: ${book.publisher}`}
              />
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default LoanList;
