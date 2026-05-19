import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  BackButton,
  Button,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
} from '@/src/components/ui/atoms';
import { useTheme } from '@/src/hooks/useTheme';
import { useMisPacientes } from '@repo/api-client';
import { ROUTES } from '@/src/routes/routes';
import { VinculacionConPaciente } from '@repo/types';
import { PacienteRow } from '@/src/components/ui/molecules';

export default function PacientesScreen() {
  const t = useTheme();
  const { data: pacientes = [], isLoading } = useMisPacientes();

  if (isLoading) return <LoadingScreen size="small" />;

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <BackButton />
      <FlatList
        data={pacientes}
        keyExtractor={item => item._id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScreenHeader
              title="Mis Pacientes"
              subtitle="Pacientes que acompañás actualmente"
            />
            <View style={s.actionWrapper}>
              <Button
                title="Vincular nuevo paciente"
                variant="primary"
                onPress={() => router.push(ROUTES.VINCULAR as never)}
              />
            </View>
            <View style={[s.separator, { backgroundColor: t.border }]} />
          </>
        }
        ItemSeparatorComponent={() => <View style={s.itemSeparator} />}
        renderItem={({ item }: { item: VinculacionConPaciente }) => (
          <PacienteRow item={item} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="Sin pacientes vinculados"
            subtitle="Pedile a tu familiar un código y vinculate"
            action={{
              label: 'Vincular ahora',
              onPress: () => router.push(ROUTES.VINCULAR as never),
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 120 },
  actionWrapper: { paddingHorizontal: 20, paddingVertical: 16 },
  separator: { height: 1, marginBottom: 8 },
  itemSeparator: { height: 12 },
});
