export type AlertKind = 'no_show' | 'stale_results' | 'doctor_overload';
export type AlertSeverity = 'error' | 'warning';

interface AlertBase {
  kind: AlertKind;
  severity: AlertSeverity;
  label: string;
  count: number;
}

interface NoShowAlert extends AlertBase {
  kind: 'no_show';
  severity: 'error';
  citaId: string;
}

interface StaleResultsAlert extends AlertBase {
  kind: 'stale_results';
  severity: 'warning';
  citaId: string;
}

interface DoctorOverloadAlert extends AlertBase {
  kind: 'doctor_overload';
  severity: 'warning';
  medicoId: string;
}

export type DashboardAlert =
  | NoShowAlert
  | StaleResultsAlert
  | DoctorOverloadAlert;
