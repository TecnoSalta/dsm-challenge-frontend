Estructura de módulos y componentes
Sugerencia de estructura siguiendo clean architecture:

src/app/
 └── features/
      ├── home/
      │    ├── home.component.ts
      │    └── home.component.html
      ├── rental-registration/
      │    ├── rental-registration.component.ts
      │    └── rental-registration.component.html
      ├── confirmation/
      │    ├── confirmation.component.ts
      │    └── confirmation.component.html
 └── core/
      ├── models/
      │    ├── rental.model.ts
      │    ├── car.model.ts
      │    └── customer.model.ts
      ├── services/
      │    ├── rental.service.ts
      │    ├── car.service.ts
      │    └── customer.service.ts
🖼️ Flujo en la UI
HomeComponent
Reactive Form para ingresar fechas + tipo/modelo de auto.
Botón “Ver disponibles” → llama a CarService.getAvailableCars().
Lista de resultados → el usuario selecciona auto → navigate(['/rental-registration'], { state: { car, dates } }).
RentalRegistrationComponent
Inicialización: recibe car + fechas desde el state.
Autocompleta esos campos en el formulario (readonly).
Formulario reactivo:
ts
Copy
rentalForm = this.fb.group({
  dni: ['', [Validators.required]],
  fullName: [{value: '', disabled: true}],
  address: [{value: '', disabled: true}],
  car: [{value: this.selectedCar, disabled: true}],
  startDate: [{value: this.selectedDates.start, disabled: true}],
  endDate: [{value: this.selectedDates.end, disabled: true}]
});
Evento onBlur / onChange del campo DNI → CustomerService.getCustomerByDni(dni)
Si existe → autocompletar fullName + address → setValue en el form.
Si no existe → habilitar campos fullName y address para carga manual.
Botón Confirmar Alquiler →
Llama a RentalService.registerRental(rentalForm.value) → recibe respuesta.
ConfirmationComponent
Muestra mensaje “Alquiler exitoso” con:
ID reserva
Datos del auto
Fechas reservadas
⚙️ Servicios Necesarios
CarService
ts
Copy
getAvailableCars(params: { startDate: string, endDate: string, type: string }): Observable<Car[]> 
CustomerService
ts
Copy
getCustomerByDni(dni: string): Observable<Customer | null>
RentalService
ts
Copy
registerRental(payload: RentalRegistration): Observable<RentalConfirmation>
💡 Ejemplo rápido de autocompletado DNI (UI logic)
ts
Copy
onDniBlur() {
  const dni = this.rentalForm.get('dni')?.value;
  if (!dni) return;

  this.customerService.getCustomerByDni(dni).subscribe({
    next: (customer) => {
      if (customer) {
        this.rentalForm.patchValue({
          fullName: customer.fullName,
          address: customer.address
        });
        this.rentalForm.get('fullName')?.disable();
        this.rentalForm.get('address')?.disable();
      } else {
        this.rentalForm.get('fullName')?.enable();
        this.rentalForm.get('address')?.enable();
        this.rentalForm.patchValue({ fullName: '', address: '' });
      }
    }
  });
}
🎨 Angular Material UI
Home: mat-form-field, mat-datepicker, mat-select.
Rental Registration: mat-form-field, validaciones con mat-error.
Confirmación: mat-card con resumen de datos.
👉 Lo clave es que tenemos ya:

Autofill desde Home (car+fechas readonly en form).
Autofill de cliente por DNI (UI decide habilitar/deshabilitar).
Flujo cerrado hasta confirmación.
Sin cambios en estructuras de datos del backend (se consumen como están).