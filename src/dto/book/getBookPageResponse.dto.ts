import { GetBookDto } from './getBook.dto';

export interface GetBooksPageResponseDto {
  books: GetBookDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}
