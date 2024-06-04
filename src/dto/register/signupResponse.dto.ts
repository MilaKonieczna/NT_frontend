import { UserRole } from '../../commonTypes/UserRole';

export interface SignupResponseDto {
  id: number | undefined;
  username: string | undefined;
  role: UserRole | undefined;
}
