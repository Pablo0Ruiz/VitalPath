import { useSetActivePaciente } from '@/src/hooks/useSetActivePaciente';
import { useTheme } from '@/src/hooks/useTheme';
import { ROUTES } from '@/src/routes/routes';
import { TipoVinculo, VinculacionConPaciente } from '@repo/types';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Card, TextField } from '../../atoms';

const TIPO_LABEL: Record<TipoVinculo, string> = {
  HIJO_A: 'Hijo/a',
  ESPOSO_A: 'Esposo/a',
  CUIDADOR_CONTRATADO: 'Cuidador contratado',
  OTRO: 'Otro',
};

const PacienteRow = ({ item }: { item: VinculacionConPaciente }) => {
  const t = useTheme();
  const setActivePaciente = useSetActivePaciente();
  const nombre =
    `${item.paciente_id.name} ${item.paciente_id.lastName ?? ''}`.trim();

  const handleVerComo = () => {
    setActivePaciente({ id: item.paciente_id._id, nombre });
    router.push(ROUTES.HOME);
  };

  return (
    <View style={s.rowPadding}>
      <Card>
        <View style={s.cardRow}>
          <View style={s.cardInfo}>
            <TextField
              variant="body"
              style={{ color: t.textPrimary, fontWeight: '600' }}
            >
              {nombre}
            </TextField>
            {item.tipo_vinculo && (
              <TextField
                variant="caption"
                style={{ color: t.textSecondary, marginTop: 2 }}
              >
                {TIPO_LABEL[item.tipo_vinculo]}
              </TextField>
            )}
          </View>
          <View style={s.badgeCol}>
            <Badge label="Activo" variant="success" />
            <Button
              title="Ver como este paciente"
              variant="secondary"
              size="sm"
              onPress={handleVerComo}
              style={s.verComoBtn}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

export default PacienteRow;

const s = StyleSheet.create({
  rowPadding: { paddingHorizontal: 20 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 12 },
  badgeCol: { alignItems: 'flex-end', gap: 8 },
  verComoBtn: { marginTop: 4 },
});
