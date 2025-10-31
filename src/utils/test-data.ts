import { CreateBookRequest } from '../models/book';
import { CreateAuthorRequest } from '../models/author';

export class TestDataGenerator {
  static generateBook(id?: number): CreateBookRequest {
    const timestamp = Date.now();
    return {
      id: id ?? Math.floor(Math.random() * 10000),
      title: `Test Book ${timestamp}`,
      description: `Description for test book ${timestamp}`,
      pageCount: Math.floor(Math.random() * 1000) + 100,
      excerpt: `Excerpt for test book ${timestamp}`,
      publishDate: new Date().toISOString(),
    };
  }

  static generateInvalidBook(): Partial<CreateBookRequest> {
    return {
      title: '', // Invalid: empty title
      description: 'Test description',
      pageCount: -1, // Invalid: negative page count
    };
  }

  static generateAuthor(id?: number, idBook?: number): CreateAuthorRequest {
    const timestamp = Date.now();
    return {
      id: id ?? Math.floor(Math.random() * 10000),
      idBook: idBook ?? Math.floor(Math.random() * 100) + 1,
      firstName: `First${timestamp}`,
      lastName: `Last${timestamp}`,
    };
  }

  static generateInvalidAuthor(): Partial<CreateAuthorRequest> {
    return {
      idBook: -1, // Invalid: negative book ID
      firstName: '', // Invalid: empty first name
      lastName: '',
    };
  }
}
