import { APIRequestContext } from '@playwright/test';
import { ApiClient } from '../utils/api-client';
import { Author, CreateAuthorRequest, UpdateAuthorRequest } from '../models/author';

export class AuthorsService {
  private apiClient: ApiClient;
  private readonly endpoint = '/api/v1/Authors';

  constructor(request: APIRequestContext, baseURL: string) {
    this.apiClient = new ApiClient(request, baseURL);
  }

  async getAllAuthors(): Promise<{
    response: Awaited<ReturnType<ApiClient['get']>>;
    data: Author[];
  }> {
    const response = await this.apiClient.get(this.endpoint);
    const data = await response.json();
    return { response, data: data as Author[] };
  }

  async getAuthorById(
    id: number
  ): Promise<{ response: Awaited<ReturnType<ApiClient['get']>>; data: Author }> {
    const response = await this.apiClient.get(`${this.endpoint}/${id}`);
    const data = await response.json();
    return { response, data: data as Author };
  }

  async createAuthor(
    author: CreateAuthorRequest
  ): Promise<{ response: Awaited<ReturnType<ApiClient['post']>>; data: Author }> {
    const response = await this.apiClient.post(this.endpoint, author);
    const data = await response.json();
    return { response, data: data as Author };
  }

  async updateAuthor(
    id: number,
    author: UpdateAuthorRequest
  ): Promise<{ response: Awaited<ReturnType<ApiClient['put']>>; data: Author }> {
    const response = await this.apiClient.put(`${this.endpoint}/${id}`, author);
    const data = await response.json();
    return { response, data: data as Author };
  }

  async deleteAuthor(id: number): Promise<Awaited<ReturnType<ApiClient['delete']>>> {
    return this.apiClient.delete(`${this.endpoint}/${id}`);
  }
}
