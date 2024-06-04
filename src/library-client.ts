import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginRequestDto } from './dto/login/loginRequest.dto';
import { LoginResponseDto } from './dto/login/loginResponse.dto';
import { SignupRequestDto } from './dto/register/signupRequest.dto';
import { SignupResponseDto } from './dto/register/signupResponse.dto';
import { GetBooksPageResponseDto } from './dto/book/getBookPageResponse.dto';
import { CreateBookRequestDto } from './dto/book/createBookRequest.dto';
import { CreateBookResponseDto } from './dto/book/createBookResponse.dto';
import { GetLoansPageResponseDto } from './dto/loan/getLoanPageResponse.dto';
import { GetReviewsPageResponseDto } from './dto/review/getReviewPageResponse.dto';
import { CreateLoanRequestDto } from './dto/loan/createLoanRequest.dto';
import { CreateLoanResponseDto } from './dto/loan/createLoanResponse.dto';
import { CreateReviewRequestDto } from './dto/review/createReviewRequest.dto';
import { CreateReviewResponseDto } from './dto/review/createReviewResponse.dto';
import { GetUserDto } from './dto/user/getUser.dto';
import { UpdateDetailRequestDto } from './dto/book/details/patchdetailsrequest.dto';
import { UpdateDetailResponseDto } from './dto/book/details/patchdetailsresponse.dto';

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

  public async signup(
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
  public async getCurrentUser(): Promise<ClientResponse<GetUserDto | null>> {
    try {
      const response: AxiosResponse<GetUserDto> = await this.client.get(
        '/users/me'
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

  public async patchDetails(
    details: UpdateDetailRequestDto
  ): Promise<ClientResponse<UpdateDetailResponseDto | null>> {
    try {
      const { id, ...rest } = details;
      const response: AxiosResponse<UpdateDetailResponseDto> =
        await this.client.patch(`/books/${id}/details`, rest);
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
  public async getAllLoans(
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetLoansPageResponseDto>> {
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

  public async getUserLoans(
    userId: number,
    page = 0,
    size = 10
  ): Promise<ClientResponse<GetLoansPageResponseDto>> {
    try {
      const response: AxiosResponse<GetLoansPageResponseDto> =
        await this.client.get(
          `/users/${userId}/loans?page=${page}&size=${size}`
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

  public async createLoan(
    loan: CreateLoanRequestDto
  ): Promise<ClientResponse<CreateLoanResponseDto>> {
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
}
