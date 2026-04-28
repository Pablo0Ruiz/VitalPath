import { View } from 'react-native';
import { Medication, CitaPopulated } from '@repo/types';
import { EmptyState } from '../../atoms/EmptyState';
import { RawAppointments, RawMedications } from './rawData';

type MedicationListProps = {
  type: 'medication';
  data: Medication[] | undefined;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onTake: (id: string) => void;
  completedIds: string[];
};

type AppointmentListProps = {
  type: 'cita';
  data: CitaPopulated[] | undefined;
};

export type ListProps = MedicationListProps | AppointmentListProps;

const CustomList = (props: ListProps) => {
  if (!props.data || props.data.length === 0) {
    const isMed = props.type === 'medication';
    return (
      <EmptyState
        icon={isMed ? 'activity' : 'calendar'}
        title={isMed ? 'Salud al día' : 'Agenda libre'}
        subtitle={
          isMed
            ? 'No tienes medicamentos programados para hoy.'
            : 'No tienes citas programadas.'
        }
      />
    );
  }

  if (props.type === 'medication') {
    return (
      <View>
        <RawMedications
          data={props.data}
          onDelete={props.onDelete}
          onEdit={props.onEdit}
          onTake={props.onTake}
          completedIds={props.completedIds}
        />
      </View>
    );
  }

  return (
    <View>
      <RawAppointments data={props.data} />
    </View>
  );
};

CustomList.displayName = 'CustomList';
export default CustomList;
