export type MedicationFrequency = 4 | 6 | 8 | 12 | 24;

export interface Medication {
  _id: string;
  name: string;
  description?: string;
  startTime?: string;
  frequencyHours: number;
  durationDays?: number;
  dosesTaken: number;
  notificationIds: string[];
}

export interface CreateMedicationPayload {
  name: string;
  description?: string;
  startTime?: string;
  frequencyHours?: MedicationFrequency;
  durationDays?: number;
  notificationIds?: string[];
}

export interface UpdateMedicationPayload extends Partial<CreateMedicationPayload> {
  id: string;
}

export interface TakeMedicationResponse {
  medication?: Medication;
  completed: boolean;
}
