import { GetUserDto } from './getUser.dto';

export interface GetUserPageResponseDto {
  users: GetUserDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}
