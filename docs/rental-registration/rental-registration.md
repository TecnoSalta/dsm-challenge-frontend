Documentación Funcional – FRONTEND
Proceso: Rental Registration (UI Focus)
Objetivo
Facilitar al usuario el registro de un nuevo alquiler de vehículo a través de una interfaz intuitiva y eficiente, aprovechando la información ya seleccionada y minimizando la entrada manual de datos.

Alcance
Este documento se centra en la experiencia de usuario y la interacción en la interfaz para el proceso de registro de alquiler, desde la selección inicial en la vista "Home" hasta la confirmación final. No se modificará la estructura de datos ni las APIs del backend, ya que se asume que el backend ya está en su versión 0 (v0) con una estructura definida.

Requerimientos Funcionales – Frontend (UI/UX)
1. Home (Punto de Partida)
Funcionalidad Existente:
Vista para ingresar fechas de inicio y fin del alquiler.
Vista para seleccionar tipo y modelo de auto.
Visualización de autos disponibles según la selección de fechas y tipo/modelo.
Interacción para rental-registration:
Una vez seleccionado un auto y las fechas, debe existir una acción clara (ej. botón "Reservar" o "Continuar") que avance al formulario de Rental Registration.
Al avanzar, la información del auto seleccionado (tipo, modelo) y las fechas (inicio, fin) deben ser autocompletadas en el formulario de Rental Registration.
2. Rental Registration (Formulario de Registro)
Funcionalidad Existente (Formulario Base):
Un formulario donde el usuario puede ingresar:
Número de ID (DNI)
Nombre completo
Dirección
Tipo y modelo de auto (estos campos deben ser autocompletados desde la vista Home).
Fechas de inicio y fin del alquiler (estos campos deben ser autocompletados desde la vista Home).
Funcionalidad a Desarrollar / Mejorar (Autocompletado y Validación UI):
Autocompletado de Auto: Los campos de "Tipo de auto" y "Modelo de auto" deben mostrar automáticamente la selección realizada en la vista "Home". Estos campos deben ser de solo lectura o deshabilitados para edición directa en este paso, para asegurar la coherencia con la selección previa.
Autocompletado de Fechas: Los campos de "Fechas de inicio" y "Fechas de fin" deben mostrar automáticamente las fechas seleccionadas en la vista "Home". Similar al auto, estos campos deben ser de solo lectura o deshabilitados.
Autocompletado de Cliente (a desarrollar):
Al ingresar el DNI, el sistema debe intentar autocompletar el "Nombre completo" y la "Dirección" del cliente si este ya existe en el sistema (esto implicará una llamada al backend para verificar la existencia del cliente y obtener sus datos).
Si el cliente no existe, los campos "Nombre completo" y "Dirección" deben permanecer editables para que el usuario los ingrese manualmente.
Validaciones en UI:
Validación de formato para DNI, nombre completo y dirección.
Validación de campos obligatorios antes de permitir el envío.
Mensajes de error claros y amigables al usuario para cada validación fallida.
Acción de Envío: Un botón "Confirmar Alquiler" o similar para enviar el formulario.
3. Confirmación de Registro (FIN)
Funcionalidad Existente:
Al enviar el formulario exitosamente, se debe mostrar una confirmación del alquiler.
Esta confirmación debe incluir los detalles del auto reservado y, idealmente, un ID de reserva.
Interacción a Desarrollar / Mejorar:
Mensaje de éxito claro y visualmente destacado.
Posibilidad de volver a la "Home" o ver "Mis Alquileres" (si aplica).
Manejo de errores: Si el backend retorna un error (ej. auto no disponible, DNI inválido), la UI debe mostrar un mensaje de error apropiado y permitir al usuario corregir o reintentar.
Flujo de Proceso (UI End-to-End para rental-registration)
Usuario en "Home": Selecciona fechas y tipo/modelo de auto.
Selección de Auto: Elige un auto disponible.
Acción "Reservar": El usuario hace clic en el botón para iniciar el registro.
Navegación a "Rental Registration": La UI carga el formulario de registro.
Autocompletado Inicial: Los campos de auto (tipo, modelo) y fechas (inicio, fin) se autocompletan con la selección de "Home".
Ingreso de DNI: El usuario ingresa su DNI.
Verificación de Cliente (UI): La UI realiza una llamada al backend para verificar si el DNI existe.
Si existe: "Nombre completo" y "Dirección" se autocompletan.
Si no existe: "Nombre completo" y "Dirección" quedan editables para ingreso manual.
Revisión y Edición: El usuario revisa los datos y completa/edita si es necesario.
Validación UI: La UI valida los campos del formulario.
Envío del Formulario: El usuario hace clic en "Confirmar Alquiler".
Respuesta del Backend:
Éxito: La UI muestra la confirmación del alquiler con los detalles y el ID de reserva.
Error: La UI muestra un mensaje de error específico y permite al usuario corregir.