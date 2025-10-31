import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../utils/api-client';
import { Book, CreateBookRequest, UpdateBookRequest } from '../models/book';

export class BooksService {
  private apiClient: ApiClient;
  private readonly endpoint = '/api/v1/Books';

  constructor(request: APIRequestContext, baseURL: string) {
    this.apiClient = new ApiClient(request, baseURL);
  }

  async getAllBooks(): Promise<{ response: Awaited<ReturnType<ApiClient['get']>>; data: Book[] }> {
    const response = await this.apiClient.get(this.endpoint);
    const data = await response.json();
    return { response, data: data as Book[] };
  }

  async getBookById(
    id: number
  ): Promise<{ response: Awaited<ReturnType<ApiClient['get']>>; data: Book }> {
    const response = await this.apiClient.get(`${this.endpoint}/${id}`);
    const data = await response.json();
    return { response, data: data as Book };
  }

  async createBook(
    book: CreateBookRequest
  ): Promise<{ response: Awaited<ReturnType<ApiClient['post']>>; data: Book }> {
    const response = await this.apiClient.post(this.endpoint, book);
    const data = await response.json();
    return { response, data: data as Book };
  }

  async updateBook(
    id: number,
    book: UpdateBookRequest
  ): Promise<{ response: Awaited<ReturnType<ApiClient['put']>>; data: Book }> {
    const response = await this.apiClient.put(`${this.endpoint}/${id}`, book);
    const data = await response.json();
    return { response, data: data as Book };
  }

  async deleteBook(id: number): Promise<Awaited<ReturnType<ApiClient['delete']>>> {
    return this.apiClient.delete(`${this.endpoint}/${id}`);
  }
}
