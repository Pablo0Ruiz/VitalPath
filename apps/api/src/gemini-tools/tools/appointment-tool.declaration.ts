import { FunctionDeclaration, Type } from '@google/genai';

/**
 * Tool to create a new appointment.
 * Required: All fields in CreateAppointmentDto (medico_ID, centroSalud_ID, fechaHora)
 */
export const createAppointmentToolDeclaration: FunctionDeclaration = {
  name: 'createAppointment',
  description:
    'Agenda una nueva cita médica. El paciente es el usuario autenticado.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      medico_ID: {
        type: Type.STRING,
        description: 'ID del médico solicitado.',
      },
      centroSalud_ID: {
        type: Type.STRING,
        description: 'ID del centro de salud.',
      },
      fechaHora: {
        type: Type.STRING,
        description: 'Fecha y hora en formato ISO (ej: 2026-05-10T14:30:00Z).',
      },
    },
    required: ['medico_ID', 'centroSalud_ID', 'fechaHora'],
  },
};

/**
 * Tool to list all appointments of the authenticated patient.
 * Required: None.
 */
export const getAppointmentsToolDeclaration: FunctionDeclaration = {
  name: 'getAppointments',
  description: 'Lista todas las citas del paciente actual.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

/**
 * Tool to get a specific appointment details.
 * Required: citaId
 */
export const getAppointmentByIdToolDeclaration: FunctionDeclaration = {
  name: 'getAppointmentById',
  description: 'Obtiene los detalles de una cita específica por su ID.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      citaId: {
        type: Type.STRING,
        description: 'El ID único de la cita.',
      },
    },
    required: ['citaId'],
  },
};

/**
 * Tool to update an existing appointment.
 * Required: citaId (to identify which one)
 */
export const updateAppointmentToolDeclaration: FunctionDeclaration = {
  name: 'updateAppointment',
  description: 'Actualiza los datos de una cita existente.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      citaId: {
        type: Type.STRING,
        description: 'ID de la cita a modificar.',
      },
      medico_ID: {
        type: Type.STRING,
        description: 'Nuevo ID del médico (opcional).',
      },
      centroSalud_ID: {
        type: Type.STRING,
        description: 'Nuevo ID del centro de salud (opcional).',
      },
      fechaHora: {
        type: Type.STRING,
        description: 'Nueva fecha/hora (opcional).',
      },
      estado: {
        type: Type.STRING,
        description: 'Nuevo estado de la cita (opcional).',
      },
    },
    required: ['citaId'],
  },
};

/**
 * Tool to cancel an appointment.
 * Required: citaId
 */
export const cancelAppointmentToolDeclaration: FunctionDeclaration = {
  name: 'cancelAppointment',
  description: 'Cancela una cita médica específica.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      citaId: {
        type: Type.STRING,
        description: 'ID de la cita a cancelar.',
      },
    },
    required: ['citaId'],
  },
};

/**
 * Tool to list all available medical centers (centros de salud).
 * Required: None.
 */
export const getCentrosSaludToolDeclaration: FunctionDeclaration = {
  name: 'getCentrosSalud',
  description:
    'Lista todos los centros de salud disponibles para agendar una cita.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};

export const appointmentTools = [
  createAppointmentToolDeclaration,
  getAppointmentsToolDeclaration,
  getAppointmentByIdToolDeclaration,
  updateAppointmentToolDeclaration,
  cancelAppointmentToolDeclaration,
  getCentrosSaludToolDeclaration,
];
