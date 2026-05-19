export const appointmentKeys = {
  all: ['appointments'] as const,
  list: (userId: string) => [...appointmentKeys.all, 'list', userId] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
  cuidador: (pacienteId: string | null) =>
    [...appointmentKeys.all, 'cuidador', pacienteId] as const,
};

export const doctorKeys = {
  all: ['doctors'] as const,
  list: () => [...doctorKeys.all, 'list'] as const,
  detail: (id: string) => [...doctorKeys.all, 'detail', id] as const,
};

export const medicationKeys = {
  all: ['medications'] as const,
  list: () => [...medicationKeys.all, 'list'] as const,
  detail: (id: string) => [...medicationKeys.all, 'detail', id] as const,
};

export const sessionKeys = {
  all: ['session'] as const,
  current: () => [...sessionKeys.all, 'current'] as const,
};
export const statsKeys = {
  all: ['stats'] as const,
  summary: () => [...statsKeys.all, 'summary'] as const,
};

export const vinculacionKeys = {
  all: ['vinculacion'] as const,
  misPacientes: () => [...vinculacionKeys.all, 'mis-pacientes'] as const,
  misCuidadores: () => [...vinculacionKeys.all, 'mis-cuidadores'] as const,
};

export const resumeKeys = {
  all: ['resume'] as const,
  current: () => [...resumeKeys.all, 'current'] as const,
  summary: (pdfBuffer: ArrayBuffer, id: string) =>
    [...resumeKeys.all, 'summary', pdfBuffer, id] as const,
  paciente: () => [...resumeKeys.all, 'paciente'] as const,
};

export const patientKeys = {
  all: ['patients'] as const,
  detail: (id: string) => [...patientKeys.all, 'detail', id] as const,
};

export const auditKeys = {
  all: ['audit-logs'] as const,
  list: (q?: import('@repo/types').AuditLogQuery) =>
    [...auditKeys.all, 'list', q ?? {}] as const,
};
