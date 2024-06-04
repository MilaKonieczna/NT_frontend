export class CreateLoanRequestDto {
  userId: number | undefined;
  bookId: number | undefined;
  loanDate: Date | undefined;
  dueDate: Date | undefined;
}
