import { DetailDto } from './details.dto';

export class UpdateDetailResponseDto {
  id: number | undefined;
  isbn: string | undefined;
  title: string | undefined;
  author: string | undefined;
  publisher: string | undefined;
  publicationYear: number | undefined;
  isAvailable: boolean | undefined;
  detail: DetailDto | undefined;
}
