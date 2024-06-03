import { GetLoanDto } from './getLoan.dto';

export interface GetLoansPageResponseDto {
  loans: GetLoanDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}
