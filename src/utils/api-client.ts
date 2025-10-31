import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async post(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async put(endpoint: string, data: unknown): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }
}
