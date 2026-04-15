import { Octicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar, Button, TextField } from '@/src/components/ui/atoms';
import {
  AppointmentRow,
  Divider,
  MedicationRow,
  SectionHeader,
  CustomModal,
} from '@/src/components/ui/molecules';
import { useAuth } from '@/src/context/AuthContext';
import { useLogout } from '@/src/hooks/auth';
import { useMedicaments } from '@/src/hooks/medicaments/useMedication';
import { useState } from 'react';

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

        <View className="flex-row items-center justify-between">
          <SectionHeader title="Medicamentos de hoy" />
          <Button title="Agregar" onPress={openModal} />
          <CustomModal visible={isModalVisible} onClose={closeModal} />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#7C3AED" className="my-8" />
        ) : (
          <View className="bg-white rounded-[16px] p-4 border border-brand-slate-200 mb-4 shadow-sm">
            {medicaments && medicaments.length > 0 ? (
              <FlatList
                data={medicaments}
                renderItem={({ item }) => (
                  <>
                    <MedicationRow
                      name={item.name}
                      description={item.description}
                      onTakePress={() => {}}
                    />
                    <Divider className="my-2" />
                  </>
                )}
                keyExtractor={item => item.id}
              />
            ) : (
              <TextField
                variant="caption"
                className="text-center text-brand-slate-400 py-4"
              >
                No tienes medicamentos programados para hoy.
              </TextField>
            )}
          </View>
        )}
        <Button title="Cerrar sesión" onPress={logout}></Button>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
