import { myApi } from '../../api/myApi';
import { UpdateMedicationPayload } from '@/src/interfaces/medication/medication.interface';
import { AxiosResponse } from 'axios';

export interface UpdateMedicationResponse {
  message: string;
}

const patchUpdateMedication = async (
  payload: UpdateMedicationPayload,
): Promise<AxiosResponse<UpdateMedicationResponse>> => {
  const { id, ...rest } = payload;
  const response = await myApi.patch<UpdateMedicationResponse>(
    `/api/medications/${id}`,
    rest,
  );
  return response;
};

export default patchUpdateMedication;
