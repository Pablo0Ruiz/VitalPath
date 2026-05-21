import { useTheme } from '@/src/hooks/useTheme';

import { TipoVinculo, VinculacionConPaciente } from '@repo/types';
import { StyleSheet, View } from 'react-native';
import { Badge, Card, TextField } from '../../atoms';

const TIPO_LABEL: Record<TipoVinculo, string> = {
  HIJO_A: 'Hijo/a',
  ESPOSO_A: 'Esposo/a',
  CUIDADOR_CONTRATADO: 'Cuidador contratado',
  OTRO: 'Otro',
};

const PacienteRow = ({ item }: { item: VinculacionConPaciente }) => {
  const t = useTheme();
  const nombre =
    `${item.paciente_id.name} ${item.paciente_id.lastName ?? ''}`.trim();

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
