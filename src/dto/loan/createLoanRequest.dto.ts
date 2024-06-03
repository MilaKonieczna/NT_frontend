import { GetBookDto } from '../book/getBook.dto';
import { GetUserDto } from '../user/getUser.dto';

export class CreateLoanRequestDto {
  userId: GetUserDto | undefined;
  bookId: GetBookDto | undefined;
}
