# Use Cases Documentation

This directory (`src/app/application/use-cases/`) contains the application-specific business logic, encapsulated as "Use Cases". In the context of Clean Architecture and Domain-Driven Design (DDD), Use Cases are the entry points to the application's core functionality from the presentation layer. Each Use Case represents a single, specific task or user story.

## Workflow and Dataflow

Below are details on the workflow and dataflow for key Use Cases implemented in this application.

### 1. Get Car Metadata (`GetCarMetadataUseCase`)

- **Purpose:** Retrieves metadata about available car types and their models.
- **Workflow:**
    1.  `HomeComponent` (Presentation) injects and calls `GetCarMetadataUseCase.execute()`.
    2.  `GetCarMetadataUseCase` calls `getCarMetadata()` on `CarRepository` (Domain).
    3.  The concrete implementation (`InMemoryCarRepository` or `CarApiService` in Infrastructure) fetches the car data.
    4.  The data (as `CarMetadata[]`) flows back through the Use Case to the `HomeComponent`.
- **Dataflow:**
    -   **Input:** None.
    -   **Output:** `Observable<CarMetadata[]>`
        ```typescript
        export interface CarMetadata {
          type: string; // e.g., "Sedan", "SUV"
          models: string[]; // e.g., ["Gol", "Polo"]
        }
        ```

### 2. Get Available Cars (`GetAvailableCarsUseCase`)

- **Purpose:** Filters and retrieves cars available for rent based on specified criteria (dates, car type, model).
- **Workflow:**
    1.  `HomeComponent` (Presentation) injects and calls `GetAvailableCarsUseCase.execute(request)` with search criteria.
    2.  `GetAvailableCarsUseCase` calls `getAvailableCars(request)` on `CarRepository` (Domain).
    3.  The concrete implementation (Infrastructure) fetches and filters the car data based on availability.
    4.  The data (as `AvailableCar[]`) flows back through the Use Case to the `HomeComponent`.
- **Dataflow:**
    -   **Input:** `AvailabilityRequest`
        ```typescript
        export interface AvailabilityRequest {
          startDate: string;
          endDate: string;
          carType?: string;
          model?: string;
        }
        ```
    -   **Output:** `Observable<AvailableCar[]>`
        ```typescript
        export interface AvailableCar {
          id: string;
          type: string;
          model: string;
          dailyRate: number;
        }
        ```

### 3. Get Customer by DNI (`GetCustomerByDniUseCase`)

- **Purpose:** Retrieves customer details based on their DNI (ID).
- **Workflow:**
    1.  `RentalRegistrationFormComponent` (Presentation) injects and calls `GetCustomerByDniUseCase.execute(dni)`.
    2.  `GetCustomerByDniUseCase` calls `getByDni(dni)` on `CustomerRepository` (Domain).
    3.  The concrete implementation (`CustomerApiService` in Infrastructure) fetches customer data from the API.
    4.  The data (as `Customer | undefined`) flows back through the Use Case to the `RentalRegistrationFormComponent`.
- **Dataflow:**
    -   **Input:** `dni: string`
    -   **Output:** `Observable<Customer | undefined>`
        ```typescript
        export interface Customer {
          ID: string;
          fullName: string;
          address: string;
        }
        ```

### 4. Create Rental (`CreateRentalUseCase`)

- **Purpose:** Creates a new car rental record.
- **Workflow:**
    1.  `RentalRegistrationFormComponent` (Presentation) injects and calls `CreateRentalUseCase.execute(rental)` with the new rental details.
    2.  `CreateRentalUseCase` calls `create(rental)` on `RentalRepository` (Domain).
    3.  The concrete implementation (`RentalApiRepository` or `InMemoryRentalRepository` in Infrastructure) sends the rental data to the API or stores it in memory.
    4.  The created `Rental` object (including its generated ID) flows back through the Use Case to the `RentalRegistrationFormComponent`.
- **Dataflow:**
    -   **Input:** `Rental`
        ```typescript
        export interface Rental {
          id?: string;
          customer: Customer;
          startDate: Date;
          endDate: Date;
          car: Car;
        }
        ```
    -   **Output:** `Observable<Rental>`

### 5. Get All Cars (`GetAllCarsUseCase`)

- **Purpose:** Retrieves a list of all available cars.
- **Workflow:**
    1.  `RentalRegistrationFormComponent` (Presentation) injects and calls `GetAllCarsUseCase.execute()`.
    2.  `GetAllCarsUseCase` calls `getAll()` on `CarRepository` (Domain).
    3.  The concrete implementation (Infrastructure) fetches the car data.
    4.  The data (as `Car[]`) flows back through the Use Case to the `RentalRegistrationFormComponent`.
- **Dataflow:**
    -   **Input:** None.
    -   **Output:** `Observable<Car[]>`
        ```typescript
        export interface Car {
          id: string;
          make: string; // e.g., "VW", "Renault"
          model: string;
          dailyRate: number;
          services: Service[];
        }
        ```
