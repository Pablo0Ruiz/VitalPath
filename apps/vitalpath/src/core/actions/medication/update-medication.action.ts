import { myApi } from '../../api/myApi';
import { UpdateMedicationPayload } from '@/src/interfaces/medication/medication.interface';
import { AxiosResponse } from 'axios';

export interface UpdateMedicationResponse {
  message: string;
}

const patchUpdateMedication = async (
  id: string,
  payload: UpdateMedicationPayload,
): Promise<AxiosResponse<UpdateMedicationResponse>> => {
  const response = await myApi.patch<UpdateMedicationResponse>(
    `/api/medicaments/${id}`,
    payload,
  );
  return response;
};

export default patchUpdateMedication;
