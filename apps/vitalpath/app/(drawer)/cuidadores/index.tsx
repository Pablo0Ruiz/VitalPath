import { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BackButton,
  Button,
  Card,
  EmptyState,
  LoadingScreen,
  ScreenHeader,
  TextField,
} from '@/src/components/ui/atoms';
import { CuidadorRow, SectionHeader } from '@/src/components/ui/molecules';
import { useTheme } from '@/src/hooks/useTheme';
import {
  useGenerarCodigo,
  useMisCuidadores,
  useRevocarVinculacion,
} from '@repo/api-client';
import type { VinculacionConCuidador } from '@repo/types';

export default function CuidadoresScreen() {
  const t = useTheme();
  const [codigoActivo, setCodigoActivo] = useState<{
    codigo: string;
    expireAt: string;
  } | null>(null);

  const { data: cuidadores = [], isLoading } = useMisCuidadores();
  const { mutate: generarCodigo, isPending: isGenerating } = useGenerarCodigo();
  const { mutate: revocar, isPending: isRevoking } = useRevocarVinculacion();

  const handleGenerarCodigo = () => {
    generarCodigo(undefined, {
      onSuccess: res => setCodigoActivo(res),
      onError: () =>
        Alert.alert('Error', 'No se pudo generar el código. Intentá de nuevo.'),
    });
  };

  const handleRevocar = (vinculacionId: string, nombre: string) => {
    Alert.alert('Revocar acceso', `¿Querés revocar el acceso de ${nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Revocar',
        style: 'destructive',
        onPress: () =>
          revocar(vinculacionId, {
            onError: () =>
              Alert.alert('Error', 'No se pudo revocar el vínculo.'),
          }),
      },
    ]);
  };

  const formatExpiry = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) return <LoadingScreen size="small" />;

  return (
    <SafeAreaView
      style={[s.container, { backgroundColor: t.background }]}
      edges={['top']}
    >
      <BackButton />
      <FlatList
        data={cuidadores}
        keyExtractor={item => item._id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ScreenHeader
              title="Mis Cuidadores"
              subtitle="Gestioná quién tiene acceso a tu información"
            />

            <View style={s.section}>
              <SectionHeader title="Vincular un cuidador" style={s.noMargin} />
              <TextField
                variant="caption"
                style={[s.hint, { color: t.textSecondary }]}
              >
                Generá un código de 6 dígitos y compartilo con tu cuidador.
                Expira en 15 minutos.
              </TextField>

              {codigoActivo && (
                <Card style={s.codeCard}>
                  <TextField
                    variant="caption"
                    style={[s.codeLabel, { color: t.textSecondary }]}
                  >
                    Código de vinculación
                  </TextField>
                  <TextField
                    variant="title"
                    style={[s.codeValue, { color: t.primary600 }]}
                  >
                    {codigoActivo.codigo}
                  </TextField>
                  <TextField
                    variant="caption"
                    style={{ color: t.textSecondary, textAlign: 'center' }}
                  >
                    Válido hasta las {formatExpiry(codigoActivo.expireAt)}
                  </TextField>
                </Card>
              )}

              <Button
                title={codigoActivo ? 'Generar nuevo código' : 'Generar código'}
                variant={codigoActivo ? 'outline' : 'primary'}
                loading={isGenerating}
                onPress={handleGenerarCodigo}
                style={s.generateButton}
              />
            </View>

            <View style={[s.separator, { backgroundColor: t.border }]} />

            <View style={s.section}>
              <SectionHeader title="Mis cuidadores" style={s.noMargin} />
            </View>
          </>
        }
        ItemSeparatorComponent={() => <View style={s.itemSeparator} />}
        renderItem={({ item }: { item: VinculacionConCuidador }) => (
          <CuidadorRow
            item={item}
            onRevocar={handleRevocar}
            isRevoking={isRevoking}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="users"
            title="Sin cuidadores"
            subtitle="Aún no tenés cuidadores vinculados"
          />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 120 },
  section: { paddingHorizontal: 20, paddingTop: 16 },
  noMargin: { marginBottom: 0 },
  hint: { marginTop: 6, marginBottom: 12 },
  codeCard: {
    alignItems: 'center',
    marginVertical: 12,
    gap: 6,
  },
  codeLabel: { marginBottom: 4 },
  codeValue: { fontSize: 36, letterSpacing: 8, fontWeight: '700' },
  generateButton: { marginTop: 4, marginBottom: 8 },
  separator: { height: 1, marginTop: 24, marginBottom: 8 },
  itemSeparator: { height: 12 },
  rowPadding: { paddingHorizontal: 20 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 12 },
  revocarButton: { marginTop: 12 },
});
