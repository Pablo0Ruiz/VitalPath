export interface Medication {
  _id: string;
  name: string;
  description?: string;
}

export interface CreateMedicationPayload {
  name: string;
  description?: string;
  time?: string;
}

export interface UpdateMedicationPayload extends Partial<CreateMedicationPayload> {
  isDone?: boolean;
}
