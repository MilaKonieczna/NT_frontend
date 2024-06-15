import { GetUserDto } from './getUser.dto';

export interface GetUsersPageResponseDto {
  users: GetUserDto[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  hasMore: boolean;
}
