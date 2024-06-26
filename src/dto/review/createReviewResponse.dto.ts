import { GetBookDto } from '../book/getBook.dto';
import { GetUserDto } from '../user/getUser.dto';

export class CreateReviewResponseDto {
  id: number | undefined;
  rating: number | undefined;
  comment: string | undefined;
  userId: GetUserDto | undefined;
  bookId: GetBookDto | undefined;
}
