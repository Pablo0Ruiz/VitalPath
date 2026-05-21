import { useState } from 'react';
import { Modal, View, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextField } from '../../atoms';
import { useUpdateCita } from '@repo/api-client';
import { parseLocalDateTime } from '@/src/utils/date';
import { useTheme } from '@/src/hooks/useTheme';

export interface EditCitaSheetProps {
  isOpen: boolean;
  citaId: string;
  prefillFecha: string;
  prefillHora: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditCitaSheet = ({
  isOpen,
  citaId,
  prefillFecha,
  prefillHora,
  onClose,
  onSuccess,
}: EditCitaSheetProps) => {
  const t = useTheme();
  const [fecha, setFecha] = useState(prefillFecha);
  const [hora, setHora] = useState(prefillHora);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: updateCita, isPending } = useUpdateCita();

  const handleSubmit = async () => {
    setError(null);

    const selected = parseLocalDateTime(fecha, hora);
    const now = new Date();

    if (selected <= now) {
      setError(
        'La fecha y hora seleccionada es pasada. Elegí una fecha futura.',
      );
      return;
    }

    await updateCita({ id: citaId, payload: { fecha, hora } });
    onSuccess?.();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable onPress={e => e.stopPropagation()} style={s.sheet}>
          <View style={[s.content, { backgroundColor: t.surfaceElevated }]}>
            <View style={[s.handle, { backgroundColor: t.border }]} />

            <View style={s.header}>
              <TextField
                variant="title"
                style={[s.title, { color: t.textPrimary }]}
              >
                Reagendar cita
              </TextField>
              <Pressable
                style={[s.closeButton, { backgroundColor: t.neutral100 }]}
                onPress={onClose}
              >
                <Ionicons name="close" size={18} color={t.neutral600} />
              </Pressable>
            </View>

            <View style={s.body}>
              <TextField
                variant="caption"
                style={[s.label, { color: t.textSecondary }]}
              >
                Fecha (YYYY-MM-DD)
              </TextField>
              <TextInput
                style={[
                  s.input,
                  { borderColor: t.border, color: t.textPrimary },
                ]}
                value={fecha}
                onChangeText={text => {
                  setFecha(text);
                  setError(null);
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={t.textSecondary}
                autoCapitalize="none"
              />

              <TextField
                variant="caption"
                style={[s.label, { color: t.textSecondary }]}
              >
                Hora (HH:MM)
              </TextField>
              <TextInput
                style={[
                  s.input,
                  { borderColor: t.border, color: t.textPrimary },
                ]}
                value={hora}
                onChangeText={text => {
                  setHora(text);
                  setError(null);
                }}
                placeholder="HH:MM"
                placeholderTextColor={t.textSecondary}
                autoCapitalize="none"
              />

              {error && (
                <TextField
                  testID="edit-cita-error"
                  variant="caption"
                  style={[s.error, { color: t.error }]}
                >
                  {error}
                </TextField>
              )}
            </View>

            <View style={s.footer}>
              <Pressable
                testID="edit-cita-submit"
                style={[
                  s.submitButton,
                  { backgroundColor: isPending ? t.neutral200 : t.primary600 },
                ]}
                disabled={isPending}
                onPress={handleSubmit}
              >
                <TextField
                  variant="body"
                  style={[
                    s.submitText,
                    { color: isPending ? t.neutral400 : '#FFFFFF' },
                  ]}
                >
                  {isPending ? 'Guardando...' : 'Guardar cambios'}
                </TextField>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: { width: '100%' },
  content: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700' },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 20, gap: 8 },
  label: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: { fontSize: 13, marginTop: 4 },
  footer: { paddingHorizontal: 20, paddingTop: 20 },
  submitButton: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitText: { fontWeight: '700', fontSize: 16 },
});
