import { DetailDto } from './details/details.dto';

export class GetBookResponseDto {
  id: number | undefined;
  isbn: string | undefined;
  title: string | undefined;
  author: string | undefined;
  publisher: string | undefined;
  publicationYear: number | undefined;
  availableCopies: number | undefined;
  detail: DetailDto | undefined;
}
