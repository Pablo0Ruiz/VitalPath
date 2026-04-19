import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, Button, TextField } from '@/src/components/ui/atoms';
import {
  CustomList,
  CustomModal,
  SectionHeader,
} from '@/src/components/ui/molecules';
import { useAuthStore } from '@repo/store';
import { useLogout, useMedicaments } from '@repo/api-client';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';
import { Appointment } from '@repo/types';

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

export default function DashboardScreen() {
  const { user, clearSession } = useAuthStore();
  const { logout } = useLogout(
    mobileTokenAdapter,
    { clearSession },
    { loginRoute: ROUTES.LOGIN },
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: medicaments, isLoading } = useMedicaments();

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleAvatarLongPress = () => {
    Alert.alert('Sesión', '¿Cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const medicamentCount = medicaments?.length ?? 0;
  const doneMeds = 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Pressable
          className="flex-row items-center"
          onLongPress={handleAvatarLongPress}
          delayLongPress={1}
        >
          <Avatar
            image={require('@/assets/images/vitalpath-logo.png')}
            size="md"
            className="bg-brand-violet-50"
          />
          <View className="ml-3">
            <TextField
              variant="caption"
              className="text-brand-slate-400 text-left text-xs"
            >
              Buenos días
            </TextField>
            <TextField
              variant="body"
              className="text-brand-slate-900 font-semibold text-left text-[15px]"
            >
              {user?.name}
            </TextField>
          </View>
        </Pressable>

        <Pressable className="w-9 h-9 items-center justify-center rounded-full bg-zinc-100">
          <Ionicons name="notifications-outline" size={20} color="#71717A" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3 px-5 pt-5 pb-2">
          <View className="flex-1 bg-[#5B4CF5] rounded-2xl px-4 py-3">
            <TextField
              variant="caption"
              className="text-white text-xs text-left mb-0.5"
            >
              Citas hoy
            </TextField>
            <TextField
              variant="body"
              className="text-white font-bold text-[28px] leading-tight text-left"
            >
              {MOCK_APPOINTMENTS.filter(a => a.date === 'Hoy').length}
            </TextField>
          </View>

          <View className="flex-1 bg-[#00C896] rounded-2xl px-4 py-3">
            <TextField
              variant="caption"
              className="text-white text-xs text-left mb-0.5"
            >
              Medicamentos
            </TextField>
            <TextField
              variant="body"
              className="text-white font-bold text-[28px] leading-tight text-left"
            >
              {doneMeds}
              <TextField
                variant="caption"
                className="text-white text-[14px] font-normal"
              >
                /{medicamentCount}
              </TextField>
            </TextField>
          </View>
        </View>

        <View className="px-5 pt-5">
          <SectionHeader
            title="Próximas citas"
            linkLabel="Ver todas"
            onLinkPress={() => {}}
          />
          <View className="bg-white rounded-2xl border border-brand-slate-100 overflow-hidden">
            <CustomList type="appointment" data={MOCK_APPOINTMENTS} />
          </View>
        </View>

        <View className="px-5 pt-6">
          <View className="flex-row items-center justify-between mb-2.5">
            <SectionHeader
              title="Medicamentos de hoy"
              className="flex-1 mb-0"
            />
            <Button
              title="Agregar"
              onPress={openModal}
              size="sm"
              variant="outline"
            />
            <CustomModal visible={isModalVisible} onClose={closeModal} />
          </View>

          {isLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator size="small" color="#7c3aed" />
            </View>
          ) : (
            <View className="bg-white rounded-2xl border border-brand-slate-100 overflow-hidden">
              <CustomList type="medication" data={medicaments} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
