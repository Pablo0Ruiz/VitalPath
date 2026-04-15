import { myApi } from '../../api/myApi';
import { Medication } from '@/src/interfaces/medication/medication.interface';

export const getMedicaments = async (): Promise<Medication[]> => {
  const { data } = await myApi.get<Medication[]>('/api/medications');
  return data;
};
