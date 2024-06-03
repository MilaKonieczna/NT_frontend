import { GetBookDto } from '../book/getBook.dto';
import { GetUserDto } from '../user/getUser.dto';

export class GetLoanDto {
  id: number | undefined;
  loanDate: Date | undefined;
  dueDate: Date | undefined;
  userId: GetUserDto | undefined;
  bookId: GetBookDto | undefined;
}
