export interface IPatientProfile {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  profile?: Record<string, unknown> | null;
}
