export interface StatsSummary {
  totalPatients: number;
  totalDoctors: number;
  appointmentsByState: Record<string, number>;
  totalMoods: number;
}
