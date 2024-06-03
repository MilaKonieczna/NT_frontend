import { GetBookDto } from '../book/getBook.dto';
import { GetUserDto } from '../user/getUser.dto';

export class CreateReviewRequestDto {
  rating: number | undefined;
  comment: string | undefined;
  userId: GetUserDto | undefined;
  bookId: GetBookDto | undefined;
}
