import { myApi } from '../../api/myApi';

const deleteMedication = async (id: string) => {
  const response = await myApi.delete(`/api/medicaments/${id}`);
  return response;
};

export default deleteMedication;
