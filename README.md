# Bookstore API Automation Testing

A comprehensive API automation testing framework for the FakeRestAPI bookstore demo application, built with TypeScript and Playwright.

## 🎯 Overview

This project provides automated testing for the RESTful API endpoints of an online bookstore, covering both happy path scenarios and edge cases. It demonstrates best practices in API test automation, including clean code architecture, maintainable test structure, and CI/CD integration.

## 📋 Features

- **TypeScript-based**: Type-safe test implementation
- **Playwright Test Framework**: Robust API testing capabilities
- **Comprehensive Test Coverage**: Happy paths and edge cases for Books and Authors APIs
- **Clean Architecture**: Separation of concerns with services, models, and utilities
- **Code Quality Tools**: ESLint and Prettier for consistent code style
- **Test Reporting**: Playwright HTML reports and Allure reports for comprehensive test analysis
- **CI/CD Integration**: GitHub Actions workflow for continuous testing

## 🏗️ Project Structure

```
books/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── src/
│   ├── models/                    # TypeScript interfaces
│   │   ├── book.ts               # Book data models
│   │   └── author.ts             # Author data models
│   ├── services/                  # API service classes
│   │   ├── books-service.ts      # Books API operations
│   │   └── authors-service.ts    # Authors API operations
│   └── utils/                     # Utility classes
│       ├── api-client.ts         # Base HTTP client
│       └── test-data.ts          # Test data generators
├── tests/                         # Test specifications
│   ├── books-api.spec.ts         # Books API test cases
│   └── authors-api.spec.ts        # Authors API test cases
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .gitignore                    # Git ignore rules
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd books
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **(Optional) Install Java for Allure reports** (if you want to use Allure reporting locally):
   ```bash
   # macOS with Homebrew:
   brew install openjdk@17
   
   # Or download from: https://www.java.com
   ```
   
   **Note:** Java is only required if you want to generate Allure reports locally. Playwright HTML reports work without Java. CI/CD automatically has Java configured.

## 🧪 Running Tests

### Run all tests

```bash
npm test
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Run specific test file

```bash
npx playwright test tests/books-api.spec.ts
```

### Run tests matching a pattern

```bash
npx playwright test --grep "GET.*Books"
```

### Run only Happy Path tests

```bash
# Using npm script (recommended):
npm run test:happy

# Or using Playwright directly:
npx playwright test --grep "(Happy Path)"
```

### Run only Edge Case tests

```bash
# Using npm script (recommended):
npm run test:edge

# Or using Playwright directly:
npx playwright test --grep "(Edge Case)"
```

## 📊 Test Reports

This project generates **two types of test reports** - choose the one that best fits your needs:

### 1. Playwright HTML Report (Default)

The **Playwright HTML report** is automatically generated after running tests. It's lightweight, fast, and doesn't require any additional setup.

**View the Playwright report:**
```bash
npm run test:report
```

**Features:**
- ✅ No additional dependencies required
- ✅ Opens immediately after tests
- ✅ Shows test execution summary
- ✅ Pass/fail status for each test
- ✅ Execution time and error details
- ✅ Request/response details

**Location:** `playwright-report/index.html`

### 2. Allure Report (Advanced)

The **Allure report** provides a more detailed, interactive view with enhanced visualizations, historical trends, and better organization. It requires Java to generate the HTML report from test results.

**Prerequisites for Allure (Local Development):**
- Java 8 or higher (Java 17 recommended)
- Install Java: `brew install openjdk@17` (macOS) or download from [java.com](https://www.java.com)

**Generate and view Allure report:**
```bash
# Run tests first (generates allure-results/)
npm test

# Generate and open Allure report
npm run allure:view

# Or use individual commands:
npm run allure:generate  # Generate HTML report
npm run allure:open      # Open in browser

# Or serve directly (generates on-the-fly):
npm run allure:serve
```

**Features:**
- 📊 Interactive dashboards and charts
- 📈 Historical test execution trends
- 🔍 Detailed step-by-step execution logs
- 📎 Attachments and screenshots
- 🏷️ Test categorization and grouping
- 📉 Better visualization of test results over time

**Locations:**
- **Test results:** `allure-results/` (raw data - auto-generated)
- **HTML report:** `allure-report/index.html` (generated from results)

### Which Report to Use?

- **For quick local testing:** Use Playwright HTML report (`npm run test:report`) - no setup required
- **For detailed analysis:** Use Allure report (`npm run allure:view`) - requires Java, but provides richer insights
- **For CI/CD:** Both reports are automatically generated and uploaded as artifacts in GitHub Actions

### CI/CD Reports

In GitHub Actions, both reports are automatically generated and uploaded:
- **Playwright report:** Download the `playwright-report` artifact
- **Allure report:** Download the `allure-report` artifact (includes `index.html`)
- **Allure results:** Download the `allure-results` artifact if you want to generate the report locally

**Note:** In CI, Java is automatically set up, so Allure reports are always generated.

## 📝 Code Quality

### Linting

```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
```

### Formatting

```bash
npm run format        # Format all files
npm run format:check  # Check formatting without making changes
```

### Type Checking

```bash
npm run type-check    # Verify TypeScript types
```

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

1. Runs on push and pull requests to main/master/develop branches
2. Installs dependencies
3. Runs linting and formatting checks
4. Performs type checking
5. Executes all API tests
6. Generates and uploads test reports as artifacts

The workflow runs automatically on every push and pull request, ensuring code quality and test coverage.

## 📚 API Endpoints Tested

### Books API

- `GET /api/v1/Books` - Retrieve all books
- `GET /api/v1/Books/{id}` - Retrieve a specific book
- `POST /api/v1/Books` - Create a new book
- `PUT /api/v1/Books/{id}` - Update an existing book
- `DELETE /api/v1/Books/{id}` - Delete a book

### Authors API (Bonus)

- `GET /api/v1/Authors` - Retrieve all authors
- `GET /api/v1/Authors/{id}` - Retrieve a specific author
- `POST /api/v1/Authors` - Create a new author
- `PUT /api/v1/Authors/{id}` - Update an existing author
- `DELETE /api/v1/Authors/{id}` - Delete an author

## 🧪 Test Coverage

### Happy Path Scenarios

- Successful retrieval of all resources
- Successful retrieval by ID
- Successful creation of resources
- Successful update of resources
- Successful deletion of resources
- Full CRUD integration tests

### Edge Cases

- Non-existent resource IDs
- Invalid ID formats (negative, very large numbers)
- Missing required fields
- Invalid data types
- Duplicate resource IDs
- Very long string inputs
- ID mismatches in update operations
- Empty/whitespace-only fields

## 🏛️ Architecture

### Design Principles

- **Separation of Concerns**: Models, services, and utilities are separated
- **DRY (Don't Repeat Yourself)**: Reusable API client and service classes
- **SOLID Principles**: Single responsibility, open/closed, dependency inversion
- **Type Safety**: Full TypeScript typing for compile-time error detection

### Key Components

1. **ApiClient**: Base HTTP client for making API requests
2. **BooksService**: Encapsulates all Books API operations
3. **AuthorsService**: Encapsulates all Authors API operations
4. **TestDataGenerator**: Utility for generating test data
5. **Models**: TypeScript interfaces for type safety

## 🔧 Configuration

### Playwright Configuration

The `playwright.config.ts` file contains:

- Test directory configuration
- Base URL for API requests
- Reporter settings (HTML, list, JSON, Allure)
- Retry and parallel execution settings

### ESLint Configuration

The `.eslintrc.json` file enforces:

- TypeScript best practices
- Prettier integration
- Code style consistency

### Prettier Configuration

The `.prettierrc` file defines:

- Code formatting rules
- Indentation and spacing
- Quote styles

## 📦 Dependencies

### Production Dependencies

- None (this is a test-only project)

### Development Dependencies

- `@playwright/test`: Test framework
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions
- `eslint`: Linting tool
- `prettier`: Code formatter
- `@typescript-eslint/*`: TypeScript ESLint plugins
- `allure-playwright`: Allure reporter for Playwright
- `allure-commandline`: Allure command-line tool for report generation

## 🐛 Troubleshooting

### Tests fail with network errors

- Ensure the API is accessible: `https://fakerestapi.azurewebsites.net`
- Check your internet connection
- Verify firewall settings

### Installation issues

- Ensure Node.js version 18+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### TypeScript errors

- Run `npm run type-check` to see detailed errors
- Ensure all dependencies are installed: `npm install`


## 📄 License

MIT License - feel free to use this project for learning and assessment purposes.

## 👤 Author

Marko Vukobrat

## 📞 Support

For issues or questions, please open an issue in the repository or contact the me.

---

**Note**: This project uses the FakeRestAPI demo service (https://fakerestapi.azurewebsites.net) which may have limitations or changes. Some edge case tests may behave differently based on the API's actual implementation.
