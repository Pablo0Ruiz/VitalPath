import { CitaPopulated } from '@repo/types';
import { AppointmentRow } from '../../AppointmentRow';
import { Divider } from '../../Divider';
import { View } from 'react-native';
import { formatDateShort } from '@/src/utils/date';

interface RawAppointmentsProps {
  data: CitaPopulated[];
}

export const RawAppointments = ({ data }: RawAppointmentsProps) => (
  <>
    {data.map((item, index) => (
      <View key={item._id}>
        <AppointmentRow
          doctor={`${item.medico_ID.name} ${item.medico_ID.lastName}`}
          specialty={item.centroSalud_ID.nombre}
          time={item.hora}
          date={formatDateShort(item.fecha)}
          avatarInitials={`${item.medico_ID.name[0]}${item.medico_ID.lastName[0]}`.toUpperCase()}
        />
        {index < data.length - 1 && <Divider className="my-2" />}
      </View>
    ))}
  </>
);
