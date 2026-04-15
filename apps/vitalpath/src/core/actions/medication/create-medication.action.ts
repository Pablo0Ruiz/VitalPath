import { AxiosResponse } from 'axios';
import { myApi } from '../../api/myApi';

export interface CreateMedicationResponse {
  message: string;
}

interface CreateMedicationPayload {
  name: string;
  description?: string;
}

const postCreateMedication = async (
  payload: CreateMedicationPayload,
): Promise<AxiosResponse<CreateMedicationResponse>> => {
  const response = await myApi.post<CreateMedicationResponse>(
    '/api/medications',
    payload,
  );
  return response;
};

export default postCreateMedication;
