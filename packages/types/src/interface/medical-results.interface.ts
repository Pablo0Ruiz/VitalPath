export interface IMedicalResults {
  _id: string;
  cita_ID?: {
    _id: string;
    fecha: string;
    hora: string;
    estado: string;
  };
  medico_ID: {
    _id: string;
    name: string;
    lastName: string;
  };
  paciente_ID: {
    _id: string;
    name: string;
    lastName: string;
  };
  fileUrl: string;
  resumenIA?: string;
  resumenMedico?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMedicalResultsResponse {
  message: string;
  data: IMedicalResults[];
}

export interface IMedicalResultsRequest {
  cita_ID: string;
  medico_ID: string;
  paciente_ID: string;
  fileUrl: string;
  resumenIA?: string;
  resumenMedico?: string;
}
