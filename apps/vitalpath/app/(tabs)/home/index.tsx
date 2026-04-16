import { Octicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, TextField } from '@/src/components/ui/atoms';
import {
  SectionHeader,
  CustomModal,
  CustomList,
} from '@/src/components/ui/molecules';
import { useAuth } from '@/src/context/AuthContext';
import { useLogout } from '@/src/hooks/auth';
import { useMedicaments } from '@/src/hooks/medicaments/useMedication';

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctor: 'Dra. Ana Martínez',
    specialty: 'Cardiología',
    time: '10:30 AM',
    date: 'Hoy',
    avatarInitials: 'AM',
    avatarClassName: 'bg-brand-violet-100',
  },
  {
    id: '2',
    doctor: 'Dr. Luis Herrera',
    specialty: 'Medicina General',
    time: '03:00 PM',
    date: 'Mañana',
    avatarInitials: 'LH',
    avatarClassName: 'bg-brand-teal-100',
  },
  {
    id: '3',
    doctor: 'Dra. Sofia Blanco',
    specialty: 'Nutrición',
    time: '11:00 AM',
    date: 'Jue 20 Mar',
    avatarInitials: 'SB',
    avatarClassName: 'bg-amber-100',
  },
];
import { useState } from 'react';
import { Appointment } from '@/src/interfaces/appointments/appointments.interface';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { logout } = useLogout();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: medicaments, isLoading } = useMedicaments();

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <View className="flex-row items-center">
          <Avatar
            image={require('@/assets/images/vitalpath-logo.png')}
            size="lg"
            className="bg-brand-violet-600"
          />
          <View className="ml-2.5">
            <TextField
              variant="caption"
              className="text-left text-brand-slate-400"
            >
              Buenos días
            </TextField>
            <TextField
              variant="body"
              className="text-left text-black font-bold"
            >
              {user?.name}
            </TextField>
          </View>
        </View>
        <Button className="w-14 h-full rounded-full bg-brand-slate-200 items-center justify-center">
          <Octicons name="bell" size={22} color="white" />
        </Button>
      </View>

      <View className="flex-1 px-4 pt-2">
        <View className="flex-[0.50] mb-4">
          <SectionHeader
            title="Próximas citas"
            linkLabel="Ver todas"
            onLinkPress={() => {}}
          />
          <View className="flex-1 bg-white rounded-[16px] p-4 border border-brand-slate-200 shadow-sm">
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomList type="appointment" data={MOCK_APPOINTMENTS} />
            </ScrollView>
          </View>
        </View>

        <View className="flex-1 mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <SectionHeader title="Medicamentos de hoy" />
            <Button title="Agregar" onPress={openModal} />
            <CustomModal visible={isModalVisible} onClose={closeModal} />
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#7C3AED" className="my-8" />
          ) : (
            <View className="flex-1 bg-white rounded-[16px] p-4 border border-brand-slate-200 shadow-sm">
              <ScrollView showsVerticalScrollIndicator={false}>
                <CustomList type="medication" data={medicaments} />
              </ScrollView>
            </View>
          )}
        </View>
        <View className="flex-[0.24] justify-center pb-2">
          <Button title="Cerrar sesión" onPress={logout} />
        </View>
        <View style={{ height: 40 }} />
      </View>
    </SafeAreaView>
  );
}
