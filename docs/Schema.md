**_ CONSULTAR EL SCHEMA DE LA BASE DE DATOS _**
ES IMPORTANTE CONSULTARLO PRIMERO PARA COMPRENDER ESTE ARCHIVO YA QUE LOS DATOS PUESTOS EN ESTE ARCHIVO SON LOS QUE SE VEN A NIVEL DE APP Y WEB Y ADEMAS LOS QUE SE AÑADEN A MANO , LOS DEMAS DATOS COMO EXPOPUSH SON PERMISOS QUE YA APARECEN CUANDO ESTAN DENTRO DE LA APP , DE IGUAL MANERA CON EL RESTO DE LOS CAMPOS QUE NO SE VEN ACA PERO SI ESTAN EN LOS SCHEMA DE LA BASE DE DATOS.

**_Centro de salud_**
Datos que debe tener el centro de salud como entidad :

- Nombre del centro
- Dirección
- Tipo de entidad(puede ser hospital, farmacia,clinica,etc)
- Lista de sus medicos que tiene trabajando
- Lista de sus trabajadores administrativos que tiene trabajando
- Codigo de vinculacion con el cual se van a unir sus medicos,trabajadores en la web.

**_ IMPORTANTE PARA TENER EN CUENTA _**
Las listas de trabajadores y medicos son diferentes , no se coloca medicos en la lista de trabajadores administrativos , al igual que no se pone trabajador administrativo (trabajador centro) dentro de la lista de medicos

**_OBSERVACION IMPORTANTE PARA TENER EN CUENTA EN LA APP _**
Los usuarios se puede registrar y logear con normalidad en la app pero en un apartado debe haber un lugar donde el ususario pueda añadir el codigo de vinculacion de un centro de salud(LO MAS PROBABLE ES QUE SE PUEDA VER O EN CONFIG O DENTRO DEL MENU DE HAMBURGUESA QUE TIENE LA PANTALLA HOME DE LA APP) , de tal manera que se pueda unir a un centro de salud.

**_ FIN DE LA OBSERVACION _**

**_USUARIO BASE _**
Datos que debe tener el usuario :

- name
- lastName
- email
- password
- fechaNacimiento
- genero
- telefono

**_MEDICO DE UN CENTRO DE SALUD_**
Datos que debe tener el medico de un centro de salud que hereda los campos del usuario base :

- Especialidad
- Citas agendadas con el
- Slots disponible para trabajar

**_PACIENTE_**
Datos que debe tener el paciente que hereda los campos del usuario base :

- Medicamentos que tiene
- Citas agendadas con los medicos del centro de salud al que pertenece
- Notas del medico
- Estudios recientes
- Estudios que le han realizado

**_ TRABAJADOR ADMINISTRATIVO DE UN CENTRO DE SALUD_**
Datos que debe tener el trabajador administrativo de un centro de salud que hereda los campos del usuario base :
SOLO TIENE LOS CAMPOS BASE DEL USUARIO BASE.

**_FIN DE LA DESCRIPCION DE LOS ESQUEMAS _**

**_RELACIONES IMPORTANTES _**

- Un medico tiene muchos estudios que le han realizado a los pacientes
- Un paciente tiene muchas citas con los medicos del centro de salud al que pertenece
- Un paciente tiene muchos estudios que le han realizado
- Un paciente tiene muchos examenes que le han realizado (Lista)
- Un paciente tiene muchas notas del medico

**_ FIN DE LA RELACION IMPORTANTE _**

---

**_ Schemas que tiene relaciones con varias entidades _**

**_ Resultados Estudios _**
Datos que debe tener este schema :

- CitaID
- MedicoID
- PacienteID
- Archivo PDF (File Uplo)
  -resumen IA - es bajo demanda del usuario , no se genera de forma automatica

**_ Moods _**

- Fecha
- userId
- mood - este campo hace referencia en la app sobre el icono al que se presiono

**_ Relacion moods con varias entidades _**

- Los moods tienen relacion con el paciente

**_ Medicamentos _**

- name
- description

**_ Relacion de medicamentos con varias entidades _**

- Los medicamentos tienen relacion con el paciente

**_ Notas _** (NO ESTA CREADO PERO ESTA PENDIENTE A EVALUACION DEPENDIENDO DEL CRECIMIENTO DE LA APP Y LA WEB)

- fecha
- texto
- MedicoID
- PacienteID

**_ Relacion de notas con varias entidades _**

- Las notas tienen relacion con el paciente
- Las notas tienen relacion con el medico

**_ Cnversacion _**

- chatId
- userId
- title
- lastMessage
- messages
- expireAt

**_ Relacion de conversacion con varias entidades _**

- Las conversaciones tienen relacion con el paciente

**_ AuditLog _**

- action
- userId
- resourceId
- ipAddress
- details

**_IMPORTANTE _** ESTE ESQUEMA ES SOLO PARA VER LA INFORMACION EN LA BASE DE DATOS , NO PARA VER EN LA APP NI EN LA WEB ,SE CENTRA MAS EN LAS ACCIONES DE LOS MEDICOS Y ADMINISTRATIVOS SOBRE LOS ESTUDIOS DE LOS PACIENTES.

**_ Citas _**

- fecha
- hora
- paciente_ID
- medico_ID
- centroSalud_ID
- estado
- reminderSentAt

**_ Relacion de Citas con varias entidades _**

- Las citas tienen relacion con el paciente
- Las citas tienen relacion con el medico
- Las citas tienen relacion con el centro de salud

**_ FIN DE LA DESCRIPCION DE LOS ESQUEMAS _**
