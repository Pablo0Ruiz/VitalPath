**_Cuidador/Familiar_**

### Objetivo

El objetivo de este rol en la app es poder complementar al paciente mayor (fundamentalmente) o incluso para cualquier paciente , para que pueda estar pendiente sobre los resultados o las citas, este rol recibe las notificaciones de aviso de cuando el paciente vinculado con este rol agende una cita o sus estudios esten listos.

### Que no puede hacer

Este rol no puede ver estudios medicos , ni interferir con las citas que se agendan.

### Importante

Ante que nada se debe cumplir las leyes de privacidad y seguridad de los datos.

#### Observaciones

Supervisión de Medicamentos (El gran ausente)
En el flujo del usuario diste un peso enorme a la gestión de medicamentos (alertas, fotos de recetas transcritas por IA, periodicidad).

Si el objetivo del cuidador es estar pendiente del adulto mayor, es indispensable que reciba notificaciones de incumplimiento. Si el paciente no marca su medicamento como "completado" tras una ventana de tiempo (por ejemplo, 30 o 60 minutos), el cuidador debería recibir una alerta para poder llamarlo o asistirle.

Definición del Flujo de Vinculación (Seguridad y Privacidad)
Mencionas que se deben cumplir las leyes de privacidad, pero no estableces cómo se crea el vínculo entre ambos usuarios.

El backend necesitará un flujo seguro: el paciente mayor debería generar un código de vinculación temporal de 6 dígitos o un código QR desde su app (Modo Senior o Normal), y el familiar deberá ingresarlo en su propia app para activar el enlace, asegurando el consentimiento explícito del paciente.

Vista de Detalles de Citas (Modo Lectura)
El documento dice que el cuidador "recibe las notificaciones de aviso de cuando el paciente agende una cita" y que "no puede interferir con las citas".

Sin embargo, para cumplir el objetivo de "acompañar y guiar fuera de la app al paciente", el cuidador necesita ver los detalles de la cita (dirección del hospital/clínica, nombre del doctor, fecha y hora). Le falta especificar que tendrá una pantalla de Calendario en modo lectura.

2. Lo que le puedes añadir (Features de alto valor)
   Soporte Multi-Paciente
   En la realidad, un hijo o cuidador suele estar a cargo de más de una persona (por ejemplo, su padre y su madre).

Añade la posibilidad de que el rol de cuidador sea multi-paciente, permitiéndole alternar entre perfiles vinculados desde un menú desplegable para revisar el estado de las citas o alertas de cada uno por separado.

Alertas de Inactividad o Estado de Ánimo
Dado que el usuario tiene un carrusel de estado de ánimo en su Home, el cuidador podría recibir una actualización o un aviso discreto si el paciente registra un estado de ánimo bajo de manera consecutiva, permitiendo una intervención familiar afectiva.

Interacción con la IA enfocada en el Cuidador
El doctor tiene su IA y el paciente la suya. El cuidador podría beneficiarse enormemente de un chat con el asistente de VitalPath, restringido estrictamente a la gestión de su familiar.

Ejemplo de uso: El familiar podría preguntar por voz o texto: "¿A qué hora tiene mi papá la cita mañana?" o "¿Ya se tomó la medicación de la tarde?", y la IA consultaría el estado en la base de datos para responderle de inmediato, agilizando el control sin que el familiar tenga que buscar manualmente en las pantallas.

Una app que solo le avisa al adulto mayor cuándo tomar su pastilla es un calendario pasivo; si el paciente tiene un olvido o pérdida de autonomía, la alerta se pierde. Al involucrar activamente al cuidador cuando el tratamiento se incumple, la plataforma se convierte en una herramienta preventiva en tiempo real. Pasa de ser un "asistente de registro" a un "salvavidas familiar".

### Schema

**_cuidador/familiar_**
Hereda los campos del usuario base

**_VinculacionPacienteCuidador_**

- cuidador_id (CuidadorFamiliar.id): Vincula al cuidador.
- paciente_id (UsuarioPaciente.id): Vincula al paciente mayor.
- tipo_vinculo (String / Enum): Define la relación (Ej: "Hijo/a", "Esposo/a", "Cuidador contratado").
- codigo_vinculacion (String, Nullable): El código temporal de 6 dígitos que el paciente genera en su app para que el familiar lo introduzca. Una vez usado, se limpia o expira.
- estado_vinculo (Enum: 'PENDIENTE', 'ACTIVO', 'REVOCADO'):
  PENDIENTE: El familiar solicitó la unión pero el paciente no la ha confirmado (o viceversa).
  ACTIVO: El enlace está aprobado. El familiar ya puede recibir notificaciones.
  REVOCADO: El paciente decidió quitar el acceso al familiar, cortando el flujo de datos de inmediato por privacidad.

antes de seguir con los siguentes sprint , evalua '/Users/kenyiruiz/Desktop/Capstone/VitalPathAI/docs/Schema.md' con el backend para corrovorar que se cumple
y que no y que esta en el backend que no este en el documento , si las relaciones se estan haciendo bien y se estan respetando , ya que vamos a incluir un
nuevo rol como este
