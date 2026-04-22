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

import {
  Avatar,
  Button,
  HeaderHome,
  TextField,
} from '@/src/components/ui/atoms';
import {
  CustomList,
  CustomModal,
  SectionHeader,
} from '@/src/components/ui/molecules';
import { useAuthStore } from '@repo/store';
import { useCitas, useLogout, useMedicaments } from '@repo/api-client';
import { useRefetchOnFocus } from '@/src/hooks/useRefetchOnFocus';
import { mobileTokenAdapter } from '@/src/adapters/mobileTokenAdapter';
import { ROUTES } from '@/src/routes/routes';

export default function DashboardScreen() {
  const { user, clearSession } = useAuthStore();
  const { logout } = useLogout(
    mobileTokenAdapter,
    { clearSession },
    { loginRoute: ROUTES.LOGIN },
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: medicaments, isLoading } = useMedicaments();
  const {
    data: citas = [],
    isLoading: isLoadCitas,
    refetch: refetchCitas,
  } = useCitas(user?.id ?? '');

  useRefetchOnFocus(refetchCitas);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleAvatarLongPress = () => {
    Alert.alert('Sesión', '¿Cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <HeaderHome
          textLabel="Buenos dias"
          nameUser={user?.name}
          onLogaut={handleAvatarLongPress}
        />
        <Pressable className="w-9 h-9 items-center justify-center rounded-full bg-zinc-100">
          <Ionicons name="notifications-outline" size={20} color="#71717A" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-5">
          <SectionHeader
            title="Próximas citas"
            linkLabel="Ver todas"
            onLinkPress={() => {}}
          />
          <View className="bg-white rounded-2xl border border-brand-slate-100 overflow-hidden">
            {isLoadCitas ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color="#7c3aed" />
              </View>
            ) : (
              <CustomList type="cita" data={citas} />
            )}
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
