# Vehicles App

## Overview

The Vehicles App is a single-page application built with Angular 19, utilizing Angular Material for UI components, NgRx for state management, and Angular Router for navigation. This application provides comprehensive vehicle information using the NHTSA Vehicle API.

## Project Structure

```
vehicles-app
├── src
│   ├── app
│   │   ├── components           # Reusable UI components
│   │   │   ├── vehicle-list     # Main vehicle list display
│   │   │   ├── vehicle-types-card   # Vehicle types display card
│   │   │   └── vehicle-models-card  # Vehicle models with virtual scroll
│   │   ├── pages               # Page components
│   │   │   ├── home            # Home page with search
│   │   │   └── make            # Brand detail page (renamed from brand)
│   │   ├── models              # TypeScript interfaces
│   │   │   ├── make.model.ts
│   │   │   ├── vehicle-type.model.ts
│   │   │   └── vehicle-model.model.ts
│   │   ├── services            # API and business logic
│   │   │   └── vehicle.service.ts
│   │   ├── store               # NgRx state management
│   │   │   ├── actions         # NgRx actions
│   │   │   ├── effects         # Side effects handling
│   │   │   ├── reducers        # State reducers
│   │   │   ├── selectors       # State selectors
│   │   │   └── state           # State interfaces
│   │   └── app.routes.ts        # Application routing
│   ├── tests
│   │   ├── pages
|   |   |   ├── home
|   |   |   └── make
│   │   └── components
|   |       ├── vehicle-models-card
|   |       └── vehicle-types-card
│   ├── assets
│   ├── styles.scss
│   ├── main.ts
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## Getting Started

1. **Clone the repository**:

   ```
   git clone <repository-url>
   cd vehicles-app
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Run the application**:

   ```
   ng serve
   ```

4. **Open your browser** and navigate to `http://localhost:4200`.

## Testing

The application includes comprehensive unit and integration tests using Jasmine and Karma.

### Running Tests

1. **Run all tests**:

   ```
   npm test
   ```

2. **Run tests with code coverage**:

   ```
   ng test --code-coverage
   ```

3. **Run tests in watch mode** (default):

   ```
   ng test --watch
   ```

4. **Run tests once and exit**:
   ```
   ng test --watch=false
   ```

### Test Structure

Tests are organized in the [`src/tests`](src/tests) directory:

- **Unit Tests**: Test individual component functionality and behavior
- **Integration Tests**: Test component interactions with NgRx store and other services

Example test files:

- [`src/tests/pages/home/home.component.spec.ts`](src/tests/pages/home/home.component.spec.ts) - Unit tests for HomeComponent
- [`src/tests/pages/home/home.component.integration.spec.ts`](src/tests/pages/home/home.component.integration.spec.ts) - Integration tests for HomeComponent

### Test Coverage

After running tests with coverage, you can view the coverage report at `coverage/index.html` in your browser.

## Technologies Used

- Angular 19
- Angular Material
- NgRx
- TypeScript
- SCSS
- Jasmine & Karma (Testing)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
