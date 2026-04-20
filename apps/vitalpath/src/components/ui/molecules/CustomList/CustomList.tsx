import { View } from 'react-native';

import { TextField } from '../../atoms';
import { Medication, Appointment } from '@repo/types';
import { RawAppointments, RawMedications } from './rawData';
import { useDeleteMedication } from '@repo/api-client';

type MedicationListProps = {
  type: 'medication';
  data: Medication[] | undefined;
};

type AppointmentListProps = {
  type: 'appointment';
  data: Appointment[] | undefined;
};

export type ListProps = MedicationListProps | AppointmentListProps;

const EMPTY_MESSAGES: Record<ListProps['type'], string> = {
  medication: 'No tienes medicamentos programados para hoy.',
  appointment: 'No tienes citas programadas.',
};

const CustomList = ({ type, data }: ListProps) => {
  const { mutateAsync: deleteMedication } = useDeleteMedication();

  const handleDelete = async (id: string) => {
    try {
      await deleteMedication(id);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (!data || data.length === 0) {
    return (
      <TextField
        variant="caption"
        className="text-center text-brand-slate-400 py-4"
      >
        {EMPTY_MESSAGES[type]}
      </TextField>
    );
  }

  return (
    <View>
      {type === 'medication' ? (
        <RawMedications
          data={data}
          onClick={(id: string) => handleDelete(id)}
        />
      ) : (
        <RawAppointments data={data} />
      )}
    </View>
  );
};

CustomList.displayName = 'CustomList';
export default CustomList;
