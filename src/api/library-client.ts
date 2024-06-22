import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginRequestDto } from '../dto/login/loginRequest.dto';
import { LoginResponseDto } from '../dto/login/loginResponse.dto';
import { SignupRequestDto } from '../dto/register/signupRequest.dto';
import { SignupResponseDto } from '../dto/register/signupResponse.dto';
import { GetBooksPageResponseDto } from '../dto/book/getBookPageResponse.dto';
import { CreateBookRequestDto } from '../dto/book/createBookRequest.dto';
import { CreateBookResponseDto } from '../dto/book/createBookResponse.dto';
import { GetLoansPageResponseDto } from '../dto/loan/getLoanPageResponse.dto';
import { GetReviewsPageResponseDto } from '../dto/review/getReviewPageResponse.dto';
import { CreateLoanRequestDto } from '../dto/loan/createLoanRequest.dto';
import { CreateLoanResponseDto } from '../dto/loan/createLoanResponse.dto';
import { CreateReviewRequestDto } from '../dto/review/createReviewRequest.dto';
import { UpdateDetailRequestDto } from '../dto/book/details/patchdetailsrequest.dto';
import { UpdateDetailResponseDto } from '../dto/book/details/patchdetailsresponse.dto';
import { CreateReviewResponseDto } from '../dto/review/createReviewResponse.dto';
import { GetUsersPageResponseDto } from '../dto/user/getUserPageResponse.dto';
import { GetUserDto } from '../dto/user/getUser.dto';
import { GetBookDto } from '../dto/book/getBook.dto';
import { PatchBookResponseDto } from '../dto/book/patchBookResponse.dto';
import { PatchUserDto } from '../dto/user/patchUser.dto';
import { ReturnLoanResponseDto } from '../dto/loan/returnLoanResponse.dto';

export type ClientResponse<T> = {
  success: boolean;
  data: T | null;
  status: number;
};

export class LibraryClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8881/api',
    });

    const token = localStorage.getItem('token');
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  public async getMe(): Promise<{
    success: boolean;
    data: GetUserDto | null;
    statusCode: number;
  }> {
    try {
      const response = await this.client.get('/users/me');
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async createReview(
    review: CreateReviewRequestDto
  ): Promise<ClientResponse<CreateReviewResponseDto | null>> {
    try {
      const response: AxiosResponse<CreateReviewResponseDto> =
        await this.client.post('/reviews', review);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getReviews(
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetReviewsPageResponseDto | null>> {
    try {
      const response: AxiosResponse<GetReviewsPageResponseDto> =
        await this.client.get(`/reviews?page=${page}&size=${size}`);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getReviewsForBook(
    id: number
  ): Promise<ClientResponse<GetReviewsPageResponseDto | null>> {
    try {
      const response: AxiosResponse<GetReviewsPageResponseDto> =
        await this.client.get(`/reviews/book/${id}`);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteReview(id: number): Promise<ClientResponse<null>> {
    try {
      const response: AxiosResponse<null> = await this.client.delete(
        `/reviews/${id}`
      );
      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getLoans(
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetLoansPageResponseDto | null>> {
    try {
      const response: AxiosResponse<GetLoansPageResponseDto> =
        await this.client.get(`/loans?page=${page}&size=${size}`);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async createLoan(
    loan: CreateLoanRequestDto
  ): Promise<ClientResponse<CreateLoanResponseDto | null>> {
    try {
      const response: AxiosResponse<CreateLoanResponseDto> =
        await this.client.post('/loans', loan);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async returnLoan(
    id: number
  ): Promise<ClientResponse<ReturnLoanResponseDto>> {
    try {
      const response: AxiosResponse<ReturnLoanResponseDto> =
        await this.client.patch(`/loans/${id}/return`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteLoan(id: number): Promise<ClientResponse<null>> {
    try {
      const response: AxiosResponse<null> = await this.client.delete(
        `/loans/${id}`
      );
      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getBooks(
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetBooksPageResponseDto | null>> {
    try {
      const response: AxiosResponse<GetBooksPageResponseDto> =
        await this.client.get(`/books?page=${page}&size=${size}`);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getBooksByGenre(
    genre: string | undefined
  ): Promise<ClientResponse<GetBooksPageResponseDto>> {
    try {
      const response: AxiosResponse<GetBooksPageResponseDto> =
        await this.client.get(`/books/genre/${genre}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getBook(id: number): Promise<ClientResponse<GetBookDto | null>> {
    try {
      const response: AxiosResponse<GetBookDto> = await this.client.get(
        `/books/${id}`
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async createBook(
    book: CreateBookRequestDto
  ): Promise<ClientResponse<CreateBookResponseDto | null>> {
    try {
      const response: AxiosResponse<CreateBookResponseDto> =
        await this.client.post('/books', book);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async patchDetails(
    details: UpdateDetailRequestDto
  ): Promise<ClientResponse<UpdateDetailResponseDto | null>> {
    try {
      const { id, ...rest } = details;

      if (!id || !rest.genre || !rest.summary || !rest.cover) {
        throw new Error('Invalid request data: All fields are required');
      }

      const response: AxiosResponse<UpdateDetailResponseDto> =
        await this.client.patch(`/books/${id}/details`, rest, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      console.error('PATCH Request Error:', axiosError.response?.data);

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async patchCopies(
    id: number,
    newCopies: number
  ): Promise<ClientResponse<PatchBookResponseDto | null>> {
    try {
      console.log(`Sending PATCH request to /books/${id}/update with data:`, {
        newCopies,
      }); // Log the data

      const response: AxiosResponse<PatchBookResponseDto> =
        await this.client.patch(
          `/books/${id}/update`,
          { newCopies },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      // Log error details for debugging
      console.error('PATCH Request Error:', axiosError.response?.data);

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteBook(id: number): Promise<ClientResponse<null>> {
    try {
      const response: AxiosResponse<null> = await this.client.delete(
        `/books/${id}`
      );
      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async login(
    data: LoginRequestDto
  ): Promise<ClientResponse<LoginResponseDto | null>> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post(
        '/auth/login',
        data
      );
      const token = response.data.token;
      if (token) {
        this.client.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${token}`;
        localStorage.setItem('token', token);
      }

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(
    data: SignupRequestDto
  ): Promise<ClientResponse<SignupResponseDto | null>> {
    try {
      const response: AxiosResponse<SignupResponseDto> = await this.client.post(
        '/auth/register',
        data
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async getUsers(
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetUsersPageResponseDto | null>> {
    try {
      const response: AxiosResponse<GetUsersPageResponseDto> =
        await this.client.get(`/users?page=${page}&size=${size}`);

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async patchUser(
    id: number,
    data: PatchUserDto
  ): Promise<ClientResponse<any>> {
    try {
      const response: AxiosResponse<any> = await this.client.patch(
        `/users/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      console.error('Error response:', axiosError.response?.data);

      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }

  public async deleteUser(id: number): Promise<ClientResponse<null>> {
    try {
      const response: AxiosResponse<null> = await this.client.delete(
        `/users/${id}`
      );
      return {
        success: true,
        data: null,
        status: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        status: axiosError.response?.status || 0,
      };
    }
  }
}
