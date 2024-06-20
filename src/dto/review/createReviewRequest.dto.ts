export class CreateReviewRequestDto {
  rating: number | undefined;
  comment: string | undefined;
  userId: number | undefined;
  bookId: number | undefined;
}
