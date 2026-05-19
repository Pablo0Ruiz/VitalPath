import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { TextField } from '@/src/components/ui/atoms/TextField';
import { useTheme } from '@/src/hooks/useTheme';

interface SummaryBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  resumenIA?: string;
  notasMedico?: string;
}

const SummaryBottomSheet = ({
  isVisible,
  onClose,
  resumenIA,
  notasMedico,
}: SummaryBottomSheetProps) => {
  const t = useTheme();

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable onPress={e => e.stopPropagation()} style={s.sheetWrapper}>
          <View style={[s.content, { backgroundColor: t.surfaceElevated }]}>
            <View style={[s.handle, { backgroundColor: t.border }]} />

            <View style={s.header}>
              <TextField
                variant="title"
                style={[s.title, { color: t.textPrimary }]}
              >
                Resumen del estudio
              </TextField>
              <Pressable onPress={onClose} style={s.closeButton}>
                <TextField
                  variant="caption"
                  style={[s.closeIcon, { color: t.textSecondary }]}
                >
                  ✕
                </TextField>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={s.scroll}>
              {resumenIA && (
                <View style={s.section}>
                  <TextField
                    variant="label"
                    style={[s.sectionLabel, { color: t.primary600 }]}
                  >
                    Análisis de IA
                  </TextField>
                  <TextField
                    variant="body"
                    style={[s.sectionBody, { color: t.textPrimary }]}
                  >
                    {resumenIA}
                  </TextField>
                </View>
              )}

              {notasMedico && (
                <View style={s.section}>
                  <TextField
                    variant="label"
                    style={[s.sectionLabel, { color: t.success }]}
                  >
                    Nota del médico
                  </TextField>
                  <TextField
                    variant="body"
                    style={[s.sectionBody, { color: t.textPrimary }]}
                  >
                    {notasMedico}
                  </TextField>
                </View>
              )}

              {!resumenIA && !notasMedico && (
                <TextField
                  variant="caption"
                  style={[s.emptyText, { color: t.textSecondary }]}
                >
                  El resumen no está disponible aún.
                </TextField>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: { width: '100%' },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontWeight: '700', fontSize: 20 },
  closeButton: { padding: 4 },
  closeIcon: { fontSize: 18 },
  scroll: { marginBottom: 8 },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: { fontSize: 15, lineHeight: 22, textAlign: 'left' },
  emptyText: { textAlign: 'center', marginTop: 32, fontSize: 14 },
});

export default SummaryBottomSheet;
