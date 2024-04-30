export interface Book {
  id: number;
  author: string;
  rating: number;
  cover_image_url: string;
  genre: string;
  description: string;
  isbn: string;
  publication_year: number;
  publisher: string;
  title: string;
}

export const booksData: Book[] = [
  {
    id: 3,
    author: 'Albert Camus',
    rating: 2,
    cover_image_url: 'https://cloud-cdn.virtualo.pl/covers/medium/241188.jpg',
    genre: 'Novel',
    description:
      "The book follows a city's struggle to maintain order and civility during an outbreak of the bubonic plague.",
    isbn: '9780415039550',
    publication_year: 1992,
    publisher: 'Krag',
    title: 'The Plague',
  },
  {
    id: 4,
    author: 'Gabriel Garcia Marquez',
    rating: 4,
    cover_image_url:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327881361i/320.jpg',
    genre: 'Magical Realism',
    description:
      'A tale of love, loss, and magical occurrences in a small Latin American town.',
    isbn: '9780061120091',
    publication_year: 1967,
    publisher: 'Harper & Row',
    title: 'One Hundred Years of Solitude',
  },
  {
    id: 5,
    author: 'Fyodor Dostoevsky',
    rating: 5,
    cover_image_url:
      'https://m.media-amazon.com/images/I/612KmKeEYEL._AC_UF894,1000_QL80_.jpg',
    genre: 'Philosophical Fiction',
    description:
      'Explores the psychological complexities of guilt, redemption, and the human condition.',
    isbn: '9780679734500',
    publication_year: 1866,
    publisher: 'The Russian Messenger',
    title: 'Crime and Punishment',
  },
  {
    id: 6,
    author: 'Harper Lee',
    rating: 4,
    cover_image_url:
      'https://freight.cargo.site/t/original/i/b3052f7f5391d2a58a33c584c53bbf1895e58abe7f1f58a0c9c020924b8323e9/cover-web.jpg',
    genre: 'Southern Gothic',
    description:
      'Explores themes of racial injustice and moral growth in the American South.',
    isbn: '9780061120084',
    publication_year: 1960,
    publisher: 'J. B. Lippincott & Co.',
    title: 'To Kill a Mockingbird',
  },
  {
    id: 7,
    author: 'George Orwell',
    rating: 5,
    cover_image_url:
      'https://images.booksense.com/images/333/869/9781328869333.jpg',
    genre: 'Dystopian Fiction',
    description:
      'A cautionary tale about totalitarianism and the erosion of truth and freedom.',
    isbn: '9780451524935',
    publication_year: 1949,
    publisher: 'Secker & Warburg',
    title: '1984',
  },
  {
    id: 8,
    author: 'J.R.R. Tolkien',
    rating: 5,
    cover_image_url:
      'https://m.media-amazon.com/images/I/81i1-a1lq9L._AC_UF1000,1000_QL80_DpWeblab_.jpg',
    genre: 'Fantasy',
    description:
      'An epic fantasy adventure set in the fictional world of Middle-earth.',
    isbn: '9780345339706',
    publication_year: 1954,
    publisher: 'Allen & Unwin',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
  },
];
