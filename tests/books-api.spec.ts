import { test, expect } from '@playwright/test';
import { BooksService } from '../src/services/books-service';
import { TestDataGenerator } from '../src/utils/test-data';

test.describe('Books API Tests', () => {
  let booksService: BooksService;
  const baseURL = 'https://fakerestapi.azurewebsites.net';

  test.beforeEach(({ request }) => {
    booksService = new BooksService(request, baseURL);
  });

  test.describe('GET /api/v1/Books', () => {
    test('should retrieve all books successfully (Happy Path)', async () => {
      const { response, data } = await booksService.getAllBooks();

      expect(response.status()).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // Validate book structure
      const book = data[0];
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('description');
      expect(book).toHaveProperty('pageCount');
      expect(book).toHaveProperty('excerpt');
      expect(book).toHaveProperty('publishDate');
      expect(typeof book.id).toBe('number');
      expect(typeof book.title).toBe('string');
    });

    test('should return valid JSON response', async () => {
      const { response } = await booksService.getAllBooks();

      expect(response.status()).toBe(200);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  test.describe('GET /api/v1/Books/{id}', () => {
    test('should retrieve a specific book by ID (Happy Path)', async () => {
      const bookId = 1;
      const { response, data } = await booksService.getBookById(bookId);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(bookId);
      expect(data).toHaveProperty('title');
      expect(data).toHaveProperty('description');
      expect(data).toHaveProperty('pageCount');
      expect(data).toHaveProperty('excerpt');
      expect(data).toHaveProperty('publishDate');
    });

    test('should handle non-existent book ID (Edge Case)', async () => {
      const nonExistentId = 999999;
      const { response } = await booksService.getBookById(nonExistentId);

      expect(response.status()).toBe(404);
    });

    test('should handle invalid book ID format (Edge Case)', async () => {
      // Testing with a very large number
      const invalidId = Number.MAX_SAFE_INTEGER;
      const { response } = await booksService.getBookById(invalidId);

      expect(response.status()).toBe(400);
    });

    test('should handle negative book ID (Edge Case)', async () => {
      const negativeId = -1;
      const { response } = await booksService.getBookById(negativeId);

      expect(response.status()).toBe(404);
    });
  });

  test.describe('POST /api/v1/Books', () => {
    test('should create a new book successfully (Happy Path)', async () => {
      const newBook = TestDataGenerator.generateBook();
      const { response, data } = await booksService.createBook(newBook);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(newBook.id);
      expect(data.title).toBe(newBook.title);
      expect(data.description).toBe(newBook.description);
      expect(data.pageCount).toBe(newBook.pageCount);
      expect(data.excerpt).toBe(newBook.excerpt);
    });

    test('should create book with required fields only', async () => {
      const minimalBook = TestDataGenerator.generateBook();
      const { response, data } = await booksService.createBook(minimalBook);

      expect(response.status()).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('title');
    });

    test('should handle duplicate book ID (Edge Case)', async () => {
      const book = TestDataGenerator.generateBook(100);
      // Create first book
      await booksService.createBook(book);

      // Try to create another book with the same ID
      const { response: response2 } = await booksService.createBook(book);

      // API might accept duplicates
      expect(response2.status()).toBe(200);
    });

    test('should handle missing required fields (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Invalid book payload should return Bad Request status, see ticket JIRA-1234',
      });
      const invalidBook = TestDataGenerator.generateInvalidBook();
      const { response } = await booksService.createBook(invalidBook as any);

      // Should return 400 Bad Request
      expect([400, 500]).toContain(response.status());
    });

    test('should handle very long strings (Edge Case)', async () => {
      const book = TestDataGenerator.generateBook();
      book.title = 'A'.repeat(10000); // Very long title
      book.description = 'B'.repeat(50000); // Very long description

      const { response } = await booksService.createBook(book);

      expect(response.status()).toBe(200);
    });
  });

  test.describe('PUT /api/v1/Books/{id}', () => {
    test('should update an existing book successfully (Happy Path)', async () => {
      const bookId = 1;
      const updatedBook = TestDataGenerator.generateBook(bookId);
      updatedBook.title = 'Updated Book Title';
      updatedBook.description = 'Updated description';

      const { response, data } = await booksService.updateBook(bookId, updatedBook);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(bookId);
      expect(data.title).toBe(updatedBook.title);
      expect(data.description).toBe(updatedBook.description);
    });

    test('should handle updating non-existent book (Edge Case)', async () => {
      const nonExistentId = 999999;
      const updatedBook = TestDataGenerator.generateBook(nonExistentId);

      const { response } = await booksService.updateBook(nonExistentId, updatedBook);

      // API returns 200 (upsert behavior)
      expect(response.status()).toBe(200);
    });

    test('should handle invalid data in update (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Wrong status code on on update with invalid book payload, see ticket JIRA-1234',
      });
      const bookId = 1;
      const invalidBook = TestDataGenerator.generateInvalidBook();

      const { response } = await booksService.updateBook(bookId, invalidBook as any);

      expect([400, 500]).toContain(response.status());
    });

    test('should handle ID mismatch in URL and body (Edge Case)', async () => {
      const urlId = 1;
      const bodyBook = TestDataGenerator.generateBook(999);

      const { response } = await booksService.updateBook(urlId, bodyBook);

      expect(response.status()).toBe(200);
    });
  });

  test.describe('DELETE /api/v1/Books/{id}', () => {
    test('should delete a book successfully (Happy Path)', async () => {
      // First create a book to delete
      const newBook = TestDataGenerator.generateBook();
      await booksService.createBook(newBook);

      // Then delete it
      const response = await booksService.deleteBook(newBook.id);

      // API typically returns 200 OK or 204 No Content for successful delete
      expect([200, 204]).toContain(response.status());
    });

    test('should handle deleting non-existent book (Edge Case)', async () => {
      const nonExistentId = 999999;
      const response = await booksService.deleteBook(nonExistentId);

      // API returns 200 (idempotent delete)
      expect(response.status()).toBe(200);
    });

    test('should handle deleting with invalid ID (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Wrong status code on book deletion with invalid payload, see ticket JIRA-1234',
      });
      const invalidId = -1;
      const response = await booksService.deleteBook(invalidId);

      expect([400, 404]).toContain(response.status());
    });
  });

  //Note:
  //In real REST APIs, IDs are usually auto-generated and not sent in POST requests.
  test.describe('Integration Tests', () => {
    test('should perform full CRUD operations (Happy Path)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Unmock books database in order to persist data, see ticket JIRA-1234',
      });
      // Create
      const newBook = TestDataGenerator.generateBook();
      const { data: createdBook } = await booksService.createBook(newBook);
      expect(createdBook.id).toBe(newBook.id);

      // Read
      const { data: retrievedBook } = await booksService.getBookById(createdBook.id);
      expect(retrievedBook.id).toBe(createdBook.id);
      expect(retrievedBook.title).toBe(createdBook.title);

      // Update
      const updatedBook = { ...createdBook, title: 'Updated Title' };
      const { data: updatedBookData } = await booksService.updateBook(createdBook.id, updatedBook);
      expect(updatedBookData.title).toBe('Updated Title');

      // Delete
      const deleteResponse = await booksService.deleteBook(createdBook.id);
      expect([200, 204]).toContain(deleteResponse.status());
    });
  });
});
