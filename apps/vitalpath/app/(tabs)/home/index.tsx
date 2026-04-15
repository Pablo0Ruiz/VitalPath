import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Octicons } from '@expo/vector-icons';

import { Avatar, Button, TextField } from '@/src/components/ui/atoms';
import {
  SectionHeader,
  AppointmentRow,
  MedicationRow,
  Divider,
} from '@/src/components/ui/molecules';
import { useAuth } from '@/src/context/AuthContext';
import { useLogout } from '@/src/hooks/auth';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <View className="flex-row items-center">
          <Avatar
            image={require('@/assets/images/vitalpath-logo.png')}
            size="md"
            className="bg-brand-violet-100"
          />
          <View className="ml-2.5">
            <TextField
              variant="caption"
              className="text-left text-brand-slate-400"
            >
              Buenos días,
            </TextField>
            <TextField
              variant="body"
              className="text-left text-black font-bold"
            >
              {user?.name}
            </TextField>
          </View>
        </View>
        <Button className="w-10 h-10 rounded-full bg-brand-slate-100 items-center justify-center">
          <Octicons name="bell" size={22} color="#7C3AED" />
          <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
        </Button>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader
          title="Próximas citas"
          linkLabel="Ver todas"
          onLinkPress={() => {}}
        />

        <View className="bg-white rounded-[16px] p-4 border border-brand-slate-200 mb-4 shadow-sm">
          <AppointmentRow
            doctor="Dra. Ana Martínez"
            specialty="Cardiología"
            time="10:30 AM"
            date="Hoy"
            avatarInitials="AM"
            avatarClassName="bg-brand-violet-100"
          />
          <Divider className="my-2" />
          <AppointmentRow
            doctor="Dr. Luis Herrera"
            specialty="Medicina General"
            time="03:00 PM"
            date="Mañana"
            avatarInitials="LH"
            avatarClassName="bg-brand-teal-100"
          />
          <Divider className="my-2" />
          <AppointmentRow
            doctor="Dra. Sofia Blanco"
            specialty="Nutrición"
            time="11:00 AM"
            date="Jue 20 Mar"
            avatarInitials="SB"
            avatarClassName="bg-amber-100"
          />
        </View>

        <SectionHeader title="Medicamentos de hoy" />
        <View className="bg-white rounded-[16px] p-4 border border-brand-slate-200 mb-8 shadow-sm">
          <MedicationRow name="Lisinopril 10mg" time="08:00 AM" isDone={true} />
          <Divider className="my-2" />
          <MedicationRow
            name="Metformina 500mg"
            time="01:00 PM"
            isDone={false}
            onTakePress={() => {}}
          />
          <Divider className="my-2" />
          <MedicationRow
            name="Atorvastatina 20mg"
            time="09:00 PM"
            isDone={false}
            onTakePress={() => {}}
          />
        </View>
        <Button title="Cerrar sesión" onPress={logout}></Button>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
