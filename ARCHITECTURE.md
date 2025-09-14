# Architecture Documentation

This document outlines the software architecture of the Angular Car Rental application, which is based on the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**.

## 1. Overview

The architecture is designed to be scalable, maintainable, and testable by separating concerns into distinct layers. The core principle is the **Dependency Rule**: source code dependencies can only point inwards. Nothing in an inner layer can know anything at all about an outer layer.

This means:
- The **Domain** logic knows nothing about the database or the UI.
- The **Application** logic knows nothing about the UI.
- The UI (**Presentation**) is an external detail and depends on all inner layers.

## 2. Layer Breakdown

The project is structured into four main layers, each residing in its own directory within `src/app/`.

### 2.1. Domain Layer

- **Directory:** `src/app/domain/`
- **Purpose:** This is the core of the application. It contains the enterprise-wide business logic and rules.
- **Contents:**
    - **Models (`/models`):** TypeScript interfaces representing the business entities and value objects (e.g., `Car`, `Rental`, `Customer`).
    - **Repositories (`/repositories`):** Abstract classes or interfaces that define the contracts for data access (e.g., `CarRepository`). These interfaces are implemented by the Infrastructure layer.
- **Dependencies:** This layer has **zero** dependencies on any other layer in the application.

### 2.2. Application Layer

- **Directory:** `src/app/application/`
- **Purpose:** Contains the application-specific business logic. It orchestrates the domain objects to perform tasks required by the presentation layer.
- **Contents:**
    - **Use Cases (`/use-cases`):** Classes that encapsulate a single, specific task or user story (e.g., `GetAllCarsUseCase`). They are the entry points to the application's logic from the presentation layer.
- **Dependencies:** Depends only on the **Domain** layer (to use its models and repository interfaces).

### 2.3. Infrastructure Layer

- **Directory:** `src/app/infrastructure/`
- **Purpose:** This layer is where the details of external services and data sources are implemented.
- **Contents:**
    - **Repositories (`/repositories`):** Concrete implementations of the repository interfaces defined in the Domain layer (e.g., `InMemoryCarRepository`). This is where the logic to talk to a database, an external API, or a mock data source resides.
    - **Data (`/data`):** Contains mock data for development and testing (e.g., `mock-cars.ts`).
- **Dependencies:** Depends on the **Domain** layer (to implement its interfaces).

### 2.4. Presentation Layer

- **Directory:** `src/app/presentation/`
- **Purpose:** The UI layer of the application. It is responsible for displaying data and capturing user input.
- **Contents:**
    - **Components (`/pages`, `/shared`):** Angular components that make up the user interface. They are kept as "dumb" as possible.
- **Dependencies:** Depends on the **Application** layer (to invoke use cases).

## 3. Data Flow Example: Finding Available Cars

1.  **`HomeComponent` (Presentation):** The user navigates to the home page.
2.  The `HomeComponent` needs a list of cars. It injects and calls the `execute()` method of `GetAllCarsUseCase` (Application).
3.  **`GetAllCarsUseCase` (Application):** This use case needs to fetch the data. It calls the `getAll()` method on the `CarRepository` interface (Domain) that was injected into its constructor.
4.  **Dependency Injection:** Angular, using the providers configured in `main.ts`, injects the concrete `InMemoryCarRepository` (Infrastructure) where the `CarRepository` (Domain) is required.
5.  **`InMemoryCarRepository` (Infrastructure):** This class implements the `getAll()` method. It retrieves the array of cars from the `mock-cars.ts` file and returns it as an `Observable`.
6.  The `Observable` flows back through the **Use Case** to the **Component**.

## 4. State Management

- **Component State:** We prioritize **Angular Signals** for managing state within our components. This provides a reactive, fine-grained, and efficient way to handle UI updates.
- **Asynchronous Operations:** We use **RxJS Observables** for handling asynchronous operations, especially in the data access (Infrastructure) layer, as this is the standard for tools like Angular's `HttpClient`.
- **Bridge:** To connect the two worlds, we use the `toSignal` function from `@angular/core/rxjs-interop`. This allows us to convert a data stream (Observable) from the application/infrastructure layers into a reactive Signal for the presentation layer in a clean, declarative way, without manual subscriptions.
