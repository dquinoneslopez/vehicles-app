# Vehicles App

## Overview

The Vehicles App is a single-page application built with Angular 19, utilizing Angular Material for UI components, NgRx for state management, and Angular Router for navigation. This application allows users to view and manage a list of vehicles.

## Features

- **Home Page**: A landing page that introduces the application.
- **Vehicle List**: Displays a list of vehicles with options to add, edit, or remove vehicles.
- **State Management**: Utilizes NgRx for managing the application state efficiently.
- **Responsive Design**: Built with Angular Material to ensure a responsive and user-friendly interface.

## Project Structure

```
vehicles-app
├── src
│   ├── app
│   │   ├── components
│   │   │   └── vehicle-list
│   │   ├── pages
│   │   │   ├── home
│   │   │   └── vehicles
│   │   ├── store
│   │   ├── services
│   │   ├── models
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app.routes.ts
│   ├── tests
│   │   └── pages
│   │       └── home
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
