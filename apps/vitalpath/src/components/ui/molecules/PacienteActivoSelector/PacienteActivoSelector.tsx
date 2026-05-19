import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useMisPacientes } from '@repo/api-client';
import { TextField } from '@/src/components/ui/atoms/TextField';
import { Badge } from '@/src/components/ui/atoms/Badge';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuthStore } from '@/src/stores/auth';
import { useActivePacienteStore } from '@/src/stores/activePaciente';
import { useSetActivePaciente } from '@/src/hooks/useSetActivePaciente';
import { ROUTES } from '@/src/routes/routes';
import type { VinculacionConPaciente } from '@repo/types';

export function PacienteActivoSelector(): JSX.Element | null {
  const t = useTheme();
  const user = useAuthStore(s => s.user);
  const activePacienteId = useActivePacienteStore(s => s.activePacienteId);
  const setActivePaciente = useSetActivePaciente();
  const { data: vinculaciones = [], isLoading } = useMisPacientes();

  if (user?.role !== 'CUIDADOR_FAMILIAR') return null;

  const activePacientes = (vinculaciones as VinculacionConPaciente[]).filter(
    v => v.estado_vinculo === 'ACTIVO',
  );

  const handleSelect = (v: VinculacionConPaciente) => {
    const nombre =
      `${v.paciente_id.name} ${v.paciente_id.lastName ?? ''}`.trim();
    setActivePaciente({ id: v.paciente_id._id, nombre });
    router.push(ROUTES.HOME);
  };

  return (
    <View style={s.container}>
      <TextField
        variant="caption"
        style={[s.label, { color: t.textSecondary }]}
      >
        Cuidando a:
      </TextField>

      {isLoading ? (
        <View style={s.row}>
          {[0, 1, 2].map(i => (
            <View
              key={i}
              style={[s.skeleton, { backgroundColor: t.neutral100 }]}
            />
          ))}
        </View>
      ) : activePacientes.length === 0 ? (
        <Pressable onPress={() => router.push(ROUTES.VINCULAR)}>
          <Badge label="Vincular paciente" variant="outline" />
        </Pressable>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.row}
        >
          {activePacientes.map(v => {
            const nombre = v.paciente_id.name;
            const isActive = v.paciente_id._id === activePacienteId;
            return (
              <Pressable key={v._id} onPress={() => handleSelect(v)}>
                <Badge
                  label={nombre}
                  variant={isActive ? 'primary' : 'outline'}
                  style={s.chip}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 12 },
  label: { marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chip: {},
  skeleton: { width: 72, height: 32, borderRadius: 9999 },
});
