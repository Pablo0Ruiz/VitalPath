export const appointmentKeys = {
  all: ['appointments'] as const,
  list: (userId: string) => [...appointmentKeys.all, 'list', userId] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
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

export const resumeKeys = {
  all: ['resume'] as const,
  current: () => [...resumeKeys.all, 'current'] as const,
  summary: (pdfBuffer: ArrayBuffer, id: string) =>
    [...resumeKeys.all, 'summary', pdfBuffer, id] as const,
  paciente: () => [...resumeKeys.all, 'paciente'] as const,
};
