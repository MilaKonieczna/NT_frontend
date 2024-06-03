import { GetReviewDto } from './getReview.dto';

export interface GetReviewsPageResponseDto {
  reviews: GetReviewDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}
