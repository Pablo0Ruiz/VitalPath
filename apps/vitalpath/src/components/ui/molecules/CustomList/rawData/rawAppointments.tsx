import { Appointment } from '@repo/types';
import { AppointmentRow } from '../../AppointmentRow';
import { Divider } from '../../Divider';
import { View } from 'react-native';

interface RawAppointmentsProps {
  data: Appointment[];
}

export const RawAppointments = ({ data }: RawAppointmentsProps) => (
  <>
    {data.map((item, index) => (
      <View key={item.id}>
        <AppointmentRow
          doctor={item.doctor}
          specialty={item.specialty}
          time={item.time}
          date={item.date}
          avatarInitials={
            item.avatarInitials || item.doctor.slice(0, 2).toUpperCase()
          }
          avatarClassName={item.avatarClassName}
        />
        {index < data.length - 1 && <Divider className="my-2" />}
      </View>
    ))}
  </>
);
