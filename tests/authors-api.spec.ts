import { test, expect } from '@playwright/test';
import { AuthorsService } from '../src/services/authors-service';
import { TestDataGenerator } from '../src/utils/test-data';

test.describe('Authors API Tests', () => {
  let authorsService: AuthorsService;
  const baseURL = 'https://fakerestapi.azurewebsites.net';

  test.beforeEach(({ request }) => {
    authorsService = new AuthorsService(request, baseURL);
  });

  test.describe('GET /api/v1/Authors', () => {
    test('should retrieve all authors successfully (Happy Path)', async () => {
      const { response, data } = await authorsService.getAllAuthors();

      expect(response.status()).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // Validate author structure
      const author = data[0];
      expect(author).toHaveProperty('id');
      expect(author).toHaveProperty('idBook');
      expect(author).toHaveProperty('firstName');
      expect(author).toHaveProperty('lastName');
      expect(typeof author.id).toBe('number');
      expect(typeof author.firstName).toBe('string');
      expect(typeof author.lastName).toBe('string');
    });

    test('should return valid JSON response', async () => {
      const { response } = await authorsService.getAllAuthors();

      expect(response.status()).toBe(200);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
    });
  });

  test.describe('GET /api/v1/Authors/{id}', () => {
    test('should retrieve a specific author by ID (Happy Path)', async () => {
      const authorId = 1;
      const { response, data } = await authorsService.getAuthorById(authorId);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(authorId);
      expect(data).toHaveProperty('idBook');
      expect(data).toHaveProperty('firstName');
      expect(data).toHaveProperty('lastName');
    });

    test('should handle non-existent author ID (Edge Case)', async () => {
      const nonExistentId = 999999;
      const { response } = await authorsService.getAuthorById(nonExistentId);

      expect(response.status()).toBe(404);
    });

    test('should handle invalid author ID format (Edge Case)', async () => {
      const invalidId = Number.MAX_SAFE_INTEGER;
      const { response } = await authorsService.getAuthorById(invalidId);

      expect(response.status()).toBe(400);
    });

    test('should handle negative author ID (Edge Case)', async () => {
      const negativeId = -1;
      const { response } = await authorsService.getAuthorById(negativeId);

      expect(response.status()).toBe(404);
    });
  });

  test.describe('POST /api/v1/Authors', () => {
    test('should create a new author successfully (Happy Path)', async () => {
      const newAuthor = TestDataGenerator.generateAuthor();
      const { response, data } = await authorsService.createAuthor(newAuthor);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(newAuthor.id);
      expect(data.idBook).toBe(newAuthor.idBook);
      expect(data.firstName).toBe(newAuthor.firstName);
      expect(data.lastName).toBe(newAuthor.lastName);
    });

    test('should create author with required fields only', async () => {
      const minimalAuthor = TestDataGenerator.generateAuthor();
      const { response, data } = await authorsService.createAuthor(minimalAuthor);

      expect(response.status()).toBe(200);
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('firstName');
      expect(data).toHaveProperty('lastName');
    });

    test('should handle duplicate author ID (Edge Case)', async () => {
      const author = TestDataGenerator.generateAuthor(100);
      await authorsService.createAuthor(author);

      // Try to create another author with the same ID
      const { response: response2 } = await authorsService.createAuthor(author);

      // API might accept duplicates, thats why status 200
      expect(response2.status()).toBe(200);
    });

    test('should handle missing required fields (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Wrong status code on author creation with invalid payload, see ticket JIRA-1234',
      });
      const invalidAuthor = TestDataGenerator.generateInvalidAuthor();
      const { response } = await authorsService.createAuthor(invalidAuthor as any);

      expect([400, 500]).toContain(response.status());
    });

    test('should handle very long names (Edge Case)', async () => {
      const author = TestDataGenerator.generateAuthor();
      author.firstName = 'A'.repeat(10000);
      author.lastName = 'B'.repeat(10000);

      const { response } = await authorsService.createAuthor(author);

      expect(response.status()).toBe(200);
    });
  });

  test.describe('PUT /api/v1/Authors/{id}', () => {
    test('should update an existing author successfully (Happy Path)', async () => {
      const authorId = 1;
      const updatedAuthor = TestDataGenerator.generateAuthor(authorId);
      updatedAuthor.firstName = 'Updated First Name';
      updatedAuthor.lastName = 'Updated Last Name';

      const { response, data } = await authorsService.updateAuthor(authorId, updatedAuthor);

      expect(response.status()).toBe(200);
      expect(data.id).toBe(authorId);
      expect(data.firstName).toBe(updatedAuthor.firstName);
      expect(data.lastName).toBe(updatedAuthor.lastName);
    });

    test('should handle updating non-existent author (Edge Case)', async () => {
      const nonExistentId = 999999;
      const updatedAuthor = TestDataGenerator.generateAuthor(nonExistentId);

      const { response } = await authorsService.updateAuthor(nonExistentId, updatedAuthor);

      // API returns 200 (upsert behavior)
      expect(response.status()).toBe(200);
    });

    test('should handle invalid data in update (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Wrong status code on on update with invalid author payload, see ticket JIRA-1234',
      });
      const authorId = 1;
      const invalidAuthor = TestDataGenerator.generateInvalidAuthor();

      const { response } = await authorsService.updateAuthor(authorId, invalidAuthor as any);

      expect([400, 500]).toContain(response.status());
    });

    test('should handle ID mismatch in URL and body (Edge Case)', async () => {
      const urlId = 1;
      const bodyAuthor = TestDataGenerator.generateAuthor(999);

      const { response } = await authorsService.updateAuthor(urlId, bodyAuthor);

      expect(response.status()).toBe(200);
    });
  });

  test.describe('DELETE /api/v1/Authors/{id}', () => {
    test('should delete an author successfully (Happy Path)', async () => {
      // First create an author to delete
      const newAuthor = TestDataGenerator.generateAuthor();
      await authorsService.createAuthor(newAuthor);

      // Then delete it
      const response = await authorsService.deleteAuthor(newAuthor.id);

      expect([200, 204]).toContain(response.status());
    });

    test('should handle deleting non-existent author (Edge Case)', async () => {
      const nonExistentId = 999999;
      const response = await authorsService.deleteAuthor(nonExistentId);

      // API returns 200 (idempotent delete)
      expect(response.status()).toBe(200);
    });

    test('should handle deleting with invalid ID (Edge Case)', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Wrong status code on author deletion with invalid payload, see ticket JIRA-1234',
      });
      const invalidId = -1;
      const response = await authorsService.deleteAuthor(invalidId);

      expect([400, 404]).toContain(response.status());
    });
  });

  //Note:
  //In real REST APIs, IDs are usually auto-generated and not sent in POST requests.
  //FakeRestAPI accepts an ID in POST for mock/demo purposes, but it doesn’t persist.
  test.describe('Integration Tests', () => {
    test('should perform full CRUD operations (Happy Path) - real scenario exaple', async () => {
      test.info().annotations.push({
        type: 'bug',
        description:
          'Known bug: Unmock authors database in order to persist data, see ticket JIRA-1234',
      });
      // Create
      const newAuthor = TestDataGenerator.generateAuthor();
      const { data: createdAuthor } = await authorsService.createAuthor(newAuthor);
      expect(createdAuthor.id).toBe(newAuthor.id);

      // Read
      const { data: retrievedAuthor } = await authorsService.getAuthorById(createdAuthor.id);
      expect(retrievedAuthor.id).toBe(createdAuthor.id);
      expect(retrievedAuthor.firstName).toBe(createdAuthor.firstName);

      // Update
      const updatedAuthor = { ...createdAuthor, firstName: 'Updated First Name' };
      const { data: updatedAuthorData } = await authorsService.updateAuthor(
        createdAuthor.id,
        updatedAuthor
      );
      expect(updatedAuthorData.firstName).toBe('Updated First Name');

      // Delete
      const deleteResponse = await authorsService.deleteAuthor(createdAuthor.id);
      expect([200, 204]).toContain(deleteResponse.status());
    });

    test('should perform full CRUD operations (Happy Path)', async () => {
      const { data: allAuthors } = await authorsService.getAllAuthors();
      expect(allAuthors.length).toBeGreaterThan(0);

      const existingAuthorId = allAuthors[0].id;

      // Read - verify we can retrieve existing author
      const { data: retrievedAuthor } = await authorsService.getAuthorById(existingAuthorId);
      expect(retrievedAuthor.id).toBe(existingAuthorId);

      // Update - update the existing author
      const updatedAuthor = {
        ...retrievedAuthor,
        firstName: 'Updated First Name',
      };
      const { data: updatedAuthorData } = await authorsService.updateAuthor(
        existingAuthorId,
        updatedAuthor
      );
      expect(updatedAuthorData.firstName).toBe('Updated First Name');

      // Create - test creation (API returns the data but doesn't persist)
      const newAuthor = TestDataGenerator.generateAuthor();
      const { data: createdAuthor } = await authorsService.createAuthor(newAuthor);
      expect(createdAuthor.id).toBe(newAuthor.id);

      // Note: We can't verify retrieval of created author because FakeRestAPI doesn't persist

      // Delete - test deletion
      const deleteResponse = await authorsService.deleteAuthor(existingAuthorId);
      expect([200, 204]).toContain(deleteResponse.status());
    });
  });
});
