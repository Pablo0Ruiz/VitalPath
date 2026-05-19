import { useTheme } from '@/src/hooks/useTheme';
import {
  EstadoVinculo,
  TipoVinculo,
  VinculacionConCuidador,
} from '@repo/types';
import { StyleSheet, View } from 'react-native';
import { Badge, Button, Card, TextField } from '../../atoms';
import { BadgeVariant } from '../../atoms/Badge/Badge.variants';

const ESTADO_BADGE: Record<EstadoVinculo, BadgeVariant> = {
  ACTIVO: 'success',
  PENDIENTE: 'warning',
  REVOCADO: 'neutral',
};

const ESTADO_LABEL: Record<EstadoVinculo, string> = {
  ACTIVO: 'Activo',
  PENDIENTE: 'Pendiente',
  REVOCADO: 'Revocado',
};

const TIPO_LABEL: Record<TipoVinculo, string> = {
  HIJO_A: 'Hijo/a',
  ESPOSO_A: 'Esposo/a',
  CUIDADOR_CONTRATADO: 'Cuidador contratado',
  OTRO: 'Otro',
};

export interface CuidadorRowProps {
  item: VinculacionConCuidador;
  onRevocar: (id: string, nombre: string) => void;
  isRevoking: boolean;
}

const CuidadorRow = ({ item, onRevocar, isRevoking }: CuidadorRowProps) => {
  const t = useTheme();
  const nombre = `${item.cuidador_id.name} ${item.cuidador_id.lastName}`;

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
          <Badge
            label={ESTADO_LABEL[item.estado_vinculo]}
            variant={ESTADO_BADGE[item.estado_vinculo]}
          />
        </View>

        {item.estado_vinculo === 'ACTIVO' && (
          <Button
            title="Revocar acceso"
            variant="outline"
            size="sm"
            loading={isRevoking}
            onPress={() => onRevocar(item._id, nombre)}
            style={s.revocarButton}
          />
        )}
      </Card>
    </View>
  );
};

export default CuidadorRow;

const s = StyleSheet.create({
  rowPadding: { paddingHorizontal: 20 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1, marginRight: 12 },
  revocarButton: { marginTop: 12 },
});
