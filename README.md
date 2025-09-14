# Car Rental SPA

This project is a Single Page Application (SPA) for a car rental service, developed with Angular, following modern architecture and best practices.

## Project Description

Based on the proposed **Backend** develop a **SPA (Single Page Application)** using **Angular** in one of its latest versions, applying a modern, scalable and easy to maintain architecture. The project must include the use of **Angular Signals**, **Observables**, and a minimum functional UI/UX design Angular Material

### Features

**Home**

- View to input dates and car type/model.
- Display available cars within the selected date range.

**Rental Registration**

- A form where the user can:
  - Enter their **ID** **number** (DNI), **full name**, and **address**
  - Select car type and model
  - Select rental **start** and **end** **dates**
- Upon submission, display rental confirmation and reserved car details.

**Modification and Cancellation**

- View a list of existing rentals (no login simulation required)
- Ability to:
  - Modify dates or the reserved car
  - Cancel the reservation

**Statistics View**

- A component that displays:
  - The most rented car type
  - The utilization percentage based on a date range

**Scheduled Service**

- A dashboard-like view with:
  - List of cars with scheduled service in the next 2 weeks
  - Information: type, model, next service date

## Instructions for running the project

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.